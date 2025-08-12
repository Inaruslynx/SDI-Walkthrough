var Service = require('node-windows').Service;

var svc = new Service({
  name: 'SDI Walkthrough - NestJS Backend',
  description: 'NestJS server for SDI Walkthrough',
  script: 'C:\\walkthrough\\nestjs-back-end\\dist\\main.js',
  workingDirectory: `C:\\walkthrough\\nestjs-back-end\\dist\\`,
});

svc.on('install', function () {
  svc.start();
});

svc.on('alreadyinstalled', function () {
  console.log('This service is already installed.');
});

svc.on('start', function () {
  console.log(
    svc.name +
      ' start!\nAPI is running.',
  );
});

svc.install();
