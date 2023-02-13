const UploadRepository = require('../UploadRepository');

describe('UploadRepository interface', () => {
  it('should throw error when invoke abstract behavior', () => {
    // Arrange
    const uploadRepository = new UploadRepository();

    // Action and Assert
    expect(() => uploadRepository.writeFile({}, {})).toThrowError('UPLOAD_REPOSITORY.METHOD_NOT_IMPLEMENTED');
  });
});
