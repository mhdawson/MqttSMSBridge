# MqttSMSBridge

Micro-app server that accepts requests through mqtt
and then sends out notifications through SMS.  It is currently
intended to provide personal notifications you configured a
predefined set of numbers to which notifications will be sent
when a request is received.

It also provides a simple UI that shows the SMS
requests that have been serviced:

![sms UI ](https://raw.githubusercontent.com/mhdawson/MqttSMSBridge/master/pictures/smsBridge.png)

To make requests you simply publish the SMS message that you want
to be sent to the topic on which the bridge is listening.

The bridge does not currenly do any authentication.  I currently
limit access by controlling access to the mqtt server by securing
it will `ssl` and requiring certificate based authentication.

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
  mqtts, then certificates must be provided through the certs
  element.
* requestTopic - topic on which the bridge listens for
  requests.
* certs - directory which must contain a `ca.cert`, `client.cert`
  and `client.key` file that will be used to connect to the mqtts
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

For example, this is my configuration file with some key elements
masked out:

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


# Installation

The easiest way to install is to run:

```bash
npm install https://github.com/mhdawson/MqttSMSBridge.git
```

and then configure the default config.json file in the lib directory as described
in the configuration section above.

# Running

Simply cd to the directory where the npm was installed and type:

```bash
npm start
```
