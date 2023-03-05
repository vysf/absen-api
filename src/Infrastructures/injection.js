// buat injection inversion sendiri yang lebih sederhana dan mudah dimengerti

// referensi:
// https://github.com/GregBastian/dicoding-backend-expert-submission/blob/main/src/Infrastructures/injections.js

/* istanbul ignore file */

// internal js module
const date = Date;
const path = require('path');
const fs = require('fs');

// external agency
const { nanoid } = require('nanoid');
const bcrypt = require('bcrypt');
const Jwt = require('@hapi/jwt');
// const path = require('path');
const pool = require('./database/postgres/pool');

// service (repository, helper, manager, etc)
const UserRepositoryPostgres = require('./repository/UserRepositoryPostgres');
const AuthenticationRepositoryPostgres = require('./repository/AuthenticationRepositoryPostgres');
const BcryptPasswordHash = require('./security/BcryptPasswordHash');
const JwtTokenManager = require('./security/JwtTokenManager');
// const StorageService = require('./database/storage/StorageService');
const UploadRepositoryStorage = require('./repository/UploadRepositoryStorage');

// use case
const RefreshAuthenticationUseCase = require('../Applications/use_case/RefreshAuthenticationUseCase');
const LoginUserUseCase = require('../Applications/use_case/LoginUserUseCase');
const LogoutUserUseCase = require('../Applications/use_case/LogoutUserUseCase');
const AddUserUseCase = require('../Applications/use_case/AddUserUseCase');
const DeleteUserUseCase = require('../Applications/use_case/DeleteUserUseCase');
const GetUsersUseCase = require('../Applications/use_case/GetUsersUseCase');
const GetUserUseCase = require('../Applications/use_case/GetUserUseCase');
const UpdateUserPasswordUseCase = require('../Applications/use_case/UpdateUserPasswordUseCase');
const UpdateUserUseCase = require('../Applications/use_case/UpdateUserUseCase');
const UploadImageUseCase = require('../Applications/use_case/UploadImageUseCase');

const serviceInstanceContainer = {
  userRepository: new UserRepositoryPostgres(pool, nanoid, date),
  authenticationRepository: new AuthenticationRepositoryPostgres(pool),
  // eslint-disable-next-line max-len
  // uploadRepository: new StorageService(path.resolve(__dirname, 'infrastructures/database/storage/file/images')),
  uploadRepository: new UploadRepositoryStorage(path.resolve(__dirname, 'storage/file/images'), fs, date),
  authenticationTokenManager: new JwtTokenManager(Jwt.token),
  passwordHash: new BcryptPasswordHash(bcrypt),
};

const useCaseInstanceCOntainer = {
  addUserUseCase: new AddUserUseCase({
    userRepository: serviceInstanceContainer.userRepository,
    passwordHash: serviceInstanceContainer.passwordHash,
  }),
  deleteUserUseCase: new DeleteUserUseCase({
    userRepository: serviceInstanceContainer.userRepository,
  }),
  getUsersUseCase: new GetUsersUseCase({
    userRepository: serviceInstanceContainer.userRepository,
  }),
  getUserUseCase: new GetUserUseCase({
    userRepository: serviceInstanceContainer.userRepository,
  }),
  updateUserPasswordUseCase: new UpdateUserPasswordUseCase({
    userRepository: serviceInstanceContainer.userRepository,
    passwordHash: serviceInstanceContainer.passwordHash,
  }),
  updateUserUseCase: new UpdateUserUseCase({
    userRepository: serviceInstanceContainer.userRepository,
  }),
  uploadImageUseCase: new UploadImageUseCase({
    userRepository: serviceInstanceContainer.userRepository,
    uploadRepository: serviceInstanceContainer.uploadRepository,
  }),
  loginUserUseCase: new LoginUserUseCase({
    userRepository: serviceInstanceContainer.userRepository,
    authenticationRepository: serviceInstanceContainer.authenticationRepository,
    authenticationTokenManager: serviceInstanceContainer.authenticationTokenManager,
    passwordHash: serviceInstanceContainer.passwordHash,
  }),
  logoutUserUseCase: new LogoutUserUseCase({
    authenticationRepository: serviceInstanceContainer.authenticationRepository,
  }),
  refreshAuthenticationUseCase: new RefreshAuthenticationUseCase({
    authenticationRepository: serviceInstanceContainer.authenticationRepository,
    authenticationTokenManager: serviceInstanceContainer.authenticationTokenManager,
  }),
};

module.exports = {
  ...serviceInstanceContainer,
  ...useCaseInstanceCOntainer,
};
