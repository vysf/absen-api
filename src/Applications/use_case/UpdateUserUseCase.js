const UpdateUser = require('../../Domains/users/entities/UpdateUser');

class UpdateUserUseCase {
  constructor({ userRepository }) {
    this.userRepository = userRepository;
  }

  async execute(useCasePayload, useCaseParams) {
    const { id } = useCaseParams;
    const userDetail = await this.userRepository.getUserById(id);
    const updatedUser = await this.userRepository
      .updateUser(id, new UpdateUser({ ...userDetail, ...useCasePayload }));

    return updatedUser;
  }
}

module.exports = UpdateUserUseCase;
