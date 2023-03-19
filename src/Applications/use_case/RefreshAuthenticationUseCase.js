/* eslint-disable class-methods-use-this */
/**
 * @class RefreshAuthenticationUseCase
 * @classdesc alur bisnis untuk mendapatkan access token baru
 */
class RefreshAuthenticationUseCase {
  /**
   * konstruksi depedensi yang dibutuhkan
   * @param {object} authenticationRepository autentikasi repositori servis
   * @param {object} authenticationTokenManager authentikasi token meneger service
   * @see {@link src/infrastructures/repository}
   * @see {@link src/infrastructures/security}
   */
  constructor({
    authenticationRepository,
    authenticationTokenManager,
  }) {
    this._authenticationRepository = authenticationRepository;
    this._authenticationTokenManager = authenticationTokenManager;
  }

  /**
   * Triger untuk menjalankan alur bisnis.\
   * Adapun algortima yang berjalan adalah:
   * 1. melakukan cek `useCasePayload` agar sesuai dengan input yang diinginkan
   * 2. mendapatkan refresh token dari `useCasePayload`
   * 3. melakukan verifikasi refresh token
   * 4. melakukan pengecekan ketersedian refresh token didalam database
   * 5. melakukan decode refresh token utnuk mendapatkan id dan username
   * 6. membuat access token baru dan mengirimkanya ke user
   *
   * @param {object} useCasePayload payload berupa refresh token
   * @returns {string} access token
   */
  async execute(useCasePayload) {
    // #1
    this._verifyPayload(useCasePayload);

    // #2
    const { refreshToken } = useCasePayload;

    // #3
    await this._authenticationTokenManager.verifyRefreshToken(refreshToken);

    // #4
    await this._authenticationRepository.checkAvailabilityToken(refreshToken);

    // #5
    const { username, id } = await this._authenticationTokenManager.decodePayload(refreshToken);

    // #6
    return this._authenticationTokenManager.createAccessToken({ username, id });
  }

  /**
   * melakukan verifikasi payload: tidak boleh kosong dan harus tipe data `string`
   * @param {object} payload berisi refresh token
   */
  _verifyPayload(payload) {
    const { refreshToken } = payload;

    if (!refreshToken) {
      throw new Error('REFRESH_AUTHENTICATION_USE_CASE.NOT_CONTAIN_REFRESH_TOKEN');
    }

    if (typeof refreshToken !== 'string') {
      throw new Error('REFRESH_AUTHENTICATION_USE_CASE.PAYLOAD_NOT_MEET_DATA_TYPE_SPECIFICATION');
    }
  }
}

module.exports = RefreshAuthenticationUseCase;
