/* eslint-disable class-methods-use-this */
class UpdateUserPasswordUseCase {
  constructor({ userRepository, passwordHash }) {
    this._userRepository = userRepository;
    this._passwordHash = passwordHash;
  }

  async execute(useCasePayload, useCaseParams) {
    this._verifyPayload(useCasePayload);
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
