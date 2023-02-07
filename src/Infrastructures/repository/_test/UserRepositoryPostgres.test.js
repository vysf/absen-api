const UsersTableTestHelper = require('../../../../tests/UsersTableTestHelper');
const InvariantError = require('../../../Commons/exceptions/InvariantError');
const RegisterUser = require('../../../Domains/users/entities/RegisterUser');
const RegisteredUser = require('../../../Domains/users/entities/RegisteredUser');
const pool = require('../../database/postgres/pool');
const UserRepositoryPostgres = require('../UserRepositoryPostgres');

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
});
