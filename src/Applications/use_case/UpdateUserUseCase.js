const UpdateUser = require('../../Domains/users/entities/UpdateUser');

/**
 * @class UpdateUserUseCase
 * @classdesc Alur bisnis untuk mengubah data user
 */
class UpdateUserUseCase {
  /**
   * konstruksi depedensi yang dibutuhkan
   * @param {object} userRepository user repository service
   * @param {object} authenticationTokenManager autentikasi token meneger service
   * @see {@link src/infrastructures/repository}
   * @see {@link src/infrastructures/security}
   */
  constructor({ userRepository, authenticationTokenManager }) {
    this._userRepository = userRepository;
    this._authenticationTokenManager = authenticationTokenManager;
  }

  /**
   * Triger untuk menjalankan alur bisnis.\
   * Adapun algoritma yang berjalan adalah:
   * 1. mendapatkan access token dari `useCaseHeader`
   * 2. melakukan verifikasi access token
   * 3. mendapatkan id user dari `useCaseParams`
   * 4. Jika role adalah admin maka dia bisa mengubah data sendiri dan user lain
   * (id -> useCaseParams)
   * 5. jika role adalah dosen maka dia hanya bisa mengubah data sendiri
   * (id -> accessToken)
   * @param {object} useCasePayload payload berupa data yang akan diubah:
   * diatur oleh UpdateUser enttities
   * @param {object} useCaseParams param berupa id user yang akan diubah
   * @param {object} useCaseHeader http header
   */
  async execute(useCasePayload, useCaseParams, useCaseHeader) {
    // #1
    const accessToken = await this._authenticationTokenManager
      .getTokenFromHeader(useCaseHeader.authorization);

    const { id: userId } = await this._authenticationTokenManager.decodePayload(accessToken);

    // #2
    await this._authenticationTokenManager.verifyAccessToken(accessToken);

    // #3
    const { id } = useCaseParams;

    // #4
    const role = await this._userRepository.checkRole(userId);
    if (role === 'admin') {
      const adminDetail = await this._userRepository.getUserById(id);
      await this._userRepository
        .updateUser(id, new UpdateUser({ ...adminDetail, ...useCasePayload }));
    }

    const userDetail = await this._userRepository.getUserById(userId);

    // #5
    await this._userRepository
      .updateUser(userId, new UpdateUser({ ...userDetail, ...useCasePayload }));
  }
}

module.exports = UpdateUserUseCase;
