/* eslint-disable class-methods-use-this */
class GetUsersUseCase {
  constructor({ userRepository }) {
    this.userRepository = userRepository;
  }

  async execute(useCasePayload) {
    this._validatePayload(useCasePayload);
    const { role } = useCasePayload;
    const users = await this.userRepository.getUsers(role);

    return users;
  }

  _validatePayload(payload) {
    const { role } = payload;
    if (!role) {
      throw new Error('GET_USERS_USE_CASE.NOT_CONTAIN_ROLE');
    }

    if (typeof role !== 'string') {
      throw new Error('GET_USERS_USE_CASE.PAYLOAD_NOT_MEET_DATA_TYPE_SPECIFICATION');
    }
  }
}

module.exports = GetUsersUseCase;
