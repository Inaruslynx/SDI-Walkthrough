var Service = require("node-windows").Service;

var svc = new Service({
  name: "SDI Walkthrough - NextJS Frontend",
  description: "Next.js server for SDI Walkthrough",
  script: "C:\\SDI_Walkthrough\\next-front-end\\.next\\standalone\\server.js",
  workingDirectory: `C:\\SDI_Walkthrough\\next-front-end\\.next\\standalone\\`,
});

svc.on("install", function () {
  svc.start();
});

svc.on("alreadyinstalled", function () {
  console.log("This service is already installed.");
});

svc.on("start", function () {
  console.log(
    svc.name + " start!\nVisit http://fs3s-hotmilllog:3000/ to visit the site."
  );
});

svc.install();
