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
    golongan = '4A',
    nip = '1999150320241503',
    nidn = '20241503',
    pangakat = 'Penata',
    jabatanStruktural = 'Lektor',
    jabatanFungsional = 'Pranata 1',
    statusKehadiran = 'hadir',
  }) {
    const query = {
      text: 'INSERT INTO users VALUES($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14)',
      values: [
        id, username,
        password, fullname,
        role, createdAt,
        updatedAt, golongan,
        nip, nidn, pangakat,
        jabatanStruktural,
        jabatanFungsional,
        statusKehadiran,
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

  async cleanTable() {
    await pool.query('DELETE FROM users WHERE 1=1');
  },
};

module.exports = UsersTableTestHelper;
