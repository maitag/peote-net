package ui;

import flash.display.Sprite;
import ui.Button;

/**
 * ...
 * @author Sylvio Sell
 */


class ChannelList extends Sprite
{

	var onSelectCallback:String->Void;
	var channels:Map<String, ui.Button>;
	var y_bottom:Int = 44;
	
	var selector:Sprite;
	
	public function new(onSelect:String->Void) 
	{
		super();
		onSelectCallback = onSelect;
		channels = new Map();
		
		selector = new Sprite();
		//selector.graphics.beginFill( 0xcccccc );
        selector.graphics.lineStyle(4, 0x555555);
		selector.graphics.drawRoundRect( 0, 0, 150, 32, 16, 16 );
		selector.x = 5;
		hideSelector();
		addChild(selector);

	}
	
	public function addChannel(channelName:String):Void 
	{
		var channel:ui.Button = new ui.Button(channelName, 5, y_bottom, 150, 32, function(_) {
			onSelectCallback(channelName);
			setSelector(channelName);
		}, true);
		channels.set(channelName, channel);

		addChild(channel);
		selector.y = y_bottom;

		y_bottom += 34;
	}
	
	public function removeChannel(channelName:String):Void 
	{
		var channel:ui.Button = channels.get(channelName);
		if (channel != null)
		{
			removeChild(channel);
			channels.remove(channelName);
			reArrange();
		}
	}
	
	public function reArrange():Void 
	{
		y_bottom = 44;
		
		for (channelName in channels.keys() )
		{
			channels.get(channelName).y = y_bottom;
			y_bottom += 34;
		}
		
	}
	
	public function setSelector(channelName:String):Void 
	{
		selector.y = channels.get(channelName).y;
	}
	
	public function hideSelector():Void 
	{
		selector.y = -1000;
	}
	
}