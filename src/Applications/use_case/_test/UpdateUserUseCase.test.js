const UpdateUser = require('../../../Domains/users/entities/UpdateUser');
const UserDetail = require('../../../Domains/users/entities/UserDetail');
const UserRepository = require('../../../Domains/users/UserRepository');
const UpdateUserUseCase = require('../UpdateUserUseCase');

describe('UpdateUserUseCase', () => {
  it('should orchestrating the update user action correctly', async () => {
    // Arrange
    const useCasePayload = {
      statusKehadiran: 'hadir',
    };

    const useCaseParams = {
      id: 'user-12',
    };

    const userDetail = new UserDetail({
      id: useCaseParams.id,
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

    const userUpdate = new UpdateUser({
      ...userDetail,
      statusKehadiran: useCasePayload.statusKehadiran,
    });

    const mockUserRepository = new UserRepository();

    mockUserRepository.getUserById = jest.fn()
      .mockImplementation(() => Promise.resolve(userDetail));
    mockUserRepository.updateUser = jest.fn()
      .mockImplementation(() => Promise.resolve());

    const updateUserUseCase = new UpdateUserUseCase({
      userRepository: mockUserRepository,
    });

    // Action
    await updateUserUseCase.execute(useCasePayload, useCaseParams);

    // Assert
    expect(mockUserRepository.getUserById).toHaveBeenCalledWith(useCaseParams.id);
    expect(mockUserRepository.updateUser).toHaveBeenCalledWith(useCaseParams.id, userUpdate);
  });
});
