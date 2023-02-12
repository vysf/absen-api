# Acceptance Scenario- Features Use Cases

### ✅ 1. Registrasi Pengguna
Fitur: Registrasi pengguna

Deskripsi: Melakukan registrasi pengguna. Pengguna pertama adalah Admin, kemudian hanya dapat digunakan admin untuk mendaftarkan dosen baru.

Dependency:
- password hash
- user repository

Payload:
-   fullname (String)
-   username (String)
-   password (String)

 Use case:
 - Dapatkan payload.
 - cek ketersedian username
 - enkripsi password
 - simpan payload ke dalam database
 - kembalikan addedUser dengan kode 201

### ✅ 2. Login
Fitur: Login

Deskripsi: Melakukan verifikasi terhadap pengguna yang terdaftar disistem

Dependency:
- password hash
- user repository
- authentication repository
- authentication token manager

Payload:
-   username (String)
-   password (String)

 Use case:
 - Dapatkan payload.
 - dapatkan password berdasarkan username
 - compare password payload dengan password dari database
 - cek username didalam database
 - generate accessToken dan refreshToken dengan id dan role pengguna
 - simpan refreshToken ke database 
 - kirimkan accessToken dan refreshToken

Spesifikasi:
-   Ketika payload kosong
    -   Mengembalikan error.
-   Ketika payload beda tipe data
    -   Mengembalikan error
-   Ketika username tidak terdaftar didalam database
    -   Mengembalikan NotFoundError
- Ketika password tidak match
	- Mengembalikan status fail dan kode status 403
- Buat accessToken dan refreshToken
	- Mengembalikan  status success, kode 201, dan accessToken dan refreshToken

### 3. Refresh Token
Fitur: Refresh token

Deskripsi: Mendapatkan accessToken baru ketika masa akses token telah habis, dengan mengirimkan refreshToken

Payload:
-   refreshToken (String)

 Use case:
 - Dapatkan payload.
 - cek refreshToken didalam database
 - generate accessToken baru
 - kirimkan accessToken

Spesifikasi:
-   Ketika payload kosong
    -   Mengembalikan error.
-   Ketika payload beda tipe data
    -   Mengembalikan error
-   Ketika refreshToken tidak ada didalam database
    -   Mengembalikan NotFoundError
- Buat accessToken
	- Mengembalikan  status success, kode 200, dan accessToken

### 4. Logout
Fitur: Logout

Deskripsi: Mendapatkan accessToken baru ketika masa akses token telah habis, dengan mengirimkan refreshToken

Payload:
-   refreshToken (String)

 Use case:
 - Dapatkan payload
 - cek refreshToken didalam database
 - hapus refreshToken didalam database
 - kirimkan status success

Spesifikasi:
-   Ketika payload kosong
    -   Mengembalikan error.
-   Ketika payload beda tipe data
    -   Mengembalikan error
- Ketika refreshToken tidak ada didalam database
	- Mengembalikan NotFoundError
-   Hapus refreshToken didalam database
	- Mengembalikan  status success dan kode 200

### 5. Dapatkan Semua Pengguna (Admin & Public)
Fitur: Dapatkan Semua Pengguna (Admin & Public)

Deskripsi: Mendapatkan semua pengguna dengan role ```dosen```. Berlaku untuk admin dan public.

Payload:
-   header authorization (opsional)

 Use case:
 - Dapatkan payload (opsional).
 - kirimkan status success dan daftar pengguna

Spesifikasi:
-   Ketika payload kosong (opsional)
    -   Mengembalikan error.
-   Ketika payload beda tipe data (opsional)
    -   Mengembalikan error
-   Dapatkan daftar pengguna
	- Mengembalikan  status success dan kode 200

### 6. Dapatkan Seorang Pengguna (Admin & Public)
Fitur: Dapatkan SeorangPengguna (Admin & Public)

Deskripsi: Mendapatkan seorang pengguna. Berlaku untuk admin dan public.

Payload:
- header authorization (opsional)
- id (String)

 Use case:
 - Dapatkan payload (opsional).
 - Cari pengguna dengan id tersebut
 - kirimkan status success dan daftar pengguna

Spesifikasi:
-   Ketika payload kosong (opsional)
    -   Mengembalikan error.
-   Ketika payload beda tipe data (opsional)
    -   Mengembalikan error
- Ketika pengguna tidak ditemukan
	- Mengembalikan NotFoundError
-   Dapatkan pengguna
	- Mengembalikan  status success dan kode 200

### 7. Ubah Data Seorang Pengguna (Admin & Dosen)
Fitur: Ubah Data Seorang Pengguna (Admin & Dosen)

Deskripsi: Mengubah data seorang pengguna. Berlaku untuk admin dan dosen.

Payload:
- header authorization (opsional)
- id (String)
- fullname (string)
- statusKehadiran (string)
- golongan (string)
- nip (string)
- nidn (string)
- jabatanFungsional (string)
- jabatanStruktural (string)

 Use case:
 - Dapatkan payload
 - Dapatkan header (token)
 - Cari pengguna dengan id
 - ubah data pengguna. masukkan ke database
 - kirimkan status success dan message

Spesifikasi:
-   Ketika header kosong
    -   Mengembalikan error.
-   Ketika payload kosong
    -   Mengembalikan error.
-   Ketika payload beda tipe data
    -   Mengembalikan error
- Ketika pengguna tidak ditemukan
	- Mengembalikan NotFoundError
-   Ubah data pengguna
	- Mengembalikan  status success dan kode 200

### 8. Ubah Password Seorang Pengguna (Admin & Dosen)
Fitur: Ubah Data Seorang Pengguna (Admin & Dosen)

Deskripsi: Mengubah data seorang pengguna. Berlaku untuk admin dan dosen.

Payload:
- header authorization (opsional)
- id (String)
- password (string)

 Use case:
 - Dapatkan payload
 - Dapatkan header (token)
 - Cari pengguna dengan id
 - ubah password pengguna. masukkan ke database
 - kirimkan status success dan message

Spesifikasi:
-   Ketika header kosong
    -   Mengembalikan error.
-   Ketika payload kosong
    -   Mengembalikan error.
-   Ketika payload beda tipe data
    -   Mengembalikan error
- Ketika pengguna tidak ditemukan
	- Mengembalikan InvariantError
-   Ubah password pengguna
	- Mengembalikan  status success dan kode 200

### 9. Upload Foto Seorang Pengguna (Admin & Dosen)
Fitur: Upload Foto Seorang Pengguna (Admin & Dosen)

Deskripsi: Mengubah foto seorang pengguna. Berlaku untuk admin dan dosen.

Payload:
- header authorization
- id (String)
- photo (File)

 Use case:
 - Dapatkan payload
 - Dapatkan header (token)
 - Cari pengguna dengan id
 - ubah foto pengguna. masukkan ke database
 - kirimkan status success dan message

Spesifikasi:
-   Ketika header kosong
    -   Mengembalikan error.
-   Ketika payload kosong
    -   Mengembalikan error.
-   Ketika payload beda tipe data
    -   Mengembalikan error
- Ketika pengguna tidak ditemukan
	- Mengembalikan NotFoundError
-   Ubah foto pengguna
	- Mengembalikan  status success dan kode 200


### 10. Hapus Data Seorang Pengguna (Admin)
Fitur: Hapus Data Seorang Pengguna (Admin)

Deskripsi: Mengubah foto seorang pengguna dengan role ```dosen```. Berlaku untuk admin.

Payload:
- header authorization
- id (String)

 Use case:
 - Dapatkan payload
 - Dapatkan header (token)
 - Cari pengguna dengan id
 - Hapus pengguna dari database
 - kirimkan status success dan message

Spesifikasi:
-   Ketika header kosong
    -   Mengembalikan error.
-   Ketika payload kosong
    -   Mengembalikan error.
-   Ketika payload beda tipe data
    -   Mengembalikan error
- Ketika pengguna tidak ditemukan
	- Mengembalikan NotFoundError
-   Hapus pengguna
	- Mengembalikan  status success dan kode 200
