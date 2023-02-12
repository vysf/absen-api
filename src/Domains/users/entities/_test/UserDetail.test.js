const UserDetail = require('../UserDetail');

describe('UserDetail entities', () => {
  it('should throw error when payload not contian needed property', () => {
    // Arrange
    const payload = {
      id: '1',
    };

    // Action & Assert
    expect(() => new UserDetail(payload)).toThrowError('DETAIL_USER.NOT_CONTAIN_NEEDED_PROPERTY');
  });

  it('should throw error when payload not meet data type specifications', () => {
    // Arrange
    const payload = {
      id: 1,
      username: 'dosenhebat',
      fullname: 'dosen 1',
      role: 'dosen',
      updatedAt: '2023-02-07T04:53:09.010Z',
      createdAt: '2023-02-07T04:53:09.010Z',
      statusKehadiran: null,
      golongan: null,
      nip: null,
      nidn: null,
      jabatanFungsional: null,
      jabatanStruktural: null,
      pangkat: null,
      photoUrl: null,
    };

    // Action & Assert
    expect(() => new UserDetail(payload)).toThrowError('DETAIL_USER.NOT_MEET_DATA_TYPE_SPECIFICATION');
  });

  it('should create UserDetail entities correctly', () => {
    // Arrange
    const payload = {
      id: 'user-1',
      username: 'dosenhebat',
      fullname: 'dosen 1',
      role: 'dosen',
      updatedAt: '2023-02-07T04:53:09.010Z',
      createdAt: '2023-02-07T04:53:09.010Z',
      statusKehadiran: null,
      golongan: null,
      nip: null,
      nidn: null,
      jabatanFungsional: null,
      jabatanStruktural: null,
      pangkat: null,
      photoUrl: null,
    };

    // Action
    const userDetail = new UserDetail(payload);

    // Assert
    expect(userDetail).toBeInstanceOf(UserDetail);
    expect(userDetail.id).toEqual(payload.id);
    expect(userDetail.username).toEqual(payload.username);
    expect(userDetail.fullname).toEqual(payload.fullname);
    expect(userDetail.role).toEqual(payload.role);
    expect(userDetail.updatedAt).toEqual(payload.updatedAt);
    expect(userDetail.createdAt).toEqual(payload.createdAt);
    expect(userDetail.statusKehadiran).toEqual(payload.statusKehadiran);
    expect(userDetail.golongan).toEqual(payload.golongan);
    expect(userDetail.nip).toEqual(payload.nip);
    expect(userDetail.nidn).toEqual(payload.nidn);
    expect(userDetail.jabatanFungsional).toEqual(payload.jabatanFungsional);
    expect(userDetail.jabatanStruktural).toEqual(payload.jabatanStruktural);
    expect(userDetail.pangkat).toEqual(payload.pangkat);
    expect(userDetail.photoUrl).toEqual(payload.photoUrl);
  });
});
