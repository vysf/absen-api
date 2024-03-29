/* eslint-disable camelcase */
const InvariantError = require('../../Commons/exceptions/InvariantError');
const NotFoundError = require('../../Commons/exceptions/NotFoundError');
const AuthorizationError = require('../../Commons/exceptions/AuthorizationError');
const RegisteredUser = require('../../Domains/users/entities/RegisteredUser');
const UserDetail = require('../../Domains/users/entities/UserDetail');
const UserRepository = require('../../Domains/users/UserRepository');

class UserRepositoryPostgres extends UserRepository {
  constructor(pool, idGenerator, dateGenerator) {
    super();
    this._pool = pool;
    this._idGenerator = idGenerator;
    this._dateGenerator = dateGenerator;
  }

  async verifyAvailableUsername(username) {
    const query = {
      text: 'SELECT username FROM users WHERE username = $1',
      values: [username],
    };

    const result = await this._pool.query(query);

    if (result.rowCount) {
      throw new InvariantError('Username tidak tersedia');
    }
  }

  async addUser(registerUser) {
    const { username, password, fullname } = registerUser;
    const id = `user-${this._idGenerator(12)}`;
    const role = 'dosen';
    const createdAt = new this._dateGenerator().toISOString();
    const updatedAt = createdAt;

    const query = {
      text: 'INSERT INTO users VALUES($1, $2, $3, $4, $5, $6, $7) RETURNING id, username, fullname',
      values: [id, username, password, fullname, role, createdAt, updatedAt],
    };

    const result = await this._pool.query(query);

    return new RegisteredUser({ ...result.rows[0] });
  }

  async getPasswordByUsername(username) {
    const query = {
      text: 'SELECT password FROM users WHERE username = $1',
      values: [username],
    };

    const result = await this._pool.query(query);

    if (!result.rowCount) {
      throw new InvariantError('Username tidak ditemukan');
    }

    return result.rows[0].password;
  }

  async getIdByUsername(username) {
    const query = {
      text: 'SELECT id FROM users WHERE username = $1',
      values: [username],
    };

    const result = await this._pool.query(query);

    if (!result.rowCount) {
      throw new InvariantError('User tidak ditemukan');
    }

    const { id } = result.rows[0];

    return id;
  }

  async getUsers(role) {
    const query = {
      text: 'SELECT * FROM users WHERE role = $1 AND is_delete = FALSE',
      values: [role],
    };

    const result = await this._pool.query(query);

    return result.rows.map((user) => new UserDetail({
      createdAt: user.created_at,
      updatedAt: user.updated_at,
      jabatanFungsional: user.jabatan_fungsional,
      jabatanStruktural: user.jabatan_struktural,
      statusKehadiran: user.status_kehadiran,
      photoUrl: user.photo_url,
      ...user,
    }));
  }

  async getUserById(id) {
    const query = {
      text: 'SELECT * FROM users WHERE id = $1',
      values: [id],
    };

    const result = await this._pool.query(query);

    if (!result.rowCount) {
      throw new NotFoundError('User tidak ditemukan');
    }

    return new UserDetail({
      updatedAt: result.rows[0].updated_at,
      createdAt: result.rows[0].created_at,
      jabatanFungsional: result.rows[0].jabatan_fungsional,
      jabatanStruktural: result.rows[0].jabatan_struktural,
      statusKehadiran: result.rows[0].status_kehadiran,
      photoUrl: result.rows[0].photo_url,
      ...result.rows[0],
    });
  }

  async checkUserIsExist(id) {
    const query = {
      text: 'SELECT * FROM users WHERE id = $1',
      values: [id],
    };

    const result = await this._pool.query(query);

    if (!result.rowCount) {
      throw new NotFoundError('User tidak ditemukan');
    }
  }

  async updateUser(id, updateUser) {
    const {
      fullname, golongan, nip,
      nidn, pangkat, jabatanStruktural,
      jabatanFungsional, statusKehadiran,
      photoUrl,
    } = updateUser;

    const query = {
      text: `UPDATE users 
      SET fullname = $1, 
      golongan = $2, 
      nip = $3, 
      nidn = $4,
      pangkat = $5, 
      jabatan_struktural = $6,
      jabatan_fungsional = $7,
      status_kehadiran = $8,
      photo_url = $9 
      WHERE id = $10`,
      values: [
        fullname, golongan,
        nip, nidn, pangkat,
        jabatanStruktural,
        jabatanFungsional,
        statusKehadiran, photoUrl, id,
      ],
    };

    const result = await this._pool.query(query);

    if (!result.rowCount) {
      throw new NotFoundError('Gagal memperbarui user. Id tidak ditemukan');
    }
  }

  async deleteUserById(id) {
    const query = {
      text: 'UPDATE users SET is_delete = TRUE WHERE id = $1',
      values: [id],
    };

    const result = await this._pool.query(query);

    if (!result.rowCount) {
      throw new NotFoundError('User tidak ditemukan');
    }
  }

  async updateUserPasswordById(id, password) {
    const query = {
      text: 'UPDATE users SET password = $1 WHERE id = $2',
      values: [password, id],
    };

    const result = await this._pool.query(query);

    if (!result.rowCount) {
      throw new NotFoundError('User tidak ditemukan');
    }
  }

  async addPhotoProfile(id, photoUrl) {
    const query = {
      text: 'UPDATE users SET photo_url = $1 WHERE id = $2',
      values: [photoUrl, id],
    };

    const result = await this._pool.query(query);

    if (!result.rowCount) {
      throw new NotFoundError('User tidak ditemukan');
    }
  }

  async verifyAdmin(id) {
    const query = {
      text: 'SELECT role FROM users WHERE id = $1',
      values: [id],
    };

    const result = await this._pool.query(query);

    if (!result.rowCount) {
      throw new NotFoundError('User tidak ditemukan');
    }

    const { role } = result.rows[0];

    if (role !== 'admin') {
      throw new AuthorizationError('Anda tidak berhak mengakses resource ini');
    }
  }

  async checkRole(id) {
    const query = {
      text: 'SELECT role FROM users WHERE id = $1',
      values: [id],
    };

    const result = await this._pool.query(query);

    if (!result.rowCount) {
      throw new NotFoundError('User tidak ditemukan');
    }

    return result.rows[0].role;
  }
}

module.exports = UserRepositoryPostgres;
