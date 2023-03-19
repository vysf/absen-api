/* eslint-disable class-methods-use-this */
/**
 * @class GetUsersUseCase
 * @classdesc Alur bisnis untuk mendapatkan daftar user
 */
class GetUsersUseCase {
  /**
   * konstruksi depedensi yang dibutuhkan
   * @param {object} userRepository repository user service
   * @see {@link src/infrastructures/repository}
   */
  constructor({ userRepository }) {
    this._userRepository = userRepository;
  }

  /**
   * Mendapatkan daftar user. hanya user dengan role `dosen` saja yang ditampilkan.\
   * Adapun algoritma yang berjalan adalah:
   * 1. melakukan cek `useCasePayload` agar sesuai dengan input yang diinginkan
   * 2. mendapatkan role dari `useCasePayload`
   * 3. mendapatkan daftar user dengan role yang diinginkan
   * 4. mengirimkan daftar user
   *
   * @param {object} useCasePayload payload berupa role
   * @returns {array} daftar user
   */
  async execute(useCasePayload) {
    // #1
    this._validatePayload(useCasePayload);

    // #2
    const { role } = useCasePayload;

    // #3
    const users = await this._userRepository.getUsers(role);

    // #4
    return users;
  }

  /**
   * melakukan verifikasi payload: tidak boleh kosong dan harus tipe data `string`
   * @param {object} payload berisi role
   */
  _validatePayload(payload) {
    const { role } = payload;
    if (!role) {
      throw new Error('GET_USERS_USE_CASE.NOT_CONTAIN_ROLE');
    }

    if (typeof role !== 'string') {
      throw new Error('GET_USERS_USE_CASE.PAYLOAD_NOT_MEET_DATA_TYPE_SPECIFICATION');
    }
  }
}

module.exports = GetUsersUseCase;
