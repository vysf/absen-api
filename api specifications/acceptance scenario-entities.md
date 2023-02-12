
# Acceptance Scenario- Entities

### ✅ 1. ```RegisterUser(payload)```
```javascript
RegisterUser({ fullname, username, password })
```
Skenario test:
- ~~Ketika payload tidak lengkap~~
	- ~~Maka ```Error(REGISTER_USER.NOT_CONTAIN_NEEDE_PROPERTY)```~~
- ~~Ketika payload tidak sesuai tipe data~~
	- ~~Maka ```Error(REGISTER_USER.NOT_MEET_DATA_TYPE_SPECIFICATION)```~~
- ~~Ketika username > 50 karakter~~
	- ~~Maka ```Error(REGISTER_USER.USERNAME_LIMIT_CHAR)```~~
- ~~Ketika username mengandung spasi~~
	- ~~Maka ```Error(REGISTER_USER.USERNAME_CONTAIN_RESTRICTED_CHARACTER)```~~

### ✅ 2. ```RegisteredUser(payload)```
```javascript
RegisteredUser({ id, fullname, username })
```
Skenario test:
- ~~Ketika payload tidak lengkap~~
	- ~~Maka ```Error(REGISTERED_USER.NOT_CONTAIN_NEEDE_PROPERTY)```~~
- ~~Ketika payload tidak sesuai tipe data~~
	- ~~Maka ```Error(REGISTERED_USER.NOT_MEET_DATA_TYPE_SPECIFICATION)```~~

### ✅ 3. ```NewAuth(payload)```
```javascript
 NewAuth({ accessToken, refreshToken })
```
Skenario test:
- ~~Ketika payload tidak lengkap~~
	- ~~Maka ```Error(NEW_AUTH.NOT_CONTAIN_NEEDE_PROPERTY)```~~
- ~~Ketika payload tidak sesuai tipe data~~
	- ~~Maka ```Error(NEW_AUTH.NOT_MEET_DATA_TYPE_SPECIFICATION)```~~

### ✅ 4. ```UserLogin(payload)```
```javascript
 NewAuth({ username, password })
```
Skenario test:
- ~~Ketika payload tidak lengkap~~
	- ~~Maka ```Error(USER_LOGIN.NOT_CONTAIN_NEEDE_PROPERTY)```~~
- ~~Ketika payload tidak sesuai tipe data~~
	- ~~Maka ```Error(USER_LOGIN.NOT_MEET_DATA_TYPE_SPECIFICATION)```~~

### ✅ 5. ```DetailUser(payload)```
```javascript
DetailUser({
	id,
	photo_url,
	fullname,
	username,
	statusKehadiran,
	golongan,
	nip,
	nidn,
	jabatanFungsional,
	jabatanStruktural,
})
```
Skenario test:
- ~~Ketika payload tidak lengkap~~
	- ~~Maka ```Error(DETAIL_USER.NOT_CONTAIN_NEEDE_PROPERTY)```~~
- ~~Ketika payload tidak sesuai tipe data~~
	- ~~Maka ```Error(DETAIL_USER.NOT_MEET_DATA_TYPE_SPECIFICATION)```~~
