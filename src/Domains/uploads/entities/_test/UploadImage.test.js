const UploadImage = require('../UploadImage');

describe('UploadImage entities', () => {
  it('should throw error when payload does not contain needed', () => {
    // Arrange
    const payload = {};

    // Action & Assert
    expect(() => new UploadImage(payload)).toThrowError('UPLOAD_IMAGE.NOT_CONTAIN_NEEDED_PROPERTY');
  });

  it('should throw error when payload does not match specific mimetype', () => {
    // Arrange
    const payload = {
      'content-type': 'application/json',
    };

    // Action & Assert
    expect(() => new UploadImage(payload)).toThrowError('UPLOAD_IMAGE.NOT_MEET_MIME_TYPE_SPECIFICATION');
  });

  it('should create UploadImage entities correctly', () => {
    // Arrange
    const payload = {
      'content-type': 'image/apng',
    };

    // Action
    const uploadImage = new UploadImage(payload);

    // Assert
    expect(uploadImage).toBeInstanceOf(UploadImage);
    expect(uploadImage.contentType).toEqual(payload['content-type']);
  });
});
