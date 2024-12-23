var Service = require("node-windows").Service;

var svc = new Service({
  name: "SDI Walkthrough - NextJS Frontend",
  description: "Next.js server for SDI Walkthrough",
  script: "C:\\SDI_Walkthrough\\next-front-end\\.next\\standalone\\server.js",
  workingDirectory: `C:\\SDI_Walkthrough\\next-front-end\\.next\\standalone\\`,
});

// Listen for the "uninstall" event so we know when it's done.
svc.on("uninstall", function () {
  console.log("Uninstall complete.");
  console.log("The service exists: ", svc.exists);
});

// Uninstall the service.
svc.uninstall();
