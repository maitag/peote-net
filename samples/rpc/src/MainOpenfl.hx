package;

import haxe.Timer;
import haxe.io.Bytes;
import peote.io.PeoteBytesInput;
import peote.io.PeoteBytesOutput;
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

	var logServer:OutputText;
	var logClient:OutputText;

	var channelName:String = "testserver";
	
	public function new ()
	{
		super ();
		/*
		logServer = new OutputText(3, 3, 280, 550);
		addChild(logServer);

		logClient = new OutputText(290, 5, 280, 550);
		addChild(logClient);

		
		PeoteSocketBridge.load( {
			onload: onLoadSocketBridge,
			preferWebsockets: true,
			onfail: function() { log("Browser doesn't support flash- or websockets",0,0 ); }
		});*/
		onLoadSocketBridge();
	}

	public function onLoadSocketBridge():Void
	{
		#if server
		var peoteServer = new PeoteServer(
		{
			offline:true,
			netLag:40,
			netSpeed:1024*1024,
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
				serverFunctions.message = function(msg:String, a:Int) { trace("message:"+msg + "," + a); };
				serverFunctions.test = function(a:Int) { trace("test:"+a); };
				
				server.setRemoteFunctions(userNr, serverFunctions);
				//peoteServer.delRemoteFunctions(userNr);
				
				//var remote = peoteServer.getRemoteFunctions(userNr, new RemoteClientFunctions() );
				//remote.message("hello from server");
				
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
				//trace("onDataChunk:" + bytes.length);
				server.remote(userNr, bytes);
			}
		});

		trace("trying to connect to peote-server...");
		peoteServer.create("localhost", 7680, "testserver");
		#end
		
		#if client
		var peoteClient = new PeoteClient(
		{
			//remoteCalling:true,
			//remoteFunctions:true,
			onEnter: function(client:PeoteClient)
			{
				trace('onEnterJoint: Joint number ${client.jointNr} entered');
				
				var remote = client.getRemoteFunctions( new ServerFunctions() );
				//TODO: onRemote (do only after a remote obj. is set from other side
				remote.message("hello from client", 23);
				remote.test(8);
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
				// client.remote(bytes);
			}
		});
		
		trace("trying to connect to peote-server...");
		peoteClient.enter("localhost", 7680, "testserver");
		#end

	}

	public function log(s:String, type:Int, nr:Int):Void
	{
		if (type == 0) logServer.log(s);
		else logClient.log(s);
	}

}


class ServerFunctions implements Remote {
	@:remote public var message:String->Int->Void;
	@:remote public var test:Int->Void;
}

class ClientFunctions {
	public var message:String->Void;
	public inline function new() {}
}
