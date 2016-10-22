//Incluir en el programa de lectura para realizar conexión con MongoDB
//guardar debe llamarse despues de leer cada variable


var mongoose = require('mongoose');
var db = mongoose.connect('mongodb://localhost/sensors');

function guardar(dato, indice){
var dataPoint=new DataPoint ();
dataPoint.value=dato;
dataPoint.sensorID=indice;
dataPoint.timestamp=new Date();
dataPoint.save();
};

