var env = require('node-env-file');
process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';
env(__dirname + '/.env');
var express = require('express');
var app = express();
var watson = require('watson-developer-cloud');
var Botkit = require('botkit');
var request = require('request');
var debug = require('debug')('botkit:main');
var unirest = require('unirest');
var fs = require('file-system');
var cfenv = require("cfenv")
var path = require('path');
var appEnv = cfenv.getAppEnv()
var randomstring = require("randomstring");
var PDFDocument = require('pdfkit');
var ConversationV1 = require('watson-developer-cloud/conversation/v1');
var conversation = watson.conversation({
    username: '2dbb4e84-d7d1-401e-8ed4-432ad011922e',
    password: 'Ly5ZcRa1bjLv',
    version: 'v1',
    version_date: '2018-02-16'
});
var servicenowmsg;
var bot_options = {
    replyWithTyping: true,
};
var insightsModule = require('./_insights/insights_logger');
var insight = new insightsModule();
var Cloudant = require('cloudant');
// Initialize Cloudant with settings from .env
var username = '9a66b744-46c4-4397-94ae-7ab17dd96ab4-bluemix';
var password = 'e00737299d9e748bafdf77e1317fb5eb47257200a8eca0fff097bd21130c9456';
var cloudant = Cloudant({
    account: username,
    password: password
});
checkdb = cloudant.db.use('passwordreset')
convdb = cloudant.db.use('conversation')
var nodemailer = require('nodemailer');
var smtpTransport = require('nodemailer-smtp-transport');
var mailAccountUser = 'schinthalapudi@miraclesoft.com'
var mailAccountPassword = 'Susanth@1996'

var fromEmailAddress = 'saipavan.anand@gmail.com'
var toEmailAddress = email

var transport = nodemailer.createTransport({
    host: 'smtp.miraclesoft.com',
    port: 587,
    auth: {
        user: mailAccountUser,
        pass: mailAccountPassword
    }
})
var botty;
var messagey;
// Create the Botkit controller, which controls all instances of the bot.
var controller = Botkit.socketbot(bot_options);

//SDK integration

 controller.middleware.send.use(function(bot, message) {
	insight.logMessage(message);
});
controller.middleware.receive.use(function(bot, message) {
        if (message.namedata) {	 
		insight.logMessage(message);
		  }
}); 

//sdk integration

// Set up an Express-powered webserver to expose oauth and webhook endpoints
var webserver = require(__dirname + '/components/express_webserver.js')(controller);

var io = require('socket.io')(controller.httpserver);



webserver.get('/', function(req, res) {
    res.sendFile(__dirname + '/index.html')
})
webserver.get('/storeconv', function(req,res) {

var message = req.query.id
//console.log("message",JSON.stringify(message))
var data = {"conversation":message}
    convdb.insert(data,function(err){
		if(!err){
			//console.log("stored conv in db")
			res.send("data store in db")
		}
		else{
			//console.log(err)
		}
	})
})
var name;
var email;

webserver.get('/checkuserid', function(req, res) {
    //console.log("userid checking", req.query);
    checkdb.find({
        selector: req.query
    }, function(err, result) {
        if (err) {
            //console.log("error checkuserid api");
            res.send(false);
        } else {
            //console.log("checkuserid in");
            if (result.docs.length != 0) {
                res.send(true);
            } else {
                res.send(false);
            }
        }


    });
})
webserver.get('/login', function(req, res) {

    res.sendFile(__dirname + '/public/chatlayout.html')
})
webserver.post('/servicenow', function(req, res) {
    //console.log('body to service-now', req.query.username);
    var options = {
        url: 'https://dev14224.service-now.com/api/now/table/incident',
        method: 'POST',
        headers: {
            "Accept": "application/json",
            "Content-Type": "application/json",
            "Authorization": ("Basic " + new Buffer("admin:Miracle@123").toString('base64'))
        },
        json: true,
        body: {
            'short_description': req.query.username,
            'assignment_group': '287ebd7da9fe198100f92cc8d1d2154e',
            'urgency': '3',
            'impact': '3'
        }
    };

    function abc(error, response, body) {
        if (error) {
            //console.log('error with ServiceNow', error, null);
            var arr = [];
            var op = '{"message": "I am struggling to connect my backend systems, please try again later"}';
            arr.push(op);
           // response.output.text[0] = arr[0];
            botty.reply(message, response)
        } else {
			//console.log("body.result.number",body.result.number)
			if(!body.result){
				res.send("ID1233214")
			}
			else{
            //console.log("INDICENT", body.result.number)
            var incidentID = body.result.number;
            res.send(body.result.number)
			}
        }
    }

    request(options, abc);
})

// Load in some helpers that make running Botkit on Glitch.com better
require(__dirname + '/components/plugin_glitch.js')(controller);

// Load in a plugin that defines the bot's identity
require(__dirname + '/components/plugin_identity.js')(controller);

// enable advanced botkit studio metrics
// and capture the metrics API to use with the identity plugin!
controller.metrics = require('botkit-studio-metrics')(controller);

// Open the web socket server
controller.openSocketServer(controller.httpserver);

// Start the bot brain in motion!!
controller.startTicking();

var context = {};
var contextdata = [];
var normalizedPath = require("path").join(__dirname, "skills");

function yes_no(texty, contexty, callback) {
    //console.log('called yes_n0')
    fyi(function(contexty1) {
        conversation.message({
            workspace_id: '02a363a1-d95c-46b1-b77a-8a79f42b5514',
            input: {
                'text': texty
            },
            context: contexty
        }, function(err, response) {
            if (err) {
                var arr = [];
                var op = '{"message": "I am struggling to connect my backend systems, please try again later"}';
                arr.push(op);
                response.output.text[0] = arr[0];

                bot.reply(message, response)
            } else {
                contextdata = response.context;
                if (err) {
                    var arr = [];
                    var op = '{"message": "I am struggling to connect my backend systems, please try again later"}';
                    arr.push(op);
                    response.output.text[0] = arr[0];
                    bot.reply(message, response)
                    return //console.log('[alice.insert fyi] ', err.message);
                } else {
                    //console.log("fyi flow in", response);
                    callback(response)
                }
            }
        })
    })

}

function fyi(callback) {
    //console.log('fyi called');

    if (contextdata.length == 0) {
        //console.log('empty context')
        var ko = {};
        callback(ko);
    } else {
        //console.log('inserting new context');
        callback(contextdata);
    }
}

controller.on('message_received', function(bot, message, err) {
	//console.log("message",message)
    if (err) {
		console.log("err",err)
        bot.reply(message, "I am struggling to connect my backend systems, please try again later")
    }
    bot.botkit.config.replyWithTyping = false;
    if (message.state == 'Human') {

        var msg = {};

        msg.name = name;
        botty = bot;
        msg.data = message.chathist;
        messagey = message;

        //console.log("humanagent", message)
        setTimeout(function() {
            bot.reply(message, {
                'text': 'I’m sorry, I was not able to understand that Would you like to speak with an agent?',
				"Buttons": "<br><button id=\"button-Yes\"onclick=\"APICALL({channel: 'W', text: 'Accept'});\">Accept</button><br><br><button id=\"button-No\" onclick=\"APICALL({channel: 'W', text: 'Decline'});\">Decline</button>",
                'botstatus': "inactive"
            })
        }, 350);
    } else {
		console.log('botmessage',message.text)
        if (message.namedata != undefined) {
            name = message.namedata;
            email = message.emaildata;
        } else {
            name = name;
            email = email;
            context = context;
        }
        conversation.message({
            workspace_id: '02a363a1-d95c-46b1-b77a-8a79f42b5514',
            input: {
                'text': message.text
            },
            context: message.context
        }, function(err, response) {
            if (err) {
				console.log("err",err)
                bot.reply(message, "I am struggling to connect my backend systems, please try again later")
            } else {
				console.log("rest",response)
                response.chathistory = message.chathist;
				 console.log("response from ",JSON.stringify(response , null ,2));	
                if (message.text == 'Yes') {
					//console.log("servicenow Msg",name+"/ Not able to find username for password reset")
                    unirest.post(appEnv.url + '/servicenow')
                        .headers({
                            'Accept': 'application/json',
                            'Content-Type': 'application/json'
                        })
                        .query({
                            "username": name+"/Not able to find username for password reset"
                        })
                        .query({
                            "UserId": response.context.UserId
                        })
                        .query({
                            "SystemId": response.context.System
                        })
                        .end(function(resp) {
                            if (resp.status == 200) {
                                var incidentID = resp.raw_body;
                                var arr = [];
                                var op = '{"message": "I have submitted a ticket to the help desk, they will contact you soon"}';
                                var op1 = '{"message": "You may track the issue with the incident ID ' + incidentID + '"}';
                                delete response.output.text[0];
                                response.output.text = [];
                                response.output.text.push(op);
                                response.output.text.push(op1);
                                var testobj = {}
                                testobj[name] = message.text,
                                testobj['Oliver'] = JSON.parse(response.output.text[0]).message + " " + JSON.parse(response.output.text[1]).message
                                bot.reply(message, response)
                            } else {
                                var arr = [];
                                var op = '{"message": "I am struggling to connect my backend systems, please try again later"}';
                                arr.push(op);
                                response.output.text[0] = arr[0];

                                bot.reply(message, response)
                            }
                        })

                }			
               else if (message.cmd == 'No') {
                    var arr = [];
                                var op = '{"message": "Alright, let me know if you need anything else"}';
                                arr.push(op);
                                response.output.text[0] = arr[0];

                                bot.reply(message, response)
                            }
	else if (message.state == 'No') {
                    var arr = [];
                                var op = '{"message": "Alright, let me know if you need anything else"}';
                                arr.push(op);
                                response.output.text[0] = arr[0];

                                bot.reply(message, response)
                            }
							// Checking the SAP userName here
				else if (JSON.parse(response.output.text[0]).cmd == "UserId") {
                    unirest.get("https://12.28.130.97:44311/sap/opu/odata/SAP/ZUSER_EXISTENCE_SRV/UserSet(UserName='" + JSON.parse(response.output.text[0]).UserId + "')?$format=json")
                        .auth({
                            user: 'ABAP_User',
                            pass: 'Creatief@4010'
                        })
                        .end(function(responsex) {
							//console.log("responsex",responsex)
                            if (responsex.error) {
								//changes done on 26/6/2019
                                /* var arr = [];
                                var op = '{"message": "I am not able to reach the SAP system right now."}';
                                arr.push(op);
                                response.output.text[0] = arr[0];
                                bot.reply(message, response) */
											yes_no('No', response.context, function(new_response) {
                                            var testobj = {}
                                            testobj[name] = message.text,
                                                testobj['Oliver'] = JSON.parse(new_response.output.text[0]).message
                                            bot.reply(message, new_response)

                                        })
                            } else {
                                if (responsex != undefined) {

                                    //console.log("userid response");

                                    if (responsex.body.d.Message == 'User ' + JSON.parse(response.output.text[0]).UserId + ' exists') {
                                        //console.log("flow userid");
                                        yes_no('Yes', response.context, function(new_response) {
                                            var testobj = {}
                                            testobj[name] = message.text,
                                                testobj['Oliver'] = JSON.parse(new_response.output.text[0]).message
                                            bot.reply(message, new_response)

                                        })
                                    } else {

                                        yes_no('No', response.context, function(new_response) {
                                            var testobj = {}
                                            testobj[name] = message.text,
                                                testobj['Oliver'] = JSON.parse(new_response.output.text[0]).message
                                            bot.reply(message, new_response)

                                        })
                                    }
                                }
                            }
                        });

                } 
				else if (message.text == "Accept") {
					bot.reply(message, {
                'text': 'Connecting with one of our Agent',
                'botstatus': "inactive"
            })
				}
				else if (message.text == "Decline") {
					bot.reply(message, {
                'text': 'let me know if you need anything else'
            })
				}
				
				else if (message.text == "Nope, still have not found it") {
					servicenowmsg = name/+" Not able to find SystemId for password reset";
                    unirest.post(appEnv.url + '/servicenow')
                        .headers({
                            'Accept': 'application/json',
                            'Content-Type': 'application/json'
                        })
                        .query({
                            "username": name+"/Not able to find system name for password reset"
                        })
                        .query({
                            "UserId": response.context.UserId
                        })
                        .query({
                            "SystemId": response.context.System
                        })
                        .end(function(resp) {

                            //console.log("RAWRESPaasdf", resp.status);
                            if (resp.status == 200) {
                                var incidentID = resp.raw_body;
                                var arr = [];

                                var op = '{"message": "I am sorry I was not able to help you as I need the system name to process your request. I have submitted a ticket to the help desk, they will contact you soon"}';
                                arr.push(op);
                                response.output.text[0] = arr[0];
                                var arrt = [];

                                var op = '{"message": "You may track the issue with the incident ID ' + incidentID + '"}';
                                arrt.push(op);
                                response.output.text[1] = arrt[0];
                                var testobj = {}
                                testobj[name] = message.text,
                                    testobj['Oliver'] = JSON.parse(response.output.text[0]).message + " " + JSON.parse(response.output.text[1]).message;
                                bot.reply(message, response)

                            } else {
                                var arr = [];
                                var op = '{"message": "I am not able to reach the SERVICE NOW right now."}';
                                arr.push(op);
                                response.output.text[0] = arr[0];

                                bot.reply(message, response)
                            }
                        })
                } else if (message.text == "Nope, unable to login") {
					servicenowmsg = name/+" Not able to login with new password";
                    unirest.post(appEnv.url + '/servicenow')
                        .headers({
                            'Accept': 'application/json',
                            'Content-Type': 'application/json'
                        })
                        .query({
                            "username": name+"/Not able to login with new password"
                        })
                        .query({
                            "UserId": response.context.UserId
                        })
                        .query({
                            "SystemId": response.context.System
                        })
                        .end(function(resp) {
                            //console.log("RAWRESPaasdf", resp.status);
                            if (resp.status == 200) {
                                var incidentID = resp.raw_body;
                                var arr = [];

                                var op = '{"message": "I am sorry, I was not able to help you log into SAP system. I have submitted a ticket to the help desk, they will contact you soon"}';
                                arr.push(op);
                                response.output.text[0] = arr[0];
                                var arrt = [];

                                var op = '{"message": "You may track the issue with the incident ID ' + incidentID + '"}';
                                arrt.push(op);
                                response.output.text[1] = arrt[0];
                                var testobj = {}
                                testobj[name] = message.text,
                                    testobj['Oliver'] = JSON.parse(response.output.text[0]).message + " " + JSON.parse(response.output.text[1]).message;
                                bot.reply(message, response)

                            } else {
                                var arr = [];
                                var op = '{"message": "I am struggling to connect my backend systems, please try again later"}';
                                arr.push(op);
                                response.output.text[0] = arr[0];

                                bot.reply(message, response)
                            }
                        })
                } else if (JSON.parse(response.output.text[0]).cmd == "Name") { // checking the 1st security question
                    //console.log("Name triggered");
                    unirest.get(appEnv.url + '/checkuserid')
                        .query({
                            "NickName": JSON.parse(response.output.text[0]).Name,
                            '_id': response.context.UserId
                        })
                        .end(function(responseName) {
                            if (responseName.error) {
                                var arr = []
                                var op = '{"message": "I am struggling to connect my backend systems, please try again later"}';
                                arr.push(op);
                                response.output.text[0] = arr[0];

                                bot.reply(message, response)
                            } else {

                                //console.log('oye', name)

                                if (responseName.body) {
                                    //console.log(JSON.stringify(response, null, 2))
                                    //try to store chat data with username that geeta told in a database at different collection.
                                    yes_no('Yes', response.context, function(new_response) {
                                        var testobj = {}
                                        testobj[name] = message.text,
                                            testobj['Oliver'] = JSON.parse(new_response.output.text[0]).message
                                        bot.reply(message, new_response)

                                    })
                                } else {
                                    //console.log("Name false");

                                    yes_no('No', response.context, function(new_response) {
                                        var testobj = {}
                                        testobj[name] = message.text,
                                            testobj['Oliver'] = JSON.parse(new_response.output.text[0]).message
                                        bot.reply(message, new_response)

                                    })
                                }
                            }
                        });
                } else if (JSON.parse(response.output.text[0]).cmd == "BornPlace") {   // checking the 2nd security question
                    //console.log("BornPlace triggered");
                    unirest.get(appEnv.url + '/checkuserid')
                        .query({
                            "BornPlace": JSON.parse(response.output.text[0]).BornPlace,
                            '_id': response.context.UserId
                        })
                        .end(function(responseBornPlace) {
                            if (responseBornPlace.error) {
                                var op = '{"message": "I am not able to reach the SAP system right now"}';
                                var arr = [];
                                arr.push(op);
                                response.output.text[0] = arr[0];
                                bot.reply(message, response)
                            } else {
                                if (responseBornPlace.body) {
                                    //console.log("flow userid");
                                    //console.log("response", JSON.stringify(response, null, 2))

                                    yes_no('Yes', response.context, function(new_response) {

                                        //console.log(new_response, 'at born place')
                                        var testobj = {}
                                        testobj[name] = message.text,
                                            testobj['Oliver'] = JSON.parse(new_response.output.text[0]).message
                                        bot.reply(message, new_response)

                                    })
                                } else {
                                    //console.log("Born place false");

                                    yes_no('No', response.context, function(new_response) {
                                        var testobj = {}
                                        testobj[name] = message.text,
                                            testobj['Oliver'] = JSON.parse(new_response.output.text[0]).message
                                        bot.reply(message, new_response)

                                    })
                                }
                            }
                        });
                } else if (JSON.parse(response.output.text[0]).cmd == "PetName") {		// checking the 3rd security question
                    //console.log("PetName triggered");
                    unirest.get(appEnv.url + '/checkuserid')
                        .query({
                            "PetName": JSON.parse(response.output.text[0]).PetName,
                            '_id': response.context.UserId
                        })
                        .end(function(responsePetName) {
                            //console.log("PetName response", responsePetName.body);

                            if (responsePetName.body) {
                                //console.log(JSON.stringify(response, null, 2))
                                yes_no('Yes', response.context, function(new_response) {

                                    //console.log("new sresp", new_response);
                                    //console.log("new password flow entered")
                                    var randomNumber = randomstring.generate({
                                        length: 7,
                                        charset: 'abcdefgh123456789qxyz'
                                    });
                                    unirest.get("https://12.28.130.97:44311/sap/opu/odata/SAP/ZRESETPSWD_SRV/UserSet(UserName='" + response.context.UserId + "',Bapipwd='" + randomNumber.toString() + "')?$format=json")
                                        .auth({
                                            user: 'ABAP_User',
                                            pass: 'Creatief@4010'
                                        })
                                        .end(function(respo) {
console.log("respo",respo);
                                            if (respo.error) {
												console.log("respo.error",respo.error);
                                                var arrt = [];

                                                var op = '{"message": "I am not able to reach the SAP system right now."}';
                                                arrt.push(op);
                                                new_response.output.text[0] = arrt[0];

                                                bot.reply(message, new_response)
                                            } else {
                                                ////console.log(respo.body.d.Bapipwd);
                                                var arrt = [];
                                                var new_response1 = new_response
                                                var op = '{"message": "Thank you, I have been able to authenticate your identity. "}';
                                                arrt.push(op);
                                                new_response1.output.text[0] = arrt[0];
                                                var arrt = [];

                                                var op = '{"message": "Your temporary password for the ' + context.System + ' system is ' + randomNumber + '"}';
                                                arrt.push(op);
                                                arrt.push(new_response1.output.text[1])

                                                //console.log(arrt, 'aarti')

                                                new_response1.output.text[1] = arrt[0];
                                                new_response1.output.text[2] = arrt[1];
                                                //console.log(new_response1.output.text)
                                                var testobj = {}
                                                testobj[name] = message.text,
                                                    testobj['Oliver'] = JSON.parse(new_response1.output.text[0]).message + " " + JSON.parse(new_response1.output.text[1]).message
                                                bot.reply(message, new_response1)

                                            }

                                        })
                                })
                            } else {
                                //console.log("else flow in");
                                ////console.log(JSON.parse(response.output.text[0]).message)

                                yes_no('No', response.context, function(new_response) {
                                    var testobj = {}
                                    testobj[name] = message.text,
                                        testobj['Oliver'] = JSON.parse(new_response.output.text[0]).message
                                    bot.reply(message, new_response)

                                })
                            }

                        });
                }
				else {
                    var response1 = {};
                    response1 = response;
                    var testobj = {}
                    testobj[name] = message.text,
                    testobj['Oliver'] = JSON.parse(response.output.text[0]).message
                    bot.reply(message, response)
                    context = response.context;
                }
            }
        });
    }

});