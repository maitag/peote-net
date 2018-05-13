package;

import haxe.Timer;
import haxe.io.Bytes;
import openfl.display.Sprite;

import ui.OutputText;

import peote.net.PeoteClient;
import peote.io.PeoteBytesOutput;
import peote.io.PeoteBytesInput;

/**
 * ...
 * @author Sylvio Sell
 */

class ClientChannel extends Sprite implements I_Channel
{
	var output:ui.OutputText;	
	var peoteClient:PeoteClient;	
	var username:String;
	
	public var channelName:String;
	
	public function new( server:String, port:Int, channelName:String, username:String, onCloseConnection:ClientChannel->Void ) 
	{
		super();
		
		this.channelName = channelName;
		this.username = username;
		
		output = new ui.OutputText(160, 45, 582, 510);
		addChild(output);
		outputAppend("connecting..");
		
		
		peoteClient = new PeoteClient( {
			
			onEnter: function(client:PeoteClient) {
				outputAppend('enter channel (${client.jointNr}) "$channelName"');
				send(username); // send username first
			},
			
			onError: function(client:PeoteClient, errorNr:Int) {
				outputAppend('can\'t enter channel "$channelName" - error-code:' + errorNr);
				Timer.delay( function() { onCloseConnection(this); } , 1000);
			},
			
			onDisconnect: function(client:PeoteClient, reason:Int) {
				outputAppend('disconnect channel (${client.jointNr}) "$channelName", reason: $reason');
				onCloseConnection(this);
			},
			
			onDataChunk: onDataChunk
			
		});
		
		peoteClient.enter(server, port, channelName );
	}

	// -------------------- append to Text to Output --------------------------------
	
	public function outputAppend(s:String):Void
	{
		output.output.appendText(s+"\n"); 
		output.output.scrollV = output.output.maxScrollV;
	}

	// ------------------------------------------------------------------------------
	// ------------------ Interface -------------------------------------------------
	// ------------------------------------------------------------------------------

	public function send(message:String):Void
	{
		var out:PeoteBytesOutput = new PeoteBytesOutput();
		out.writeString(message);
		peoteClient.sendChunk(out.getBytes());
	}

	public function close():Void
	{
		peoteClient.leave();
	}
	
	// ------------------------------------------------------------------------------
	// ------------------ Data Chunk arrives ----------------------------------------
	// ------------------------------------------------------------------------------
	
	public function onDataChunk( client:PeoteClient, bytes:Bytes ):Void 
	{
		var input:PeoteBytesInput = new PeoteBytesInput(bytes);
		outputAppend( input.readString() );
	}
	

}