const request = require('request');
var token, reference, conversationID;
const crypto = require("crypto");
const async = require('async');
var id = crypto.randomBytes(8).toString("hex");
var conversationID = id;
var user = {};


var insightsModule = function(auth_token, bot_reference) {
  token = process.env.M_INSIGHTS_TOKEN;
  reference = process.env.M_INSIGHTS_REF;
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
	console.log('got it89');
	console.log(messageData)
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
    url: "https://d6936366.ngrok.io/registerconversation/",
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
        console.log(body);
      } else {
        console.log(err);
      }
    });
  })
}
