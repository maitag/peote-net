#!/bin/bash

haxe cli.hxml

test -d "bin" || mkdir -p "bin"

cp build/neko/peote-net-test.n bin/peote-net-test.n

echo '#!/bin/bash\nneko peote-net-test.n "$@"' >bin/peote-net-test-neko
chmod +x bin/peote-net-test-neko

cp build/cpp/MainCli bin/peote-net-test
