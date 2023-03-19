/**
 * @class DeleteUserUseCase
 * @classdesc alur bisnis untuk menghapus user
 */
class DeleteUserUseCase {
  /**
   * konstruktor untuk depedensi yang dibutuhkan
   * @param {object} userRepository repository user service
   * @param {object} authenticationTokenManager autentikasi token manager service
   * @see {@link src/infrastructures/repository}
   * @see {@link src/infrastructures/security}
   */
  constructor({ userRepository, authenticationTokenManager }) {
    this._userRepository = userRepository;
    this._authenticationTokenManager = authenticationTokenManager;
  }

  /**
   * Triger untuk menjalankan alur bisnis.
   *
   * > **Hanya admin yang dapat menghapus data user**
   *
   * Adapun algoritma yang berjalan adalah:
   * 1. mendapatkan access token dari `useCaseHeader`
   * 2. melakukan verifikasi dan melakukan decode access token untuk mendapatkan id
   * 3. mendapatkan id dari `useCaseParams` dan melakukan pengecekan daftar user
   * 4. melakukan verifikasi role user adalah admin atau bukan
   * 5. menghapus user dari database menggunakan id dari `useCaseParams`
   *
   * @param {object} useCaseParams parameter berupa id user
   * @param {object} useCaseHeader http header
   */
  async execute(useCaseParams, useCaseHeader) {
    // #1
    const accessToken = await this._authenticationTokenManager
      .getTokenFromHeader(useCaseHeader.authorization);

    // #2
    await this._authenticationTokenManager.verifyAccessToken(accessToken);
    const { id: userId } = await this._authenticationTokenManager.decodePayload(accessToken);

    // #3
    const { id } = useCaseParams;
    await this._userRepository.checkUserIsExist(id);

    // #4
    await this._userRepository.verifyAdmin(userId);

    // #5
    await this._userRepository.deleteUserById(id);
  }
}

module.exports = DeleteUserUseCase;
