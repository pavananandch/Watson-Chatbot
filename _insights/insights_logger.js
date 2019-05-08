const request = require('request');
var token, reference, conversationID;
const crypto = require("crypto");
const async = require('async');
var id = crypto.randomBytes(8).toString("hex");
var conversationID = id;
var user = {};


var insightsModule = function(auth_token, bot_reference) {
  token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI1YzdkMTc3N2VmNTY0ODI4Zjg1ZDM1ZGYiLCJjcmVhdGVkQXQiOiIyMDE5LTAzLTA0VDEyOjE4OjAwLjAyN1oiLCJpYXQiOjE1NTE3MDE4ODB9.bGgMNOre_IZZPAZSyVg-kRqwJ9vSYcNUpwzue2cUxLc';
  reference = '2a7dc0350180770c43e2dd6385774a7a';
};

insightsModule.prototype.logMessage = function(messageObj) {
	
	if (messageObj.type) {
    var messageData = {};
    messageData.timestamp = new Date();
    messageData.channel = 'Web';
    messageData.text = messageObj.text;
	if(user.name == messageObj.namedata){
		messageData.conversationID = conversationID;
	}
	else{
		messageData.conversationID = crypto.randomBytes(8).toString("hex");
		conversationID = messageData.conversationID ;
	}
    user.name= messageObj.namedata;
	user.id = messageObj.emaildata;
	messageData.user = user;
    messageData.origin = "User";
    messageData.type = 'message';
	messageData.intent = null ;
    reportMessage(messageData);
  } else {

  async.each(messageObj.output.text,function(message,callback){
	 var data = JSON.parse(message);
       var messageData = {};
      messageData.conversationID = conversationID;
      messageData.timestamp = new Date();
      messageData.channel = 'Web';
      messageData.text = data.message;
      messageData.user = user;
      messageData.origin = "Bot";
      messageData.type = 'message';
	  messageData.intent = messageObj.intents[0].intent;
      reportMessage(messageData);  
	  
  });
  
  };

}

module.exports = insightsModule;

function reportMessage(messageData) {
  var requestPayload = {
    url: "https://minsights-server-1-1.azurewebsites.net/registerconversation/",
    method: 'POST',
    json: true,
    headers: {
      'refid': reference
    },
    auth: {
      'bearer': token
    },
    body: messageData
  };
  return new Promise(function(fulfill, reject) {
    request.post(requestPayload, function(err, response, body) {
      if (!err) {
      } else {
        console.log(err);
      }
    });
  })
}
