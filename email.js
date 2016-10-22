//Este programa envía un correo cuando hay alarma por temperatura excesiva
//Se puede ampliar para enviar alarma en las 5 variables

var sender = require('sendgrid-sender'); //biblioteca para enviar correos
var json = require('json-file');

var alarma_activa=0; //auxiliar para evitar enviar múltiples correos


function enviarEmail(){
  var file = json.read('./package.json'); //Paquete para intercambio de datos
  var Voltage=file.get('Voltage');  
  var MemoryUse=file.get('MemoryUse');
  var Frequency=file.get('Frequency');
  var Processor=file.get('Processor');
  var Temperature=file.get('Temperature');
  var Fecha=file.get('Fecha');
  var Hora=file.get('Hora');
  if (Temperature>50 && alarma_activa=0){ //Enviar correo solo en caso de alarma, solo la primera vez
  sender('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', {  
  from: 'sajibu3108@gmail.com',
  to: 'stevenjb.wolf@gmail.com',
  subject: 'test message',
  html: '<h1><font color="red">ALERTA ALTA TEMPERATURA</font></h1>'+ //Indica alarma correspondiente
	'<h3>Voltaje es : '+ Voltage + 'V</h3>'+
	'<h3>Uso de memoria es : '+ MemoryUse + '</h3>'+
	'<h3>La frecuencia es : '+ Frequency + '</h3>'+
	'<h3>Procesador es : '+ Processor + '</h3>'+
	'<h3>Temperatura es : '+ Temperature + ' °C</h3>'+
	'<h3>Fecha: '+ Fecha + '  Hora:'+ Hora +'</h3>'	
}, function(err) {
  if (err) {
    console.log('error while sending message: ' + err);
  } else {
    console.log('message sent'); //Para debug
  }
})
alarma_activa=1;}//Avisa que ya no se deben enviar más correos
else if (Temperature<=50){ //Si la situación vuelve a la normalidad, se resetea la condición de alarma
alarma_activa=0;} 
;}

setTimeout(enviarEmail,4000); 
setInterval(enviarEmail,30000); //Comprobar si existe alarma cada 30 s

module.exports=enviarEmail;



