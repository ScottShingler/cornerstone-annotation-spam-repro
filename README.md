> Tested with node version v18.12.1 (yarn 1.19.2)


To Run:
1. `yarn install`
2. `npm run build`
3. `npx webpack serve`
4. go to https://localhost:8080
5. click `Enable Pan Tool`


You should get teh following error:
```
index.js:1 Uncaught TypeError: Cannot read properties of undefined (reading 'renderViewport')
    at eval (index.js:1:391493)
    at Array.forEach (<anonymous>)
    at Bp._renderViewports (index.js:1:391412)
    at Bp.setToolActive (index.js:1:387749)
    at __webpack_require__.g.enable_tool (index.js:103:15)
    at HTMLButtonElement.onclick ((index):9:55)
```