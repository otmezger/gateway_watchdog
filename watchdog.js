//This program performs the data parsing. It doesn't store the data in MongoDB
//in order to execute tests with the email


var fs = require('fs'); //Library for readFile
var DataPoint = require('./models/dataPointModel');//Standard data model


var memlibre,memtotal,cargaproc,voltaje,frecuencia,temperatura;//Variables for data parsing
var ultimo_voltaje=0;
var ultima_frecuencia=0;
var ultima_temperatura=0;


var json = require('json-file'); 
var file = json.read('./package.json');//JSON package to send emails

var aux;//Auxiliar variable for reading through bash commands




function leer_linea (archivo, linea_no, callback) { //This function only reads one line from an specific file
    var data = fs.readFileSync(archivo, 'utf8');
    var lineas = data.split("\n");
    if(+linea_no > lineas.length){
      throw new Error('File end reached without finding line');
    }
    callback(null, lineas[+linea_no]);
}



function lectura(){ //Function for reading all data at the same time

comando_bash('/opt/vc/bin/vcgencmd measure_volts core'); //Read voltage through a bash command
setTimeout(function(){ //Includes a delay to allow for the data parsing
voltaje=parseFloat(aux.slice(5));//Asign only the numeric value that was read


leer_linea('/proc/meminfo', 0, function(err, linea){ //Reads total memory
memtotal=linea;
});
leer_linea('/proc/meminfo', 2, function(err, linea){ //Read available memory
memlibre=linea;
});
var memlibre_num= parseFloat(memlibre.slice(13)); //Parses only numeric values
var memtotal_num=parseFloat(memtotal.slice(9));
var usomem=(memlibre_num/memtotal_num)*100;


comando_bash('/opt/vc/bin/vcgencmd measure_clock core'); 
setTimeout(function(){ //Every bash call need time to load memory
frecuencia=parseFloat(aux.slice(13));


cargaproc=fs.readFileSync('/proc/loadavg', 'utf8'); //The processor load file is read directly
var procesador5min=parseFloat(cargaproc.slice(5,9)); //Only the five minute average value is chosen


comando_bash('/opt/vc/bin/vcgencmd measure_temp');
setTimeout(function(){
temperatura=parseFloat(aux.slice(5));
ultima_temperatura=temperatura;

file.set('Voltage', voltaje); //Choose the read data in the JSON file
file.set('MemoryUse',usomem );
file.set('Frequency',frecuencia );
file.set('Processor',procesador5min*100 ); //The processor reading is turned into a percentage
file.set('Temperature',temperatura );
var date = new Date(); //Take the actual time and date value
file.set('Fecha',date.toLocaleDateString()); //Turn date variable type to string type
file.set('Hora',date.toLocaleTimeString());

file.writeSync(); //Saves JSON
},500);},500);},500);
console.log(temperatura); //For debugging purposes

};

function comando_bash(comando){ //This function executes a bash command inside the program
var exec = require('child_process').exec, child;
child = exec(comando,
function (error, stdout, stderr) { 
    aux=stdout; //The command's text output is stored inside aux
    if (error !== null) {
      console.log('exec error: ' + error);
    }
});
};


setInterval(lectura,16000); //Makes a reading every 16s (for testing)

module.exports =lectura; 

