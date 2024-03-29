﻿# Acceptance Scenario-Database

## Token Storage
#### ✅ 1. addToken(token)
Fitur: Tambah token

Deskripsi: Melakukan proses penambahan refreshToken ke dalam database

Payload:
- refreshToken (String)

Sql: 
```sql
INSERT INTO authentications VALUES(refreshToken)
```


#### ✅ 2. checkAvailabilityToken(token)

Fitur: Cek ketersediaan token

Deskripsi: Melakukan proses pengecekan apakah refreshtoken telah tersimpan di dalam database

Payload:
- refreshToken (String)

Skenario test:
- ~~Ketika token tidak ada~~
	- ~~Mengembalikan ```InvariantError```~~

sql:
```sql
SELECT * FROM authentications WHERE token = refreshToken
```

#### ✅ 3. deleteToken(token)
Fitur: Hapus token

Deskripsi: Melakukan proses penghapusan refreshtoken dari database

Payload:
- refreshToken (String)

sql: 
```sql
DELETE FROM authentications WHERE token = refershToken
```

## User Storage
#### ✅ 1. verifyAvailableUsername(username)
Fitur: cek ketersediaan username

Deskripsi: Melakukan proses cek username. apabila username sudah terdaftar akan mengembalikan true

Payload:
- username (String)

Skenario test:
- ~~Ketika username tidak tersedia~~
	- ~~Mengembalikan nilai ```InvariantError```~~
- ~~Ketika username tersedia~~
	- ~~Maka tidak mengembalikan error~~

Sql:
```sql
SELECT username FROM users WHERE username = username
```

#### ✅ 2. addUser({fullname, username, password})
Fitur: Tambah pengguna

Deskripsi: Melakukan proses tambah/registrasi pengguna. mengembalikan id

Payload:
- fullname (String)
- username (String)
- password (String)

Skenario test:
- ~~Ketika berhasil menambah user~~
	- ~~Mengembalikan nilai id, fullname, dan username~~

Sql:
```sql
INSERT INTO users VALUES('user-123', 'Jhon Doe', 'jhondoe', 'ok9012jiis') RETURNUNG id, fullname, username
```

catatn sisi sistem:
- role default adalah ```dosen```
- createdAt dan updatedAt otomatis ditambahkan juga ke dalam database

#### ✅ 3. getPasswordByUsername(username)
Fitur: Mendapatkan password berdasarkan username

Deskripsi: Melakukan proses pengambilan password pengguna menggunakan username. mengembalikan password dari database.

Payload:
- username (String)

Skenario test:
- ~~Ketika password tidak ada~~
	- ~~Mengembalikan ```InvariantError```~~
- ~~Ketika password ada~~
	- ~~Tidak mengembalikan ```InvariantError```~~

Sql:
```sql
SELECT password FROM users WHERE username = username
```

#### ✅ 4. getUsers(role)
Fitur: Mendapatkan daftar pengguna

Deskripsi: Melakukan proses pengambilan daftar data pengguna khusus role ```dosen```

Payload:
- role (String)

Skenario test:
- ~~Ketika ada daftar user~~
	- ~~Maka kembalikan daftar user hanya role ```dosen```~~
- ~~Ketika tidak ada data~~
	- ~~Maka Kembalikan daftar kosong~~

Sql:
```sql
SELECT * FROM users WHERE role = 'dosen'
```

#### ✅ 5. getUsersById({id})
Fitur: Mendapatkan data seorang pengguna

Deskripsi: Melakukan proses pengambilan data pengguna menggunakan id

Payload:
- id (String)

Skenario test:
- ~~Ketika id ada~~
	- ~~Mengembalikan data pengguna~~

Sql:
```sql
SELECT * FROM users WHERE id = id
```

#### ✅ 6. checkUserIsExist(id)
Fitur: Mengecek data seorang pengguna ada/tidak didalam database

Deskripsi: Melakukan proses pengecekan ada/tidak data pengguna menggunakan id. mirip getUsersById({id}), hanya beda pada pengembalian data.

Payload:
- id (String)

Skenario test:
- ~~Ketika user tidak ada~~
	- ~~Mengembalikan ```NotFoundError```~~
- ~~Ketika user ada~~
	- ~~Tidak mengembalikan ```NotFoundError```~~

Sql:
```sql
SELECT * FROM users WHERE id = id
```

#### ✅ 7. updateUser(id, {fullname, statusKehadiran, gologan, nip, nidn, jabatanFungsional, jabatanStruktural})
Fitur: Mendapatkan data seorang pengguna

Deskripsi: Melakukan proses update/ubah data user berdasarkan id.

Payload:
- id (String)
- fullname (string)
- statusKehadiran (string)
- golongan (string)
- nip (string)
- nidn (string)
- jabatanFungsional (string)
- jabatanStruktural (string)

Skenario test:
- ~~Ketika berhasil mengubah data~~
	- ~~Tidak mengembalikan ```NotFoundError```~~
- ~~Ketika gagal mengubah data~~
	- ~~Mengembalikan ```NotFoundError```~~

Sql:
```sql
UPDATE users 
SET fullname = 'fullname', 
	statusKehadiran = 'statusKehadiran', 
	golongan = 'golongan', 
	nip = 'nip', 
	nidn = 'nidn', 
	jabatanFungsional = 'jabatanFungsional',
	jabatanStruktural = 'jabatanStruktural'
WHERE id = 'id'
```

#### ✅ 8. deleteUserById(id)
Fitur: Mendapatkan data seorang pengguna

Deskripsi: Melakukan proses hapus user berdasarkan id. ~~belum diputuskan untuk _soft delete_ atau _hard delete_~~
menggunakan _soft delete_

Payload:
- id (String)

sql: 
~~opsi _hard delete_~~
```sql
DELETE FROM users WHERE id = 'id'
```
atau opsi _soft delete_

```sql
UPDATE users
SET is_delete = TRUE
WHERE id = 'id'
```

Skenario test:
- ~~Ketika berhasil menghapus data~~
	- ~~Tidak mengembalikan ```NotFoundError```~~
- ~~Ketika gagal menghapus data~~
	- ~~Mengembalikan ```NotFoundError```~~

#### ✅ 9. updateUserPasswordById({id, password})
Fitur: Mendapatkan data seorang pengguna

Deskripsi: Melakukan proses update/ubah data user berdasarkan id.

Payload:
- id (String)
- password (string)

Skenario test:
- ~~Ketika berhasil menghapus data~~
	- ~~Tidak mengembalikan ```NotFoundError```~~
- ~~Ketika gagal menghapus data~~
	- ~~Mengembalikan ```NotFoundError```~~

Sql:
```sql
UPDATE users 
SET password = '12wdededed'
WHERE id = 'id'
```

## Upload Storage
#### ✅ 1. addPhotoProfile({id, photo})
Fitur: Mendapatkan data seorang pengguna

Deskripsi: Melakukan proses update/ubah foto user berdasarkan id.

Payload:
- id (String)
- foto (File)

Skenario test:
- ~~Ketika berhasil mengubah foto profile~~
	- ~~Tidak mengembalikan ```NotFoundError```~~
- ~~Ketika gagal mengubah foto profil~~
	- ~~Mengembalikan ```NotFoundError```~~

```sql
UPDATE users
SET photo_url = 'http://localhost:5000/upload/images/photo.jpg'
WHERE id = 'id'
```
