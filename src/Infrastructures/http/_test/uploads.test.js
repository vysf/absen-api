/* eslint-disable import/no-extraneous-dependencies */
const path = require('path');
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
    fs.rmSync(path.join(__dirname, '../../../Interfaces/http/api/uploads/storage'), { recursive: true, force: true });
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
      const filePath = path.join(__dirname, '../../../../tests/images/', 'flower.jpg');
      const file = fs.readFileSync(filePath);
      const requestPayload = new FormData();
      requestPayload.append('photo', file, { filename: 'flower.jpg' });

      const { accessToken, id } = await ServerTestHelper
        .getAccessTokenAndUserIdHelper({ server });
      // console.log(requestPayload);
      // Action
      const buffer = await requestPayload.getBuffer();
      const response = await server.inject({
        method: 'POST',
        url: `/upload/${id}/photo`,
        payload: buffer,
        headers: {
          Authorization: `Bearer ${accessToken}`,
          ...requestPayload.getHeaders(),
        },
      });

      // Assert
      const responseJson = JSON.parse(response.payload);

      expect(response.statusCode).toEqual(200);
      expect(responseJson.status).toEqual('success');
      expect(responseJson.message).toBeDefined();
    });
  });
});
