/* eslint-disable camelcase */
exports.up = (pgm) => {
  pgm.createTable('users', {
    id: {
      type: 'VARCHAR(50)',
      primaryKey: true,
    },
    username: {
      type: 'VARCHAR(50)',
      notNull: true,
      unique: true,
    },
    password: {
      type: 'TEXT',
      notNull: true,
    },
    fullname: {
      type: 'TEXT',
      notNull: true,
    },
    golongan: {
      type: 'VARCHAR(6)',
    },
    nip: {
      type: 'VARCHAR(18)',
    },
    nidn: {
      type: 'VARCHAR(10)',
    },
    pangkat: {
      type: 'VARCHAR(23)',
    },
    role: {
      type: 'TEXT',
      notNull: true,
    },
    jabatan_struktural: {
      type: 'VARCHAR(50)',
    },
    jabatan_fungsional: {
      type: 'VARCHAR(50)',
    },
    status_kehadiran: {
      type: 'VARCHAR(50)',
    },
    created_at: {
      type: 'TEXT',
      notNull: true,
    },
    updated_at: {
      type: 'TEXT',
      notNull: true,
    }
  });
};

exports.down = (pgm) => {
  pgm.dropTable('users');
};
