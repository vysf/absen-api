/* eslint-disable class-methods-use-this */
class UserDetail {
  constructor(payload) {
    this._verifyPayload(payload);

    this.id = payload.id;
    this.fullname = payload.fullname;
    this.username = payload.username;
    this.role = payload.role;
    this.updatedAt = payload.updatedAt;
    this.createdAt = payload.createdAt;
    this.statusKehadiran = payload.statusKehadiran;
    this.golongan = payload.golongan;
    this.nip = payload.nip;
    this.nidn = payload.nidn;
    this.jabatanFungsional = payload.jabatanFungsional;
    this.jabatanStruktural = payload.jabatanStruktural;
    this.pangkat = payload.pangkat;
    this.photoUrl = payload.photoUrl;
  }

  _verifyPayload(payload) {
    if (!('id' in payload)
        || !('fullname' in payload)
        || !('username' in payload)
        || !('role' in payload)
        || !('updatedAt' in payload)
        || !('createdAt' in payload)
        || !('statusKehadiran' in payload)
        || !('golongan' in payload)
        || !('nip' in payload)
        || !('nidn' in payload)
        || !('jabatanFungsional' in payload)
        || !('jabatanStruktural' in payload)
        || !('pangkat' in payload)
        || !('photoUrl' in payload)) {
      throw new Error('DETAIL_USER.NOT_CONTAIN_NEEDED_PROPERTY');
    }

    const {
      id, username, fullname, role, updatedAt, createdAt,
    } = payload;

    if (typeof id !== 'string' || typeof username !== 'string' || typeof fullname !== 'string' || typeof role !== 'string' || typeof updatedAt !== 'string' || typeof createdAt !== 'string') {
      throw new Error('DETAIL_USER.NOT_MEET_DATA_TYPE_SPECIFICATION');
    }
  }
}

module.exports = UserDetail;
