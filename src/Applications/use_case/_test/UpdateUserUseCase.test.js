const UpdateUser = require('../../../Domains/users/entities/UpdateUser');
const UserDetail = require('../../../Domains/users/entities/UserDetail');
const UserRepository = require('../../../Domains/users/UserRepository');
const AuthenticationTokenManager = require('../../security/AuthenticationTokenManager');
const UpdateUserUseCase = require('../UpdateUserUseCase');

describe('UpdateUserUseCase', () => {
  it('should orchestrating the update user action for dosen role correctly', async () => {
    const anotherId = 'user-xxx';

    const userDetail = new UserDetail({
      id: anotherId,
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

    // Arrange
    const useCasePayload = {
      statusKehadiran: 'hadir',
    };

    const useCaseParams = {
      id: 'user-12',
    };

    const useCaseHeader = {
      authorization: 'Bearer accessToken',
    };

    const expectedAccessToken = 'accessToken';

    const mockUserRepository = new UserRepository();
    const mockAuthenticationTokenManager = new AuthenticationTokenManager();

    mockUserRepository.updateUser = jest.fn()
      .mockImplementation(() => Promise.resolve());
    mockUserRepository.checkRole = jest.fn()
      .mockImplementation(() => Promise.resolve('dosen'));
    mockUserRepository.checkUserIsExist = jest.fn()
      .mockImplementation(() => Promise.resolve());

    mockAuthenticationTokenManager.getTokenFromHeader = jest.fn()
      .mockImplementation(() => Promise.resolve('accessToken'));
    mockAuthenticationTokenManager.verifyAccessToken = jest.fn()
      .mockImplementation(() => Promise.resolve());

    const userUpdate = new UpdateUser({
      ...userDetail,
      statusKehadiran: useCasePayload.statusKehadiran,
    });

    mockUserRepository.getUserById = jest.fn()
      .mockImplementation(() => Promise.resolve(userDetail));

    mockAuthenticationTokenManager.decodePayload = jest.fn()
      .mockImplementation(() => Promise.resolve({ id: anotherId }));

    const updateUserUseCase = new UpdateUserUseCase({
      userRepository: mockUserRepository,
      authenticationTokenManager: mockAuthenticationTokenManager,
    });

    // Action
    await updateUserUseCase.execute(useCasePayload, useCaseParams, useCaseHeader);

    // Assert
    expect(mockAuthenticationTokenManager.getTokenFromHeader)
      .toBeCalledWith(useCaseHeader.authorization);
    expect(mockAuthenticationTokenManager.verifyAccessToken).toBeCalledWith(expectedAccessToken);
    expect(mockAuthenticationTokenManager.decodePayload).toBeCalledWith(expectedAccessToken);

    expect(mockUserRepository.getUserById).toHaveBeenCalledWith(anotherId);
    expect(mockUserRepository.checkUserIsExist).toHaveBeenCalledWith(useCaseParams.id);
    expect(mockUserRepository.checkRole).toHaveBeenCalledWith(anotherId);
    expect(mockUserRepository.updateUser).toHaveBeenCalledWith(anotherId, userUpdate);
  });

  it('should orchestrating the update user action for admin role correctly', async () => {
    // Arrange
    const useCasePayload = {
      statusKehadiran: 'hadir',
    };

    const useCaseParams = {
      id: 'user-admin',
    };

    const useCaseHeader = {
      authorization: 'Bearer accessToken',
    };

    const expectedAccessToken = 'accessToken';

    const userDetail = new UserDetail({
      id: useCaseParams.id,
      username: 'dosenhebat',
      fullname: 'dosen 1',
      role: 'admin',
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

    const userUpdate = new UpdateUser({
      ...userDetail,
      statusKehadiran: useCasePayload.statusKehadiran,
    });

    const mockUserRepository = new UserRepository();
    const mockAuthenticationTokenManager = new AuthenticationTokenManager();

    mockUserRepository.getUserById = jest.fn()
      .mockImplementation(() => Promise.resolve(userDetail));
    mockUserRepository.updateUser = jest.fn()
      .mockImplementation(() => Promise.resolve());
    mockUserRepository.checkRole = jest.fn()
      .mockImplementation(() => Promise.resolve('admin'));
    mockUserRepository.checkUserIsExist = jest.fn()
      .mockImplementation(() => Promise.resolve());

    mockAuthenticationTokenManager.getTokenFromHeader = jest.fn()
      .mockImplementation(() => Promise.resolve('accessToken'));
    mockAuthenticationTokenManager.verifyAccessToken = jest.fn()
      .mockImplementation(() => Promise.resolve());
    mockAuthenticationTokenManager.decodePayload = jest.fn()
      .mockImplementation(() => Promise.resolve(useCaseParams));

    const updateUserUseCase = new UpdateUserUseCase({
      userRepository: mockUserRepository,
      authenticationTokenManager: mockAuthenticationTokenManager,
    });

    // Action
    await updateUserUseCase.execute(useCasePayload, useCaseParams, useCaseHeader);

    // Assert
    expect(mockAuthenticationTokenManager.getTokenFromHeader)
      .toBeCalledWith(useCaseHeader.authorization);
    expect(mockAuthenticationTokenManager.verifyAccessToken).toBeCalledWith(expectedAccessToken);
    expect(mockAuthenticationTokenManager.decodePayload).toBeCalledWith(expectedAccessToken);

    expect(mockUserRepository.getUserById).toHaveBeenCalledWith(useCaseParams.id);
    expect(mockUserRepository.checkUserIsExist).toHaveBeenCalledWith(useCaseParams.id);
    expect(mockUserRepository.checkRole).toHaveBeenCalledWith(useCaseParams.id);
    expect(mockUserRepository.updateUser).toHaveBeenCalledWith(useCaseParams.id, userUpdate);
  });
});
