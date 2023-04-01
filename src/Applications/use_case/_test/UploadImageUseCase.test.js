const UploadRepository = require('../../../Domains/uploads/UploadRepository');
const UpdateUser = require('../../../Domains/users/entities/UpdateUser');
const UserDetail = require('../../../Domains/users/entities/UserDetail');
const UserRepository = require('../../../Domains/users/UserRepository');
const AuthenticationTokenManager = require('../../security/AuthenticationTokenManager');
const UploadImageUseCase = require('../UploadImageUseCase');

describe('UploadImageUseCase', () => {
  it('should throw error if payload not contain needed property', async () => {
    // Arrange
    const useCasePayload = {
      photo: {
        hapi: {
          headers: {},
          filename: 'image.jpeg,',
        },
      },
    };

    const uploadImageUseCase = new UploadImageUseCase({});

    // Action & Assert
    await expect(uploadImageUseCase.execute(useCasePayload, {}))
      .rejects
      .toThrowError('UPLOAD_IMAGE.NOT_CONTAIN_NEEDED_PROPERTY');
  });

  it('should throw error if payload not contain mime type specification', async () => {
    // Arrange
    const useCasePayload = {
      photo: {
        hapi: {
          headers: {
            'content-type': 'pdf',
          },
          filename: 'image.jpeg,',
        },
      },
    };

    const uploadImageUseCase = new UploadImageUseCase({});

    // Action & Assert
    await expect(uploadImageUseCase.execute(useCasePayload, {}))
      .rejects
      .toThrowError('UPLOAD_IMAGE.NOT_MEET_MIME_TYPE_SPECIFICATION');
  });

  describe('should orchestrating the upload image action correctly', () => {
    // Arrange
    const useCaseHeader = {
      authorization: 'Bearer accessToken',
    };

    const useCaseParams = {
      id: 'user-12',
    };

    const useCasePayload = {
      photo: {
        hapi: {
          headers: {
            'content-type': 'image/jpeg',
          },
          filename: 'image.jpeg,',
        },
      },
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

    const expectedAccessToken = 'accessToken';

    const { filename } = useCasePayload.photo.hapi.filename;
    const fileLocation = `http://${process.env.HOST}:${process.env.PORT}/upload/images/${filename}`;

    const userUpdate = new UpdateUser({
      ...userDetail,
      photoUrl: fileLocation,
    });

    const mockUploadRepository = new UploadRepository();
    const mockUserRepository = new UserRepository();
    const mockAuthenticationTokenManager = new AuthenticationTokenManager();

    mockUploadRepository.writeFile = jest.fn()
      .mockImplementation(() => Promise.resolve(filename));

    mockUserRepository.getUserById = jest.fn()
      .mockImplementation(() => Promise.resolve(userDetail));
    mockUserRepository.updateUser = jest.fn()
      .mockImplementation(() => Promise.resolve());

    mockAuthenticationTokenManager.getTokenFromHeader = jest.fn()
      .mockImplementation(() => Promise.resolve('accessToken'));
    mockAuthenticationTokenManager.verifyAccessToken = jest.fn()
      .mockImplementation(() => Promise.resolve());

    it('should orchestrating the upload image action for dosen role', async () => {
      mockUserRepository.checkUserIsExist = jest.fn()
        .mockImplementation(() => Promise.resolve());

      mockUserRepository.checkRole = jest.fn()
        .mockImplementation(() => Promise.resolve('dosen'));
      mockAuthenticationTokenManager.decodePayload = jest.fn()
        .mockImplementation(() => Promise.resolve(useCaseParams));

      const uploadImageUseCase = new UploadImageUseCase({
        uploadRepository: mockUploadRepository,
        userRepository: mockUserRepository,
        authenticationTokenManager: mockAuthenticationTokenManager,
      });

      // Action
      await uploadImageUseCase.execute(useCasePayload, useCaseParams, useCaseHeader);

      // Assert
      expect(mockUserRepository.checkUserIsExist).toHaveBeenCalledWith(useCaseParams.id);

      expect(mockUserRepository.getUserById).toHaveBeenCalledWith(useCaseParams.id);
      expect(mockUserRepository.checkRole).toHaveBeenCalledWith(useCaseParams.id);
      expect(mockUserRepository.updateUser).toHaveBeenCalledWith(useCaseParams.id, userUpdate);

      expect(mockUploadRepository.writeFile)
        .toHaveBeenCalledWith(useCasePayload.photo, useCasePayload.photo.hapi);

      expect(mockAuthenticationTokenManager.getTokenFromHeader)
        .toBeCalledWith(useCaseHeader.authorization);
      expect(mockAuthenticationTokenManager.verifyAccessToken).toBeCalledWith(expectedAccessToken);
      expect(mockAuthenticationTokenManager.decodePayload).toBeCalledWith(expectedAccessToken);
    });

    it('should orchestrating the upload image action for admin role', async () => {
      const adminId = 'user-1098';

      mockUserRepository.checkRole = jest.fn()
        .mockImplementation(() => Promise.resolve('admin'));
      mockAuthenticationTokenManager.decodePayload = jest.fn()
        .mockImplementation(() => Promise.resolve({ id: adminId }));

      const uploadImageUseCase = new UploadImageUseCase({
        uploadRepository: mockUploadRepository,
        userRepository: mockUserRepository,
        authenticationTokenManager: mockAuthenticationTokenManager,
      });

      // Action
      await uploadImageUseCase.execute(useCasePayload, useCaseParams, useCaseHeader);

      // Assert
      expect(mockUserRepository.getUserById).toHaveBeenCalledWith(useCaseParams.id);
      expect(mockUserRepository.checkRole).toHaveBeenCalledWith(adminId);
      expect(mockUserRepository.updateUser).toHaveBeenCalledWith(useCaseParams.id, userUpdate);

      expect(mockUploadRepository.writeFile)
        .toHaveBeenCalledWith(useCasePayload.photo, useCasePayload.photo.hapi);

      expect(mockAuthenticationTokenManager.getTokenFromHeader)
        .toBeCalledWith(useCaseHeader.authorization);
      expect(mockAuthenticationTokenManager.verifyAccessToken).toBeCalledWith(expectedAccessToken);
      expect(mockAuthenticationTokenManager.decodePayload).toBeCalledWith(expectedAccessToken);
    });
  });
});
