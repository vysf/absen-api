const pool = require('../../database/postgres/pool');
const UsersTableTestHelper = require('../../../../tests/UsersTableTestHelper');
const ServerTestHelper = require('../../../../tests/ServerTestHelper');
const injection = require('../../injection');
const createServer = require('../createServer');

describe('/users endpoint', () => {
  afterAll(async () => {
    await pool.end();
  });

  afterEach(async () => {
    await UsersTableTestHelper.cleanTable();
  });

  describe('when POST /users', () => {
    it('should response 201 and persisted user', async () => {
      // Arrange
      const requestPayload = {
        username: 'dicoding',
        password: 'secret',
        fullname: 'Dicoding Indonesia',
      };
      // eslint-disable-next-line no-undef
      const server = await createServer(injection);

      // Action
      const response = await server.inject({
        method: 'POST',
        url: '/users',
        payload: requestPayload,
      });

      // Assert
      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(201);
      expect(responseJson.status).toEqual('success');
      expect(responseJson.data.addedUser).toBeDefined();
    });

    it('should response 400 when request payload not contain needed property', async () => {
      // Arrange
      const requestPayload = {
        fullname: 'Dicoding Indonesia',
        password: 'secret',
      };
      // const server = await createServer(container);
      const server = await createServer(injection);

      // Action
      const response = await server.inject({
        method: 'POST',
        url: '/users',
        payload: requestPayload,
      });

      // Assert
      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(400);
      expect(responseJson.status).toEqual('fail');
      expect(responseJson.message).toEqual('tidak dapat membuat user baru karena properti yang dibutuhkan tidak ada');
    });

    it('should response 400 when request payload not meet data type specification', async () => {
      // Arrange
      const requestPayload = {
        username: 'dicoding',
        password: 'secret',
        fullname: ['Dicoding Indonesia'],
      };
      // const server = await createServer(container);
      const server = await createServer(injection);

      // Action
      const response = await server.inject({
        method: 'POST',
        url: '/users',
        payload: requestPayload,
      });

      // Assert
      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(400);
      expect(responseJson.status).toEqual('fail');
      expect(responseJson.message).toEqual('tidak dapat membuat user baru karena tipe data tidak sesuai');
    });

    it('should response 400 when username more than 50 character', async () => {
      // Arrange
      const requestPayload = {
        username: 'dicodingindonesiadicodingindonesiadicodingindonesiadicoding',
        password: 'secret',
        fullname: 'Dicoding Indonesia',
      };
      // const server = await createServer(container);
      const server = await createServer(injection);

      // Action
      const response = await server.inject({
        method: 'POST',
        url: '/users',
        payload: requestPayload,
      });

      // Assert
      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(400);
      expect(responseJson.status).toEqual('fail');
      expect(responseJson.message).toEqual('tidak dapat membuat user baru karena karakter username melebihi batas limit');
    });

    it('should response 400 when username contain restricted character', async () => {
      // Arrange
      const requestPayload = {
        username: 'dicoding indonesia',
        password: 'secret',
        fullname: 'Dicoding Indonesia',
      };
      // const server = await createServer(container);
      const server = await createServer(injection);

      // Action
      const response = await server.inject({
        method: 'POST',
        url: '/users',
        payload: requestPayload,
      });

      // Assert
      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(400);
      expect(responseJson.status).toEqual('fail');
      expect(responseJson.message).toEqual('tidak dapat membuat user baru karena username mengandung karakter terlarang');
    });

    it('should response 400 when username unavailable', async () => {
      // Arrange
      await UsersTableTestHelper.addUser({ username: 'dicoding' });
      const requestPayload = {
        username: 'dicoding',
        fullname: 'Dicoding Indonesia',
        password: 'super_secret',
      };
      // const server = await createServer(container);
      const server = await createServer(injection);

      // Action
      const response = await server.inject({
        method: 'POST',
        url: '/users',
        payload: requestPayload,
      });

      // Assert
      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(400);
      expect(responseJson.status).toEqual('fail');
      expect(responseJson.message).toEqual('Username tidak tersedia');
    });
  });

  describe('when GET /users', () => {
    it('should response 200 and get list of users', async () => {
      // Arrange
      await UsersTableTestHelper.addUser({ id: '1', username: 'user1' });
      await UsersTableTestHelper.addUser({ id: '2', username: 'user2' });

      const server = await createServer(injection);
      // Action
      const response = await server.inject({
        method: 'GET',
        url: '/users',
        // payload: requestPayload,
      });

      // Assert
      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(200);
      expect(responseJson.status).toEqual('success');
      expect(responseJson.data.users).toBeDefined();
      expect(responseJson.data.users).toHaveLength(2);
    });
  });

  describe('when GET /users/{id}', () => {
    it('should response 200 and get a user detail', async () => {
      // Arrange
      const server = await createServer(injection);
      const id = 'user-1';

      await UsersTableTestHelper.addUser({ id, username: 'jhondoe' });

      // Action
      const response = await server.inject({
        method: 'GET',
        url: `/users/${id}`,
      });

      // Assert
      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(200);
      expect(responseJson.status).toEqual('success');
      expect(responseJson.data.user).toBeDefined();
    });

    it('should response 400 if user not exists', async () => {
      // Arrange
      const server = await createServer(injection);
      const id = 'user-1';

      // Action
      const response = await server.inject({
        method: 'GET',
        url: `/users/${id}`,
      });

      // Assert
      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(404);
      expect(responseJson.status).toEqual('fail');
      expect(responseJson.message).toBeDefined();
    });
  });

  describe('when PUT /users/{id}', () => {
    describe('when user\'s role is dosen', () => {
      it('should response 200 and update user own data', async () => {
        // Arrange
        const server = await createServer(injection);
        const requestPayload = {
          fullname: 'new name',
        };

        const { accessToken, id } = await ServerTestHelper
          .getAccessTokenAndUserIdHelper({ server });

        // Action
        const response = await server.inject({
          method: 'PUT',
          url: `/users/${id}`,
          payload: requestPayload,
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        });

        // Assert
        const responseJson = JSON.parse(response.payload);

        expect(response.statusCode).toEqual(201);
        expect(responseJson.status).toEqual('success');
        expect(responseJson.message).toBeDefined();
      });
    });

    it('should response 200 and update user own password', async () => {
      // Arrange
      const server = await createServer(injection);
      const requestPayload = {
        password: 'newpassword',
      };

      const { accessToken, id } = await ServerTestHelper
        .getAccessTokenAndUserIdHelper({ server });

      // Action
      const response = await server.inject({
        method: 'PUT',
        url: `/users/${id}`,
        payload: requestPayload,
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      // Assert
      const responseJson = JSON.parse(response.payload);

      expect(response.statusCode).toEqual(201);
      expect(responseJson.status).toEqual('success');
      expect(responseJson.message).toBeDefined();
    });

    // PENTING UNTUK DILANJUTKAN !!!
    // it('should response 401 if user update another user data', async () => {});

    // describe('when user\'s role is admin', () => {

    // });
  });

  describe('when DELETE /users/{id}', () => {
    it('should response 200 and delete user correctly', async () => {
      // Arrange
      const server = await createServer(injection);

      const user = {
        id: 'user-2',
        username: 'janedoe',
        fullname: 'Jane Doe',
        role: 'dosen',
      };
      await UsersTableTestHelper.addUser(user);

      const { accessToken, id } = await ServerTestHelper
        .getAccessTokenAndUserIdHelper({ server });

      await UsersTableTestHelper.updateRole(id, 'admin');

      // Action
      const response = await server.inject({
        method: 'DELETE',
        url: `/users/${user.id}`,
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      // Assert
      const responseJson = JSON.parse(response.payload);
      const result = await UsersTableTestHelper.findUsersById(user.id);

      expect(response.statusCode).toEqual(201);
      expect(responseJson.status).toEqual('success');
      expect(responseJson.message).toBeDefined();
      expect(result[0].is_delete).toEqual(true);
    });

    it('should response 403 when not the admin who delete the user', async () => {
      // Arrange
      const server = await createServer(injection);

      const user = {
        id: 'user-2',
        username: 'janedoe',
        fullname: 'Jane Doe',
        role: 'dosen',
      };
      await UsersTableTestHelper.addUser(user);

      const { accessToken } = await ServerTestHelper
        .getAccessTokenAndUserIdHelper({ server });

      // Action
      const response = await server.inject({
        method: 'DELETE',
        url: `/users/${user.id}`,
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      // Assert
      const responseJson = JSON.parse(response.payload);

      expect(response.statusCode).toEqual(403);
      expect(responseJson.status).toEqual('fail');
      expect(responseJson.message).toBeDefined();
    });
  });
});
