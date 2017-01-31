### peote-net
[Haxe](http://haxe.org) library with api to use joint-protocol of [peote-server](https://github.com/maitag/peote-server)


####How To Create a Server
```
peoteServer = new PeoteServer({
		onCreateJoint: function(jointNr:Int) {
			trace("new channel " + jointNr + "created");
		},
		onCreateJointError: function(errorNr:Int) {
			trace("can´t create channel. error:" + errorNr);
		},
		onUserConnect: function(jointNr:Int, userNr:Int) {
			trace("onUserConnect: jointNr=" + jointNr + ", userNr=" + userNr);
			// send something to client
			var output:PeoteBytesOutput = new PeoteBytesOutput();
			output.writeString("Hello Client " + userNr);
			peoteServer.send(userNr, output.getBytes() );
		},
		onUserDisconnect: function(jointNr:Int, userNr:Int, reason:Int) {
			trace("onUserDisconnect: jointNr="+jointNr+", userNr="+userNr+", reason="+reason);
		},
		onData: function(jointNr:Int, userNr:Int, bytes:Bytes ) {
			trace("User " + userNr + "sends some bytes on channel " + jointNr);
		}
	});
	
peoteServer.createJoint("localhost", 7680, "testserver");
```

####How To Create a Client
```
peoteClient = new PeoteClient({
		onEnterJoint: function(jointNr:Int) {
			trace("onEnterJoint: jointNr=" + jointNr);
			// send something to server
			var output:PeoteBytesOutput = new PeoteBytesOutput();
			output.writeString("Hello Server on channel " + jointNr);
			peoteClient.send( output.getBytes() );
		},
		onEnterJointError: function(errorNr:Int) {
			trace("onEnterJointError:"+errorNr);
		},
		onDisconnect: function(jointNr:Int, reason:Int) {
			trace("onDisconnect: jointNr="+jointNr+", reason="+reason);
		},
		onData: function(jointNr:Int, bytes:Bytes ) {
			trace("Server sends some bytes on channel " + jointNr);
		}
	});
	
peoteClient.enterJoint("localhost", 7680, "testserver");
```
  
This depends on [peote-socket](https://github.com/maitag/peote-socket) haxe-library to get  
more platform independent TCP-Sockets in haxe.  
  
For html5 or flash-targets you can set proxy-address before creating new Server or Client  
( for cpp this will be ignored and it calls onload directly ):  
```
PeoteSocketBridge.load( {
	onload: openSocket,       // callback if swfbridges is loaded or websockets available
	prefareWebsockets: true,  // trying websockets first and fallback to flash
	proxys: {
		proxyServerWS:"localhost",  // proxy for websocket
		proxyPortWS  : 3211,
		
		proxyServerSWF:"localhost", // proxy for peoteSocketBridge.swf
		proxyPortSWF  :3211,
	},
	onfail: function() { trace("Browser doesn't support flash-raw-sockets or websockets"); }
});


function openSocket() { 
	// create Server or Client here ...
}

```


####Depends on
[peote-socket](https://github.com/maitag/peote-socket)  haxe library


####Proxy Servers
For testing you need to run a Perl TCP Server that supports joint-protocol:  
[peote-server](https://github.com/maitag/peote-server)

To wrap around Websockets here is little proxy: [peote-proxy](https://github.com/maitag/peote-proxy)  

use with care ;)=  


####TODO:
- fixing the old chat sample
- testscripts for performance/stability
- more samples
