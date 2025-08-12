var Service = require("node-windows").Service;

var svc = new Service({
  name: 'SDI Walkthrough - NestJS Backend',
  description: 'NestJS server for SDI Walkthrough',
  script: 'C:\\walkthrough\\nestjs-back-end\\dist\\main.js',
  workingDirectory: `C:\\walkthrough\\nestjs-back-end\\dist\\`,
});

// Listen for the "uninstall" event so we know when it's done.
svc.on("uninstall", function () {
  console.log("Uninstall complete.");
  console.log("The service exists: ", svc.exists);
});

// Uninstall the service.
svc.uninstall();
