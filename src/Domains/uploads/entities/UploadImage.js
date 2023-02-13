/* eslint-disable class-methods-use-this */
class UploadImage {
  constructor(payload) {
    this._verifyPayload(payload);

    this.contentType = payload['content-type'];
  }

  _verifyPayload(payload) {
    if (!payload['content-type']) {
      throw new Error('UPLOAD_IMAGE.NOT_CONTAIN_NEEDED_PROPERTY');
    }

    const imageMimeType = ['image/apng', 'image/avif', 'image/gif', 'image/jpeg', 'image/png', 'image/webp'].includes(payload['content-type']);
    if (!imageMimeType) {
      throw new Error('UPLOAD_IMAGE.NOT_MEET_MIME_TYPE_SPECIFICATION');
    }
  }
}

module.exports = UploadImage;
