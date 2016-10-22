//Include in the reading program to perform the connection with MongoDB
//"Save" must be called after reading each variable


var mongoose = require('mongoose');
var db = mongoose.connect('mongodb://localhost/sensors');

function save(dato, indice){
var dataPoint=new DataPoint ();
dataPoint.value=dato;
dataPoint.sensorID=indice;
dataPoint.timestamp=new Date();
dataPoint.save();
};

