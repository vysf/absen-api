class DeleteUserUseCase {
  constructor({ userRepository, authenticationTokenManager }) {
    // , authenticationTokenManager
    this._userRepository = userRepository;
    this._authenticationTokenManager = authenticationTokenManager;
  }

  // , useCaseHeader
  async execute(useCaseParams, useCaseHeader) {
    // verifikasi token
    const accessToken = await this._authenticationTokenManager
      .getTokenFromHeader(useCaseHeader.authorization);
    await this._authenticationTokenManager.verifyAccessToken(accessToken);
    const { id: userId } = await this._authenticationTokenManager.decodePayload(accessToken);

    const { id } = useCaseParams;
    await this._userRepository.checkUserIsExist(id);

    // verifikasi role
    await this._userRepository.verifyAdmin(userId);
    await this._userRepository.deleteUserById(id);
  }
}

module.exports = DeleteUserUseCase;

/**
 * 1. cek token -> keluarkan id
 * 2. cek role berdasarkan id diatas
 * 3. ambil id dari params
 * 4. cek role
 *  jika role admin
 *    maka boleh hapus data
 *  jika role dosen
 *    cek id dari token === id param
 *      jika boleh hapus data
 *    tidak boleh hapus data -> AuthorizationError('Anda tidak berhak mengakses resource ini')
 */
