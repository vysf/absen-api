/* eslint-disable max-classes-per-file */
const fs = require('fs');
const { PassThrough } = require('stream');
const UploadRepositoryStorage = require('../UploadRepositoryStorage');
const UploadRepository = require('../../../Domains/uploads/UploadRepository');
const InvariantError = require('../../../Commons/exceptions/InvariantError');

jest.mock('fs');
describe('UploadRepositoryStorage', () => {
  beforeAll(() => {
    fs.rmSync('./src/Infrastructures/storage', { recursive: true, force: true });
  });

  it('should an instance of UploadRepository and make storage directory if it does not exist', () => {
    // Arrange
    const folder = './src/Infrastructures/storage/file/images';
    const fsExistsSync = jest.spyOn(fs, 'existsSync');
    const fsMkdirSync = jest.spyOn(fs, 'mkdirSync');

    // Action
    const uploadRepositoryStorage = new UploadRepositoryStorage(folder, fs, {});

    // Assert
    expect(uploadRepositoryStorage).toBeInstanceOf(UploadRepository);
    expect(fsExistsSync).toBeCalledWith(folder);
    expect(fsMkdirSync).toBeCalledWith(folder, { recursive: true });
  });

  describe('writeFile function', () => {
    it('should throw error if file is empty', async () => {
      // Arrange
      const folder = './src/Infrastructures/storage/file/images';
      class FakeDate {
        static now = () => '1678002996136';
      }
      const uploadRepositoryStorage = new UploadRepositoryStorage(folder, fs, FakeDate);

      const mockReadable = new PassThrough();
      const mockFilePath = {};
      const mockWriteable = new PassThrough();
      fs.createWriteStream.mockReturnValueOnce(mockWriteable);
      const mockError = new Error('You crossed the streams!');

      // Action
      const writeFile = uploadRepositoryStorage.writeFile(mockReadable, mockFilePath);
      mockReadable.emit('error', mockError);

      // Assert
      await expect(writeFile).rejects.toThrow(InvariantError);
    });

    it('should save image inside storage/file/images directory', async () => {
      // Arrange
      const folder = './src/Infrastructures/storage/file/images';
      class FakeDate {
        static now = () => '1678002996136';
      }
      const uploadRepositoryStorage = new UploadRepositoryStorage(folder, fs, FakeDate);

      const mockFilePath = {
        filename: 'image.png',
      };
      const mockReadable = new PassThrough();
      const mockWriteable = new PassThrough();
      fs.createWriteStream.mockReturnValueOnce(mockWriteable);

      const filename = FakeDate.now() + mockFilePath.filename;
      const imagelocation = `${folder}/${filename}`;
      const fsCreateWriteStream = jest.spyOn(fs, 'createWriteStream');

      // Action
      const writeFile = uploadRepositoryStorage.writeFile(mockReadable, mockFilePath);

      setTimeout(() => {
        mockReadable.emit('data', 'beep!');
        mockReadable.emit('data', 'boop!');
        mockReadable.emit('end');
      }, 100);

      // Assert
      // await expect(writeFile).rejects.toEqual(mockError);
      await expect(writeFile).resolves.toEqual(filename);
      expect(fsCreateWriteStream).toBeCalledWith(imagelocation);
    });
  });
});
