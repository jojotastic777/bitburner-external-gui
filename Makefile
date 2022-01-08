build:
	tsc
	cp -r src/viewer/*.html dist/viewer/
	sed -i 's/export {};//' dist/viewer/index.js

setup-env:
	yarn install --dev