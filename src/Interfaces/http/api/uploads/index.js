const routes = require('./routes');
const UploadsHandler = require('./handler');

module.exports = {
  name: 'uploads',
  register: async (server, { injection }) => {
    const uploadsHandler = new UploadsHandler(injection);
    server.route(routes(uploadsHandler));
  },
};
