package;


import openfl.display.Sprite;
import openfl.events.Event;


import peote.bridge.PeoteSocketBridge;

import ui.OutputText;
import test.Stress;

class MainOpenfl extends Sprite {
	
	var host:String = "localhost";
	var port:Int = 7680;
	
	var logServer:OutputText;
	var logClient:OutputText;
	
	var channelName:String = "testserver";
	var maxChannel:Int = 10; // try testserver0, testserver1, testserver2 ...
	
	#if server
	var maxServers:Int = 1;
	var maxClients:Int = 0;
	#elseif client
	var maxServers:Int = 0;
	var maxClients:Int = 1;
	#else
	var maxServers:Int = 1;
	var maxClients:Int = 1;
	#end
	
	var minBytes:Int = 1;
	var maxBytes:Int = 65536;

	var test:Stress;
	
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
		test = new Stress(host, port, log, maxServers, maxClients, channelName, maxChannel, minBytes, maxBytes );
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
