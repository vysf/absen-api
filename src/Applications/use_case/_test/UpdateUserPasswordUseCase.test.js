const UserRepository = require('../../../Domains/users/UserRepository');
const AuthenticationTokenManager = require('../../security/AuthenticationTokenManager');
const PasswordHash = require('../../security/PasswordHash');
const UpdateUserPasswordUseCase = require('../UpdateUserPasswordUseCase');

describe('UpdateUserPasswordUseCase', () => {
  it('should throw error if payload not contain needed property', async () => {
    // Arrange
    const useCaseParams = {
      id: 'user-123',
    };

    const useCasePayload = {};

    const updateUserPasswordUseCase = new UpdateUserPasswordUseCase({});

    // Action & Assert
    await expect(updateUserPasswordUseCase.execute(useCasePayload, useCaseParams))
      .rejects
      .toThrowError('UPDATE_USER_PASSWORD_USE_CASE.NOT_CONTAIN_NEEDED_PROPERTY');
  });

  it('should throw error if payload not meet data type specification', async () => {
    // Arrange
    const useCaseParams = {
      id: 'user-123',
    };

    const useCasePayload = {
      password: 1234,
    };

    const updateUserPasswordUseCase = new UpdateUserPasswordUseCase({});

    // Action & Assert
    await expect(updateUserPasswordUseCase.execute(useCasePayload, useCaseParams))
      .rejects
      .toThrowError('UPDATE_USER_PASSWORD_USE_CASE.PAYLOAD_NOT_MEET_DATA_TYPE_SPECIFICATION');
  });

  describe('should orchestrating the update password action correctly', () => {
    // Arrange
    const useCaseParams = {
      id: 'user-123',
    };

    const useCasePayload = {
      password: 'newpassword',
    };

    const useCaseHeader = {
      authorization: 'Bearer accessToken',
    };

    const expectedAccessToken = 'accessToken';

    const mockUserRepository = new UserRepository();
    const mockPasswordHash = new PasswordHash();
    const mockAuthenticationTokenManager = new AuthenticationTokenManager();

    mockUserRepository.checkUserIsExist = jest.fn()
      .mockImplementation(() => Promise.resolve());
    mockPasswordHash.hash = jest.fn()
      .mockImplementation(() => Promise.resolve('encrypted_password'));

    mockAuthenticationTokenManager.getTokenFromHeader = jest.fn()
      .mockImplementation(() => Promise.resolve('accessToken'));
    mockAuthenticationTokenManager.verifyAccessToken = jest.fn()
      .mockImplementation(() => Promise.resolve());

    it('should only allow dosen to update their own password', async () => {
      const userId = useCaseParams;

      mockUserRepository.updateUserPasswordById = jest.fn()
        .mockImplementation(() => Promise.resolve());
      mockUserRepository.checkRole = jest.fn()
        .mockImplementation(() => Promise.resolve('dosen'));
      mockAuthenticationTokenManager.decodePayload = jest.fn()
        .mockImplementation(() => Promise.resolve(userId));

      const updateUserPasswordUseCase = new UpdateUserPasswordUseCase({
        userRepository: mockUserRepository,
        passwordHash: mockPasswordHash,
        authenticationTokenManager: mockAuthenticationTokenManager,
      });

      // Action
      await updateUserPasswordUseCase.execute(useCasePayload, useCaseParams, useCaseHeader);

      // Assert
      expect(mockAuthenticationTokenManager.getTokenFromHeader)
        .toBeCalledWith(useCaseHeader.authorization);
      expect(mockAuthenticationTokenManager.verifyAccessToken).toBeCalledWith(expectedAccessToken);
      expect(mockAuthenticationTokenManager.decodePayload).toBeCalledWith(expectedAccessToken);

      expect(mockUserRepository.checkUserIsExist).toBeCalledWith(useCaseParams.id);
      expect(mockUserRepository.checkRole).toBeCalledWith(userId.id);
      expect(mockPasswordHash.hash).toBeCalledWith(useCasePayload.password);
      expect(mockUserRepository.updateUserPasswordById).toBeCalledWith(userId.id, 'encrypted_password');
    });

    it('should only allow admin to update their own password and another user password', async () => {
      const userId = 'user-admin';

      mockUserRepository.updateUserPasswordById = jest.fn()
        .mockImplementation(() => Promise.resolve());
      mockUserRepository.checkRole = jest.fn()
        .mockImplementation(() => Promise.resolve('admin'));
      mockAuthenticationTokenManager.decodePayload = jest.fn()
        .mockImplementation(() => Promise.resolve({ id: userId }));

      const updateUserPasswordUseCase = new UpdateUserPasswordUseCase({
        userRepository: mockUserRepository,
        passwordHash: mockPasswordHash,
        authenticationTokenManager: mockAuthenticationTokenManager,
      });

      // Action
      await updateUserPasswordUseCase.execute(useCasePayload, useCaseParams, useCaseHeader);

      // Assert
      expect(mockAuthenticationTokenManager.getTokenFromHeader)
        .toBeCalledWith(useCaseHeader.authorization);
      expect(mockAuthenticationTokenManager.verifyAccessToken).toBeCalledWith(expectedAccessToken);
      expect(mockAuthenticationTokenManager.decodePayload).toBeCalledWith(expectedAccessToken);

      expect(mockUserRepository.checkUserIsExist).toBeCalledWith(useCaseParams.id);
      expect(mockUserRepository.checkRole).toBeCalledWith(userId);
      expect(mockPasswordHash.hash).toBeCalledWith(useCasePayload.password);
      expect(mockUserRepository.updateUserPasswordById).toBeCalledWith(userId, 'encrypted_password');
    });
  });
});
