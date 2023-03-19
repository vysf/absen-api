const RegisterUser = require('../../Domains/users/entities/RegisterUser');

/**
 * @class AddUserUseCase
 * @description Alur bisnis untuk menambahkan user baru
 */
class AddUserUseCase {
  /**
   * kontruktor modul yang dibutuhkan
   * @param {object} userRepository repository user
   * @param {object} passwordHash password hash
   * @see {@link src/infrastructures/repository}
   * @see {@link src/infrastructures/security}
   */
  constructor({ userRepository, passwordHash }) {
    this._userRepository = userRepository;
    this._passwordHash = passwordHash;
  }

  /**
   * triger untuk menjalankan alur bisnis
   * @param {object} useCasePayload payload berupa username, password, fullname
   * @returns {object} RegisteredUser
   */
  async execute(useCasePayload) {
    const registerUser = new RegisterUser(useCasePayload);
    await this._userRepository.verifyAvailableUsername(registerUser.username);
    registerUser.password = await this._passwordHash.hash(registerUser.password);
    return this._userRepository.addUser(registerUser);
  }
}

module.exports = AddUserUseCase;
