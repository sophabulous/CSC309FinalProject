#RESTInPeace

## Set up .env (optional)

To specify environment variables, create a new file named `.env` and see `
.env.example` to see which variables can be specified.


## Setup Database

Create a directory to store the database and start the database server:

`mkdir data`
        
`mongod --dbpath=$PWD/data`

## Run Node

`node app.js` 

The first time Node starts up, it will automatically seed the datbase. In order to reseed the database, use the following command when starting node:

`node app.js reseed`

## Express API

| Route                 |QUERY PARAMS                | GET                          | POST                                                               | DELETE          |
| --------------------- | -------------------------- |----------------------------- | ------------------------------------------------------------------ | --------------- |
| /stores               |                            | Get all stores               | Create new store {storeID, name, address}                          | N/A             |
| /stores/:id           |                            | Get a store                  | Modify a store {name, address, photo}                              | Delete a store  |
| /rate/:id             |                            | N/A                          | Rate a store   {rating}                                            | N/A             |
| /fruits               | type, season, storeId      | Get all fruits               | Create a new fruit  {storeId, type, season, price, quantity, unit} | N/A             |
| /fruits/:id           |                            | Get a fruit                  | Modify a fruit {price, quantity, photo, unit}                      | Delete a fruit  |
| /signup               |                            | N/A                          | Create new user {name, address, email, username, password}         | N/A             |
| /login                |                            | N/A                          | Start user session  {username, password}                           | N/A             |  
| /signout              |                            | End user session             | N/A                                                                | N/A             |
| /users                |                            | Get all users                | N/A                                                                | N/A             |
| /users/:id            |                            | Get a user                   | Modify a user {name, address, email, photo}                        | Delete a user   |
| /carts                |                            | Get all carts                | N/A                                                                | N/A             |
| /carts/:id            |                            | Get a cart                   | Modify a cart {fruitID, quantity}                                  | Delete a cart   |
| /checkout/:id         |                            | N/A                          | Deletes a cart and creates an order                                | N/A             |
| /orders               | username                   | Get all orders               | N/A                                                                | N/A             |
| /orders:id            |                            | Get an order                 | N/A                                                                | N/A             |
| /comments             | username, storeId, fruitId | Get all comments             | N/A                                                                | N/A             |  
| /comments/fruits      |                            |                              | Add a fruit comment                                                | N/A             |
| /comments/stores      |                            |                              | Add a store comment                                                | N/A             |
| /comments/:id         |                            |                              |                                                                    | Delete a comment|
