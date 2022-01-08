# Bitburner External GUI
An external stats UI for the game Bitburner. Play Bitburner here: https://danielyxie.github.io/bitburner/

Build Dependencies:
- yarn
- make

Build Instructions:
1. Run `make setup-env`.
2. Run `make build`.

Usage Instructions:
1. See: [Build Instructions](#Build_Instructions)
2. Copy `dist/bitburner/guiExternSvc.js` into a Bitburner script.
3. Run `node dist/server/wsServer.js`
4. Run the `guiExternSvc.js` script in Bitburner.
5. Open `dist/viewer/index.html` in a web browser.
