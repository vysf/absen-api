/* eslint-disable no-console */
require('dotenv').config();
const createServer = require('./Infrastructures/http/createServer');
const injection = require('./Infrastructures/injection');

(async () => {
  const server = await createServer(injection);
  await server.start();
  console.log(`server start at ${server.info.uri}`);
})();
