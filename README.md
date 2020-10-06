# peote-net
Crossplatform library that provides a simple Client/Server TCP-Networking-API  
for multiple [Haxe](http://haxe.org) targets (cpp, neko, hashlink, html5, flash, android).  

Inside webbrowser it supports websockets.  

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
		//offline: true,  // did not open a socket (for testing client-connection inside same app)
		//netLag: 400,    // simmulates net response time (in milliseconds)
		//netSpeed: 1024, // simmulates net speed (in Bytes per second)
		
		onCreate: function(server:PeoteServer) {
			trace('Channel ${server.jointNr} created.');
		},
		onError: function(server:PeoteServer, userNr:Int, reason:Int) {
			switch(reason) {
				case Reason.DISCONNECT: trace("Can't connect to peote-server.");
				case Reason.CLOSE:      trace("Connection to peote-server is closed.");
				case Reason.ID:         trace("Another channel with same id (or wrong id).");
				case Reason.MAX:        trace("Created to much channels on this server (max is 128).");
				case Reason.MALICIOUS:  trace("Malicious data (by user).");
			}
		},
		onUserConnect: function(server:PeoteServer, userNr:Int) {
			trace('New user $userNr enters channel ${server.jointNr}.');
			
			// send something to client
			var output:PeoteBytesOutput = new PeoteBytesOutput();
			output.writeString('Hello Client $userNr');
			server.sendChunk( userNr, output.getBytes() );
		},
		onUserDisconnect: function(server:PeoteServer, userNr:Int, reason:Int) {
			trace('User $userNr disconnects from channel ${server.jointNr}.');
			switch (reason) {
				case Reason.CLOSE:      trace("User leaves channel.");
				case Reason.DISCONNECT: trace("User was disconnected.");
			}
		},
		//choose between onData or onDataChunk (do not use one for remoteobject functioncalling)
		//onData: function(server:PeoteServer, userNr:Int, bytes:Bytes ) {
		//	trace('User $userNr sends some bytes on channel ${server.jointNr}');
		//},
		onDataChunk: function(server:PeoteServer, userNr:Int, bytes:Bytes) {
			var input = new PeoteBytesInput(bytes);
			trace( input.readString() ); // Hello Server
		},
		// maxChunkSize: 256  // max amount of bytes per chunk (default is 32 KB)
	});
	
peoteServer.create("localhost", 7680, "testserver");
```

## How To Create a Client
```
peoteClient = new PeoteClient({
		onEnter: function(client:PeoteClient) {
			trace('Connect: Channel ${client.jointNr} entered');
			
			// send something to server
			var output:PeoteBytesOutput = new PeoteBytesOutput();
			output.writeString("Hello Server");
			client.sendChunk( output.getBytes() );
		},
		onError: function(client:PeoteClient, reason:Int) {
			switch(reason) {
				case Reason.DISCONNECT:trace("can't connect to peote-server");
				case Reason.CLOSE:     trace("disconnected from peote-server");
				case Reason.ID:        trace("No channel with this ID to enter.");
				case Reason.MAX:       trace("Entered to much channels on this server (max is 128)");
				case Reason.FULL:      trace("Channel is full (max of 256 users already connected).");
				case Reason.MALICIOUS: trace("Malicious data.");
			}
		},
		onDisconnect: function(client:PeoteClient, reason:Int) {
			trace('Disconnected from channel ${client.jointNr}');
			switch (reason) {
				case Reason.CLOSE:      trace("Channel closed by creator.");
				case Reason.DISCONNECT: trace("Channel-creator disconnected.");
			}
		},
		//choose between onData or onDataChunk (do not use one for remoteobject functioncalling)
		//onData: function(client:PeoteClient, bytes:Bytes) {
		//	trace('Server sends some bytes on channel ${client.jointNr}');
		//},
		onDataChunk: function(client:PeoteClient, bytes:Bytes) {
			var input = new PeoteBytesInput(bytes);
			trace( input.readString() ); // Hello Client ..
		},
		// maxChunkSize: 256  // max amount of bytes per chunk (default is 32 KB)
	});

peoteClient.enter("localhost", 7680, "testserver");
```
If you wanna try out more please look into the testing and samples folders.  
There are included a simple chat and how to do "remote procedure calling".  


## Depends on
[peote-socket](https://github.com/maitag/peote-socket) library that handle multiplatform TCP-Sockets.  
  

## Peote Server
To let it run, you need a standalone-server that supports the `joint-protocol` for package forwarding.  
Use [peote-server](https://github.com/maitag/peote-server) (written in [Perl](https://www.perl.org/)) for this (with care ;)=  


## TODO:
- more options to handle buffering (max users per server, payload, outbounds)
- let server disconnect/block users
- let server send data to all users at once
- hardening to make it more robust against flooding
- better implementation/documentation of the network-protocol
