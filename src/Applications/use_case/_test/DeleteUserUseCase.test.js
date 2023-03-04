const UserRepository = require('../../../Domains/users/UserRepository');
const DeleteUserUseCase = require('../DeleteUserUseCase');

describe('DeleteUserUseCase', () => {
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
