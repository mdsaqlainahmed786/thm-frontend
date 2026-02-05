module.exports = {
  apps: [{
    name: 'thm-frontend',
    script: 'node_modules/.bin/next',
    args: 'start',
    instances: 1,
    exec_mode: 'fork',
    watch: false,
    
    // Memory management - restart if memory exceeds limit
    max_memory_restart: '1G',
    
    // Auto restart configuration
    autorestart: true,
    max_restarts: 10,
    min_uptime: '10s',
    restart_delay: 4000,
    
    // Graceful shutdown
    kill_timeout: 5000,
    wait_ready: true,
    listen_timeout: 10000,
    
    // Logging
    error_file: './logs/pm2-error.log',
    out_file: './logs/pm2-out.log',
    log_date_format: 'YYYY-MM-DD HH:mm:ss Z',
    merge_logs: true,
    
    // Environment
    env: {
      NODE_ENV: 'production',
      PORT: 3000
    },
    
    // Health check - restart if not responding
    exp_backoff_restart_delay: 100,
  }]
};

