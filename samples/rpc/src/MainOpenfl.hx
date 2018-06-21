package;

import haxe.io.Bytes;
import peote.net.Remote;

import openfl.display.Sprite;

import peote.net.PeoteServer;
import peote.net.PeoteClient;
import peote.bridge.PeoteSocketBridge;

import ui.OutputText;

class MainOpenfl extends Sprite
{

	var host:String = "localhost";
	var port:Int = 7680;

	var out:OutputText;

	var channelName:String = "testserver";
	
	public function new ()
	{
		super();
		out = new OutputText(3, 3, 560, 550);
		addChild(out);

		#if ((!server) && (!client))
		onLoadSocketBridge();
		#else
		PeoteSocketBridge.load( {
			onload: onLoadSocketBridge,
			preferWebsockets: true,
			onfail: function() { out.log("Browser doesn't support flash- or websockets" ); }
		});
		#end
	}

	public function onLoadSocketBridge():Void
	{
		#if (server || (!client))
		var peoteServer = new PeoteServer(
		{
			#if (!server)
			offline:true,
			netLag:10, // results in 20 ms per chunk
			netSpeed:1024 * 1024 * 512, //[512KB] per second
			#end
			//remoteCalling:true,
			//remoteFunctions:true,
			onCreate: function(server:PeoteServer)
			{
				trace('onCreateJoint: Channel ${server.jointNr} created.');
			},
			onUserConnect: function(server:PeoteServer, userNr:Int)
			{
				trace('onUserConnect: jointNr:${server.jointNr}, userNr:$userNr');
				
				// server object where methods can be called by remote
				var serverFunctions = new ServerFunctions();
				serverFunctions.message = function(msg:String, a:Int) {
					out.log("serverfunction 'message':"+msg + "," + a);
				};
				serverFunctions.test = function(a:Int) {
					out.log("serverfunction 'test':"+a);
				};				
				server.setRemote(userNr, serverFunctions, 0); // --> Client's onRemote on will be called with 0
				
			},
			onRemote: function(server:PeoteServer, userNr:Int, remoteId:Int)
			{
				trace('onRemote: jointNr:${server.jointNr}, userNr:$userNr, remoteId:$remoteId');
				switch (remoteId) {
					case 0:
						var clientFunctions = ClientFunctions.getRemoteServer(server, userNr, remoteId);
						clientFunctions.message("hello from server");
					case 1:
						var secondClientFunctions = SecondClientFunctions.getRemoteServer(server, userNr, remoteId);
						secondClientFunctions.test();
						
					default: trace("unknow type");
				}
			},
			onUserDisconnect: function(server:PeoteServer, userNr:Int, reason:Int)
			{
				trace('onUserDisconnect: jointNr:${server.jointNr}, userNr:$userNr');
			},
			onError: function(server:PeoteServer, userNr:Int, reason:Int)
			{
				trace('onCreateJointError:$reason, userNr:$userNr');
			},
			onDataChunk: function(server:PeoteServer, userNr:Int, bytes:Bytes )
			{
				server.remote(userNr, bytes);
			}
		});

		trace("trying to connect to peote-server...");
		peoteServer.create("localhost", 7680, "testserver");
		#end
		
		#if (client || (!server))
		var peoteClient = new PeoteClient(
		{
			//remoteCalling:true,
			//remoteFunctions:true,
			onEnter: function(client:PeoteClient)
			{
				trace('onEnterJoint: Joint number ${client.jointNr} entered');
				
				// first client object where methods can be called by remote
				var clientFunctions = new ClientFunctions();
				clientFunctions.message = function(msg:String) {
					out.log("clientfunction 'message':"+msg);
				};				
				client.setRemote(clientFunctions, 0);       // --> Server's onRemote on will be called with 0
				
				// second client object where methods can be called by remote
				var secondClientFunctions = new SecondClientFunctions();
				secondClientFunctions.test = function() {
					out.log("clientfunction 'test (second client remoteObjectsMethodCall ;)':");
				};				
				client.setRemote(secondClientFunctions, 1);  // --> Server's onRemote on will be called with 1
				
			},
			onRemote: function(client:PeoteClient, remoteId:Int)
			{
				trace('onRemote: jointNr:${client.jointNr}, remoteId:$remoteId');
				switch (remoteId) {
					case 0:
						var serverFunctions = ServerFunctions.getRemoteClient(client, remoteId);
						serverFunctions.message("hello from client", 23);
						for (i in 0...23) serverFunctions.test(i);
					default: trace("unknow type");
				}
			},
			onDisconnect: function(client:PeoteClient, reason:Int)
			{
				trace('onDisconnect: jointNr=${client.jointNr}');
			},
			onError: function(client:PeoteClient, reason:Int)
			{
				trace('onEnterJointError:$reason');
			},
			onDataChunk: function(client:PeoteClient, bytes:Bytes )
			{
				client.remote(bytes);
			}
		});
		
		trace("trying to connect to peote-server...");
		peoteClient.enter("localhost", 7680, "testserver");
		#end

	}

}

// REMOTE-OBJECTS --------------------------------------

class ServerFunctions implements Remote {
	@:remote public var message:String->Int->Void;
	@:remote public var test:Int->Void;
}

class ClientFunctions implements Remote {
	@:remote public var message:String->Void;
}
class SecondClientFunctions implements Remote {
	@:remote public var test:Void->Void;
}
