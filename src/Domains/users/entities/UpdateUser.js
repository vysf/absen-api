/* eslint-disable class-methods-use-this */
class UpdateUser {
  constructor(payload) {
    this._verifyPayload(payload);

    this.fullname = payload.fullname;
    this.golongan = payload.golongan;
    this.nip = payload.nip;
    this.nidn = payload.nidn;
    this.pangkat = payload.pangkat;
    this.jabatanStruktural = payload.jabatanStruktural;
    this.jabatanFungsional = payload.jabatanFungsional;
    this.statusKehadiran = payload.statusKehadiran;
  }

  _verifyPayload(payload) {
    if (!('fullname' in payload)
        || !('golongan' in payload)
        || !('nip' in payload)
        || !('nidn' in payload)
        || !('pangkat' in payload)
        || !('jabatanStruktural' in payload)
        || !('jabatanFungsional' in payload)
        || !('statusKehadiran' in payload)) {
      throw new Error('UPDATE_USER.NOT_CONTAIN_NEEDED_PROPERTY');
    }

    const { fullname } = payload;

    if (typeof fullname !== 'string') {
      throw new Error('UPDATE_USER.NOT_MEET_DATA_TYPE_SPECIFICATION');
    }
  }
}

module.exports = UpdateUser;
