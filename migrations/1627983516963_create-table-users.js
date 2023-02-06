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
    role: {
      type: 'TEXT',
      notNull: true,
    },
    created_at: {
      type: 'TEXT',
      notNull: true,
    },
    updated_at: {
      type: 'TEXT',
      notNull: true,
    },
    golongan: {
      type: 'VARCHAR(6)',
      default: null,
    },
    nip: {
      type: 'VARCHAR(18)',
      default: null,
    },
    nidn: {
      type: 'VARCHAR(10)',
      default: null,
    },
    pangkat: {
      type: 'VARCHAR(23)',
      default: null,
    },
    jabatan_struktural: {
      type: 'VARCHAR(50)',
      default: null,
    },
    jabatan_fungsional: {
      type: 'VARCHAR(50)',
      default: null,
    },
    status_kehadiran: {
      type: 'VARCHAR(50)',
      default: null,
    },
  });
};

exports.down = (pgm) => {
  pgm.dropTable('users');
};
