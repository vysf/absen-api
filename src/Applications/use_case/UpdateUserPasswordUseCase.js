/* eslint-disable class-methods-use-this */
class UpdateUserPasswordUseCase {
  constructor({ userRepository, passwordHash, authenticationTokenManager }) {
    this._userRepository = userRepository;
    this._passwordHash = passwordHash;
    this._authenticationTokenManager = authenticationTokenManager;
  }

  async execute(useCasePayload, useCaseParams, useCaseHeader) {
    this._verifyPayload(useCasePayload);
    const accessToken = await this._authenticationTokenManager
      .getTokenFromHeader(useCaseHeader.authorization);
    await this._authenticationTokenManager.verifyAccessToken(accessToken);

    const { id } = useCaseParams;
    const { password: plainPassword } = useCasePayload;

    await this._userRepository.checkUserIsExist(id);

    const newPassword = await this._passwordHash.hash(plainPassword);

    await this._userRepository.updateUserPasswordById(id, newPassword);
  }

  _verifyPayload(payload) {
    const { password } = payload;

    if (!password) {
      throw new Error('UPDATE_USER_PASSWORD_USE_CASE.NOT_CONTAIN_NEEDED_PROPERTY');
    }

    if (typeof password !== 'string') {
      throw new Error('UPDATE_USER_PASSWORD_USE_CASE.PAYLOAD_NOT_MEET_DATA_TYPE_SPECIFICATION');
    }
  }
}

module.exports = UpdateUserPasswordUseCase;
