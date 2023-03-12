class UsersHandler {
  constructor(injection) {
    this._container = injection;

    this.postUserHandler = this.postUserHandler.bind(this);
    this.getUsersHandler = this.getUsersHandler.bind(this);
    this.getUserByIdHandler = this.getUserByIdHandler.bind(this);
    this.updateUserByIdHandler = this.updateUserByIdHandler.bind(this);
    this.deleteUserByIdHandler = this.deleteUserByIdHandler.bind(this);
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

  async getUsersHandler(request, h) {
    const { getUsersUseCase } = this._container;
    const users = await getUsersUseCase.execute({ role: 'dosen' });

    const response = h.response({
      status: 'success',
      data: {
        users,
      },
    });
    response.code(200);
    return response;
  }

  async getUserByIdHandler(request, h) {
    const { getUserUseCase } = this._container;
    const user = await getUserUseCase.execute(request.params);

    const response = h.response({
      status: 'success',
      data: {
        user,
      },
    });
    response.code(200);
    return response;
  }

  async updateUserByIdHandler(request, h) {
    const { updateUserUseCase } = this._container;

    const { password } = request.payload;

    if (password) {
      await this.updateUserPasswordByIdHandler(request, h);
    }

    await updateUserUseCase.execute(request.payload, request.params, request.headers);

    const response = h.response({
      status: 'success',
      message: 'data berhasil diubah',
    });
    response.code(201);
    return response;
  }

  async updateUserPasswordByIdHandler(request, h) {
    const { updateUserPasswordUseCase } = this._container;

    await updateUserPasswordUseCase.execute(request.payload, request.params, request.headers);

    const response = h.response({
      status: 'success',
      message: 'data berhasil diubah',
    });
    response.code(201);
    return response;
  }

  async deleteUserByIdHandler(request, h) {
    const { deleteUserUseCase } = this._container;
    await deleteUserUseCase.execute(request.params, request.headers);

    const response = h.response({
      status: 'success',
      message: 'data berhasil diubah',
    });
    response.code(201);
    return response;
  }
}

module.exports = UsersHandler;
