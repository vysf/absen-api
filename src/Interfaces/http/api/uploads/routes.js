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
        maxBytes: 512000,
      },
    },
  },
  {
    method: 'GET',
    path: '/upload/{params*}',
    handler: {
      directory: {
        path: path.resolve(__dirname, 'storage/file'),
      },
    },
  },
]);

module.exports = routes;
