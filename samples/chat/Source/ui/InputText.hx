package ui;

import openfl.display.Sprite;
import openfl.text.Font;
import openfl.text.TextField;
import openfl.text.TextFieldType;
import openfl.text.TextFormat;
import lime.ui.KeyCode;
import flash.events.KeyboardEvent;
import ui.Button;

/**
 * ...
 * @author Sylvio Sell
 */
class InputText extends Sprite
{
	var input:TextField;
	
	public function new(label:String, x:Int, y:Int, w:Int, h:Int, callback:TextField->Void) 
	{
		super();
		var enter_button:ui.Button = new ui.Button(label, x+w+2, y, 120, h, function(_) {
			callback(input);
		});
		addChild(enter_button);
		
		
		
		var textFormat = new TextFormat ();
		textFormat.leftMargin = 5;
		textFormat.rightMargin = 5;
		textFormat.size = Math.floor(h/2);
		
		
		input = new TextField ();
		
		input.defaultTextFormat = textFormat;
		
		//input.embedFonts = true;
		input.type = TextFieldType.INPUT;
		input.border = true;
		input.multiline = false;
		//input.wordWrap = true;
		input.background = true;
		input.backgroundColor = 0xeeeeee;
		
		input.x = x;
		input.y = y;
		input.width = w;
		input.height= h-1;		
		
		addChild (input);
		
		input.addEventListener(KeyboardEvent.KEY_UP, function(event:Dynamic):Void {
			if (event.keyCode == KeyCode.RETURN)
			{
				callback(input);
			}
		});
	}
	
	public function focus():Void 
	{
		stage.focus = input;
	}
	
}