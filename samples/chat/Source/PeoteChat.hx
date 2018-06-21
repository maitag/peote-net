package;

import ui.Button;
import ui.ChannelList;
import ui.InputText;

import openfl.display.Sprite;
import openfl.text.TextField;

import peote.bridge.PeoteSocketBridge;

class PeoteChat extends Sprite {
	
	var channels:Map<String, I_Channel>;
	var active:I_Channel = null;

	var input_username:ui.InputText;
	
	var create_channel:ui.InputText;
	var enter_channel:ui.InputText;
	
	var send_message:ui.InputText;
	
	var channel_list:ui.ChannelList;
	var close_button:ui.Button;
	
	var username:String = "";
	
	public function new () {
		
		super ();
		channels = new Map();
		
		PeoteSocketBridge.load( {
			onload: onLoadSocketBridge,
			preferWebsockets: true,
			onfail: function() { trace("Browser doesn't support flash- or websockets"); }
		});
	}
	
	public function onLoadSocketBridge():Void
	{
		// server adress and port number of peote-server (perl proxy with peote-net protocol)
		var server:String = "localhost";
		var port:Int = 7680;
		
		// -------------------------- input user name ---------------------
		
		input_username = new ui.InputText("Enter Name", 160, 3, 140, 32,
		
			function(input:TextField) // on Send Message
			{
				if ( input.text != ""  ) {
					username = input.text;
					removeChild(input_username);
					addChild(create_channel);
					addChild(enter_channel);
					addChild(channel_list);
					create_channel.focus();
				} 
				else input_username.focus();
			}
		);
		addChild(input_username);
		input_username.focus();
		
		// -------------------------- SERVER ---------------------------
		
		create_channel = new ui.InputText("Create Channel", 160, 3, 140, 32,
			
			function(input:TextField) // on Create New Channel
			{ 	
				if (input.text != "" && !channels.exists(input.text) ) {
					
					if (active == null) {
						addChild(close_button);
						addChild(send_message);
					}
					
					active = new ServerChannel( server, port, input.text, username,
						
						function(channel:ServerChannel) // onCloseConnection
						{ 
							channel_list.removeChannel(channel.channelName);
							channels.remove(channel.channelName);
							if (channel == active)
							{	
								if (channels.iterator().hasNext())
								{
									active = channels.iterator().next();
									swapChildren( cast channel, cast active );
									channel_list.setSelector(active.channelName);
								}
								else
								{
									active = null;
									removeChild(send_message);
									removeChild(close_button);
									channel_list.hideSelector();
								}
							}
							removeChild( cast channel );
						}
					);
					
					channels.set( input.text, active );
					
					addChild( cast active);
					channel_list.addChannel(active.channelName);
					
					input.text = "";
				}
				create_channel.focus();
			}
		);
		
		
		// -------------------------- CLIENT ---------------------------
		
		enter_channel = new ui.InputText("Enter Channel", 480, 3, 140, 32,
			
			function(input:TextField) // on Enter Channel
			{
				if (input.text != "" && !channels.exists(input.text) ) {
					
					if (active == null) {
						addChild(close_button);
						addChild(send_message);
					}
					
					active = new ClientChannel( server, port, input.text, username,
						
						function(channel:ClientChannel) // onCloseConnection
						{ 
							channel_list.removeChannel(channel.channelName);
							channels.remove(channel.channelName);
							if (channel == active)
							{
								if (channels.iterator().hasNext())
								{
									active = channels.iterator().next();
									swapChildren( cast channel, cast active );
									channel_list.setSelector(active.channelName);
								}
								else
								{
									active = null;
									removeChild(send_message);
									removeChild(close_button);
									channel_list.hideSelector();
								}
							}
							removeChild( cast channel );
						}
					);
					
					channels.set( input.text, active );
					
					addChild( cast active);
					channel_list.addChannel(active.channelName);
					
					input.text = "";
				}
				enter_channel.focus();
			}
		);
		
		
		// -------------------------- Send Message ---------------------
		
		send_message = new ui.InputText("Send", 160, 560, 460, 32,
		
			function(input:TextField) // on Send Message
			{
				if ( input.text != ""  ) {
					active.send(input.text);
					
					input.text = "";
					stage.focus = input; // did not work on js and cpp target
				}
			}
		);
		
		
		// --------------- Channel List (to select open connections ------
		
		channel_list = new ui.ChannelList(
			
			function(name:String) // select Channel
			{
				swapChildren( cast channels.get(name), cast active );
				active = channels.get(name);
			}
		);
		
		
		// -------------------------- close Channel ----------------------
		
		close_button = new ui.Button("close", 744, 44, 50, 32,
			
			function(_) // close Channel
			{		
				active.close();
				
				channel_list.removeChannel(active.channelName);
				channels.remove(active.channelName);
				
				var old:I_Channel = active;
				
				if (channels.iterator().hasNext())
				{
					active = channels.iterator().next();
					swapChildren( cast old, cast active );
					channel_list.setSelector(active.channelName);
				}
				else
				{
					active = null;
					removeChild(send_message);
					removeChild(close_button);
					channel_list.hideSelector();
				}
				
				removeChild( cast old );
			}
		);
		
		
	}
	
	
}
