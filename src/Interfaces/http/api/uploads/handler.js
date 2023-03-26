class UploadsHandler {
  constructor(injection) {
    this._container = injection;

    this.postUploadPhotoHandler = this.postUploadPhotoHandler.bind(this);
  }

  async postUploadPhotoHandler(request, h) {
    const { uploadImageUseCase } = this._container;
    await uploadImageUseCase.execute(request.payload, request.params, request.headers);

    const response = h.response({
      status: 'success',
      message: 'foto profil berhasil diubah',
    });
    response.code(200);
    return response;
  }
}

module.exports = UploadsHandler;
