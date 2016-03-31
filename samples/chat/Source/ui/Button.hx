package ui;

import flash.display.Sprite;
import flash.text.TextField;
import flash.text.TextFormat;
import flash.text.TextFormatAlign;
import flash.events.MouseEvent;

/**
 * ...
 * @author Sylvio Sell
 */

class Button extends Sprite
{
	var text:TextField;
	
	public function new(label:String, x:Int, y:Int, w:Int, h:Int, onClick:Dynamic->Void, selectable:Bool = false)
    {
        super();
		
		this.x = x;
		this.y = y;
		
		// drawRect ----------------------
		
		graphics.beginFill( 0xcccccc );
        graphics.drawRoundRect( 0, 0, w, h, 16, 16 );
        graphics.endFill();
		
		
		// addTextField ------------------
		
		var format = new TextFormat();
		format.align = TextFormatAlign.CENTER;
		format.size = Math.floor(h/2);
		
		text = new TextField();
		text.defaultTextFormat = format;
		
		text.selectable = selectable;
		text.y = Math.floor(h/8);
		text.width = w;
		text.height= h;		
		
		text.text = label;
		addChild (text);
		

		// listen on Click -------------		
		addEventListener(MouseEvent.CLICK, onClick );
		
    }
 

}