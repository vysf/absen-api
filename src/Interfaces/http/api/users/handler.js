class UsersHandler {
  constructor(injection) {
    this._container = injection;

    this.postUserHandler = this.postUserHandler.bind(this);
  }

  async postUserHandler(request, h) {
    const { addUserUseCase } = this._container;
    const addedUser = await addUserUseCase.execute(request.payload);

    const response = h.response({
      status: 'success',
      data: {
        addedUser,
      },
    });
    response.code(201);
    return response;
  }
}

module.exports = UsersHandler;
