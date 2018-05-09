package;


@:access(lime.app.Application)
@:access(lime.system.System)


@:dox(hide) class ApplicationMain {
	
	
	public static function main () {
		
		var projectName = "PeoteTestServer";
		
		var config = {
			
			build: "10",
			company: "Sylvio Sell - maitag",
			file: "PeoteTestServer",
			fps: 30,
			name: "PeoteNetTest",
			orientation: "",
			packageName: "peote.net",
			version: "0.5.7",
			windows: [
				
				{
					allowHighDPI: false,
					alwaysOnTop: false,
					antialiasing: 0,
					background: 16777215,
					borderless: false,
					colorDepth: 16,
					depthBuffer: false,
					display: 0,
					fullscreen: false,
					hardware: true,
					height: 600,
					hidden: #if munit true #else false #end,
					maximized: false,
					minimized: false,
					parameters: {},
					resizable: true,
					stencilBuffer: false,
					title: "PeoteNetTest",
					vsync: false,
					width: 800,
					x: null,
					y: null
				},
			]
			
		};
		
		lime.system.System.__registerEntryPoint (projectName, create, config);
		
		#if sys
		lime.system.System.__parseArguments (config);
		#end
		
		#if (!html5 || munit)
		create (config);
		#end
		
	}
	
	
	public static function create (config:lime.app.Config):Void {
		
		ManifestResources.init (config);
		
		var preloader = new lime.app.Preloader ();
		
		#if !munit
		var app = new PeoteTest ();
		app.setPreloader (preloader);
		app.create (config);
		#end
		
		preloader.create (config);
		
		for (library in ManifestResources.preloadLibraries) {
			
			preloader.addLibrary (library);
			
		}
		
		for (name in ManifestResources.preloadLibraryNames) {
			
			preloader.addLibraryName (name);
			
		}
		
		preloader.load ();
		
		#if !munit
		start (app);
		#end
		
	}
	
	
	public static function start (app:lime.app.Application = null):Void {
		
		#if !munit
		
		var result = app.exec ();
		
		#if (sys && !ios && !nodejs && !emscripten)
		lime.system.System.exit (result);
		#end
		
		#else
		
		new PeoteTest ();
		
		#end
		
	}
	
	
	@:noCompletion @:dox(hide) public static function __init__ () {
		
		var init = lime.app.Application;
		
		#if neko
		// Copy from https://github.com/HaxeFoundation/haxe/blob/development/std/neko/_std/Sys.hx#L164
		// since Sys.programPath () isn't available in __init__
		var sys_program_path = {
			var m = neko.vm.Module.local().name;
			try {
				sys.FileSystem.fullPath(m);
			} catch (e:Dynamic) {
				// maybe the neko module name was supplied without .n extension...
				if (!StringTools.endsWith(m, ".n")) {
					try {
						sys.FileSystem.fullPath(m + ".n");
					} catch (e:Dynamic) {
						m;
					}
				} else {
					m;
				}
			}
		};
		
		var loader = new neko.vm.Loader (untyped $loader);
		loader.addPath (haxe.io.Path.directory (#if (haxe_ver >= 3.3) sys_program_path #else Sys.executablePath () #end));
		loader.addPath ("./");
		loader.addPath ("@executable_path/");
		#end
		
	}
	
	
}