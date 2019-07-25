'use strict';
//window.$ = window.jQuery = require('jquery');
var nodemailer = require('nodemailer');
var PDFDocument = require('pdfkit');
var smtpTransport = require('nodemailer-smtp-transport');
var mailAccountUser = 'oliverbotagent@gmail.com';
var mailAccountPassword = 'Miracle@123';
var fromEmailAddress = 'oliverbotagent@gmail.com';
var fs = require('file-system');
var app = require('express')();
var myVar;
var snackbar = false;
var toEmailAddress = localStorage.getItem("email");
var displayName = localStorage.getItem("name");
function titleCase(str) {
   var splitStr = str.toLowerCase().split(' ');
   for (var i = 0; i < splitStr.length; i++) {
       // You do not need to check if i is larger than splitStr length, as your for does that for you
       // Assign it back to the array
       splitStr[i] = splitStr[i].charAt(0).toUpperCase() + splitStr[i].substring(1);     
   }
   // Directly return the joined string
   return splitStr.join(' '); 
}
displayName = titleCase(displayName); // name used for display in agent side
var namedata = localStorage.getItem("name");
//namedata = namedata.charAt(0).toUpperCase() + namedata.slice(1);
namedata = titleCase(namedata);
namedata = namedata.replace(/\s/g, '')
var name = localStorage.getItem("name");
//name = name.charAt(0).toUpperCase() + name.slice(1);
name = titleCase(name);
name = name.replace(/\s/g, '')
console.log(name)
var email = localStorage.getItem("email");
var idleTime = 0;
var agentname;
var socket = io.connect('http://OliverAgent.mybluemix.net/');
$(".typing").hide();
 $("#typer").hide();
  window.onbeforeunload = function() {
	 if(snackbar){
    socket.emit('logoutname', {'name':name,'botstatus':'inactive','agent':agentname});
	 }
}
 $(".input").bind("keyup", function(e) {
if(!$('.input').val() == ""){
	 socket.emit('typingon',{"name":name,"status":"on"})
}
else{
 socket.emit('typingoff',{"name":name,"status":"off"})
 }
}) 
socket.on('connect',function(){ 
    // Send ehlo event right after connect:
   socket.emit('create',name);
});

 socket.on('agenttypeon',function(){ 
	 $(".typing").show();
	 document.getElementById("typing").innerHTML = agentname + " is typing..."
	console.log("Oliveragenttypingon");
	 //$("#typer").show();
});
socket.on('agenttypeoff',function(){ 
console.log("Oliveragenttypingoff");
	 $(".typing").hide();
	 //$("#typer").hide();
});

//  Configure email params.
var transport = nodemailer.createTransport(smtpTransport({
    service: 'gmail',
	secure: false,
    auth: {
        user: mailAccountUser,
        pass: mailAccountPassword
    },
	tls: {
        rejectUnauthorized: false
    }
}))

var count = 0;
var mail;
var typingstatus;
var botstatus = 'active';
var bote = true;
var ipcRenderer = require('electron').ipcRenderer;
const path = require('path')
var context;
var chathistory = [];
var chathist = [];
console.log(typeof(chathist))
var chatd;
var chatdata;
var botcount = 0;

var windowstatus = document.hidden
socket.on("agentmsg",function(agentmsg){
				console.log(agentmsg)
				 play();
				messenger.recieve(agentmsg);
			})
socket.on('agent',function(msg){
	agentname = msg.agentname
	console.log(agentname)
	myStopFunction();
	bote = false;
	idleTime = 0;
	snackbar = true;
	botstatus = "inactive";
	play();
	messenger.recieve(msg);
})
socket.on('startbot',function(msg){
	if(botstatus != "active"){
	setTimeout(function() {
            messenger.recieve({
                text: "You have been disconnected from the help desk agent"
            });
        }, 900);
	}
	botstatus = "active";
	bote = true;
	snackbar = false;
    botcount = 0;
	        
})
function logout() {
	//socket.emit('chathistory',{"chathist":chathist,"name":name})
	socket.emit('logoutname', {'name':name,'botstatus':botstatus});	
bote = true;
idleTime = 0;
    botcount = 0;
	botstatus = "active";
    console.log("logout func in")
    localStorage.removeItem('email');
    localStorage.removeItem('name');
    ipcRenderer.send('removefile', function() {
        console.log("remove triggered")
    });
    mail = {
        from: fromEmailAddress,
        to: email,
        subject: "Chat summary",
	html:`<html xmlns="http://www.w3.org/1999/xhtml"> <head> <link rel="stylesheet" type="text/css" href="//fonts.googleapis.com/css?family=Open+Sans"> <title>Password Reset Bot</title> </head> <body marginwidth="0" marginheight="0" style="background-color: #b7b2b3;width: 100%;background-size: cover;"> <span style="display:none;font-size:12px;font-family:'Open Sans';">Password Reset Bot</span> <table width="100%" border="0" cellpadding="0" cellspacing="0" align="center" style="max-width: 800px;border-radius:10px;"> <tbody> <tr> <td height="15px"></td> </tr> <tr> <td> <table data-module="Footer" cellspacing="0" cellpadding="0" border="0" bgcolor="#232527" align="center" width="100%" style="max-width: 800px; border-radius: 7px 7px 0 0;"> <tbody> <tr> <td align="center"> <table cellpadding="0" cellspacing="0" border="0" width="100%" style="max-width: 700px;" align="center"> <tbody> <tr> <td align="center"> <table align="left" cellpadding="0" cellspacing="0" border="0" width="100%" style="max-width:346px"> <tbody> <tr> <td align="center"> <div align="left" style="width: 100%;display:inline-block;"> <table cellpadding="0" cellspacing="0" border="0" align="left"> <tbody> <tr> <td height="15px"></td> </tr> <tr> <td align="center"> <a target="blank" href="http://www.miraclesoft.com/"> <img src="http://www.miraclesoft.com/images/newsletters/Q2/miracle-logo-light.png" style="width: 150px;padding-left: 5px;" align="left"></a> </td> </tr> <tr> <td height="15px"></td> </tr> </tbody> </table> </div> </td> </tr> </tbody> </table> <table align="right" cellpadding="0" cellspacing="0" border="0" width="100%" style="max-width: 168px;"> <tbody> <tr> <td height="25px"></td> </tr> <tr> <td align="center" width="100px"> <a target="blank" href="http://www.miraclesoft.com/company/" style="text-decoration:none;color:#ffffff;font-size: 15px;font-family:'Open Sans';">About</a> </td> <td align="center" width="100px"> <a target="blank" href="http://www.miraclesoft.com/contact/" style="text-decoration:none;color:#ffffff;font-size: 15px;font-family:'Open Sans';">Contact</a> </td> </tr> <tr> <td height="10px"></td> </tr> </tbody> </table> </td> </tr> </tbody> </table> </td> </tr> </tbody> </table> <table width="100%" border="0" cellpadding="0" cellspacing="0" align="center" style="max-width: 800px;"> <tbody> <tr align="center"> <td> <table width="100%" bgcolor="#ffffff" border="0" cellpadding="0" cellspacing="0" align="center" style="max-width: 800px;border-bottom: 4px solid #b7b2b3;"> <tbody> <tr> <td height="15px"></td> </tr> <tr> <td align="center"> <table width="100%" border="0" cellpadding="0" cellspacing="0" align="center" style="max-width: 700px;/* padding: 10px; */"> <tbody> <tr> <td> <table width="100%" border="0" cellpadding="0" cellspacing="0" align="center"> <tbody> <tr> <td style=""> <table width="100%" border="0" cellpadding="0" cellspacing="0" align="center"> <tbody> <tr> <td style=""> <table width="100%" border="0" cellpadding="0" cellspacing="0"> <tbody> <tr> <td height="15px"></td> </tr> <tr> <td style="text-align:left;font-family: 'Open Sans';font-size: 16px;line-height: 25px;text-decoration: none;color: #232527;font-weight:900;"> Hello ${name}, </td> </tr> <tr> <td height="5px"></td> </tr> <tr> <td align="justify" valign="top" style="color:#8c8c8c;font-family: 'Open Sans';font-size:15px;mso-line-height-rule:exactly;line-height:30px;font-weight:400"> Thank you for using Oliver, the password the reset bot! The following is the conversation that you had with him today. </td> </tr> <tr> <td height="5px"></td> </tr> </tbody> </table> </td> </tr> </tbody> </table> </td> </tr> </tbody> </table> </td> </tr> </tbody> </table> </td> </tr> <tr> <td height="15px"></td> </tr> </tbody> </table> </td> </tr> </tbody> </table> <table width="100%" border="0" cellpadding="0" cellspacing="0" align="center" style="max-width:800px;background-size: cover; background-color: #ffffff;" bgcolor="#ffffff"> <tbody> <tr> <td align="center"> <table style="max-width:700px;" width="100%" cellspacing="0" cellpadding="0" align="center"> <tbody>${chathist.map(hist =>`<tr> <td height="5px"></td> </tr><tr> <td align="center"> <table align="right" cellpadding="0" cellspacing="0" width="auto" style="max-width:600px;"> <tbody> <tr> <td align="center"> <table align="center" cellpadding="0" cellspacing="0" width="100%" style="border-radius: 10px 10px 0 10px;padding: 8px 15px;background-color: #232527;"> <tbody> <tr> <td style="font-family: Open Sans;text-align:justify;color: #fff;font-size: 16px;line-height: 30px;"> ${hist[name]}</td> </tr> </tbody> </table> </td> </tr> <tr> <td align="right"> <table align="right" cellpadding="0" cellspacing="0" width="auto" style="font-size: 11px;max-width: 300px;color: #232527;font-family: Open Sans;padding: 5px;"> <tbody> <tr> <td>${name} | ${hist.time}</td> </tr> </tbody> </table> </td> </tr> </tbody> </table> </td> </tr> <tr> <td height="25px"></td> </tr><tr> <td height="25px"></td> </tr> <tr> <td align="center"> <table align="left" cellpadding="0" cellspacing="0" width="auto" style="max-width:600px;"> <tbody> <tr> <td align="center"> <table align="center" cellpadding="0" cellspacing="0" width="100%" style="border-radius: 10px 10px 10px 0px;padding: 8px 15px;background-color: #00aae7;"> <tbody> <tr> <td style="font-family: Open Sans;text-align:justify;color: #fff;font-size: 16px;line-height: 30px;"> ${hist.Oliver}</td> </tr> </tbody> </table> </td> </tr> <tr> <td align="left"> <table align="left" cellpadding="0" cellspacing="0" width="auto" style="font-size: 11px;max-width: 300px;color: #232527;font-family: Open Sans;padding: 5px;"> <tbody> <tr> <td>Oliver | ${hist.time}</td> </tr> </tbody> </table> </td> </tr> </tbody> </table> </td> </tr>`)} </tbody> </table> </td> </tr> </tbody> </table> <table cellspacing="0" cellpadding="0" border="0" bgcolor="#232527" align="center" width="100%" style="max-width: 800px; border-radius:0 0 7px 7px;"> <tbody> <tr> <td align="center"> <table cellspacing="0" cellpadding="0" border="0" align="center" width="100%" style=" max-width: 700px; "> <tbody> <tr> <td height="10px"></td> </tr> <tr> <td align="center"> <table width="100%" style="max-width: 700px;"> <tbody> <tr> <td> <table align="center"> <tbody> <tr> <td style="color:#666666; font-family: 'Open Sans'; font-size:14px; font-weight:400; line-height:26px;" align="center"> <span style="color: #ffffff" data-size="Copyright2" data-min="12" data-max="50"> &#169; Copyrights 2018 | Miracle Software Systems, Inc.</span> </td> </tr> </tbody> </table> </td> </tr> </tbody> </table> </td> </tr> <tr> <td height="10px"></td> </tr> </tbody> </table> </td> </tr> </tbody> </table> </td> </tr> <tr> <td height="15px"></td> </tr> </tbody> </table> </body></html>`
    }
    console.log("logout api in", email)
    transport.sendMail(mail, function(error, response) {
        if (error) {
            console.log(error);
        } else {
            console.log(response);
            console.log("Message sent: " + response.messageId);
           // window.location = "login.html"
        }
		setTimeout(function() {
            window.location = "login.html"
        }, 900);

        transport.close();
    });
    chathist = [];
    chatdata = null;
    chatd = null;

    /* $.get( "http://localhost:3000/logout", function(response,err) {
    alert("into logout");
    if(!response){
    console.log("error logout");
    }else{
      console.log( "Data Loaded: " + JSON.stringify(response));
      }
    }); */
}

function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
        throw new TypeError("Cannot call a class as a function");
    }
}
let time = new Date(),
    timeString = time.toLocaleString('en-US', {
        hour: 'numeric',
        minute: 'numeric',
        hour12: true
    })
let spac1 = '<p class="myfa">' + timeString + '\t| Oliver' + '</p>';
let space1 = spac1.fontsize(1);
ipcRenderer.on('clear', function() {
    $.get("http://localhost:3000/clear", function(data, status) {
        console.log("clear triggered")
    });
});
var Messenger = function() {
    function Messenger() {
        this.onRecieve = function(message) {
            return console.log('Recieved: ' + message.output.text[0] + message.context.Buttons);
        };
        this.onSend = function(message) {

            return console.log('Sent: ' + message.text);
        };

    }

    Messenger.prototype.send = function send() {
		console.log("@@@@@@")
        var text = arguments.length <= 0 || arguments[0] === undefined ? '' : arguments[0];
/*         if (botstatus == "active") {
            $("#typer").show();
        } */
        var message = {
            user: this.me,
            text: text
        };
        message.namedata = namedata;
        /* console.log(message.namedata); */
        message.emaildata = localStorage.getItem("email");
        /* console.log(message.emaildata); */
        this.onSend(message);
    };
    Messenger.prototype.recieve = function recieve() {

        console.log(arguments[0].text)

        var text = arguments.length <= 0 || arguments[0] === undefined ? '' : arguments[0];
        this.onRecieve(arguments[0]);
        $("#typer").hide();
    };

    return Messenger;
}();

function timefunction() {
    myVar = setTimeout(function(){ 
	socket.emit('disablenotification','disable')
		  setTimeout(function() {
            messenger.recieve({
                text: "I apologize, I was not able to find any available agents at this point of time. If you would like I can submit a ticket on your behalf. Would you like for me to do that?",
				Buttons: "<br><button id=\"button-Yes\"onclick=\"APICALL({channel: 'W', text: 'Yes'});\">Yes</button> <button id=\"button-No\" onclick=\"APICALL({channel: 'W', text: 'No',cmd:'No',state:'No'});\">No</button>"
            });
        }, 900); }, 30000);
}

function myStopFunction() {
    clearTimeout(myVar);
}
var BuildHTML = function() {
    function BuildHTML() {
        _classCallCheck(this, BuildHTML);
        this.messageWrapper = 'message-wrapper';
        this.textWrapper = 'text-wrapper';
        this.meClass = 'me';
        this.themClass = 'them';
    }

    BuildHTML.prototype.me = function me(text, me) {
        return '<br><div class="' + this.messageWrapper + ' ' + this['me' + 'Class'] + '">\n<div class="' + this.textWrapper + '">' + text + '\n</div></div> '
    }
    BuildHTML.prototype.me1 = function me(text, me) {

        /*     console.log(text) */

        return '<br><div class="' + this.messageWrapper + ' ' + this['me' + 'Class'] + '">\n<div class="' + this.textWrapper + '">' + text + '\n</div></div> <br>'
    }
    BuildHTML.prototype.them = function them(text, them) {

        /*       console.log("prototype",text); */

        return '<div class="message-wrapper them"><div class="demo">' + text + '</div></div>'
    };
    return BuildHTML;
}();
$(document).ready(function() {
    window.messenger = new Messenger();
    window.buildHTML = new BuildHTML();
    var $input = $('#input');
    var $send = $('#send');
    var $content = $('#content');
    var $inner = $('#inner');

    function safeText(text) {
        $content.find('.message-wrapper').last().find('.text-wrapper').text(text);
    }

    function animateText() {
            $content.find('.message-wrapper').last().find('.text-wrapper').addClass('animated fadeIn');
    }

    function scrollBottom() {
        $($inner).animate({
            scrollTop: $($inner).offset().top + $($content).outerHeight(true)
        }, {
            queue: false,
            duration: 'ease'
        });
    }

    function buildSent(message) {
        let time = new Date(),
            timeString = time.toLocaleString('en-US', {
                hour: 'numeric',
                minute: 'numeric',
                hour12: true
            })
        let spac = '<p class="myfont">' + namedata + '&nbsp|&nbsp' + timeString + '</p>';
        let space = spac.fontsize(1)
        /*     console.log('sending: ', message); */
        $content.append(buildHTML.me(message.text) + space);
        safeText(message.text);
        animateText();
        scrollBottom();
        if (message.channel != 'w') {
            message.text = $input.val();
        }
        message.user = '';
        message.channel = 'webhook';
        message.chatdata = chatdata;
        if (context == undefined) {
            message.context = {}
        } else {
            message.context = context;
        }
        if (botstatus == "inactive") {
            message.botstatus = "inactive";
			message.state = "Human";
			var inpute = $input.val();
			socket.emit("userdata",{"name":name,"text":inpute,"agent":agentname})						
        }else{
        message.chathist = chathist;
        $.post("http://localhost:3000/botkit/receive",
            message,
            function(data, status) {
                console.log("data", data)
                console.log("message", message)
				if(bote){
				if(JSON.parse(data.output.text[0]).message == "I didn't understand. Can you try rephrasing?" || JSON.parse(data.output.text[0]).message == "I'm not sure what you mean..."){
                			botcount++;
			if(botcount == 2 && bote == true){

            messenger.recieve({
                'text': 'Would you like to speak with an agent?',
				"Buttons": "<br><button id=\"button-Yes\"onclick=\"APICALL({channel: 'W', text: 'Accept'});\">Accept</button>&nbsp&nbsp<button id=\"button-No\" onclick=\"APICALL({channel: 'W', text: 'Decline'});\">Decline</button>",
            });
	
		var historyobj = {};
                        historyobj[name] = message.text,
						historyobj['UserAgent'] = 'Would you like to speak with an agent?'
						historyobj['time'] = timeString;
        }
                		console.log(botcount)
                		}
				}

				 if(JSON.parse(data.output.text[0]).message == "Give me a second while I connect you with an agent"){
/*         	bote = false;			
			botstatus = "inactive";
			message.state = "Human"; */
			 timefunction()
			idleTime = 0;
			 var msg = {};
            msg.name = name;
            msg.data = chathist;
			msg.displayName = displayName;
			console.log("triggered")
			socket.emit('broadcast', msg);	
	
        }
                if (data.botstatus == "inactive") {
                    botstatus = "inactive";
                    message.botstatus = "inactive";
                    typingstatus = "on"
                }
				if(data.botstatus == "active"){
					botstatus = "active";
                    message.botstatus = "active";
                    typingstatus = "on"
				}
                if (windowstatus == false) {
                    count = 0
                }
                context = data.context;
                if (document.hidden) {
                    console.log("documenthidden");
                    var notification = new Notification('OliverBot', {
                        icon: './js/image/labs.ico',
                        body: JSON.parse(data.output.text[0]).message
                    })
                    notification.onclick = () => {
                        ipcRenderer.send('update-badge', 0);
                        ipcRenderer.send('maxmize');
                    }
                }
                if (status == 'success') {
                    play();
                    var data1 = {};
                    if (data.text) {
                        var historyobj = {};
                        historyobj[name] = message.text,
                                    historyobj['UserAgent'] = data.text;
									historyobj['time'] = timeString;
                            			if(document.hidden){
                            				count++;
                            			ipcRenderer.send('update-badge',count);
                            			console.log("documenthidden");
                                        data1.text = data.text
                                         messenger.recieve(data1);
                            						}
                            messenger.recieve(data);
                        chathistory = historyobj;
                    } else {
                        if (JSON.parse(data.output.text.length) == 1) {
                            var historyobj = {};
                            historyobj[name] = message.text,
                                historyobj['Oliver'] = JSON.parse(data.output.text[0]).message;
								historyobj['time'] = timeString;
                            data1.text = JSON.parse(data.output.text[0]).message;
                            if (document.hidden) {
                                count++;
                                ipcRenderer.send('update-badge', count);
                            }
                        }
                        if (JSON.parse(data.output.text.length) == 2 && JSON.parse(data.output.text[1]).Buttons == undefined) {
                            var historyobj = {};
                            historyobj[name] = message.text,
                                historyobj['Oliver'] = JSON.parse(data.output.text[0]).message + " " + JSON.parse(data.output.text[1]).message;
								historyobj['time'] = timeString;
                            data1.text1 = JSON.parse(data.output.text[0]).message
                            data1.text2 = JSON.parse(data.output.text[1]).message;
                            if (document.hidden) {
                                count++;
                                ipcRenderer.send('update-badge', count);
                                var notification = new Notification('OliverBot', {
                                    icon: './js/image/labs.ico',
                                    body: JSON.parse(data.output.text[1]).message
                                })
                                notification.onclick = () => {
                                    ipcRenderer.send('update-badge', 0);
                                    ipcRenderer.send('maxmize');
                                }
                            }
                        } else if (JSON.parse(data.output.text.length) == 2 && JSON.parse(data.output.text[1]).Buttons != undefined) {
                            console.log("intotext1 flow")
                            var historyobj = {};
                            historyobj[name] = message.text,
                                historyobj['Oliver'] = JSON.parse(data.output.text[0]).message + " " + JSON.parse(data.output.text[1]).message;
								historyobj['time'] = timeString;
                            data1.text1 = JSON.parse(data.output.text[0]).message
                            data1.text2 = JSON.parse(data.output.text[1]).message;
                            data1.Buttons = JSON.parse(data.output.text[1]).Buttons;
                            if (document.hidden) {
                                count++
                                ipcRenderer.send('update-badge', count);
                                var notification = new Notification('OliverBot', {
                                    icon: './js/image/labs.ico',
                                    body: JSON.parse(data.output.text[1]).message
                                })
                                notification.onclick = () => {
                                    ipcRenderer.send('update-badge', 0);
                                    ipcRenderer.send('maxmize');
                                }
                            }
                        } else if (JSON.parse(data.output.text.length) == 3 && JSON.parse(data.output.text[2]).Buttons != undefined) {
                            var historyobj = {};
                            historyobj[name] = message.text,
                                historyobj['Oliver'] = JSON.parse(data.output.text[0]).message + " " + JSON.parse(data.output.text[1]).message + " " + JSON.parse(data.output.text[2]).message
								historyobj['time'] = timeString;
                            data1.text1 = JSON.parse(data.output.text[0]).message
                            data1.text2 = JSON.parse(data.output.text[1]).message;
                            data1.text3 = JSON.parse(data.output.text[2]).message;
                            data1.Buttons = JSON.parse(data.output.text[2]).Buttons;
                            if (document.hidden) {
                                count++
                                ipcRenderer.send('update-badge', count);
                                var notification = new Notification('OliverBot', {
                                    icon: './js/image/labs.ico',
                                    body: JSON.parse(data.output.text[1]).message
                                })
                                count++
                                ipcRenderer.send('update-badge', count);
                                var notification = new Notification('OliverBot', {
                                    icon: './js/image/labs.ico',
                                    body: JSON.parse(data.output.text[2]).message
                                })
                                notification.onclick = () => {
                                    ipcRenderer.send('update-badge', 0);
                                    ipcRenderer.send('maxmize');
                                }
                            }
                        } else if (JSON.parse(data.output.text[0]).Buttons) {
                            data1.Buttons = JSON.parse(data.output.text[0]).Buttons;
                        }
                        messenger.recieve(data1);
                        chathistory = historyobj;
                    }
                }

                if (chathist.length == 0) {
                    chathist.push(chathistory);
                    console.log(typeof(chathist))
                    for (var i = 0; i < chathist.length; i++) {
                        chatd = name + " : " + chathist[i][name] + "\nOliver" + " : " + chathist[i].Oliver + "\n"
                        chatdata = chatd;
                    }
                } else {
                    if (chathist) {
                        chathist.push(chathistory);
                        for (var i = 0; i < chathist.length; i++) {
							console.log(chathist[i][name])
                            chatd = name + " : " + chathist[i][name] + "\nOliver" + " : " + chathist[i].Oliver + "\n"
                        }
                        chatdata = chatdata + chatd;
                        console.log(chathist)
                    } else {
                        alert("error")
                    }
                }
                console.log(chathist)
            }).fail(function(response) {
            if (response.statusText == "error") {
                messenger.recieve({
                    'text': "I am struggling to connect my backend systems, Please check your Internet connectivity and try again later"
                });
            }
        });
		}
    }

    function buildRecieved(text) {
        let time = new Date(),
            timeString = time.toLocaleString('en-US', {
                hour: 'numeric',
                minute: 'numeric',
                hour12: true
            })
        let spac1 = '<p class="myfa">' + timeString + '\t| Oliver' + '</p>';
        let space1 = spac1.fontsize(1);
        /*     console.log('recieving: ',text, text.text,text.Buttons); */
        if (text.Buttons && text.text2 == undefined) {
            /*         console.log("button flow"); */
            $content.append(buildHTML.them(text.text + '<br>' + text.Buttons) + space1 + '<br>');
        } else if (text.text2 && text.Buttons == undefined && text.text3 == undefined) {
            console.log("flow text.text2");
            $content.append(buildHTML.them(text.text1) + '<br>');
            $content.append(buildHTML.them(text.text2) + space1 + '<br>');
        } else if (text.text2 && text.Buttons && text.text3 == undefined) {
            console.log("flow text.text2Buttons");
            $content.append(buildHTML.them(text.text1) + '<br>');
            $content.append(buildHTML.them(text.text2 + '<br>' + text.Buttons) + space1 + '<br>');
        } else if (text.text3 && text.Buttons) {
            console.log("flow text.text3Buttons");
            $content.append(buildHTML.them(text.text1) + '<br>');
            $content.append(buildHTML.them(text.text2) + space1 + '<br>');
            setTimeout(function() {
                $content.append(buildHTML.them(text.text3 + '<br>' + text.Buttons) + space1 + '<br>');
                play();
                scrollBottom();
            }, 3500);
            animateText();
            scrollBottom();
        } else {
            console.log("else flow in",text.text);
			if(botcount !=2){
				console.log(text)
				console.log(text.text)
            $content.append(buildHTML.them(text.text) + space1 + '<br>');
			}else{
				 $content.append(buildHTML.them("I’m sorry, I was not able to understand") + space1 + '<br>');
			}
        }
        safeText(text);
        animateText();
        scrollBottom();

    }

    function sendMessage() {
        $("#typer").hide();
        var text = $input.val();
        //from here send message to  HelpDesk agent
        messenger.send(text + '\n');
        $input.val('');
    }
    messenger.onSend = buildSent;
    messenger.onRecieve = buildRecieved;

    if (localStorage.getItem("name") != undefined) {
        setTimeout(function() {
            messenger.recieve({
                text1: "Welcome! I'm Oliver - the password reset bot.",
                text2: "How can I help you today?"
            });
        }, 900);
    }
    $input.focus();
    $send.on('click', function(e) {
        sendMessage();
    });
    $('#input').keypress(function(e) {
        var key = e.which;
        if (e.keyCode == 10 || e.keyCode == 13 && $input.val() != "") {
            e.preventDefault();
            sendMessage();
        }
    });
});

function zero(num) {
    return ('0' + num).slice(-2);
}

function APICALL(message) {
    //messenger.send(message.text +'\n')
    var $input = $('#input');
    var $send = $('#send');
    var $content = $('#content');
    var $inner = $('#inner');
console.log("APICALL",message)
    function safeText(text) {
        $content.find('.message-wrapper').last().find('.text-wrapper').text(text);
    }

    function animateText() {

            $content.find('.message-wrapper').last().find('.text-wrapper').addClass('animated fadeIn');


    }

//  if(message.text == "Yes, able to login"){
						// mail = {
        // from: fromEmailAddress,
        // to: email,
        // subject: "Chat summary",
	// html:`<html xmlns="http://www.w3.org/1999/xhtml"> <head> <link rel="stylesheet" type="text/css" href="//fonts.googleapis.com/css?family=Open+Sans"> <title>Password Reset Bot</title> </head> <body marginwidth="0" marginheight="0" style="background-color: #b7b2b3;width: 100%;background-size: cover;"> <span style="display:none;font-size:12px;font-family:'Open Sans';">Password Reset Bot</span> <table width="100%" border="0" cellpadding="0" cellspacing="0" align="center" style="max-width: 800px;border-radius:10px;"> <tbody> <tr> <td height="15px"></td> </tr> <tr> <td> <table data-module="Footer" cellspacing="0" cellpadding="0" border="0" bgcolor="#232527" align="center" width="100%" style="max-width: 800px; border-radius: 7px 7px 0 0;"> <tbody> <tr> <td align="center"> <table cellpadding="0" cellspacing="0" border="0" width="100%" style="max-width: 700px;" align="center"> <tbody> <tr> <td align="center"> <table align="left" cellpadding="0" cellspacing="0" border="0" width="100%" style="max-width:346px"> <tbody> <tr> <td align="center"> <div align="left" style="width: 100%;display:inline-block;"> <table cellpadding="0" cellspacing="0" border="0" align="left"> <tbody> <tr> <td height="15px"></td> </tr> <tr> <td align="center"> <a target="blank" href="http://www.miraclesoft.com/"> <img src="http://www.miraclesoft.com/images/newsletters/Q2/miracle-logo-light.png" style="width: 150px;padding-left: 5px;" align="left"></a> </td> </tr> <tr> <td height="15px"></td> </tr> </tbody> </table> </div> </td> </tr> </tbody> </table> <table align="right" cellpadding="0" cellspacing="0" border="0" width="100%" style="max-width: 168px;"> <tbody> <tr> <td height="25px"></td> </tr> <tr> <td align="center" width="100px"> <a target="blank" href="http://www.miraclesoft.com/company/" style="text-decoration:none;color:#ffffff;font-size: 15px;font-family:'Open Sans';">About</a> </td> <td align="center" width="100px"> <a target="blank" href="http://www.miraclesoft.com/contact/" style="text-decoration:none;color:#ffffff;font-size: 15px;font-family:'Open Sans';">Contact</a> </td> </tr> <tr> <td height="10px"></td> </tr> </tbody> </table> </td> </tr> </tbody> </table> </td> </tr> </tbody> </table> <table width="100%" border="0" cellpadding="0" cellspacing="0" align="center" style="max-width: 800px;"> <tbody> <tr align="center"> <td> <table width="100%" bgcolor="#ffffff" border="0" cellpadding="0" cellspacing="0" align="center" style="max-width: 800px;border-bottom: 4px solid #b7b2b3;"> <tbody> <tr> <td height="15px"></td> </tr> <tr> <td align="center"> <table width="100%" border="0" cellpadding="0" cellspacing="0" align="center" style="max-width: 700px;/* padding: 10px; */"> <tbody> <tr> <td> <table width="100%" border="0" cellpadding="0" cellspacing="0" align="center"> <tbody> <tr> <td style=""> <table width="100%" border="0" cellpadding="0" cellspacing="0" align="center"> <tbody> <tr> <td style=""> <table width="100%" border="0" cellpadding="0" cellspacing="0"> <tbody> <tr> <td height="15px"></td> </tr> <tr> <td style="text-align:left;font-family: 'Open Sans';font-size: 16px;line-height: 25px;text-decoration: none;color: #232527;font-weight:900;"> Hello ${name}, </td> </tr> <tr> <td height="5px"></td> </tr> <tr> <td align="justify" valign="top" style="color:#8c8c8c;font-family: 'Open Sans';font-size:15px;mso-line-height-rule:exactly;line-height:30px;font-weight:400"> Thank you for using Oliver, the password the reset bot! The following is the conversation that you had with him today. </td> </tr> <tr> <td height="5px"></td> </tr> </tbody> </table> </td> </tr> </tbody> </table> </td> </tr> </tbody> </table> </td> </tr> </tbody> </table> </td> </tr> <tr> <td height="15px"></td> </tr> </tbody> </table> </td> </tr> </tbody> </table> <table width="100%" border="0" cellpadding="0" cellspacing="0" align="center" style="max-width:800px;background-size: cover; background-color: #ffffff;" bgcolor="#ffffff"> <tbody> <tr> <td align="center"> <table style="max-width:700px;" width="100%" cellspacing="0" cellpadding="0" align="center"> <tbody>${chathist.map(hist =>` <tr> <td height="25px"></td> </tr> <tr> <td align="center"> <table align="left" cellpadding="0" cellspacing="0" width="auto" style="max-width:600px;"> <tbody> <tr> <td align="center"> <table align="center" cellpadding="0" cellspacing="0" width="100%" style="border-radius: 10px 10px 10px 0px;padding: 8px 15px;background-color: #00aae7;"> <tbody> <tr> <td style="font-family: Open Sans;text-align:justify;color: #fff;font-size: 16px;line-height: 30px;"> ${hist.Oliver}</td> </tr> </tbody> </table> </td> </tr> <tr> <td align="left"> <table align="left" cellpadding="0" cellspacing="0" width="auto" style="font-size: 11px;max-width: 300px;color: #232527;font-family: Open Sans;padding: 5px;"> <tbody> <tr> <td>Oliver | ${hist.time}</td> </tr> </tbody> </table> </td> </tr> </tbody> </table> </td> </tr> <tr> <td height="5px"></td> </tr> <tr> <td align="center"> <table align="right" cellpadding="0" cellspacing="0" width="auto" style="max-width:600px;"> <tbody> <tr> <td align="center"> <table align="center" cellpadding="0" cellspacing="0" width="100%" style="border-radius: 10px 10px 0 10px;padding: 8px 15px;background-color: #232527;"> <tbody> <tr> <td style="font-family: Open Sans;text-align:justify;color: #fff;font-size: 16px;line-height: 30px;"> ${hist[name]}</td> </tr> </tbody> </table> </td> </tr> <tr> <td align="right"> <table align="right" cellpadding="0" cellspacing="0" width="auto" style="font-size: 11px;max-width: 300px;color: #232527;font-family: Open Sans;padding: 5px;"> <tbody> <tr> <td>${name} | ${hist.time}</td> </tr> </tbody> </table> </td> </tr> </tbody> </table> </td> </tr> <tr> <td height="25px"></td> </tr>`)} </tbody> </table> </td> </tr> </tbody> </table> <table cellspacing="0" cellpadding="0" border="0" bgcolor="#232527" align="center" width="100%" style="max-width: 800px; border-radius:0 0 7px 7px;"> <tbody> <tr> <td align="center"> <table cellspacing="0" cellpadding="0" border="0" align="center" width="100%" style=" max-width: 700px; "> <tbody> <tr> <td height="10px"></td> </tr> <tr> <td align="center"> <table width="100%" style="max-width: 700px;"> <tbody> <tr> <td> <table align="center"> <tbody> <tr> <td style="color:#666666; font-family: 'Open Sans'; font-size:14px; font-weight:400; line-height:26px;" align="center"> <span style="color: #ffffff" data-size="Copyright2" data-min="12" data-max="50"> &#169; Copyrights 2018 | Miracle Software Systems, Inc.</span> </td> </tr> </tbody> </table> </td> </tr> </tbody> </table> </td> </tr> <tr> <td height="10px"></td> </tr> </tbody> </table> </td> </tr> </tbody> </table> </td> </tr> <tr> <td height="15px"></td> </tr> </tbody> </table> </body></html>`
    // }
    // console.log("logout api in", email)
    // transport.sendMail(mail, function(error, response) {
        // if (error) {
            // console.log(error);
        // } else {
            // console.log(response);
            // console.log("Message sent: " + response.messageId);
        // }

        // transport.close();
		// });
// } 
    function scrollBottom() {
        $($inner).animate({
            scrollTop: $($inner).offset().top + $($content).outerHeight(true)
        }, {
            queue: false,
            duration: 'ease'
        });
    }
    let time = new Date(),
        timeString = time.toLocaleString('en-US', {
            hour: 'numeric',
            minute: 'numeric',
            hour12: true
        })
    let spac = '<p class="myfont">' + namedata + '&nbsp|&nbsp' + timeString + '</p>';
    let space = spac.fontsize(1)
    /*     console.log('sending: ', message.text); */
    $content.append(buildHTML.me(message.text) + space + '<br>');
    safeText(message.text);
    animateText();
    scrollBottom();
    message.context = context;
    message.user = '';
    message.channel = 'webhook';
	 message.chatdata = chatdata;
	 if(message.text == "Accept"){
		 var jsonchat = JSON.stringify(chathist)
$.get("http://localhost:3000/storeconv?id="+jsonchat, function(data){
console.log(data)
        });
		 botcount = 0;
		         	/* bote = false;
			message.state = "Human";
			botstatus = "inactive"; */
		  setTimeout(function() {
            messenger.recieve({
                text: "Give me a second while I connect you with an agent",
            });
        }, 900);
		 	var msg = {};
            msg.name = name;
            msg.data = chathist;
			timefunction()
		 socket.emit('broadcast', msg);	
	 }
	 	 if(message.text == "Decline"){
			 		 botcount = 0;
		  setTimeout(function() {
            messenger.recieve({
                text: "Alright,let me know if you need anything else",
            });
        }, 900);
	 }
    $.post("http://localhost:3000/botkit/receive",  
        message,
        function(data, status) {
            context = data.context;
            play();
            if (status == 'success') {
				console.log("data",JSON.parse(data.output.text[0]).message)
                var data1 = {};
                data1.text = JSON.parse(data.output.text[0]).message;
                /*  console.log(JSON.parse(data.output.text.length)); */
                if (data.output.text.length > 1 && JSON.parse(data.output.text[1]).Buttons == undefined) {
                    var historyobj = {};
                    historyobj[name] = message.text,
                        historyobj['Oliver'] = JSON.parse(data.output.text[0]).message + " " + JSON.parse(data.output.text[1]).message;
						historyobj['time'] = timeString;
                    data1.text1 = JSON.parse(data.output.text[0]).message
                    data1.text2 = JSON.parse(data.output.text[1]).message;
                } else if (data.output.text.length > 1 && JSON.parse(data.output.text[1]).Buttons != undefined) {
                    var historyobj = {};
                    historyobj[name] = message.text,
                        historyobj['Oliver'] = JSON.parse(data.output.text[0]).message + " " + JSON.parse(data.output.text[1]).message;
						historyobj['time'] = timeString;
                    data1.text1 = JSON.parse(data.output.text[0]).message
                    data1.text2 = JSON.parse(data.output.text[1]).message;
                    data1.Buttons = JSON.parse(data.output.text[1]).Buttons;
                } else if (JSON.parse(data.output.text[0]).Buttons) {
                    data1.Buttons = JSON.parse(data.output.text[0]).Buttons;
                } else {
                    var historyobj = {};
                    historyobj[name] = message.text,
                        historyobj['Oliver'] = JSON.parse(data.output.text[0]).message;
						historyobj['time'] = timeString;
                    data1.text1 = JSON.parse(data.output.text[0]).message
                }
                messenger.recieve(data1);
                chathistory = historyobj;
            }
            if (chathist) {
				console.log(chathist)
				if(chathistory != undefined){
                chathist.push(chathistory);
				}
                for (var i = 0; i < chathist.length; i++) {
					console.log(chathistory)
                    chatd = name + " : " + chathist[i][name] + "\nOliver" + " : " + chathist[i].Oliver + "\n"
                }
                chatdata = chatdata + chatd;
                console.log("chatdata", chatdata);

            } else {
                alert("error")
            }
        }).fail(function(response) {
        if (response.statusText == "error") {
            messenger.recieve({
                text: "I am struggling to connect my backend systems, Please check your Internet connectivity and try again later"
            });
            /*                 console.log(text); */
        }
    });

}