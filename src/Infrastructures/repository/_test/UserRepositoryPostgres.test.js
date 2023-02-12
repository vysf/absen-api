const UsersTableTestHelper = require('../../../../tests/UsersTableTestHelper');
const InvariantError = require('../../../Commons/exceptions/InvariantError');
const RegisterUser = require('../../../Domains/users/entities/RegisterUser');
const RegisteredUser = require('../../../Domains/users/entities/RegisteredUser');
const pool = require('../../database/postgres/pool');
const UserRepositoryPostgres = require('../UserRepositoryPostgres');

const NotFoundError = require('../../../Commons/exceptions/NotFoundError');
const UserDetail = require('../../../Domains/users/entities/UserDetail');

describe('UserRepositoryPostgres', () => {
  afterEach(async () => {
    await UsersTableTestHelper.cleanTable();
  });

  afterAll(async () => {
    await pool.end();
  });

  describe('verifyAvailableUsername function', () => {
    it('should throw InvariantError when username not available', async () => {
      // Arrange
      await UsersTableTestHelper.addUser({ username: 'dicoding' }); // memasukan user baru dengan username dicoding
      const userRepositoryPostgres = new UserRepositoryPostgres(pool, {});

      // Action & Assert
      await expect(userRepositoryPostgres.verifyAvailableUsername('dicoding')).rejects.toThrowError(InvariantError);
    });

    it('should not throw InvariantError when username available', async () => {
      // Arrange
      const userRepositoryPostgres = new UserRepositoryPostgres(pool, {});

      // Action & Assert
      await expect(userRepositoryPostgres.verifyAvailableUsername('dicoding')).resolves.not.toThrowError(InvariantError);
    });
  });

  describe('addUser function', () => {
    it('should persist register user and return registered user correctly', async () => {
      // Arrange
      const registerUser = new RegisterUser({
        username: 'dicoding',
        password: 'secret_password',
        fullname: 'Dicoding Indonesia',
      });
      const fakeIdGenerator = () => '123'; // stub!
      const userRepositoryPostgres = new UserRepositoryPostgres(pool, fakeIdGenerator);

      // Action
      await userRepositoryPostgres.addUser(registerUser);

      // Assert
      const users = await UsersTableTestHelper.findUsersById('user-123');
      expect(users).toHaveLength(1);
    });

    it('should return registered user correctly', async () => {
      // Arrange
      const registerUser = new RegisterUser({
        username: 'dicoding',
        password: 'secret_password',
        fullname: 'Dicoding Indonesia',
      });
      const fakeIdGenerator = () => '123'; // stub!
      const userRepositoryPostgres = new UserRepositoryPostgres(pool, fakeIdGenerator);

      // Action
      const registeredUser = await userRepositoryPostgres.addUser(registerUser);

      // Assert
      expect(registeredUser).toStrictEqual(new RegisteredUser({
        id: 'user-123',
        username: 'dicoding',
        fullname: 'Dicoding Indonesia',
      }));
    });
  });

  describe('getPasswordByUsername', () => {
    it('should throw InvariantError when user not found', () => {
      // Arrange
      const userRepositoryPostgres = new UserRepositoryPostgres(pool, {});

      // Action & Assert
      return expect(userRepositoryPostgres.getPasswordByUsername('dicoding'))
        .rejects
        .toThrowError(InvariantError);
    });

    it('should return username password when user is found', async () => {
      // Arrange
      const userRepositoryPostgres = new UserRepositoryPostgres(pool, {});
      await UsersTableTestHelper.addUser({
        username: 'dicoding',
        password: 'secret_password',
      });

      // Action & Assert
      const password = await userRepositoryPostgres.getPasswordByUsername('dicoding');
      expect(password).toBe('secret_password');
    });
  });

  describe('getIdByUsername', () => {
    it('should throw InvariantError when user not found', async () => {
      // Arrange
      const userRepositoryPostgres = new UserRepositoryPostgres(pool, {});

      // Action & Assert
      await expect(userRepositoryPostgres.getIdByUsername('dicoding'))
        .rejects
        .toThrowError(InvariantError);
    });

    it('should return user id correctly', async () => {
      // Arrange
      await UsersTableTestHelper.addUser({ id: 'user-321', username: 'dicoding' });
      const userRepositoryPostgres = new UserRepositoryPostgres(pool, {});

      // Action
      const userId = await userRepositoryPostgres.getIdByUsername('dicoding');

      // Assert
      expect(userId).toEqual('user-321');
    });
  });

  describe('getUsers', () => {
    it('should return list of users correctly', async () => {
      // Arrange
      const expectedUsersList = [
        {
          id: 'dosen-1',
          fullname: 'dosen 1',
          username: 'dosen1',
          statusKehadiran: 'hadir',
          golongan: '4A',
          nip: '1999150320241503',
          nidn: '20241503',
          photoUrl: 'image.png',
          jabatanFungsional: 'Pranata 1',
          jabatanStruktural: 'Lektor',
          pangkat: 'Penata',
          role: 'dosen',
          updatedAt: '2023-02-07T04:53:09.010Z',
          createdAt: '2023-02-07T04:53:09.010Z',
        },
        {
          id: 'dosen-2',
          fullname: 'dosen 2',
          username: 'dosen2',
          statusKehadiran: 'hadir',
          golongan: '4A',
          nip: '1999150320241503',
          nidn: '20241503',
          photoUrl: 'image.png',
          jabatanFungsional: 'Pranata 1',
          jabatanStruktural: 'Lektor',
          pangkat: 'Penata',
          role: 'dosen',
          updatedAt: '2023-02-07T04:53:09.010Z',
          createdAt: '2023-02-07T04:53:09.010Z',
        },
        {
          id: 'dosen-3',
          fullname: 'dosen 3',
          username: 'dosen3',
          statusKehadiran: 'hadir',
          golongan: '4A',
          nip: '1999150320241503',
          nidn: '20241503',
          photoUrl: 'image.png',
          jabatanFungsional: 'Pranata 1',
          jabatanStruktural: 'Lektor',
          pangkat: 'Penata',
          role: 'dosen',
          updatedAt: '2023-02-07T04:53:09.010Z',
          createdAt: '2023-02-07T04:53:09.010Z',
        },
      ];

      await UsersTableTestHelper.addUser({ ...expectedUsersList[0], password: 'user1' });
      await UsersTableTestHelper.addUser({ ...expectedUsersList[1], password: 'user1' });
      await UsersTableTestHelper.addUser({ ...expectedUsersList[2], password: 'user2' });

      const userRepositoryPostgres = new UserRepositoryPostgres(pool, {});

      // Action
      const users = await userRepositoryPostgres.getUsers('dosen');

      // Assert
      // console.log(users);
      expect(users).toEqual(expectedUsersList);
    });

    it('should return list of users correctly even with null value', async () => {
      // Arrange
      const expectedUsersList = [
        {
          id: 'dosen-1',
          fullname: 'dosen 1',
          username: 'dosen1',
          role: 'dosen',
          updatedAt: '2023-02-07T04:53:09.010Z',
          createdAt: '2023-02-07T04:53:09.010Z',
        },
        {
          id: 'dosen-2',
          fullname: 'dosen 2',
          username: 'dosen2',
          statusKehadiran: 'hadir',
          golongan: '4A',
          nip: '1999150320241503',
          nidn: '20241503',
          jabatanFungsional: 'Pranata 1',
          jabatanStruktural: 'Lektor',
          pangkat: 'Penata',
          role: 'dosen',
          updatedAt: '2023-02-07T04:53:09.010Z',
          createdAt: '2023-02-07T04:53:09.010Z',
          photoUrl: 'http://localhost:5000/upload/images/photo.jpg',
        },
        {
          id: 'dosen-3',
          fullname: 'dosen 3',
          username: 'dosen3',
          statusKehadiran: 'hadir',
          golongan: '4A',
          nip: '1999150320241503',
          nidn: '20241503',
          jabatanFungsional: 'Pranata 1',
          jabatanStruktural: 'Lektor',
          pangkat: 'Penata',
          role: 'dosen',
          updatedAt: '2023-02-07T04:53:09.010Z',
          createdAt: '2023-02-07T04:53:09.010Z',
          photoUrl: 'http://localhost:5000/upload/images/photo.jpg',
        },
      ];

      await UsersTableTestHelper.addUser({ ...expectedUsersList[0], password: 'user1' });
      await UsersTableTestHelper.addUser({ ...expectedUsersList[1], password: 'user1' });
      await UsersTableTestHelper.addUser({ ...expectedUsersList[2], password: 'user2' });

      expectedUsersList[0] = {
        statusKehadiran: null,
        golongan: null,
        nip: null,
        nidn: null,
        jabatanFungsional: null,
        jabatanStruktural: null,
        pangkat: null,
        photoUrl: null,
        ...expectedUsersList[0],
      };
      const userRepositoryPostgres = new UserRepositoryPostgres(pool, {});

      // Action
      const users = await userRepositoryPostgres.getUsers('dosen');

      // Assert
      // console.log(users);
      expect(users).toEqual(expectedUsersList);
    });

    it('should return empty list of users', async () => {
      // Arrange
      const userRepositoryPostgres = new UserRepositoryPostgres(pool, {});

      // Action
      const users = await userRepositoryPostgres.getUsers('dosen');

      // Assert
      // console.log(users);
      expect(users).toEqual([]);
    });
  });

  describe('getUserById', () => {
    it('should return user deatil by id', async () => {
      // Arrange
      const id = 'user-098';
      await UsersTableTestHelper.addUser({
        id,
        username: 'dosenhebat',
        fullname: 'dosen 1',
        password: 'secret',
      });

      const userRepositoryPostgres = new UserRepositoryPostgres(pool, {});

      // Action
      const user = await userRepositoryPostgres.getUserById(id);
      // console.log(user)
      // Assert
      expect(user).toStrictEqual(new UserDetail({
        id,
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
      }));
    });
  });

  describe('checkUserIsExist', () => {
    it('should check if user is exist correctly', async () => {
      // Arrange
      const id = 'user-098';
      await UsersTableTestHelper.addUser({
        id,
        username: 'dosenhebat',
        fullname: 'dosen 1',
        password: 'secret',
      });

      const userRepositoryPostgres = new UserRepositoryPostgres(pool, {});

      // Action & Assert
      await expect(userRepositoryPostgres.checkUserIsExist(id)).resolves.not.toThrow(NotFoundError);
    });

    it('should throw NotFoundError if user does not exist', async () => {
      // Arrange
      const userRepositoryPostgres = new UserRepositoryPostgres(pool, {});

      // Action & Assert
      await expect(userRepositoryPostgres.checkUserIsExist('user-109')).rejects.toThrow(NotFoundError);
    });
  });

  describe('updateUser', () => {
    it('should update user data correctly', async () => {
      // Arrange
      const id = 'user-120';

      await UsersTableTestHelper.addUser({
        id,
        username: 'dosen1',
        fullname: 'dosen 1',
        password: 'secret',
      });

      const userRepositoryPostgres = new UserRepositoryPostgres(pool, {});

      const userBeforeUpdate = await userRepositoryPostgres.getUserById(id);

      const dataUpdate = {
        statusKehadiran: 'hadir',
      };

      const updatedUserData = new UserDetail({ ...userBeforeUpdate, ...dataUpdate });

      // Action
      await userRepositoryPostgres.updateUser(id, updatedUserData);
      const userAfterUpdate = await userRepositoryPostgres.getUserById(id);

      // Assert
      expect(userAfterUpdate).toStrictEqual(updatedUserData);
    });

    it('should throw NotFound Error when user not exist', async () => {
      // Arrange
      const userRepositoryPostgres = new UserRepositoryPostgres(pool, {});

      // Action & Assert
      await expect(userRepositoryPostgres.updateUser('xxx', {}))
        .rejects.toThrow(NotFoundError);
    });
  });

  describe('deleteUserById', () => {
    it('should throw NotFoundError when user that want to delete is not exist', async () => {
      // Arrange
      const userRepositoryPostgres = new UserRepositoryPostgres(pool, {});

      // Action & Assert
      await expect(userRepositoryPostgres.deleteUserById('xxx'))
        .rejects.toThrow(NotFoundError);
    });

    it('should be able to delete user', async () => {
      // Arrange
      const id = 'user-120';

      await UsersTableTestHelper.addUser({
        id,
        username: 'dosen1',
        fullname: 'dosen 1',
        password: 'secret',
      });

      const userRepositoryPostgres = new UserRepositoryPostgres(pool, {});

      // Action
      await userRepositoryPostgres.deleteUserById(id);
      const user = await UsersTableTestHelper.findUsersById(id);

      // Assert
      expect(user[0].is_delete).toEqual(true);
    });
  });

  describe('updateUserPasswordById', () => {
    it('should throw NotFoundError when user does not exist', async () => {
      // Arrange
      const userRepositoryPostgres = new UserRepositoryPostgres(pool, {});

      // Action & Assert
      await expect(userRepositoryPostgres.updateUserPasswordById('xxx', ''))
        .rejects.toThrow(NotFoundError);
    });

    it('should update user\'s password correctly', async () => {
      // Arrange
      const id = 'user-120';
      const password = 'secret';
      const changePassword = 'secret1';

      await UsersTableTestHelper.addUser({
        id,
        username: 'dosen1',
        fullname: 'dosen 1',
        password,
      });

      const userRepositoryPostgres = new UserRepositoryPostgres(pool, {});

      // Action & Assert
      await expect(userRepositoryPostgres.updateUserPasswordById(id, changePassword))
        .resolves.not.toThrow(NotFoundError);
    });
  });

  describe('addPhotoProfile', () => {
    it('should add photo profile correclty', async () => {
      // Arrange
      const id = 'user-1';
      const photoUrl = 'http://localhost:5000/upload/images/photo.jpg';
      await UsersTableTestHelper.addUser({
        id, photoUrl,
      });

      const userRepositoryPostgres = new UserRepositoryPostgres(pool, {});

      // Action
      const photo = await UsersTableTestHelper.findUsersById(id);

      // Assert
      await expect(userRepositoryPostgres.addPhotoProfile(id, photoUrl))
        .resolves.not.toThrow(NotFoundError);
      expect(photo[0].photo_url).toEqual(photoUrl);
    });

    it('should throw NotFoundError if user that want to update phto profile does not exist', async () => {
      // Arrange
      const userRepositoryPostgres = new UserRepositoryPostgres(pool, {});

      // Action & Assert
      await expect(userRepositoryPostgres.addPhotoProfile('xxx', 'photoUrl.img'))
        .rejects.toThrow(NotFoundError);
    });
  });
});
