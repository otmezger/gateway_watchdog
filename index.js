//This program integrates the data parse and the email dispatch

var enviarEmail= require('./email');
var perro = require('./watchdog');

enviarEmail();
perro();

//node ./index.js
