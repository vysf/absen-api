/* istanbul ignore file */
const ServerTestHelper = {
  async getAccessTokenAndUserIdHelper({ server, username = 'jhondoe' }) {
    const userPayload = {
      username,
      password: 'secret',
    };

    const responseUser = await server.inject({
      method: 'POST',
      url: '/users',
      payload: {
        fullname: 'placeholder fullname',
        ...userPayload,
      },
    });

    const responseAuth = await server.inject({
      method: 'POST',
      url: '/authentications',
      payload: userPayload,
    });

    const { id } = (JSON.parse(responseUser.payload)).data.addedUser;
    const { accessToken } = (JSON.parse(responseAuth.payload)).data;
    return { id, accessToken };
  },
};

module.exports = ServerTestHelper;
