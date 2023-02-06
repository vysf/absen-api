```mermaid
erDiagram
    USERS {
        varchar id
        varchar fullname
        varchar username
        varchar golongan
        varchar nip
        varchar nidn
        varchar pangkat
        varchar jabatan_struktural
        varchar jabatan_fungsional
        varchar password
        varchar role
        text photo_url
        text created_at
        text updated_at
    }
    AUTHENTICATIONS {
        text token
    }
```
