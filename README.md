# MqttSMSBridge

Micro-app server that accepts requests through mqtt
and then sends out notifications through SMS.

# Configuration

Configuration for the bridge is through the
config.json file in the lib directory.
The bridge currently supports 2 SMS providers:

* voipms
* twilio

The options for each of the provider elements are:

* voipms
  * enabled - set to true if you want notifications to
    be sent using this provider.
  * user - voip.ms API userid.
  * password - voip.ms API password.
  * did - voip.ms did(number) from which the SMS will be sent.
  * dst - number to which the SMS will be sent.
* twilio
  * enabled - set to true if you want notifications to
    be sent using this provider.
  * accountSID - twilio account ID.
  * accountAuthToken - twilio auth token.
  * toNumber - number to which the SMS will be sent.
  * fromNumber - number from which the SMS will be sent.

The mqtt server through which requests are accepted is configured
through the mqtt element.  This is an array or one more objects
with the following elements:

* serverlUrl - url for the mqtt server.  If it is of type
  mqtts, then certifications must be provided in the certs
  element:w
* requestTopic - topic on which the bridge listens for
  requests.
* certs - directory which must contain a `ca.cert`, `client.cert`
  and `client.key` file that will be used to connect to the mqtt
  server.

In addition, the bridge supports the following configuration
elements, as well as those supported by the
[micro-app-framework](https://github.com/mhdawson/micro-app-framework).

* title - title for the window for the application.
* windowSize - size of the window for the application.
* serverPort - port on which to connect to get the GUI for the.
  application.
* eventLogPrefix - path to the directory into which the log file
  will be written.

An sample configuration file (with the sensitive bits masked):

```json
{
  "title": "SMS Bridge",
  "windowSize": { "x": 300, "y": 300 },
  "serverPort": 14000,
  "eventLogPrefix": "/home/user1/repo/MqttSMSBridge",
  "mqtt": [ { "serverUrl": "mqtt:10.1.1.186:1883",
              "requestTopic": "house/sms" }
          ],
  "voipms": { "enabled": true,
              "user": "XXXXXXXXXX",
              "password": "XXXXXX",
              "did": "XXXXXXXXXX",
              "dst": "XXXXXXXXXX" },
  "twilio": { "enabled": false,
              "accountSID": "XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX",
              "accountAuthToken": "XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX",
              "toNumber": "XXXXXXXXXXX" ,
              "fromNumber": "XXXXXXXXXX" }
}
```
