const UserRepository = require('../../../Domains/users/UserRepository');
const DeleteUserUseCase = require('../DeleteUserUseCase');

describe('DeleteUserUseCase', () => {
  it('should throw error if use case payload is not contain user id', async () => {
    // Arrange
    const useCaseParams = {};
    const deleteUserUseCase = new DeleteUserUseCase({});

    // Action & Assert
    await expect(deleteUserUseCase.execute(useCaseParams))
      .rejects
      .toThrowError('DELETE_USER_USE_CASE.NOT_CONTAIN_ID');
  });

  it('should throw error if id not a string', async () => {
    // Arrange
    const useCaseParams = {
      id: [],
    };
    const deleteUserUseCase = new DeleteUserUseCase({});

    // Action & Assert
    await expect(deleteUserUseCase.execute(useCaseParams))
      .rejects
      .toThrowError('DELETE_USER_USE_CASE.PAYLOAD_NOT_MEET_DATA_TYPE_SPECIFICATION');
  });

  it('should orchestrating the delete user action correctly', async () => {
    // Arrange
    const useCaseParams = {
      id: 'user-123',
    };

    const mockUserRepository = new UserRepository();
    mockUserRepository.checkUserIsExist = jest.fn()
      .mockImplementation(() => Promise.resolve());
    mockUserRepository.deleteUserById = jest.fn()
      .mockImplementation(() => Promise.resolve());

    // Action
    const deleteUserUseCase = new DeleteUserUseCase({
      userRepository: mockUserRepository,
    });

    await deleteUserUseCase.execute(useCaseParams);

    // Assert
    expect(mockUserRepository.checkUserIsExist).toHaveBeenCalledWith(useCaseParams.id);
    expect(mockUserRepository.deleteUserById).toHaveBeenCalledWith(useCaseParams.id);
  });
});
