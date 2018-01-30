package ui;

import openfl.display.Sprite;
import openfl.text.TextField;
import openfl.text.TextFieldType;
import openfl.text.TextFormat;

/**
 * ...
 * @author Sylvio Sell
 */
class OutputText extends Sprite
{
	public var output:TextField;

	public function new(x:Int, y:Int, w:Int, h:Int ) 
	{
		super();
		
		var textFormat = new TextFormat ();
		textFormat.leftMargin = 5;
		textFormat.rightMargin = 5;
		textFormat.size = 16;
		
		
		output = new TextField ();
		
		output.defaultTextFormat = textFormat;
		
		//output.embedFonts = true;
		output.type = TextFieldType.DYNAMIC;
		output.border = true;
		output.multiline = true;
		output.wordWrap = true;
		output.background = true;
		output.backgroundColor = 0xf5f5f5;
		
		output.x = x;
		output.y = y;
		output.width = w;
		output.height= h;		
		
		
		addChild (output);
		
	}
	
}