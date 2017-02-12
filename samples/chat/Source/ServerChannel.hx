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
	var inputBuffer:PeoteBytesInput; // stores not fully readed chunk
	var chunk_size:Int = 0;
	
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
		
		
		inputBuffer = new PeoteBytesInput();
		
		peoteServer = new PeoteServer( {
			
			onCreateJoint: function(jointNr:Int) {
				outputAppend('create new channel ($jointNr): "$channelName"');
			},
			
			onCreateJointError: function(errorNr:Int) {
				outputAppend('can\'t create channel "$channelName" - error-code:' + errorNr);
				Timer.delay( function() { onCloseConnection(this); } , 1000);
			},
			
			onUserConnect: function( jointNr:Int, userNr:Int ) {
				user.set(userNr,"");
			},
			
			onUserDisconnect: function(jointNr:Int, userNr:Int, reason:Int) {
				outputAppend( '${user.get(userNr)} leaves channel, reason: $reason' );
				user.remove(userNr);
			},
			
			onData: onData
			
		});
		
		peoteServer.createJoint( server, port, channelName );
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
		var bytes:PeoteBytesOutput = new PeoteBytesOutput();
		bytes.writeString(message);
		
		for ( userNr in user.keys() ) sendChunk(userNr, bytes);
		
		outputAppend(message);
	}

	public function close():Void
	{
		peoteServer.deleteJoint(); // close Channel
	}
	
	// ------------------------------------------------------------------------------
	
	public function sendChunk( userNr:Int, output:PeoteBytesOutput):Void
	{	
		var chunksize:PeoteBytesOutput = new PeoteBytesOutput();
		chunksize.writeUInt16(output.length);
		peoteServer.send( userNr, chunksize.getBytes() );
		peoteServer.send( userNr, output.getBytes() );
	}

	// ------------------------------------------------------------------------------
	// ------------------ Data Input ------------------------------------------------
	// ------------------------------------------------------------------------------
	
	public function onData( jointNr:Int, userNr:Int, bytes:Bytes ):Void 
	{
		inputBuffer.append( bytes );
		
		if (chunk_size == 0 && inputBuffer.bytesLeft() >=2 ) {
			chunk_size = inputBuffer.readUInt16(); // read chunk size
		}
		
		if ( chunk_size != 0 && inputBuffer.bytesLeft() >= chunk_size )
		{
			onDataChunk( userNr, inputBuffer, chunk_size );
			chunk_size = 0;
		}
	}

	// this will called if full chunk arrives
	public function onDataChunk( userNr:Int, input:PeoteBytesInput, chunk_size:Int ):Void 
	{
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