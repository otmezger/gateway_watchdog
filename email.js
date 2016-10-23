//This program sends an email when there's an alarm due to excesive core temperatures
//It can be expanded so it sends alarms for all 5 variables that are being measured in the RaspberryPi

var sender = require('sendgrid-sender'); //library to send emails
var json = require('json-file');

var alarma_activa=0; //auxiliar variable to avoid sending mutiple emails for the same reason


function enviarEmail(){
  var file = json.read('./package.json'); //Package for data exchange
  var Voltage=file.get('Voltage');  
  var MemoryUse=file.get('MemoryUse');
  var Frequency=file.get('Frequency');
  var Processor=file.get('Processor');
  var Temperature=file.get('Temperature');
  var Fecha=file.get('Fecha');
  var Hora=file.get('Hora');
  if (Temperature>50 && alarma_activa=0){ //Send an email in the case of alarm, just the first time
  sender('SG.T7MMhXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX-Rm34hVK89I1_iU8XfH0', {  //This is your API key, not your API ID. From sengrid.com
  from: 'sajibu3108@gmail.com',
  to: 'stevenjb.wolf@gmail.com',
  subject: 'test message',
  html: '<h1><font color="red">ALERTA ALTA TEMPERATURA</font></h1>'+ //Indicates the corresponding alarm
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
    console.log('message sent'); //For debugging purposes
  }
})
alarma_activa=1;}//Won't send more emails
else if (Temperature<=50){ //Resets alarm condition
alarma_activa=0;} 
;}

setTimeout(enviarEmail,4000); 
setInterval(enviarEmail,30000); //Checks for alarms every 30s

module.exports=enviarEmail;



