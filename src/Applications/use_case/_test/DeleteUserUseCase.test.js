const UserRepository = require('../../../Domains/users/UserRepository');
const AuthenticationTokenManager = require('../../security/AuthenticationTokenManager');
const DeleteUserUseCase = require('../DeleteUserUseCase');

describe('DeleteUserUseCase', () => {
  it('should orchestrating the delete user action correctly', async () => {
    // Arrange
    const useCaseParams = {
      id: 'user-123',
    };

    const useCaseHeader = {
      authorization: 'Bearer accessToken',
    };

    const admin = { id: 'user-1' };

    const expectedAccessToken = 'accessToken';

    const mockUserRepository = new UserRepository();
    const mockAuthenticationTokenManager = new AuthenticationTokenManager();

    mockUserRepository.checkUserIsExist = jest.fn()
      .mockImplementation(() => Promise.resolve());
    mockUserRepository.deleteUserById = jest.fn()
      .mockImplementation(() => Promise.resolve());
    mockUserRepository.verifyAdmin = jest.fn()
      .mockImplementation(() => Promise.resolve());

    mockAuthenticationTokenManager.getTokenFromHeader = jest.fn()
      .mockImplementation(() => Promise.resolve('accessToken'));
    mockAuthenticationTokenManager.verifyAccessToken = jest.fn()
      .mockImplementation(() => Promise.resolve());
    mockAuthenticationTokenManager.decodePayload = jest.fn()
      .mockImplementation(() => Promise.resolve(admin));

    // Action
    const deleteUserUseCase = new DeleteUserUseCase({
      userRepository: mockUserRepository,
      authenticationTokenManager: mockAuthenticationTokenManager,
    });

    await deleteUserUseCase.execute(useCaseParams, useCaseHeader);

    // Assert
    expect(mockAuthenticationTokenManager.getTokenFromHeader)
      .toBeCalledWith(useCaseHeader.authorization);
    expect(mockAuthenticationTokenManager.verifyAccessToken).toBeCalledWith(expectedAccessToken);
    expect(mockAuthenticationTokenManager.decodePayload).toBeCalledWith(expectedAccessToken);

    expect(mockUserRepository.checkUserIsExist).toHaveBeenCalledWith(useCaseParams.id);
    expect(mockUserRepository.verifyAdmin).toHaveBeenCalledWith(admin.id);
    expect(mockUserRepository.deleteUserById).toHaveBeenCalledWith(useCaseParams.id);
  });
});
