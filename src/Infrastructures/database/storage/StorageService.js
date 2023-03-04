/* istanbul ignore file */
/* eslint-disable camelcase */

// fs buat jadi this._fileSystem dan Date jadi this._dateGenerator
// test semua Uncovered Line
// lebih baik file ini masuk ke repository, ubah jadi UploadRepositoryStorage
const fs = require('fs');
const UploadRepository = require('../../../Domains/uploads/UploadRepository');

class StorageService extends UploadRepository {
  constructor(folder) {
    super();
    this._folder = folder;

    if (!fs.existsSync(folder)) {
      fs.mkdirSync(folder, { recursive: true });
    }
  }

  // fungsi dengan nama writeFile yang menerima satu parameter
  // yaitu file yang merupakan Readable dan objek meta yang
  // mengandung informasi dari berkas yang akan ditulis seperti
  // nama berkas, content-type, dan sebagainya.
  writeFile(file, meta) {
    const filename = +new Date() + meta.filename;
    const path = `${this._folder}/${filename}`;

    const fileStream = fs.createWriteStream(path);

    return new Promise((resolve, reject) => {
      fileStream.on('error', (error) => reject(error));
      file.pipe(fileStream);
      file.on('end', () => resolve(filename));
    });
  }
}

module.exports = StorageService;
