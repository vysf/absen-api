const path = require('path');

const routes = (handler) => ([
  {
    method: 'POST',
    path: '/upload/{id}/photo',
    handler: handler.postUploadPhotoHandler,
    options: {
      payload: {
        allow: 'multipart/form-data',
        multipart: true,
        output: 'stream',
        maxBytes: 500000, // 500KB
      },
    },
  },
  {
    method: 'GET',
    path: '/upload/{params*}',
    handler: {
      directory: {
        path: path.resolve(__dirname, 'file'),
      },
    },
  },
]);

module.exports = routes;
