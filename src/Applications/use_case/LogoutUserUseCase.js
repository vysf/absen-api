/* eslint-disable class-methods-use-this */

/**
 * @class LogoutUserUseCase
 * @classdesc alur bisnis untuk logout user
 */
class LogoutUserUseCase {
  /**
   * kontruktor untuk dependesi yang dibutuhkan
   * @param {object} authenticationRepository authentikasi service
   * @see {@link src/infrastructures/repository}
   */
  constructor({
    authenticationRepository,
  }) {
    this._authenticationRepository = authenticationRepository;
  }

  /**
   * Triger untuk menjalankan alur bisnis.\
   * Adapun algoritma yang berjalan adalah:
   * 1. melakukan cek `useCasePayload` agas sesuai dengan input yang diinginkan
   * 2. melakukan cek ketersedian refresh token didalam database
   * 3. menghapus refresh token yang ada didalam database
   *
   * @param {object} useCasePayload payload berupa refresh token
   */
  async execute(useCasePayload) {
    // #1
    this._validatePayload(useCasePayload);
    const { refreshToken } = useCasePayload;

    // #2
    await this._authenticationRepository.checkAvailabilityToken(refreshToken);

    // #3
    await this._authenticationRepository.deleteToken(refreshToken);
  }

  /**
   * melakukan validasi payload: payload tidak boleh kosong dan harus tipe data `string`
   * @param {object} payload berisi refresh token
   */
  _validatePayload(payload) {
    const { refreshToken } = payload;
    if (!refreshToken) {
      throw new Error('DELETE_AUTHENTICATION_USE_CASE.NOT_CONTAIN_REFRESH_TOKEN');
    }

    if (typeof refreshToken !== 'string') {
      throw new Error('DELETE_AUTHENTICATION_USE_CASE.PAYLOAD_NOT_MEET_DATA_TYPE_SPECIFICATION');
    }
  }
}

module.exports = LogoutUserUseCase;
