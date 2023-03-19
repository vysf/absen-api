/* eslint-disable class-methods-use-this */
const UpdateUser = require('../../Domains/users/entities/UpdateUser');

/**
 * @class UploadImageUseCase
 * @classdesc Alur bisnis untuk mengubah foto profile user
 */
class UploadImageUseCase {
  /**
   * kontruksi dependensi yang dibutuhkan
   * @param {object} uploadRepository upload respository servis
   * @param {object} userRepository user respository servis
   * @see {@link src/infrastructures/repository}
   */
  constructor({ uploadRepository, userRepository, authenticationTokenManager }) {
    this._uploadRepository = uploadRepository;
    this._userRepository = userRepository;
    this._authenticationTokenManager = authenticationTokenManager;
  }

  // photo.hapi tidak boleh ada disini, masukan kedalam payload
  // nanti diubah yaaaaa
  /**
   * Triger untuk menjalankan alur bisnis.\
   * Adapun algoritma yang berjalan adalah:
   * 1. mendapatkan id dari `useCaseParams` dan photo dari `useCasePayload`
   * 2. melakukan validasi image header
   * 3. membuat filename dan menyimpan gambar di folder yang ditentukan\
   * see `infrastructures/injections`
   * 4. membuat url file location
   * 5. mendapatkan access token dari `useCaseHeader` dan melakukan verifikasi access token
   * 6. mendapatkan id dari access token
   * 7. jika role adalah admin maka dia dapat mengubah foto profil sendiri dan user lain
   * 8. jika role adalah dosen maka dia hanya dapat mengubah foto profil sendiri
   * 9. menyimpan perubahan gambar ke dalam database
   * @param {object} useCasePayload payload berupa stream photo
   * @param {object} useCaseParams param berupa id user
   */
  async execute(useCasePayload, useCaseParams, useCaseHeader) {
    // #1
    const { id } = useCaseParams;
    const { photo } = useCasePayload;

    // #2
    this._validateImageHeaders(photo.hapi.headers);

    // #3
    const filename = await this._uploadRepository.writeFile(photo, photo.hapi);

    // #4
    const fileLocation = `http://${process.env.HOST}:${process.env.PORT}/upload/images/${filename}`;

    // #5
    const accessToken = await this._authenticationTokenManager
      .getTokenFromHeader(useCaseHeader.authorization);
    await this._authenticationTokenManager.verifyAccessToken(accessToken);

    // #6
    const { id: userId } = await this._authenticationTokenManager.decodePayload(accessToken);

    // #7
    const role = await this._userRepository.checkRole(userId);
    if (role === 'admin') {
      const userDetail = await this._userRepository.getUserById(id);
      await this._userRepository
        .updateUser(id, new UpdateUser({ ...userDetail, photoUrl: fileLocation }));
    }

    // #8
    const userDetail = await this._userRepository.getUserById(id);

    // #9
    await this._userRepository
      .updateUser(id, new UpdateUser({ ...userDetail, photoUrl: fileLocation }));
  }

  /**
   * meakukan verifikasi payload: tidak boleh kosong dan harus merupakan data gambar
   * @param {object} payload berisi photo header
   */
  _validateImageHeaders(payload) {
    if (!payload['content-type']) {
      throw new Error('UPLOAD_IMAGE.NOT_CONTAIN_NEEDED_PROPERTY');
    }

    const imageMimeType = ['image/apng', 'image/avif', 'image/gif', 'image/jpeg', 'image/png', 'image/webp'].includes(payload['content-type']);
    if (!imageMimeType) {
      throw new Error('UPLOAD_IMAGE.NOT_MEET_MIME_TYPE_SPECIFICATION');
    }
  }
}

module.exports = UploadImageUseCase;
