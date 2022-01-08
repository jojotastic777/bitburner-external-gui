build: build-js build-html

build-html:
	cp -r src/viewer/*.html dist/viewer/

build-js:
	node ./node_modules/typescript/bin/tsc
	sed -i 's/export {};//' dist/viewer/index.js

setup-env:
	yarn install --dev