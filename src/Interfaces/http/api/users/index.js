const UsersHandler = require('./handler');
const routes = require('./routes');

module.exports = {
  name: 'users',
  register: async (server, { injection }) => {
    const usersHandler = new UsersHandler(injection);
    server.route(routes(usersHandler));
  },
};
