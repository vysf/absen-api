/* istanbul ignore file */
const pool = require('../src/Infrastructures/database/postgres/pool');

const UsersTableTestHelper = {
  async addUser({
    id = 'user-123',
    username = 'dicoding',
    password = 'secret',
    fullname = 'Dicoding Indonesia',
    role = 'dosen',
    createdAt = '2023-02-07T04:53:09.010Z',
    updatedAt = '2023-02-07T04:53:09.010Z',
    golongan = null,
    nip = null,
    nidn = null,
    pangkat = null,
    jabatanStruktural = null,
    jabatanFungsional = null,
    statusKehadiran = null,
    photoUrl = null,
  }) {
    const query = {
      text: 'INSERT INTO users VALUES($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15)',
      values: [
        id, username,
        password, fullname,
        role, createdAt,
        updatedAt, golongan,
        nip, nidn, pangkat,
        jabatanStruktural,
        jabatanFungsional,
        statusKehadiran,
        photoUrl,
      ],
    };

    await pool.query(query);
  },

  async findUsersById(id) {
    const query = {
      text: 'SELECT * FROM users WHERE id = $1',
      values: [id],
    };

    const result = await pool.query(query);
    return result.rows;
  },

  async updateRole(id, role) {
    const query = {
      text: 'UPDATE users SET role = $1 WHERE id = $2',
      values: [role, id],
    };

    await pool.query(query);
  },

  async cleanTable() {
    await pool.query('DELETE FROM users WHERE 1=1');
  },
};

module.exports = UsersTableTestHelper;
