const UpdateUser = require('../../Domains/users/entities/UpdateUser');

class UpdateUserUseCase {
  constructor({ userRepository }) {
    this._userRepository = userRepository;
  }

  async execute(useCasePayload, useCaseParams) {
    const { id } = useCaseParams;
    const userDetail = await this._userRepository.getUserById(id);
    const updatedUser = await this._userRepository
      .updateUser(id, new UpdateUser({ ...userDetail, ...useCasePayload }));

    return updatedUser;
  }
}

module.exports = UpdateUserUseCase;
