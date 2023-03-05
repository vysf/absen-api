/* eslint-disable class-methods-use-this */
/* eslint-disable camelcase */

// fs buat jadi this._fileSystem dan Date jadi this._dateGenerator
// test semua Uncovered Line
// lebih baik file ini masuk ke repository, ubah jadi UploadRepositoryStorage
// const InvariantError = require('../../Commons/exceptions/InvariantError');
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

  // fungsi dengan nama writeFile yang menerima satu parameter
  // yaitu file yang merupakan Readable dan objek meta yang
  // mengandung informasi dari berkas yang akan ditulis seperti
  // nama berkas, content-type, dan sebagainya.
  writeFile(file, meta) {
    const filename = this._dateGenerator.now() + meta.filename;
    const path = `${this._folder}/${filename}`;

    const fileStream = this._fileSystem.createWriteStream(path);

    return new Promise((resolve, reject) => {
      fileStream.on('error', () => reject(new InvariantError('file stream kosong')));

      file
        .on('error', () => reject(new InvariantError('file kosong')))
        .pipe(fileStream)
        .on('finish', () => resolve(filename));
    });
  }
}

module.exports = UploadRepositoryStorage;
