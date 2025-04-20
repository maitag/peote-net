# peote-net
Crossplatform library that provides a simple Client/Server TCP-Networking-API  
for multiple [Haxe](http://haxe.org) targets (cpp, neko, hashlink, html5, flash, android).  


For networking it is using a simple and fast protocol over TCP, where the packets are redirected by [peote-server](https://github.com/maitag/peote-server).  
If using html5 haxe-target all is wrapped by websockets.  

It also supports "offline emulation" for testing-purposes, where peoteClients/Servers can run together inside one application without need of any network.  


## Peote Server
To let it run over network, you need a standalone-server that supports the `joint-protocol` for package forwarding.  
Use [peote-server](https://github.com/maitag/peote-server) (written in [Perl](https://www.perl.org/)) for this (with care ;)=  


## Haxe dependencies
[peote-socket](https://github.com/maitag/peote-socket) library that handle multiplatform TCP-Sockets.  
  

## Installation:
```
haxelib git peote-socket https://github.com/maitag/peote-socket
haxelib git peote-net https://github.com/maitag/peote-net
```


## Various message transport modes

Peote-net can run into 3 different modes:

1) `onData`
- if bytes are `send` the onData-event on the opposite side will called imediadly on recieve
- the recieving bytes can be arrive into different parts as how they are `send`

2) `onDataChunk`
- only if all bytes wich sended by `sendChunk` are recieved, the `onDataChunk` event will be called

3) `RPC` (remote procedure call)
- clients and servers can provide special 'remote functions' wich can be called from the opposite side afterwards



## How to create a server (onData, onDataChunk)
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
		
		// send something to client ( into 'onData' mode use: 'server.send' function instead )
		var output:PeoteBytesOutput = new PeoteBytesOutput();
		output.writeString('Hello Client $userNr');
		server.sendChunk( userNr, output.getBytes() );
		
		// broadcast ( into onData mode use: 'server.broadcast' function instead )
		output = new PeoteBytesOutput();
		output.writeString('a new user connected');
		server.broadcastChunk( output.getBytes() ); // to all connected clients
		server.broadcastChunk( output.getBytes(), userNr ); // to all connected clients but exclude the userNr
	},
	onUserDisconnect: function(server:PeoteServer, userNr:Int, reason:Int) {
		trace('User $userNr disconnects from channel ${server.jointNr}.');
		switch (reason) {
			case Reason.CLOSE:      trace("User leaves channel.");
			case Reason.DISCONNECT: trace("User was disconnected.");
		}
	},
	// choose between onData or onDataChunk (do not use this handlers for remoteobject functioncalling)
	// onData: function(server:PeoteServer, userNr:Int, bytes:Bytes ) {
	// 	trace('User $userNr sends some bytes on channel ${server.jointNr}');
	// },
	onDataChunk: function(server:PeoteServer, userNr:Int, bytes:Bytes) {
		var input = new PeoteBytesInput(bytes);
		trace( input.readString() ); // Hello Server
	},
	// maxChunkSize: 256  // max amount of available bytes per chunk (default is 32 KB)
});
	
peoteServer.create("localhost", 7680, "testserver");
```

## How to create a client (onData, onDataChunk)
```
peoteClient = new PeoteClient({
	onEnter: function(client:PeoteClient) {
		trace('Connect: Channel ${client.jointNr} entered');
		
		// send something to server ( into 'onData' mode use 'client.send' function instead )
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
	// choose between onData or onDataChunk (do not use this handlers for remoteobject functioncalling)
	// onData: function(client:PeoteClient, bytes:Bytes) {
	// 	trace('Server sends some bytes on channel ${client.jointNr}');
	// },
	onDataChunk: function(client:PeoteClient, bytes:Bytes) {
		var input = new PeoteBytesInput(bytes);
		trace( input.readString() ); // Hello Client ..
	},
	// maxChunkSize: 256  // max amount of available bytes per chunk (default is 32 KB)
});

peoteClient.enter("localhost", 7680, "testserver");
```


## Samples and usecases

- [core/stress test](https://github.com/maitag/peote-net/tree/master/testing/peote-net-test): creates multiple servers/clients at the same time wich send/recieve random bytes (commandline/OpenFL)  

- [peote-net-samples](https://github.com/maitag/peote-net-samples) some simple lime samples and also OpenFL ones (chat, rpc)  

- used inside of [peote-playground](https://github.com/maitag/peote-playground/tree/master/net)s net-samples

- [peote-net integration](https://github.com/maitag/armory-3d-land/tree/main/peote-net) by logic nodes to use inside of [Armory3d](https://github.com/armory3d)

- used inside ohmruns [stx framework](https://github.com/ohmrun), e.g. by the [datura](https://github.com/ohmrun/datura) p2p tool  



## TODO:
- more options to handle buffering (max users per server, payload, outbounds)
- let peoteServer disconnect/block users
- hardening to make it more robust against flooding
- better implementation/documentation of the network-protocol
