const UserLogin = require('../../Domains/users/entities/UserLogin');
const NewAuthentication = require('../../Domains/authentications/entities/NewAuth');

/**
 * @class LoginUserUseCase
 * @description alur bisnis untuk login user
 */
class LoginUserUseCase {
  /**
   * konstrutor modul yang dibutuhkan
   * @param {object} userRepository repository user service
   * @param {object} authenticationRepository authentikasi service
   * @param {object} authenticationTokenManager authentikasi token manager service
   * @param {object} passwordHash password hash service
   * @see {@link src/infrastructures/repository}
   * @see {@link src/infrastructures/security}
   */
  constructor({
    userRepository,
    authenticationRepository,
    authenticationTokenManager,
    passwordHash,
  }) {
    this._userRepository = userRepository;
    this._authenticationRepository = authenticationRepository;
    this._authenticationTokenManager = authenticationTokenManager;
    this._passwordHash = passwordHash;
  }

  /**
   * Triger untuk menjalankan alur bisnis.\
   * Adapun algoritma yang berjalan adalah:
   * 1. melakukan cek `useCasePayload` agar sesuai dengan input yang diinginkan
   * 2. mendapatkan password dari database berdasarkan username yang diberikan
   * 3. melakukan komparasi terhadap password yang diinputkan dengan password yang
   * disimpan didalam database
   * 4. mendapatkan id berdasarkan username
   * 5. buat access token dan refresh token dengan input username dan id
   * 6. menyimpan refresh token kedalam database
   * 7. mengirimkan access token dan refresh token ke user
   *
   * @param {object} useCasePayload payload berupa username dan password
   * @returns {object} newAuthentication mengembalikan refresh token dan access token
   */
  async execute(useCasePayload) {
    // #1
    const { username, password } = new UserLogin(useCasePayload);

    // #2
    const encryptedPassword = await this._userRepository.getPasswordByUsername(username);

    // #3
    await this._passwordHash.comparePassword(password, encryptedPassword);

    // #4
    const id = await this._userRepository.getIdByUsername(username);
    const role = await this._userRepository.checkRole(id);

    // #5
    const accessToken = await this._authenticationTokenManager
      .createAccessToken({ username, id, role });
    const refreshToken = await this._authenticationTokenManager
      .createRefreshToken({ username, id, role });

    const newAuthentication = new NewAuthentication({
      accessToken,
      refreshToken,
    });

    // #6
    await this._authenticationRepository.addToken(newAuthentication.refreshToken);

    // #7
    return newAuthentication;
  }
}

module.exports = LoginUserUseCase;
