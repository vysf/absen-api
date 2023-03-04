const UserRepository = require('../../../Domains/users/UserRepository');
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

  it('should orchestrating update user password use case correctly', async () => {
    // Arrange
    const useCaseParams = {
      id: 'user-123',
    };

    const useCasePayload = {
      password: 'newpassword',
    };

    const mockUserRepository = new UserRepository();
    const mockPasswordHash = new PasswordHash();

    mockUserRepository.checkUserIsExist = jest.fn()
      .mockImplementation(() => Promise.resolve());
    mockUserRepository.updateUserPasswordById = jest.fn()
      .mockImplementation(() => Promise.resolve());
    mockPasswordHash.hash = jest.fn()
      .mockImplementation(() => Promise.resolve('encrypted_password'));

    const updateUserPasswordUseCase = new UpdateUserPasswordUseCase({
      userRepository: mockUserRepository,
      passwordHash: mockPasswordHash,
    });

    // Action
    await updateUserPasswordUseCase.execute(useCasePayload, useCaseParams);

    // Assert
    expect(mockUserRepository.checkUserIsExist).toBeCalledWith(useCaseParams.id);
    expect(mockPasswordHash.hash).toBeCalledWith(useCasePayload.password);
    expect(mockUserRepository.updateUserPasswordById).toBeCalledWith(useCaseParams.id, 'encrypted_password');
  });
});
