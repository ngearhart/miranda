
let io = require('socket.io');
let url = "10.0.0.3";
let socket = io(url);
let SerialPort = require("serialport").SerialPort
let exec = require('child_process').exec;

console.log("Starting...")

//socket.on();

function getSerialPorts(onComplete) {
    exec('dmesg | grep tty', function (error, stdout, stderr) {
      var result = [];
      stdout.split("\n").forEach(function(line){
        var words=line.split(" ");
        if(words.length>=6 && words[6].substring(0,3)=="tty"){
            result.push(words[6]);
        }
      });
      onComplete(result);
    });
}

function openSerial(ports) {
    var serialPort = new SerialPort(ports[0], {
    baudrate: 9600
    }, false); // this is the openImmediately flag [default is true]

    serialPort.open(function (error) {
    if ( error ) {
        console.log('failed to open: '+error);
    } else {
        console.log('open');
        serialPort.on('data', function(data) {
            console.log('data received: ' + data);
        });
        serialPort.write("test\n", function(err, results) {
            console.log('err ' + err);
            console.log('results ' + results);
        });
    }
    });
}

getSerialPorts(openSerial);