//This program performs the data parsing. It doesn't store the data in MongoDB
//in order to execute tests with the email


var fs = require('fs'); //biblioteca para readFile
var DataPoint = require('./models/dataPointModel');//Modelo de datos estándar


var memlibre,memtotal,cargaproc,voltaje,frecuencia,temperatura;//Variables para lectura de datos
var ultimo_voltaje=0;
var ultima_frecuencia=0;
var ultima_temperatura=0;


var json = require('json-file'); 
var file = json.read('./package.json');//Paquete JSON para enviar por correo

var aux;//auxiliar para leer mediante comandos bash




function leer_linea (archivo, linea_no, callback) { //Esta función lee solo una línea de un archivo específico
    var data = fs.readFileSync(archivo, 'utf8');
    var lineas = data.split("\n");
    if(+linea_no > lineas.length){
      throw new Error('File end reached without finding line');
    }
    callback(null, lineas[+linea_no]);
}



function lectura(){ //Función para leer todos los datos a la vez

comando_bash('/opt/vc/bin/vcgencmd measure_volts core'); //lee voltaje mediante comando bash
setTimeout(function(){ //Se incluye un delay para permitir la lectura de datos
voltaje=parseFloat(aux.slice(5));// Asignar solo el valor numérico leído


leer_linea('/proc/meminfo', 0, function(err, linea){ //Lee memoria total
memtotal=linea;
});
leer_linea('/proc/meminfo', 2, function(err, linea){ //Lee la memoria disponible
memlibre=linea;
});
var memlibre_num= parseFloat(memlibre.slice(13)); //Escoger solo los valores numéricos
var memtotal_num=parseFloat(memtotal.slice(9));
var usomem=(memlibre_num/memtotal_num)*100;


comando_bash('/opt/vc/bin/vcgencmd measure_clock core'); 
setTimeout(function(){ //Cada llamada a bash necesita tiempo para cargar en memoria
frecuencia=parseFloat(aux.slice(13));


cargaproc=fs.readFileSync('/proc/loadavg', 'utf8'); //El archivo de carga del procesador es una sola línea, se lee directo
var procesador5min=parseFloat(cargaproc.slice(5,9)); //Se escoge solo el valor promedio de 5 min


comando_bash('/opt/vc/bin/vcgencmd measure_temp');
setTimeout(function(){
temperatura=parseFloat(aux.slice(5));
ultima_temperatura=temperatura;

file.set('Voltage', voltaje); //Escribir los datos leídos en el archivo JSON
file.set('MemoryUse',usomem );
file.set('Frequency',frecuencia );
file.set('Processor',procesador5min*100 ); //La lectura de procesador se pasa a porcentaje
file.set('Temperature',temperatura );
var date = new Date(); //Tomar el valor de hora y fecha actual
file.set('Fecha',date.toLocaleDateString()); //Convierte variable tipo date a string
file.set('Hora',date.toLocaleTimeString());

file.writeSync(); //Guardar JSON
},500);},500);},500);
console.log(temperatura); //Para debug

};

function comando_bash(comando){ //Esta función ejecuta un comando bash dentro del programa
var exec = require('child_process').exec, child;
child = exec(comando,
function (error, stdout, stderr) { 
    aux=stdout; //La salida de texto del comando se almacena en aux
    if (error !== null) {
      console.log('exec error: ' + error);
    }
});
};


setInterval(lectura,16000); //Hacer lectura cada 16 s (para prueba) 

module.exports =lectura; 

