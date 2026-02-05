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
const HOSTNAME = process.env.HOSTNAME || "127.0.0.1";

module.exports = {
  apps: [
    {
      name: "thm-frontend",
      cwd: path.resolve(__dirname),
      // Run Next directly (more reliable than `pm2 start npm -- start` for signals/logging)
      script: "node_modules/next/dist/bin/next",
      args: ["start", "-p", String(PORT), "-H", HOSTNAME],
      interpreter: "node",

      env: {
        NODE_ENV: "production",
        PORT: String(PORT),
        HOSTNAME,
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


