const InvariantError = require('../../Commons/exceptions/InvariantError');
const UploadRepository = require('../../Domains/uploads/UploadRepository');

class UploadRepositoryStorage extends UploadRepository {
  constructor(folder, fileSystem, dateGenerator) {
    super();
    this._folder = folder;
    this._fileSystem = fileSystem;
    this._dateGenerator = dateGenerator;

    if (!this._fileSystem.existsSync(this._folder)) {
      this._fileSystem.mkdirSync(this._folder, { recursive: true });
    }
  }

  // Rename function to be more descriptive
  // Split function into smaller functions with descriptive names
  async writeFile(file, meta) {
    const filename = this._generateFilename(meta.filename);
    const path = this._getPath(filename);

    await this._createWriteStream(file, path);
    return filename;
  }

  // Generate filename based on current date and original filename
  _generateFilename(originalFilename) {
    return this._dateGenerator.now() + originalFilename;
  }

  // Generate full path to save file in based on folder and filename
  _getPath(filename) {
    return `${this._folder}/${filename}`;
  }

  // Create write stream for file and save it to path
  // Use async/await instead of returning a Promise
  async _createWriteStream(file, path) {
    const fileStream = this._fileSystem.createWriteStream(path);

    await new Promise((resolve, reject) => {
      fileStream.on('error', () => reject(new InvariantError('file stream kosong')));
      file.on('error', () => reject(new InvariantError('file kosong')))
        .pipe(fileStream)
        .on('finish', () => resolve());
    });
  }
}

module.exports = UploadRepositoryStorage;
