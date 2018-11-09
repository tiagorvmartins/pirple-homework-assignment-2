# pirple-homework-assignment-2
This is my public repo for the Pirple Homework Assignment #2

## API Definition

### /users

- [POST]  http://localhost:3000/users

Example payload request:

{
    "name": "Your Name",
    "emailAddress": "your_address@your_domain.com",
    "streetAddress": "your street address",
    "password": "yourpassword"
}


- [GET]  http://localhost:3000/users?id=a688f4dbc11ead7d9902ef10347e2eebec1c9eae38521cfb3e6bc19aa0c1df98

Requires authentication in header, the token key like this:

token : 3vwqxudaw6fmf9sowjdu

The id is the hashed emailAddress, such that the system allows unique users with their unique emailAddress.

- [PUT]  http://localhost:3000/users

Requires authentication in header, the token key like this:

token : 3vwqxudaw6fmf9sowjdu

{
	"id": "a688f4dbc11ead7d9902ef10347e2eebec1c9eae38521cfb3e6bc19aa0c1df98",    //required field
	"name":"New Name",
	"streetAddress":"New Street",
	"password":"NewPassword"
}

- [DELETE] http://localhost:3000/users?id=a688f4dbc11ead7d9902ef10347e2eebec1c9eae38521cfb3e6bc19aa0c1df98

Requires authentication in header, the token key like this:

token : 3vwqxudaw6fmf9sowjdu

Note: it removes the token associated with the user.


### /login

- [POST]  http://localhost:3000/login

{
	"emailAddress": "your_address@your_domain.com",
	"password": "NewPassword"

}

Note: it doesn't create more tokens if there is already a valid (not expired) token for the user.

- [POST]  http://localhost:3000/logout

Requires authentication in header, the token key like this:

token : 3vwqxudaw6fmf9sowjdu

Note: it removes the token from the system itself.

###### *Note: Public and Private key generated using a third-party library (at https://wiki.openssl.org/index.php/Binaries) of OpenSSL.*
