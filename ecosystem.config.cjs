/**
 * PM2 production config for the Next.js frontend.
 *
 * Why this exists:
 * - nginx 502 => upstream (Next.js) not reachable (process stopped / crashed / OOM / not listening)
 * - This config enables auto-healing and safer restarts with good logs.
 *
 * Usage on EC2 (from app directory):
 *   npm ci
 *   npm run build
 *   pm2 start ecosystem.config.cjs --only thm-frontend --update-env
 *   pm2 save
 *
 * Helpful:
 *   pm2 logs thm-frontend --lines 200
 *   pm2 describe thm-frontend
 */

const path = require("path");

const PORT = Number(process.env.PORT || 3000);
// DO NOT use process.env.HOSTNAME here — Linux usually sets it to the machine hostname (e.g. ip-172-31-0-142),
// which can cause Next to bind to an unexpected interface. nginx is proxying to 127.0.0.1, so bind to IPv4 loopback.
const BIND_HOST = process.env.BIND_HOST || "127.0.0.1";
const INSTANCES = process.env.PM2_INSTANCES ? Number(process.env.PM2_INSTANCES) : 1;
// Prefer explicit config, but provide safe defaults so production never leaks localhost into redirects.
// NextAuth uses NEXTAUTH_URL to build absolute callback/sign-in URLs.
const PUBLIC_HOST = process.env.NEXT_PUBLIC_HOST || "https://admin.thehotelmedia.com";
const NEXTAUTH_URL = process.env.NEXTAUTH_URL || PUBLIC_HOST;

module.exports = {
  apps: [
    {
      name: "thm-frontend",
      cwd: path.resolve(__dirname),
      // Run Next directly (more reliable than `pm2 start npm -- start` for signals/logging)
      script: "node_modules/next/dist/bin/next",
      args: ["start", "-p", String(PORT), "-H", BIND_HOST],
      interpreter: "node",
      instances: Number.isFinite(INSTANCES) && INSTANCES > 0 ? INSTANCES : 1,
      exec_mode: Number.isFinite(INSTANCES) && INSTANCES > 1 ? "cluster" : "fork",

      env: {
        NODE_ENV: "production",
        PORT: String(PORT),
        BIND_HOST,
        AUTH_DEBUG: process.env.AUTH_DEBUG || "false",
        NEXT_PUBLIC_HOST: PUBLIC_HOST,
        NEXTAUTH_URL,
        // If you use NEXTAUTH_URL_INTERNAL, keep it pointing to the local upstream for server-side calls.
        NEXTAUTH_URL_INTERNAL:
          process.env.NEXTAUTH_URL_INTERNAL || `http://${BIND_HOST}:${PORT}`,
      },

      // Resilience / self-healing
      autorestart: true,
      watch: false,
      min_uptime: 10_000,
      max_restarts: 50,
      restart_delay: 3_000,
      exp_backoff_restart_delay: 100,
      kill_timeout: 10_000,

      /**
       * If the process is being OOM-killed (very common on small EC2),
       * setting a max memory restart prevents prolonged 502s and provides a clear signal in PM2.
       * Tune based on instance size.
       */
      max_memory_restart: process.env.PM2_MAX_MEMORY_RESTART || "650M",

      // Logs
      time: true,
      merge_logs: true,
      log_date_format: "YYYY-MM-DD HH:mm:ss Z",
    },
  ],
};


