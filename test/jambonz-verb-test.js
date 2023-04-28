const test = require('tape');
const logger = require('pino')({level: process.env.JAMBONES_LOGLEVEL || 'error'});
const { validate } = require('..');

test("validate correct verbs", async (t) => {

  verbs = [
    {
      "verb": "play",
      "url": "https://example.com/example.mp3",
      "timeoutSecs": 10,
      "seekOffset": 8000,
      "actionHook": "/play/action"
    },
    {
      "verb": "conference",
      "name": "test",
      "beep": true,
      "startConferenceOnEnter": false,
      "waitHook": "/confWait",
      "enterHook": "/confEnter"   
    },
    {
      "verb": "config",
      "synthesizer": {
        "voice": "Jenny",
        "vendor": "google"
      },
      "recognizer": {
        "vendor": "google",
        "language": "de-DE"
      },
      "bargeIn": {
        "enable": true,
        "input" : ["speech"],
        "actionHook": "/userInput"
      }
    },
    {
      "verb": "dequeue",
      "name": "support",
      "beep": true,
      "timeout": 60
    },
    {
      "verb": "dial",
      "actionHook": "/outdial",
      "callerId": "+16173331212",
      "callerName": "Tom",
      "answerOnBridge": true,
      "dtmfCapture": ["*2", "*3"],
      "dtmfHook": {
        "url": "/dtmf",
        "method": "GET"
      },
      "amd": {
        "actionHook": "/answeringMachineDetection",
    
      },
      "target": [
        {
          "type": "phone",
          "number": "+15083084809",
          "trunk": "Twilio"
        },
        {
          "type": "sip",
          "sipUri": "sip:1617333456@sip.trunk1.com",
          "auth": {
            "username": "foo",
            "password": "bar"
          }
        },
        {
          "type": "user",
          "name": "spike@sip.example.com"
        }
      ]
    },
    {
      "verb": "dialogflow",
      "project": "ai-in-rtc-drachtio-tsjjpn",
      "lang": "en-US",
      "credentials": "{\"type\": \"service_account\",\"project_id\": \"prj..",
      "welcomeEvent": "welcome",
      "eventHook": "/dialogflow-event",
      "actionHook": "/dialogflow-action"
    },
    {
      "verb": "dtmf",
      "dtmf": "0276",
      "duration": 250
    },
    {
      "verb": "enqueue",
      "name": "support",
      "actionHook": "/queue-action",
      "waitHook": "/queue-wait"
    },
    {
      "verb": "gather",
      "actionHook": "http://example.com/collect",
      "input": ["digits", "speech"],
      "bargein": true,
      "dtmfBargein": true,
      "finishOnKey": "#",
      "numDigits": 5,
      "timeout": 8,
      "recognizer": {
        "vendor": "google",
        "language": "en-US",
        "hints": ["sales", "support"],
        "hintsBoost": 10,
        "deepgramOptions": {
          "endpointing": 500
        }
      },
      "say": {
        "text": "To speak to Sales press 1 or say Sales.  To speak to customer support press 2 or say Support",
        "synthesizer": {
          "vendor": "google",
          "language": "en-US"
        }
      }
    },
    {
      "verb": "gather",
      "actionHook": "http://example.com/collect",
      "input": ["digits", "speech"],
      "bargein": true,
      "dtmfBargein": true,
      "finishOnKey": "#",
      "numDigits": 5,
      "timeout": 8,
      "recognizer": {
        "vendor": "google",
        "language": "en-US",
        "hints": ["sales", "support"],
        "hintsBoost": 10,
        "deepgramOptions": {
          "endpointing": true
        }
      },
    },
    {
      "verb": "hangup",
      "headers": {
        "X-Reason" : "maximum call duration exceeded"
      }
    },
    {
      "verb": "leave"
    },
    {
      "verb": "lex",
      "botId": "MTLNerCD9L",
      "botAlias": "z5yY1iYykE",
      "region": "us-east-1",
      "locale": "en_US",
      "credentials": {
        "accessKey": "XXXX",
        "secretAccessKey": "YYYY"
      },
      "passDtmf": true,
      "intent": {"name":"BookHotel"},
      "metadata": {
        "slots": {
          "Location": "Los Angeles"
        },
        "context": {
          "callerId": "+15083084909",
          "customerName": "abc company"
        }
      },
      "tts": {
        "vendor": "google",
        "language": "en-US",
        "voice": "en-US-Wavenet-C"
      },
      "eventHook": "/lex-events"
    },
    {
      "verb": "listen",
      "url": "wss://myrecorder.example.com/calls",
      "mixType" : "stereo"
    },
    {
      "verb": "message",
      "to": "15083084809",
      "from": "16173334567",
      "text": "Your one-time passcode is 1234",
      "actionHook": "/sms/action"
    },
    {
      "verb": "pause",
      "length": 3
    },
    {
      "verb": "play",
      "url": "https://example.com/example.mp3",
      "timeoutSecs": 10,
      "seekOffset": 8000,
      "actionHook": "/play/action"
    },
    {
      "verb": "rasa",
      "url": "http://my-assitant.acme.com/webhooks/rest/webhook?token=foobarbazzle",
      "prompt": "Hello there!  What can I do for you today?",
      "eventHook": "/rasa/event",
      "actionHook": "/rasa/action"
    },
    {
      "verb": "redirect",
      "actionHook": "/connectToSales",
    },
    {
      "verb": "say",
      "text": "hi there!",
      "synthesizer" : {
        "vendor": "google",
        "language": "en-US"
      }
    },
    {
      "verb": "sip:decline",
      "status": 480,
      "reason": "Gone Fishing",
      "headers" : {
        "Retry-After": 1800
      }
    },
    {
      "verb": "sip:request",
      "method": "INFO",
      "headers": {
        "X-Metadata": "my sip metadata"
      },
      "actionHook": "/info"
    },
    {
      "verb": "sip:refer",
      "referTo": "+15083084809",
      "actionHook": "/action"
    },
    {
      "verb": "tag",
      "data": {
        "foo": "bar",
        "counter": 100,
        "list": [1, 2, "three"]
      }
    },
    {
      "verb": "transcribe",
      "transcriptionHook": "http://example.com/transcribe",
      "recognizer": {
        "vendor": "nvidia",
        "language" : "en-US",
        "interim": true
      }
    }
  ];
  try {
    validate(logger, verbs);
    t.ok(1 == 1,'successfully validate verbs');
  } catch(err) {
    t.fail('validate should not fail here. with reason: ' + err);
  }
  
  t.end();
});

test('invalid test', async (t) => {
  verbs = [
    {
      "verb": "play",
      "timeoutSecs": 10,
      "seekOffset": 8000,
      "actionHook": "/play/action"
    }
  ];
  try {
    validate(logger, verbs);
    t.fail('validate should not fail here. with reason: ' + err);
  } catch(err) {
    t.ok(1 == 1,'successfully validate verbs');
  }
  
  t.end();
})