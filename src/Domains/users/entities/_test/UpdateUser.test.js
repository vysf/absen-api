const UpdateUser = require('../UpdateUser');

describe('UpdateUser entities', () => {
  it('should throw error when payload does not contain needed property', () => {
    // Arrange
    const payload = {
      fullname: 'nama panjang',
      // golongan,
      // nip,
      // nidn,
      // pangkat,
      // jabatanStruktural,
      // jabatanFungsional,
      // statusKehadiran,
    };

    expect(() => new UpdateUser(payload)).toThrowError('UPDATE_USER.NOT_CONTAIN_NEEDED_PROPERTY');
  });

  it('should throw error when payload not meet data type specification', () => {
    // Arrange
    const payload = {
      fullname: [],
      golongan: null,
      nip: null,
      nidn: null,
      pangkat: null,
      jabatanStruktural: null,
      jabatanFungsional: null,
      statusKehadiran: null,
    };

    // Action & Assert
    expect(() => new UpdateUser(payload)).toThrowError('UPDATE_USER.NOT_MEET_DATA_TYPE_SPECIFICATION');
  });

  it('should create UpdateUser entities correctly', () => {
    // Arrange
    const payload = {
      fullname: 'Jhon Doe',
      golongan: null,
      nip: null,
      nidn: null,
      pangkat: null,
      jabatanStruktural: null,
      jabatanFungsional: null,
      statusKehadiran: null,
    };

    // Action
    const updateUser = new UpdateUser(payload);

    // Assert
    expect(updateUser).toBeInstanceOf(UpdateUser);
    expect(updateUser.fullname).toEqual(payload.fullname);
    expect(updateUser.golongan).toEqual(payload.golongan);
    expect(updateUser.nip).toEqual(payload.nip);
    expect(updateUser.nidn).toEqual(payload.nidn);
    expect(updateUser.pangkat).toEqual(payload.pangkat);
    expect(updateUser.jabatanStruktural).toEqual(payload.jabatanStruktural);
    expect(updateUser.jabatanFungsional).toEqual(payload.jabatanFungsional);
    expect(updateUser.statusKehadiran).toEqual(payload.statusKehadiran);
  });
});
