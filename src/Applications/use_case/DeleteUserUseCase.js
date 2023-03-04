class DeleteUserUseCase {
  constructor({ userRepository }) {
    this._userRepository = userRepository;
  }

  async execute(useCaseParams) {
    const { id } = useCaseParams;
    await this._userRepository.checkUserIsExist(id);
    await this._userRepository.deleteUserById(id);
  }
}

module.exports = DeleteUserUseCase;
