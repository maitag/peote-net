# peote-net
Crossplatform library that provides a simple Client/Server TCP-Networking-API  
for multiple [Haxe](http://haxe.org) targets (cpp, neko, html5, flash, android).  

Inside webbrowser it supports fallback-solution to use websockets or bridged flash-sockets.  
On serverside the TCP-packets will be redirected with simple and fast protocol  
by this tool: [peote-server](https://github.com/maitag/peote-server).  


## Installation:
```
haxelib git peote-socket https://github.com/maitag/peote-socket
haxelib git peote-net https://github.com/maitag/peote-net
```

## How To Create a Server
```
peoteServer = new PeoteServer({
		onCreateJoint: function(server:PeoteServer) {
			trace('Channel ${server.jointNr} created.');
		},
		onCreateJointError: function(server:PeoteServer, error:Int) {
			switch(error) {
				case -2: trace("Can't connect to peote-server.");
				case -1: trace("Disconnected from peote-server.");
				case  2: trace("Another joint with same id exists.");
				default: trace('Error: $error');
			}
		},
		onUserConnect: function(server:PeoteServer, userNr:Int) {
			trace('New user connects: jointNr:${server.jointNr}, userNr=$userNr');
			// send something to client
			var output:PeoteBytesOutput = new PeoteBytesOutput();
			output.writeString('Hello Client $userNr');
			server.sendChunk( userNr, output.getBytes() );
		},
		onUserDisconnect: function(server:PeoteServer, userNr:Int, reason:Int) {
			trace('User disconnects: jointNr=${server.jointNr}, userNr=$userNr');
			switch (reason) {
				case 0: trace("User leaves channel.");
				case 1: trace("User was disconnected.");
				default: trace('Reason: $reason');
			}
		},
		//choose between onData or onDataChunk
		//onData: function(server:PeoteServer, userNr:Int, bytes:Bytes ) {
		//	trace('User $userNr sends some bytes on channel ${server.jointNr}');
		//},
		onDataChunk: function(server:PeoteServer, userNr:Int, bytes:Bytes) {
			var input = new PeoteBytesInput(bytes);
			trace( input.readString() ); // Hello Server
		}
	});
	
peoteServer.createJoint("localhost", 7680, "testserver");
```

## How To Create a Client
```
peoteClient = new PeoteClient({
		onEnterJoint: function(client:PeoteClient) {
			trace('Connect: Channel ${client.jointNr} entered');
			// send something to server
			var output:PeoteBytesOutput = new PeoteBytesOutput();
			output.writeString("Hello Server");
			client.sendChunk( output.getBytes() );
		},
		onEnterJointError: function(client:PeoteClient, error:Int) {
			switch(error) {
				case 1:  trace("can't enter channel");
				case -2: trace("can't connect to peote-server");
				case -1: trace("disconnected from peote-server");
				default: trace('Error:$error');
			}
		},
		onDisconnect: function(client:PeoteClient, reason:Int) {
			trace('Disconnect: jointNr:${client.jointNr}');
			switch (reason) {
				case 0: trace("Channel closed by owner");
				case 1: trace("Channel-owner disconnected");
				default: trace('Reason:$reason');
			}
		},
		//choose between onData or onDataChunk
		//onData: function(client:PeoteClient, bytes:Bytes) {
		//	trace('Server sends some bytes on channel ${client.jointNr}');
		//},
		onDataChunk: function(client:PeoteClient, bytes:Bytes) {
			var input = new PeoteBytesInput(bytes);
			trace( input.readString() ); // Hello Client ..
		}
	});

peoteClient.enterJoint("localhost", 7680, "testserver");
```


## Depends on
[peote-socket](https://github.com/maitag/peote-socket) library that handle multiplatform TCP-Sockets.  
  
For __html5__ or __flash-targets__ you can set a proxy-address before creating a new PeoteSocket,  
cpp-targets will ignore this and calls the onload-callback directly.  
```
PeoteSocketBridge.load( {
	onload: openSocket,      // callback if swfbridges is loaded or websockets available
	preferWebsockets: true,  // trying websockets first and fallback to flash (html5)
	proxys: {
		proxyServerWS:"localhost",  // proxy for websocket
		proxyPortWS  : 3211,
		proxyServerSWF:"localhost", // proxy for peoteSocketBridge.swf
		proxyPortSWF  :3211,
	},
	onfail: function() { trace("Browser doesn't support flash-raw-sockets or websockets"); }
});


function openSocket() { 
	peoteSocket = new PeoteSocket({
	...
}

```


## Peote Server
To let it run, you need a standalone-server that supports the `joint-protocol` for package forwarding.  
Use [peote-server](https://github.com/maitag/peote-server) (written in [Perl](https://www.perl.org/)) for this (with care ;)=  


## TODO:
- bugfixing for websockets
- better errorhandling and avoiding buffer-outbounds
- console-tests to check stability and performance
- hardening to make it more robust against flooding
- better implementation/documentation of the network-protocol
- total rewrite of the Perl Peote-Server in haxe
