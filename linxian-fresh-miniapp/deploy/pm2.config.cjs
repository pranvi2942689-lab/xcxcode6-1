module.exports = {
  apps: [
    {
      name: "linxian-fresh-server",
      cwd: "/srv/linxian-fresh-miniapp/server",
      script: "app.js",
      env: {
        NODE_ENV: "production",
        APP_PORT: 3000
      }
    }
  ]
};
