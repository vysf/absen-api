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
   * 3. melakukan verifikasi access token
   * 4. mendapatan id user dari `useCaseParams`
   * 5. mendapatkan plain password dari `useCasePayload`
   * 6. melakukan pengecekan keberadaan user didalam database berdasarkan id
   * 7. melakukan hashing password menggunkan plain password
   * 8. melakukan perubahan data untuk password baru berdasarkan id user yang diperlukan
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
    await this._authenticationTokenManager.verifyAccessToken(accessToken);

    // #4
    const { id } = useCaseParams;

    // #5
    const { password: plainPassword } = useCasePayload;

    // #6
    await this._userRepository.checkUserIsExist(id);

    // #7
    const newPassword = await this._passwordHash.hash(plainPassword);

    // const { id: userId } = await this._authenticationTokenManager.decodePayload(accessToken);
    // const role = await this._userRepository.checkRole(userId);
    // if (role === 'dosen') {
    //   await this._userRepository.updateUserPasswordById(userId, newPassword);
    // }
    // await this._userRepository.updateUserPasswordById(id, newPassword);

    // jika access token berisi id dengan role admin, maka dapat mengubah password sendiri
    // dan password user lain
    // - accessToken.id (role: admin) -> updateUserPasswordById(useCaseParams.id, newPassword)
    // jika access token berisi id dengan role dosen, maka hanya bisa mengubah password sendiri
    // - accessToken.id (role: dosen) -> updateUserPasswordById(accessToken.id, newPassword)

    // #8
    await this._userRepository.updateUserPasswordById(id, newPassword);
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
