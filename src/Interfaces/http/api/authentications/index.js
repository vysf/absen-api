const routes = require('./routes');
const AuthenticationsHandler = require('./handler');

module.exports = {
  name: 'authentications',
  register: async (server, { injection }) => {
    const authenticationsHandler = new AuthenticationsHandler(injection);
    server.route(routes(authenticationsHandler));
  },
};
