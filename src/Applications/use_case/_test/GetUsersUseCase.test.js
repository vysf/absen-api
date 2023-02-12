const UserDetail = require('../../../Domains/users/entities/UserDetail');
const UserRepository = require('../../../Domains/users/UserRepository');
const GetUsersUseCase = require('../GetUsersUseCase');

describe('GetUsersUseCase', () => {
  it('should throw error if use case payload not contain role', async () => {
    // Arrange
    const useCasePayload = {};
    const getUsersUseCase = new GetUsersUseCase({});

    // Acaton & Assert
    await expect(getUsersUseCase.execute(useCasePayload))
      .rejects
      .toThrowError('GET_USERS_USE_CASE.NOT_CONTAIN_ROLE');
  });

  it('should throw error if role not string', async () => {
    // Arrange
    const useCasePayload = {
      role: [],
    };
    const getUsersUseCase = new GetUsersUseCase({});

    // Acaton & Assert
    await expect(getUsersUseCase.execute(useCasePayload))
      .rejects
      .toThrowError('GET_USERS_USE_CASE.PAYLOAD_NOT_MEET_DATA_TYPE_SPECIFICATION');
  });

  it('should orchestrating the get users action correctly', async () => {
    // Arrange
    const useCasePayload = {
      role: 'dosen',
    };

    const expectedUsers = [
      new UserDetail({
        id: 'dosen-1',
        fullname: 'dosen 1',
        username: 'dosen1',
        statusKehadiran: 'hadir',
        golongan: '4A',
        nip: '1999150320241503',
        nidn: '20241503',
        photoUrl: 'image.png',
        jabatanFungsional: 'Pranata 1',
        jabatanStruktural: 'Lektor',
        pangkat: 'Penata',
        role: 'dosen',
        updatedAt: '2023-02-07T04:53:09.010Z',
        createdAt: '2023-02-07T04:53:09.010Z',
      }),
      new UserDetail({
        id: 'dosen-2',
        fullname: 'dosen 2',
        username: 'dosen2',
        statusKehadiran: 'hadir',
        golongan: '4A',
        nip: '1999150320241503',
        nidn: '20241503',
        photoUrl: 'image.png',
        jabatanFungsional: 'Pranata 1',
        jabatanStruktural: 'Lektor',
        pangkat: 'Penata',
        role: 'dosen',
        updatedAt: '2023-02-07T04:53:09.010Z',
        createdAt: '2023-02-07T04:53:09.010Z',
      }),
      new UserDetail({
        id: 'dosen-3',
        fullname: 'dosen 3',
        username: 'dosen3',
        statusKehadiran: 'hadir',
        golongan: '4A',
        nip: '1999150320241503',
        nidn: '20241503',
        photoUrl: 'image.png',
        jabatanFungsional: 'Pranata 1',
        jabatanStruktural: 'Lektor',
        pangkat: 'Penata',
        role: 'dosen',
        updatedAt: '2023-02-07T04:53:09.010Z',
        createdAt: '2023-02-07T04:53:09.010Z',
      }),
    ];

    const mockUserRepository = new UserRepository();

    mockUserRepository.getUsers = jest.fn()
      .mockImplementation(() => Promise.resolve(expectedUsers));

    const getUsersUseCase = new GetUsersUseCase({
      userRepository: mockUserRepository,
    });

    // Action
    const users = await getUsersUseCase.execute(useCasePayload);

    // Assert
    expect(users).toEqual(expectedUsers);
    expect(mockUserRepository.getUsers).toHaveBeenCalledWith(useCasePayload.role);
  });
});
