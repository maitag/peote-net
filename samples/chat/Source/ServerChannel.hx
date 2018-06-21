package;

import haxe.ds.IntMap;
import haxe.Timer;
import haxe.io.Bytes;
import openfl.display.Sprite;

import ui.OutputText;

import peote.net.PeoteServer;
import peote.io.PeoteBytesOutput;
import peote.io.PeoteBytesInput;

/**
 * ...
 * @author Sylvio Sell
 */


class ServerChannel extends Sprite implements I_Channel
{
	var output:ui.OutputText;	
	var peoteServer:PeoteServer;
	var user:IntMap<String>;	
	var username:String;
	
	public var channelName:String;
	
	public function new( server:String, port:Int, channelName:String, username:String, onCloseConnection:ServerChannel->Void ) 
	{
		super();
		
		this.channelName = channelName;
		this.username = username;
		
		user = new IntMap();
		
		output = new ui.OutputText(160, 45, 582, 510);
		addChild(output);
		outputAppend("connect..");
		outputAppend("create new Channel " + channelName);
		
		
		peoteServer = new PeoteServer( {
			
			onCreate: function( server:PeoteServer ) {
				outputAppend('create new channel (${server.jointNr}): "$channelName"');
			},
			
			onError: function( server:PeoteServer, userNr:Int, errorNr:Int ) {
				outputAppend('can\'t create channel "$channelName" - error-code:' + errorNr);
				Timer.delay( function() { onCloseConnection(this); } , 1000);
			},
			
			onUserConnect: function( server:PeoteServer, userNr:Int ) {
				user.set(userNr,"");
			},
			
			onUserDisconnect: function( server:PeoteServer, userNr:Int, reason:Int ) {
				outputAppend( '${user.get(userNr)} leaves channel, reason: $reason' );
				user.remove(userNr);
			},
			
			onDataChunk: onDataChunk
			
		});
		
		peoteServer.create( server, port, channelName );
	}
	
	// -------------------- append to Text to Output --------------------------------

	public function outputAppend(s:String):Void
	{
		output.output.appendText(s + "\n");
		output.output.scrollV = output.output.maxScrollV;
	}

	// ------------------------------------------------------------------------------
	// ------------------ Interface -------------------------------------------------
	// ------------------------------------------------------------------------------

	public function send(message:String):Void
	{
		message = username + ":" + message;
		sendToAll(message);
	}
	
	public function sendToAll(message:String):Void
	{
		var out:PeoteBytesOutput = new PeoteBytesOutput();
		out.writeString(message);
		
		for ( userNr in user.keys() ) peoteServer.sendChunk(userNr, out.getBytes());
		
		outputAppend(message);
	}

	public function close():Void
	{
		peoteServer.delete(); // close Channel
	}
	
	// ------------------------------------------------------------------------------
	// ------------------ Data Chunk arrives ----------------------------------------
	// ------------------------------------------------------------------------------
	
	public function onDataChunk( server:PeoteServer,  userNr:Int, bytes:Bytes ):Void 
	{
		var input:PeoteBytesInput = new PeoteBytesInput(bytes);
		if ( user.get(userNr) == "" ) // first incomming message is username
		{
			user.set( userNr, input.readString() );
			outputAppend( '${user.get(userNr)} enters channel' );
		}
		else
		{
			var message = user.get(userNr) + ": " + input.readString();
			sendToAll(message);
		}
	}
	


	
}