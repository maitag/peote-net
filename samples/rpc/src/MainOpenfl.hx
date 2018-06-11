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
		super ();
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
			#if (!client)
			offline:true,
			netLag:40,
			netSpeed:1024 * 1024,
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
				
				var serverFunctions = new ServerFunctions();
				serverFunctions.message = function(msg:String, a:Int) {
					out.log("serverfunction 'message':"+msg + "," + a);
				};
				serverFunctions.test = function(a:Int) {
					out.log("serverfunction 'test':"+a);
				};
				server.setRemoteFunctions(userNr, serverFunctions);
				
				// TODO: peoteServer.delRemoteFunctions(userNr);
				
				// TODO: onRemote (do only after a remote obj. is set from other side
				var remote = ClientFunctions.getRemoteServer(server, userNr);
				remote.message("hello from server");
				
			},
			onUserDisconnect: function(server:PeoteServer, userNr:Int, reason:Int)
			{
				trace('onUserDisconnect: jointNr:${server.jointNr}, userNr:$userNr');
			},
			onError: function(server:PeoteServer, error:Int)
			{
				trace('onCreateJointError:$error');
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
				
				var clientFunctions = new ClientFunctions();
				clientFunctions.message = function(msg:String) {
					out.log("clientfunction 'message':"+msg);
				};
				client.setRemoteFunctions(clientFunctions);
				
				// TODO: onRemote (do only after a remote obj. is set from other side
				var remote = ServerFunctions.getRemoteClient(client); // TODO: api
				remote.message("hello from client", 23);
				remote.test(42);
				
			},
			onDisconnect: function(client:PeoteClient, reason:Int)
			{
				trace('onDisconnect: jointNr=${client.jointNr}');
			},
			onError: function(client:PeoteClient, error:Int)
			{
				trace('onEnterJointError:$error');
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


class ServerFunctions implements Remote {
	@:remote public var message:String->Int->Void;
	@:remote public var test:Int->Void;
}

class ClientFunctions implements Remote {
	@:remote public var message:String->Void;
}
