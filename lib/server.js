// Copyright 2016 the project authors as listed in the AUTHORS file.
// All rights reserved. Use of this source code is governed by the
// license that can be found in the LICENSE file.
"use strict";

const mqtt = require('mqtt');
const https = require('https');

const sendSmsMessageVoipms = function(config, info) {
  if ((config.voipms != undefined) && (config.voipms.enabled)) {
    var options = { host: 'voip.ms',
                    port: 443,
                    method: 'GET',
                    path: '/api/v1/rest.php?' + 'api_username=' + config.voipms.user + '&' +
                                                'api_password=' + config.voipms.password + '&' +
                                                'method=sendSMS' + '&' +
                                                'did=' + config.voipms.did + '&' +
                                                'dst=' + config.voipms.dst + '&' +
                                                'message=' + encodeURIComponent(info)
                   };
    var request = https.request(options, function(res) {
      if (res.statusCode !== 200) {
        console.log('STATUS:' + res.statusCode);
      }
    });
    request.end();
  }
}

const sendSmsMessageTwilio = function(config, info) {
  if ((config.twilio != undefined) && (config.twilio.enabled)) {
    var twilioClient = new twilio.RestClient(config.twilio.accountSID, config.twilio.accountAuthToken);
    twilioClient.sendMessage({
      to: config.twilio.toNumber,
      from: config.twilio.fromNumber,
      body: info
    }, function(err, message) {
      if (err) {
       console.log('Failed to send sms:' + err.message);
      }
    });
  }
};

///////////////////////////////////////////////
// micro-app framework methods
///////////////////////////////////////////////
var Server = function() {
}

Server.getDefaults = function() {
  return { 'title': 'SMS bridge' };
}


var replacements;
Server.getTemplateReplacments = function() {
  if (replacements === undefined) {
    var config = Server.config;
    replacements = [{ 'key': '<DASHBOARD_TITLE>', 'value': config.title },
                    { 'key': '<UNIQUE_WINDOW_ID>', 'value': config.title },
                    { 'key': '<PAGE_WIDTH>', 'value': PAGE_WIDTH },
                    { 'key': '<PAGE_HEIGHT>', 'value': PAGE_HEIGHT }];

  }
  return replacements;
}

var mqttClients = new Array();
Server.startServer = function(server) {
  const config = Server.config;

  // connect to each of the configured mqtt servers
  for (var i = 0; i < config.mqtt.length; i++) {
    let mqttOptions;
    if (config.mqtt[i].serverUrl.indexOf('mqtts') > -1) {
      const certsPath = config.mqtt[i].certs;
      mqttOptions = { key: fs.readFileSync(path.join(__dirname, certsPath, '/client.key')),
                      cert: fs.readFileSync(path.join(__dirname, certsPath, '/client.cert')),
                      ca: fs.readFileSync(path.join(__dirname, certsPath, '/ca.cert')),
                      checkServerIdentity: function() { return undefined }
      }
    }

    mqttClients[i] = mqtt.connect(config.mqtt[i].serverUrl, mqttOptions);

    let subscribeFunction = mqttClients[i].subscribe.bind(mqttClients[i], config.mqtt[i].requestTopic);
    mqttClients[i].on('connect',function() {
      subscribeFunction();
    });

    mqttClients[i].on('message', function(topic, message) {
      message = message.toString();
      sendSmsMessageTwilio(config, message);
      sendSmsMessageVoipms(config, message);
    });
  };
}


if (require.main === module) {
  var path = require('path');
  var microAppFramework = require('micro-app-framework');
  microAppFramework(path.join(__dirname), Server);
}


module.exports = Server;
