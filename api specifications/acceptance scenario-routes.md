# Acceptance Scenario- Features Use Cases
Ini adalah API yang dibuat khusus untuk melayani absensi dosen

### ✅ Registrasi pengguna (Admin & Dosen)
method: ```POST```
path: ```/users```
Scenario test:
- ~~should response 201 and register new user~~
- ~~should response 400 if payload not contain needed property~~
- ~~should response 400 when request payload not meet data type specification~~
- ~~should response 400 if username more than 50 character~~
- ~~should response 400 if username contain restricted character~~
- ~~should response 400 if username unavailable~~


### Login (Public)
method: ```POST```
path: ```/authentications```
Scenario test:
- should response 201 and new authentication
- should response 400 if username not found
- should response 401 if password wrong
- should response 400 if payload not contain needed property
- should response 400 if payload has wrong data type

### Refresh Token (Admin & Dosen)
method: ```PUT```
path: ```/authentications```
Scenario test:
- should response 200 and send new access token
- should response 400 if payload not contain refresh token
- should response 400 if refresh token not string
- should response 400 if refresh token not  valid
- should response 400 if refresh token not registered in database

### Logout (Admin & Dosen)
method: ```DELETE```
path: ```/authentications```
Scenario test:
- should response 200 if refresh token valid
- should response 400 if payload not contain refresh token
- should response 400 if refresh token not string
- should response 400 if refresh token not registered in database

### ✅ Dapatkan Semua Pengguna (Admin & Public)
method: ```GET```
path: ```/users```
Scenario test:
- ~~should response 200 and get list of users~~

### ✅ Dapatkan Seorang Pengguna (Admin & Public)
method: ```GET```
path: ```/users/{id}```
Scenario test:
- ~~should response 200 and get a user detail~~
- ~~should response 400 if user not registered in database~~

### ⚠️ Ubah Data Seorang Pengguna (Admin & Dosen)
method: ```PUT```
path: ```/users/{id}```
Scenario test for dosen role:
- should response 200 and update user data
- should response 400 if payload not contain needed property
- should response 400 if payload has wrong data type
- should response 400 if id not registered in database

### ⚠️ Ubah Password Seorang Pengguna (Admin & Dosen)
method: ```PUT```
path: ```/users/{id}```
- should response 201 and update user password
- should response 400 if payload not contain needed property
- should response 400 if payload has wrong data type
- should response 400 if id not registered in database

### Upload Foto Seorang Pengguna (Admin & Dosen)
method: ```POST```
path: ```/users/{id}/photo```
- should response 201 and update user photo
- should response 400 if payload not contain needed property
- should response 400 if payload has wrong data type
- should response 400 if id not registered in database
- should response 400 if payload has no image file
- should response 400 if image file size more than 50kb

### ⚠️ Hapus Data Seorang Pengguna (Admin)
method: ```DELETE```
path: ```/users/{id}```
- ~~should response 200 and delete user data~~
- ~~should response 403 when not the admin who delete the user~~
- should response 400 if payload not contain needed property
- should response 400 if payload has wrong data type
- should response 400 if id not registered in database

