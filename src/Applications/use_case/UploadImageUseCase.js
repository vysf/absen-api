/* eslint-disable class-methods-use-this */
const UpdateUser = require('../../Domains/users/entities/UpdateUser');

class UploadImageUseCase {
  constructor({ uploadRepository, userRepository }) {
    this.uploadRepository = uploadRepository;
    this.userRepository = userRepository;
  }

  // photo.hapi tidak boleh ada disini, masukan kedalam payload
  // nanti diubah yaaaaa
  async execute(useCasePayload, useCaseParams) {
    const { id } = useCaseParams;
    const { photo } = useCasePayload;

    this._validateImageHeaders(photo.hapi.headers);

    const filename = await this.uploadRepository.writeFile(photo, photo.hapi);
    const fileLocation = `http://${process.env.HOST}:${process.env.PORT}/upload/images/${filename}`;

    const userDetail = await this.userRepository.getUserById(id);

    const updatedUser = await this.userRepository
      .updateUser(id, new UpdateUser({ ...userDetail, photoUrl: fileLocation }));

    return updatedUser;
  }

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
