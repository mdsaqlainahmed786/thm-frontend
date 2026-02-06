# EC2: Frontend 502 Bad Gateway (nginx + PM2 + Next.js)

If you see **`502 Bad Gateway`** from nginx, it means nginx cannot reach the **upstream Next.js server** (connection refused / timed out / upstream down).

This repo ships a hardened PM2 config: `ecosystem.config.cjs` (auto-restart + memory guard + backoff).

---

## 1) Confirm what nginx is failing on

Run this **while you are getting 502**:

```bash
sudo tail -n 200 /var/log/nginx/error.log
```

Typical meanings:

- **`connect() failed (111: Connection refused)`**: Next.js process is **not listening** on the configured port.
- **`upstream timed out`**: Next.js is **hung / overloaded** (CPU, memory, or a slow SSR path).
- **`no live upstreams`**: nginx upstream config points to a dead upstream group.
- **`upstream sent too big header`**: nginx response header buffers are too small (often due to large `Set-Cookie` headers from auth). Common with NextAuth.

Important: **PM2 can show "online" while nginx still gets connection refused** if the process is restarting/crash-looping quickly, or if it is bound to a different interface (common IPv6/localhost mismatch).

### Fix for: `upstream sent too big header`

Add these inside every nginx `location` that proxies to Next.js (port `3000`), e.g. `location / { ... }`:

```nginx
# Allow large auth headers (NextAuth / large cookies)
proxy_buffer_size 128k;
proxy_buffers 4 256k;
proxy_busy_buffers_size 256k;
```

Reload:

```bash
sudo nginx -t && sudo systemctl reload nginx
```

### Fix for frequent 504s: increase upstream timeouts (mitigation)

If you see repeated `upstream timed out (110: Connection timed out) while reading response header from upstream`,
you can mitigate by increasing timeouts in those same `location` blocks:

```nginx
proxy_connect_timeout 5s;
proxy_send_timeout 120s;
proxy_read_timeout 120s;
send_timeout 120s;
```

---

## 2) Check PM2 state + why it stopped

```bash
pm2 list
pm2 describe thm-frontend
pm2 logs thm-frontend --lines 200
```

Also look at the raw log files:

```bash
ls -lah ~/.pm2/logs | grep -i thm-frontend
tail -n 200 ~/.pm2/logs/thm-frontend-out.log
tail -n 200 ~/.pm2/logs/thm-frontend-error.log
```

If you see the app in PM2 as **`stopped`**, that usually means one of:

- **Autorestart disabled** (`--no-autorestart` or config)
- **Crash loop protection** (max restarts reached)
- **Manual stop from somewhere** (deploy script, cron, another user/process)

---

## 3) Check for OOM-kills (most common root cause)

On small instances, SSR + image optimization can spike memory.

```bash
dmesg -T | egrep -i "killed process|oom|out of memory" | tail -n 80
free -h
```

If you see OOM messages, fix by:

- Increasing RAM (bigger instance)
- Adding swap
- Reducing memory usage (less SSR work, fewer concurrent image optimizations)
- Setting a **PM2 max memory restart** (see `ecosystem.config.cjs`)

---

## 4) Check disk space / inode exhaustion

Full disk can make Next.js crash or behave unpredictably (cache writes fail).

```bash
df -h
df -i
du -sh ~/.pm2/logs 2>/dev/null || true
```

If logs are huge, consider PM2 logrotate or cleaning old logs.

---

## 5) Confirm the frontend is actually listening on the nginx upstream port

Replace `3000` if your nginx points elsewhere.

```bash
sudo ss -ltnp | grep -E ":3000\b" || true
curl -sS -I http://127.0.0.1:3000/ | head
```

If `curl` fails but PM2 says "online", the process may be wedged or bound to a different interface/port.

### IPv6/localhost gotcha (very common)

If your app is started with `-H localhost`, Node/Next can bind to **`::1` (IPv6)**. nginx is proxying to **`127.0.0.1` (IPv4)**, so it will get **connection refused**.

Fix: force the app to bind to IPv4:

- Start Next with `-H 127.0.0.1` (the provided `ecosystem.config.cjs` already does this by default), OR
- Change nginx upstream to `proxy_pass http://[::1]:3000;` (not recommended unless you know you want IPv6).

Confirm binding:

```bash
sudo ss -ltnp | grep -E ":3000\b" -n
```

---

## 6) Recommended stable start (use ecosystem file)

From the app directory on EC2:

```bash
npm ci
npm run build
pm2 start ecosystem.config.cjs --only thm-frontend --update-env
pm2 save
```

## 6.1) Add PM2 log rotation (prevents disk issues / massive logs)

```bash
pm2 install pm2-logrotate
pm2 set pm2-logrotate:max_size 20M
pm2 set pm2-logrotate:retain 10
pm2 set pm2-logrotate:compress true
pm2 save
```

## 6.2) If you suspect bots are hammering `/` with POSTs

If nginx error log shows repeated requests from a single IP (or many), add rate-limiting in nginx to reduce load spikes.

Example (place in the `server {}` for the frontend domain):

```nginx
limit_req_zone $binary_remote_addr zone=frontend:10m rate=10r/s;

location / {
    limit_req zone=frontend burst=30 nodelay;
    proxy_pass http://127.0.0.1:3000;
    include /etc/nginx/proxy_params;
}
```

Reload:

```bash
sudo nginx -t && sudo systemctl reload nginx
```

If you also want the apps to come back after reboots:

```bash
pm2 startup
pm2 save
```

---

## 7) If it still stops: capture these three outputs

When the incident happens again, grab:

```bash
sudo tail -n 200 /var/log/nginx/error.log
pm2 logs thm-frontend --lines 200
dmesg -T | egrep -i "killed process|oom|out of memory" | tail -n 80
```

Those three almost always identify the real root cause in minutes.


