var async = require('async');
var Wemo = require('wemo-client');
var Device = require('structure-sdk-js').Device;

// The serial number of the Wemo. Makes sure that if there's multiple on
// the network, we pick the right one.
var myWemoSerial = 'my-wemo-serial';

var wemo = new Wemo();
var device = new Device({
  id: 'my-device-id',
  key: 'my-access-key',
  secret: 'my-access-secret'
});

device.on('error', function(err) { console.log(err); });
device.on('connect', function() { console.log('Connected to Structure!') });

// Connect the device to Structure.
device.connect();

// Attach the command event handler. Occurs whenever
// a command is sent to this device from Structure.
device.on('command', function(command) {

  if(!wemoClient) {
    return;
  }

  console.log(command);

  if(command.name === 'on') {
    wemoClient.setBinaryState(1);
  }
  else if(command.name == 'off') {
    wemoClient.setBinaryState(0);
  }
});

var wemoClient = null;

// Look for the wemo.
async.whilst(
  function() { return wemoClient === null; },
  function(callback) {

    // Waiting for 5 seconds to find wemo on network.
    setTimeout(callback, 5000);

    console.log('Looking for devices.');

    // Gets invoked whenever a wemo is discovered.
    wemo.discover(function(deviceInfo) {

      // Check to make sure this is the wemo we want to control.
      if(deviceInfo.serialNumber === myWemoSerial) {
        console.log('Found my WeMo!');
        wemoClient = wemo.client(deviceInfo);
      }
    });
  }
);
