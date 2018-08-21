var express=require('express')();
var server=require('http').createServer(express);
var io=require('socket.io').listen(server);
var watson = require('watson-developer-cloud/conversation/v1');
var t1=0;
	
server.listen(5005,function(){
	console.log("server is running on port 5005");
	
	io.sockets.on('connection',function(req){
		
var firstPay= 
          {
		workspace_id: 'e63bb82f-dcf4-4d67-9e36-a2671e94806c',
	//	input: {"text": ""},
	//	context: context
		  }				
	conversation.message(firstPay,function(err, res) {
		console.log("this is first request");	
			if (err){
			console.log('error:', err);
			}
			else{
				context=res.context;
			console.log(res.output.text[0]);
			io.sockets.emit('firstMessage',res.output.text[0]);
			}			
			});				

	});
	
	});
	
var conversation = new watson({
	"username": "d3cb035d-b79b-4ec6-8acd-39d7a812be01",
	"password": "Rsc0UnMhv3hl",
	version: 'v1',
  version_date: '2017-04-21'
});
// Replace with the context obtained from the initial request
//  "url": "https://gateway.watsonplatform.net/conversation/api",
//  "username": "87f46d04-4d62-473b-82e8-0d81595e4ff5",
//  "password": "RMQUVs4oLghF"
//"workspace_id":"9278459a-af39-44ce-bf07-14da66078651"
var context ;
io.sockets.on('connection',function(req){
	
	req.on('sendMessage',function(data){
var payload= 
          {
		workspace_id: 'd3cb035d-b79b-4ec6-8acd-39d7a812be0',
		input: {"text": data},
		context: context
		  }
		  
	conversation.message(payload,function(err, res) {
		console.log("this is the data: ",data)	
			if (err){
			console.log('error occured');
			}
			else{
				console.log(res);
			context=res.context;
			req.emit('receiveMessage',res.output.text);
			console.log(res.output.text);				
			}			
			});			
	});
});



