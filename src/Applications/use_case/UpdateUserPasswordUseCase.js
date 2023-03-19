/* eslint-disable class-methods-use-this */
/**
 * @class UpdateUserPasswordUseCase
 * @classdesc Alur bisnis untuk mengubah password user
 */
class UpdateUserPasswordUseCase {
  /**
   * konstruksi depedensi yang dibutuhkan
   * @param {object} userRepository user repositori servis
   * @param {object} passwordHash password hash servis
   * @param {object} authenticationTokenManager autentikasi token meneger servis
   * @see {@link src/infrastructures/repository}
   * @see {@link src/infrastructures/security}
   */
  constructor({ userRepository, passwordHash, authenticationTokenManager }) {
    this._userRepository = userRepository;
    this._passwordHash = passwordHash;
    this._authenticationTokenManager = authenticationTokenManager;
  }

  /**
   * Triger untuk menjalankan alur bisnis.\
   * Adapun algoritma yang berjalan adalah:
   * 1. melakukan cek `useCasePayload` agar input sesuai dengan yang diinginkan
   * 2. mendapatkan access token dari `useCaseHeader`
   * 3. melakukan decode untuk mendapatkan id dari access token
   * 4. melakukan verifikasi access token
   * 5. mendapatan id user dari `useCaseParams`
   * 6. mendapatkan plain password dari `useCasePayload`
   * 7. melakukan pengecekan keberadaan user didalam database berdasarkan id
   * 8. melakukan hashing password menggunkan plain password
   * 9. Jika role adalah admin maka dia bisa mengubah password sendiri dan user lain
   * 10. jika role adalh dosen maka dia hanya bisa mengubah password sendiri
   *
   * @param {object} useCasePayload payload berupa plain password
   * @param {object} useCaseParams param berupa id user
   * @param {object} useCaseHeader http header
   */
  async execute(useCasePayload, useCaseParams, useCaseHeader) {
    // #1
    this._verifyPayload(useCasePayload);

    // #2
    const accessToken = await this._authenticationTokenManager
      .getTokenFromHeader(useCaseHeader.authorization);

    // #3
    const { id: userId } = await this._authenticationTokenManager.decodePayload(accessToken);

    // #4
    await this._authenticationTokenManager.verifyAccessToken(accessToken);

    // #5
    const { id } = useCaseParams;

    // #6
    const { password: plainPassword } = useCasePayload;

    // #7
    await this._userRepository.checkUserIsExist(id);

    // #8
    const newPassword = await this._passwordHash.hash(plainPassword);

    // #9
    const role = await this._userRepository.checkRole(userId);
    if (role === 'admin') {
      await this._userRepository.updateUserPasswordById(id, newPassword);
    }

    // #10
    await this._userRepository.updateUserPasswordById(userId, newPassword);
  }

  /**
   * melakukan verifikasi payload: tidak boleh kosong dan harus tipe data `string`
   * @param {object} payload berisi plain password
   */
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
