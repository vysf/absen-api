const UploadRepository = require('../../../Domains/uploads/UploadRepository');
const UpdateUser = require('../../../Domains/users/entities/UpdateUser');
const UserDetail = require('../../../Domains/users/entities/UserDetail');
const UserRepository = require('../../../Domains/users/UserRepository');
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

  it('should orchestrating the upload image action correctly', async () => {
    // Arrange
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

    // photo.hapi.headers = 'content-type': 'image/jpeg'
    // file: photo.pipe dan file.on
    // meta: photo.hapi.filename
    // photo: {
    //  hapi: {
    //    headers: {
    //      'content-type': 'image/jpeg',
    //    },
    //    filename: 'image.jpeg,'
    // }
    //  pipe:
    //  on:
    // }

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

    const { filename } = useCasePayload.photo.hapi.filename;
    const fileLocation = `http://${process.env.HOST}:${process.env.PORT}/upload/images/${filename}`;

    const userUpdate = new UpdateUser({
      ...userDetail,
      photoUrl: fileLocation,
    });

    const mockUploadRepository = new UploadRepository();
    const mockUserRepository = new UserRepository();

    mockUploadRepository.writeFile = jest.fn()
      .mockImplementation(() => Promise.resolve(filename));

    mockUserRepository.getUserById = jest.fn()
      .mockImplementation(() => Promise.resolve(userDetail));

    mockUserRepository.updateUser = jest.fn()
      .mockImplementation(() => Promise.resolve());

    const uploadImageUseCase = new UploadImageUseCase({
      uploadRepository: mockUploadRepository,
      userRepository: mockUserRepository,
    });

    // Action
    await uploadImageUseCase.execute(useCasePayload, useCaseParams);

    // Assert
    expect(mockUserRepository.getUserById).toHaveBeenCalledWith(useCaseParams.id);
    expect(mockUploadRepository.writeFile)
      .toHaveBeenCalledWith(useCasePayload.photo, useCasePayload.photo.hapi);
    expect(mockUserRepository.updateUser).toHaveBeenCalledWith(useCaseParams.id, userUpdate);
  });
});
