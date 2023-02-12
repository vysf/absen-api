const UserDetail = require('../../../Domains/users/entities/UserDetail');
const UserRepository = require('../../../Domains/users/UserRepository');
const GetUserUseCase = require('../GetUserUseCase');

describe('GetUserUseCase', () => {
  it('should throw error if payload does not contain id', async () => {
    // Arrange
    const useCasePayload = {};
    const getUserUseCase = new GetUserUseCase({});

    // Acaton & Assert
    await expect(getUserUseCase.execute(useCasePayload))
      .rejects
      .toThrowError('GET_USER_USE_CASE.NOT_CONTAIN_ID');
  });

  it('should throw error if payload not meet data type specification', async () => {
    // Arrange
    const useCasePayload = {
      id: 1,
    };
    const getUserUseCase = new GetUserUseCase({});

    // Acaton & Assert
    await expect(getUserUseCase.execute(useCasePayload))
      .rejects
      .toThrowError('GET_USER_USE_CASE.PAYLOAD_NOT_MEET_DATA_TYPE_SPECIFICATION');
  });

  it('should orchestrating the get user action correctly', async () => {
    // Arrange
    const useCasePayload = {
      id: 'user-123',
    };

    const user = new UserDetail({
      id: useCasePayload.id,
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
    });

    const mockUserRepository = new UserRepository();

    mockUserRepository.getUserById = jest.fn()
      .mockImplementation(() => Promise.resolve(user));

    const getUserUseCase = new GetUserUseCase({
      userRepository: mockUserRepository,
    });

    // Action
    await getUserUseCase.execute(useCasePayload);

    // Assert
    expect(mockUserRepository.getUserById).toHaveBeenCalledWith(useCasePayload.id);
  });
});
