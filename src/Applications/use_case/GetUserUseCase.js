/* eslint-disable class-methods-use-this */
/**
 * @class GetUserUseCase
 * @classdesc Alur bisnis untuk mendapatkan data seorang user
 */
class GetUserUseCase {
  /**
   * konstrutor depedensi yang dibutuhkan
   * @param {object} userRepository repositori user servis
   * @see {@link src/infrastructures/repository}
   */
  constructor({ userRepository }) {
    this._userRepository = userRepository;
  }

  /**
   * Mendapatkan data seorang user.\
   * Adapun algortima yang berjalan adalah:
   * 1. melakukan cek pada `useCasePayload` agar sesuai dengan input yang diinginkan
   * 2. mendapatkan id dari `useCasePayload`
   * 3. mendapatkan data use menggunakan id dari database
   * 4. mengirimkan data user
   *
   * @param {object} useCasePayload payload berupa id
   * @returns {object} data user
   */
  async execute(useCasePayload) {
    // #1
    this._verifyPayload(useCasePayload);

    // #2
    const { id } = useCasePayload;

    // #3
    const user = await this._userRepository.getUserById(id);

    // #4
    return user;
  }

  /**
   * melakukan vefisikasi payload: tidak boleh kosong dan harus berupa string
   * @param {object} payload berisi id
   */
  _verifyPayload(payload) {
    const { id } = payload;

    if (!id) {
      throw new Error('GET_USER_USE_CASE.NOT_CONTAIN_ID');
    }

    if (typeof id !== 'string') {
      throw new Error('GET_USER_USE_CASE.PAYLOAD_NOT_MEET_DATA_TYPE_SPECIFICATION');
    }
  }
}

module.exports = GetUserUseCase;
