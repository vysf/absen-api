/* eslint-disable class-methods-use-this */
class DeleteUserUseCase {
  constructor({ userRepository }) {
    this._userRepository = userRepository;
  }

  async execute(useCaseParams) {
    this._verifyPayload(useCaseParams);
    const { id } = useCaseParams;
    await this._userRepository.checkUserIsExist(id);
    await this._userRepository.deleteUserById(id);
  }

  _verifyPayload(payload) {
    const { id } = payload;

    if (!id) {
      throw new Error('DELETE_USER_USE_CASE.NOT_CONTAIN_ID');
    }

    if (typeof id !== 'string') {
      throw new Error('DELETE_USER_USE_CASE.PAYLOAD_NOT_MEET_DATA_TYPE_SPECIFICATION');
    }
  }
}

module.exports = DeleteUserUseCase;
