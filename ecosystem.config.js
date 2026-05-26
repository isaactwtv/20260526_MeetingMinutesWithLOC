module.exports = {
  apps: [
    {
      name: "meeting-minutes-app",
      script: "./dist/server.cjs",
      instances: "max",       // Utilize all available CPU cores
      exec_mode: "cluster",   // Run in cluster mode for load balancing
      watch: false,
      env: {
        NODE_ENV: "production",
        PORT: 3000
      },
      env_production: {
        NODE_ENV: "production",
        // The port PM2 will bind the app to in production
        PORT: 3000
        // GEMINI_API_KEY: "your_real_gemini_api_key" (Recommended to set via system environment variables)
      }
    }
  ]
};
