
if test -f "./node_modules/error-overlay-webpack-plugin/dist/index.js"; then
    yarn start
else
    yarn run buildErrorOverlay && yarn start
fi