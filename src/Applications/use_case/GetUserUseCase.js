/* eslint-disable class-methods-use-this */
class GetUserUseCase {
  constructor({ userRepository }) {
    this._userRepository = userRepository;
  }

  async execute(useCasePayload) {
    this._verifyPayload(useCasePayload);
    const { id } = useCasePayload;
    const user = await this._userRepository.getUserById(id);

    return user;
  }

  _verifyPayload(payload) {
    const { id } = payload;

    if (!id) {
      throw new Error('GET_USER_USE_CASE.NOT_CONTAIN_ID');
    }

    if (typeof id !== 'string') {
      throw new Error('GET_USER_USE_CASE.PAYLOAD_NOT_MEET_DATA_TYPE_SPECIFICATION');
    }
  }
}

module.exports = GetUserUseCase;
