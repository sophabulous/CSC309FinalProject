#RESTInPeace

Checkout out the live website [here](https://ripefruitsuoft.herokuapp.com).


## Set up .env (optional)

To specify environment variables, create a new file named `.env` and see `.env.example` to see which variables can be specified. You can do this manually or run the following command:

`node setup.js`

Node that the admin seed was created using a secret SECRET variable. To have access to an admin, you will need to hash a password using your own secret and replace the admin password in `app/seed/seed-db.json`

## Setup Database

Create a directory to store the database and start the database server:

`mkdir data`

## Start Node and MongoDB

`npm start`

The first time Node starts up, it will automatically seed the database. In order to clear the database and restart with the initial seed use the following command when starting node:

`npm reseed`

## Express API

| Route                 |QUERY PARAMS                | GET                                  | POST                                                                            | DELETE                      |
| --------------------- | -------------------------- |------------------------------------- | ------------------------------------------------------------------------------- | --------------------------- |
| /stores               |                            | Get all stores                       | Create new store {storeID, name, address.street, address.city, address.province, address.postalcode}  <sup>1</sup>                         | N/A                         |
| /stores/:id (storeId) |                            | Get a store                          | Modify a store {name<sup>†</sup>, address.street<sup>†</sup>, address.city<sup>†</sup>, address.province<sup>†</sup>, address.postalcode<sup>†</sup>, photo<sup>†</sup>} <sup>1</sup>                              | Delete a store <sup>1</sup> |
| /rate/:id (storeId)   |                            | N/A                                  | Rate a store   {rating}       <sup>2</sup>                                      | N/A                         |
| /fruits               | type, season, storeId      | Get all fruits                       | Create a new fruit  {storeId, type, season, price, quantity, unit} <sup>1</sup> | N/A                         |
| /fruits/:id (Fruit _id)|                            | Get a fruit                          | Modify a fruit {price<sup>†</sup>, quantity<sup>†</sup>, photo<sup>†</sup>, unit<sup>†</sup>} <sup>1</sup>                      | Delete a fruit <sup>1</sup> |
| /signup               |                            | N/A                                  | Create new user {name, address.street, address.city, address.province, address.postalcode, email, username, password, conrimpassword}                      | N/A                         |
| /login                |                            | N/A                                  | Start user session  {username, password}                                        | N/A                         |  
| /signout              |                            | End user session  <sup>2</sup>       | N/A                                                                             | N/A                         |
| /users                |                            | Get all users <sup>1</sup>           | N/A                                                                             | N/A                         |
| /users/:id (username) |                            | Get a user <sup>2</sup>              | Modify a user {name<sup>†</sup>, address.street<sup>†</sup>, address.city<sup>†</sup>, address.province<sup>†</sup>, address.postalcode<sup>†</sup>, email<sup>†</sup>, photo<sup>†</sup>}  <sup>2</sup>                       | Delete a user  <sup>1</sup> |
| /carts                |                            | Get all carts <sup>1</sup>           | N/A                                                                             | N/A                         |
| /carts/:id (username) |                            | Get a cart  <sup>2</sup>             | Modify a cart {fruitID, quantity} <sup>2</sup>                                  | Delete a cart <sup>2</sup>  |
| /checkout/:id (username)|                            | N/A                                  | Deletes a cart and creates an order <sup>2</sup>                                | N/A                         |
| /orders               | username                   | Get all orders <sup>1</sup>          | N/A                                                                             | N/A                         |
| /orders:id (Order _id)|                            | Get an order <sup>2</sup>            | N/A                                                                             | N/A                         |
| /comments             | username, storeId, fruitId | Get all comments <sup>1</sup>        | N/A                                                                             | N/A                         |  
| /comments/fruits      |                            |                                      | Add a fruit comment <sup>2</sup>                                                | N/A                         |
| /comments/stores      |                            |                                      | Add a store comment <sup>2</sup>                                                | N/A                         |
| /comments/:id (Comment _id) |                            |  N/A                                 | N/A                                                                             | Delete a comment <sup>1</sup>|  
<sup>1</sup>: Requires admin
<sup>2</sup>: Requires logged in 
<sup>†</sup>: Optional
