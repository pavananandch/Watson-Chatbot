require('dotenv').load();

var middleware = require('botkit-middleware-watson')({
  username: 'd3cb035d-b79b-4ec6-8acd-39d7a812be01',
  password: 'Rsc0UnMhv3hl',
  workspace_id: 'e63bb82f-dcf4-4d67-9e36-a2671e94806c',
  url: process.env.CONVERSATION_URL || 'https://gateway.watsonplatform.net/conversation/api/v1/workspaces/e63bb82f-dcf4-4d67-9e36-a2671e94806c/message/',
  version_date: '2017-05-26'
});

module.exports = function(app) {
  if (process.env.USE_SLACK) {
    var Slack = require('./bot-slack');
    Slack.controller.middleware.receive.use(middleware.receive);
    Slack.bot.startRTM();
    console.log('Slack bot is live');
  }
  if (process.env.USE_FACEBOOK) {
    var Facebook = require('./bot-facebook');
    Facebook.controller.middleware.receive.use(middleware.receive);
    Facebook.controller.createWebhookEndpoints(app, Facebook.bot);
    console.log('Facebook bot is live');
  }
  if (process.env.USE_TWILIO) {
    var Twilio = require('./bot-twilio');
    Twilio.controller.middleware.receive.use(middleware.receive);
    Twilio.controller.createWebhookEndpoints(app, Twilio.bot);
    console.log('Twilio bot is live');
  }
  // Customize your Watson Middleware object's before and after callbacks.
  middleware.before = function(message, conversationPayload, callback) {
    callback(null, conversationPayload);
  }

  middleware.after = function(message, conversationResponse, callback) {
    callback(null, conversationResponse);
  }
};