#RESTInPeace

## Set up .env (optional)

To specify environment variables, create a new file named `.env` and see `
.env.example` to see which variables can be specified.


## Setup Database

Create a directory to store the database and start the database server:

`mkdir data`
        
`mongod --dbpath=$PWD/data`


## Seeding Database

To seed the database use the following GET routes:

`/stores/seed`

`/fruits/seed`


## Express API

| Route                  | GET                          | POST                                            | DELETE          |
| ---------------------  |----------------------------- | ----------------------------------------------- | --------------- |
| /stores                | Get all stores               | Create new store                                | N/A             |
| /stores/:id            | Get a store                  | Modify a store {name: , address: , photo:}      | Delete a store  |
| /stores/:id?rating=    | N/A                          | Rate a store                                    | N/A             |
| /fruits                | Get all fruits               | Create a new fruit                              | N/A             |
| /fruits?type=          | Get all fruits with type     | N/A                                             | N/A             |
| /fruits/:id            | Get a fruit                  | Modify a fruit {price: , quantity: , photo:}    | Delete a fruit  |
| /signup                | N/A                          | Create new user                                 | N/A             |
| /login                 | N/A                          | Start user session                              | N/A             |  
| /signout               | End user session             | N/A                                             | N/A             |
| /user                  | N/A                          | Modify a user                                   | N/A             |
