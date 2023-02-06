# API Absen Dosen
Ini adalah API yang dibuat khusus untuk melayani absensi dosen

## Registrasi pengguna (Admin & Dosen)
method: ```POST```
path: ```/users```
body request:
```json
{
	"username": string,
	"fullname": string,
	"password": string,
}
```
status code: ```201```
response body:
```json
{
	"status": "success",
	"data": {
		"addedUser": {
			"id": "user-123",
			"username": "dosen1",
			"fullname": "Jhon Doe",
		},
	},
}
```
## Login (Public)
method: ```POST```
path: ```/authentications```
body request:
```json
{
	"username": string,
	"password": string,
}
```
status code: ```201```
response body:
```json
{
	"status": "success",
	"data": {
		"accessToken": "jwt8uu9i0",
		"refreshToken": "lkijijjhu234",
	},
}
```
## Refresh Token (Admin & Dosen)
method: ```PUT```
path: ```/authentications```
body request:
```json
{
	"refreshToken": string,
}
```
status code: ```200```
response body:
```json
{
	"status": "success",
	"data": {
		"accessToken": "jwt8uu9i0",
	},
}
```
## Logout (Admin & Dosen)
method: ```DELETE```
path: ```/authentications```
body request:
```json
{
	"refreshToken": string,
}
```
status code: ```200```
response body:
```json
{
	"status": "success",
}
```
## Dapatkan Semua Pengguna (Admin & Public)
method: ```GET```
path: ```/users```
body request:
```json
{}
```
status code: ```200```
response body:
```json
{
	"status": "success",
	"data": [
		{
			"id": "dosen-123",
			"photo_url": "http://localhost:5000/upload/images/photo.jpg",
			"fullname": "Jhon Doe",
			"username": "jhondoe",
			"statusKehadiran": "hadir",
			"golongan": "4A",
			"nip": "1999150320241503",
			"nidn": "20241503",
			"jabatanFungsional": "Pranata 1",
			"jabatanStruktural": "Lektor",
		},
		{
			"id": "dosen-456",
			"photo_url": "http://localhost:5000/upload/images/cover.jpg",
			"fullname": "Jene Doe",
			"username": "jenedoe",
			"statusKehadiran": "sedang rapat",
			"golongan": "4A",
			"nip": "1999150320241503",
			"nidn": "20241503",
			"jabatanFungsional": "Pranata 1",
			"jabatanStruktural": "Lektor",
		},
	],
}
```
## Dapatkan Seorang Pengguna (Admin & Public)
method: ```GET```
path: ```/users/{id}```
body request:
```json
{
	"id": string,
}
```
status code: ```200```
response body:
```json
{
	"status": "success",
	"data": {
		"id": "dosen-123",
		"photo_url": "http://localhost:5000/upload/images/photo.jpg",
		"fullname": "Jhon Doe",
		"username": "jhondoe",
		"statusKehadiran": "hadir",
		"golongan": "4A",
		"nip": "1999150320241503",
		"nidn": "20241503",
		"jabatanFungsional": "Pranata 1",
		"jabatanStruktural": "Lektor",
	},
}
```

## Ubah Data Seorang Pengguna (Admin & Dosen)
method: ```PUT```
path: ```/users/{id}```
body request:
```json
{
	"fullname": string,
	"statusKehadiran": string,
	"golongan": string,
	"nip": string,
	"nidn": string,
	"jabatanFungsional": string,
	"jabatanStruktural": string,
}
```
status code: ```200```
response body:
```json
{
	"status": "success",
	"message": "data berhasil diubah",
}
```

## Ubah Password Seorang Pengguna (Admin & Dosen)
method: ```PUT```
path: ```/users/{id}```
body request:
```json
{
	"password": string,
}
```
status code: ```200```
response body:
```json
{
	"status": "success",
	"message": "passwordberhasil diubah",
}
```
## Upload Foto Seorang Pengguna (Admin & Dosen)
method: ```POST```
path: ```/users/{id}/photo```
body request:
```json
{
	"photo": file,
}
```
status code: ```201```
response body:
```json
{
	"status": "success",
	"message": "foto profil berhasil diubah",
}
```
## Hapus Data Seorang Pengguna (Admin)
method: ```DELETE```
path: ```/users/{id}```
body request:
```json
{
	"id": string
}
```
status code: ```200```
response body:
```json
{
	"status": "success",
	"message": "User berhasil dihapus",
}
```
