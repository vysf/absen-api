/* eslint-disable import/no-extraneous-dependencies */
// const path = require('path');
const FormData = require('form-data');
// const { Readable } = require('stream');
const fs = require('fs');
const pool = require('../../database/postgres/pool');
const UsersTableTestHelper = require('../../../../tests/UsersTableTestHelper');
const ServerTestHelper = require('../../../../tests/ServerTestHelper');
const injection = require('../../injection');
const createServer = require('../createServer');

describe('/users/{id}/photo', () => {
  afterAll(async () => {
    await pool.end();
  });

  afterEach(async () => {
    await UsersTableTestHelper.cleanTable();
  });

  describe('when POST photo', () => {
    it('should response 200 and update user own photo', async () => {
      // Arrange
      const server = await createServer(injection);
      // const requestPayload = {
      //   photo: fs.readFileSync('tests/images/flower.jpg'),
      // };
      // const stream = Readable.from(buffer);

      const requestPayload = new FormData();
      requestPayload.append('photo', fs.readFileSync('tests/images/flower.jpg'));

      // console.log(fs.readFileSync('tests/images/flower.jpg'));
      // console.log(path.join('tests/images/flower.png'));

      const { accessToken, id } = await ServerTestHelper
        .getAccessTokenAndUserIdHelper({ server });
      // console.log(requestPayload);
      // Action
      const response = await server.inject({
        method: 'POST',
        url: `/upload/${id}/photo`,
        payload: requestPayload.getBuffer(),
        headers: {
          Authorization: `Bearer ${accessToken}`,
          ...requestPayload.getHeaders(),
        },
      });

      // Assert
      const responseJson = JSON.parse(response.payload);
      // console.log(response.payload, requestPayload.getHeaders());

      expect(response.statusCode).toEqual(200);
      expect(responseJson.status).toEqual('success');
      expect(responseJson.message).toBeDefined();
    });
  });
});
