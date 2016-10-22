//This program integrates the data parse and the email dispatch

var enviarEmail= require('./email');
var watchdog = require('./watchdog');

enviarEmail();
watchdog();

//node ./index.js
