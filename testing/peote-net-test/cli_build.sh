haxe cli.hxml

test -d "bin" || mkdir -p "bin"

cp build/neko/peote-net-test.n bin/peote-net-test.n

cp build/cpp/MainCli bin/peote-net-test
