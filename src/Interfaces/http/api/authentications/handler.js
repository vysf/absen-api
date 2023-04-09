class AuthenticationsHandler {
  constructor(injection) {
    this._container = injection;

    this.postAuthenticationHandler = this.postAuthenticationHandler.bind(this);
    this.putAuthenticationHandler = this.putAuthenticationHandler.bind(this);
    this.deleteAuthenticationHandler = this.deleteAuthenticationHandler.bind(this);
  }

  async postAuthenticationHandler(request, h) {
    const { loginUserUseCase } = this._container;
    const { accessToken, refreshToken, role } = await loginUserUseCase.execute(request.payload);
    const response = h.response({
      status: 'success',
      data: {
        accessToken,
        refreshToken,
        role,
      },
    });
    response.code(201);
    return response;
  }

  async putAuthenticationHandler(request) {
    const { refreshAuthenticationUseCase } = this._container;
    const accessToken = await refreshAuthenticationUseCase.execute(request.payload);

    return {
      status: 'success',
      data: {
        accessToken,
      },
    };
  }

  async deleteAuthenticationHandler(request) {
    const { logoutUserUseCase } = this._container;
    await logoutUserUseCase.execute(request.payload);
    return {
      status: 'success',
    };
  }
}

module.exports = AuthenticationsHandler;
