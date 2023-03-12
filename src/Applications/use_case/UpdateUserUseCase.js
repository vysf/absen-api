const UpdateUser = require('../../Domains/users/entities/UpdateUser');

class UpdateUserUseCase {
  constructor({ userRepository, authenticationTokenManager }) {
    this._userRepository = userRepository;
    this._authenticationTokenManager = authenticationTokenManager;
  }

  async execute(useCasePayload, useCaseParams, useCaseHeader) {
    const accessToken = await this._authenticationTokenManager
      .getTokenFromHeader(useCaseHeader.authorization);
    await this._authenticationTokenManager.verifyAccessToken(accessToken);

    const { id } = useCaseParams;
    const userDetail = await this._userRepository.getUserById(id);
    const updatedUser = await this._userRepository
      .updateUser(id, new UpdateUser({ ...userDetail, ...useCasePayload }));

    return updatedUser;
  }
}

module.exports = UpdateUserUseCase;
