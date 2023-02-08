/* eslint-disable camelcase */
const InvariantError = require('../../Commons/exceptions/InvariantError');
const NotFoundError = require('../../Commons/exceptions/NotFoundError');
const RegisteredUser = require('../../Domains/users/entities/RegisteredUser');
const UserRepository = require('../../Domains/users/UserRepository');

class UserRepositoryPostgres extends UserRepository {
  constructor(pool, idGenerator) {
    super();
    this._pool = pool;
    this._idGenerator = idGenerator;
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
    const createdAt = new Date().toISOString();
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

    // harus diganti pakai entities
    return result.rows.map((user) => {
      const {
        password, created_at,
        updated_at, jabatan_fungsional,
        jabatan_struktural, status_kehadiran,
        is_delete, ...restData
      } = user;
      return {
        createdAt: user.created_at,
        updatedAt: user.updated_at,
        jabatanFungsional: user.jabatan_fungsional,
        jabatanStruktural: user.jabatan_struktural,
        statusKehadiran: user.status_kehadiran,
        ...restData,
      };
    });
  }

  async getUserById(id) {
    const query = {
      text: 'SELECT * FROM users WHERE id = $1',
      values: [id],
    };

    const result = await this._pool.query(query);

    // ganti jadi entities
    const {
      updated_at: updatedAt, created_at: createdAt,
      jabatan_fungsional: jabatanFungsional,
      jabatan_struktural: jabatanStruktural,
      status_kehadiran: statusKehadiran,
      is_delete, password, ...restData
    } = result.rows[0];

    return {
      updatedAt,
      createdAt,
      jabatanFungsional,
      jabatanStruktural,
      statusKehadiran,
      ...restData,
    };
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

  async updateUser(id, {
    fullname,
    golongan,
    nip,
    nidn,
    pangkat,
    jabatanStruktural,
    jabatanFungsional,
    statusKehadiran,
  }) {
    const query = {
      text: `UPDATE users 
      SET fullname = $1, 
      golongan = $2, 
      nip = $3, 
      nidn = $4,
      pangkat = $5, 
      jabatan_struktural = $6,
      jabatan_fungsional = $7,
      status_kehadiran = $8 
      WHERE id = $9`,
      values: [
        fullname, golongan,
        nip, nidn, pangkat,
        jabatanStruktural,
        jabatanFungsional,
        statusKehadiran, id,
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
}

module.exports = UserRepositoryPostgres;
