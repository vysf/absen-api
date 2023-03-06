/* eslint-disable no-new */
/* eslint-disable max-classes-per-file */
const fs = require('fs');
const path = require('path');
const UploadRepositoryStorage = require('../UploadRepositoryStorage');

describe('UploadRepositoryStorage', () => {
  beforeAll(() => {
    fs.rmSync('./src/Infrastructures/storage', { recursive: true, force: true });
  });

  const folder = './src/Infrastructures/storage/file/images';
  const filename = 'flower.jpg';
  const dateGenerator = {
    now: jest.fn(() => '20220305150000'),
  };

  describe('constructor', () => {
    it('should not create upload directory if it already exists', () => {
      // Arrange
      jest.spyOn(fs, 'existsSync').mockReturnValueOnce(true);
      const mkdirSync = jest.spyOn(fs, 'mkdirSync');

      // Act
      new UploadRepositoryStorage(folder, fs, dateGenerator);

      // Assert
      expect(mkdirSync).not.toHaveBeenCalled();
    });

    it('should create upload directory if it does not exist', () => {
      // Arrange
      jest.spyOn(fs, 'existsSync').mockReturnValueOnce(false);
      const mkdirSync = jest.spyOn(fs, 'mkdirSync');

      // Act
      new UploadRepositoryStorage(folder, fs, dateGenerator);

      // Assert
      expect(mkdirSync).toHaveBeenCalledWith(folder, { recursive: true });
    });
  });

  describe('_generateFilename', () => {
    it('should generate filename based on current date and original filename', () => {
      const originalFilename = 'example.png';
      const expectedFilename = `${dateGenerator.now()}example.png`;
      const uploadRepositoryStorage = new UploadRepositoryStorage(folder, fs, dateGenerator);

      const result = uploadRepositoryStorage._generateFilename(originalFilename);

      expect(result).toEqual(expectedFilename);
    });
  });

  describe('_getPath', () => {
    it('should generate full path to save file in based on folder and filename', () => {
      const expectedPath = `${folder}/${filename}`;
      const uploadRepositoryStorage = new UploadRepositoryStorage(folder, fs, dateGenerator);

      const result = uploadRepositoryStorage._getPath(filename);

      expect(result).toEqual(expectedPath);
    });
  });

  describe('writeFile function', () => {
    it('should save file and return filename', async () => {
      // Arrange
      const filePath = path.resolve('./tests/images', filename);
      const readable = fs.createReadStream(filePath);

      const repository = new UploadRepositoryStorage(folder, fs, dateGenerator);
      const meta = { filename };

      // Act
      const result = await repository.writeFile(readable, meta);

      // Assert
      expect(result).toEqual(expect.stringMatching(/20220305150000flower.jpg/));
      expect(fs.existsSync(path.join(folder, result))).toBe(true);

      // Clean up
      fs.unlinkSync(path.join(folder, result));
    });
  });
});
