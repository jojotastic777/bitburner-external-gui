build: build-html build-js

build-html:
	cp -r src/viewer/*.html dist/viewer/

build-js:
	tsc
	sed -i 's/export {};//' dist/viewer/index.js

setup-env:
	yarn install --dev