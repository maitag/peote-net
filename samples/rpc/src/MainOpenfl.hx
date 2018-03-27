package;


import haxe.io.Bytes;

import openfl.display.Sprite;
import openfl.events.Event;

import peote.net.PeoteNet;
import peote.net.PeoteServer;
import peote.net.PeoteClient;


import peote.bridge.PeoteSocketBridge;

import ui.OutputText;

class MainOpenfl extends Sprite {
	
	var host:String = "localhost";
	var port:Int = 7680;
	
	var logServer:OutputText;
	var logClient:OutputText;
	
	var channelName:String = "testserver";
		
	public function new () {
		
		super ();
		
		logServer = new OutputText(3, 3, 280, 550);
		addChild(logServer);
		
		logClient = new OutputText(290, 5, 280, 550);
		addChild(logClient);
		
		stage.addEventListener (Event.RESIZE, stageOnResize);
		
		PeoteSocketBridge.load( {
			onload: onLoadSocketBridge,
			preferWebsockets: true,
			onfail: function() { log("Browser doesn't support flash- or websockets",0,0 ); }
		});
	}
	
	public function onLoadSocketBridge():Void
	{
		#if server
		var peoteServer:PeoteServer;
		var alice:Alice;
		var bobs:Array<RemoteObject<Bob>>;
		
		peoteServer = new PeoteServer(
		{
			onCreateJoint: function(server:PeoteServer) {
				trace('onCreateJoint: Channel ${server.jointNr} created.'); 
				alice = new Alice();	
				bobs = new Array<Bob>();
			},
			onCreateJointError: function(server:PeoteServer, error:Int) {
				trace('onCreateJointError:$error');
			},
			onUserDisconnect: function(server:PeoteServer, userNr:Int, reason:Int) {
				trace('onUserDisconnect: jointNr:${server.jointNr}, userNr:$userNr');
				bobs[userNr] = null;
			},
			onUserConnect: function(server:PeoteServer, userNr:Int) {
				trace('onUserConnect: jointNr:${server.jointNr}, userNr:$userNr');
				
				// provides acces to alice (only class-members signed by @metadata)
				peoteServer.provideRemoteObject(userNr, alice);
				
				// get access to provided object by client
				bobs[userNr] = new RemoteObject<Bob>();
				peoteServer.accessRemoteObject(userNr, bobs[userNr]);
				bobs[userNr].send("message from peoteServer to Bob");
			},
			onDataChunk: function(server:PeoteServer, userNr:Int, bytes:Bytes ) {
				// let client access members of alice
				
			}
		});
			
		trace("trying to connect to peote-server...");
		peoteServer.createJoint("localhost", 7680, "testserver");
		
		
		#elseif client
		
		var peoteClient:PeoteClient;
		var bob:Bob;
		var alice:RemoteObject<Alice>;
		
		peoteClient = new PeoteClient(
		{
			onEnterJointError: function(client:PeoteClient, error:Int) {
				trace('onEnterJointError:$error');
			},
			onDisconnect: function(client:PeoteClient, reason:Int) {
				trace('onDisconnect: jointNr=${client.jointNr}');
			},
			onEnterJoint: function(client:PeoteClient) {
				trace('onEnterJoint: Joint number ${client.jointNr} entered');
				
				bob = new Bob();	
				// provides acces to bob (class-members signed by @metadata)
				peoteClient.provideRemoteObject(bob);
				
				// get access to provided object by client
				alice = new RemoteObject<Alice>();
				peoteClient.accessRemoteObject(alice);
				alice.send("message from peoteClient to Alice");
			
			},
			onDataChunk: function(server:PeoteClient, bytes:Bytes ) {
				
			}
		});
		#else
		
		// accessing CLASS local (without peote-net between -----------------
		var alice:Alice = new Alice();	
		var bob:Bob = new Bob();
		
		alice.send("hello alice");
		bob.send("hello bob");
		
		#end
	
	}
	
	public function log(s:String, type:Int, nr:Int):Void {
		if (type == 0) logServer.log(s);
		else logClient.log(s);
	}

	private function stageOnResize (event:Event):Void {
	
		var contentWidth = 574;
		var contentHeight = 560;
		
		var maxScaleX = stage.stageWidth / contentWidth;
		var maxScaleY = stage.stageHeight / contentHeight;
		var scale;
		
		if (maxScaleX < maxScaleY)
			scale = maxScaleX;
		else scale = maxScaleY;
		
		scaleX = scale;
		scaleY = scale;
		x = stage.stageWidth / 2 - (contentWidth * scale) / 2;
		y = stage.stageHeight / 2 - (contentHeight * scale) / 2;
	
	}
}
