#RESTInPeace's RIPeFruts App

Checkout out the live website [here](https://ripefruitsuoft.herokuapp.com).


## Set up .env (optional)

To specify environment variables, create a new file named `.env` and see `.env.example` to see which variables must be specified. You can do this manually or run the following command:

`node setup.js`

Note that the admin seed was created using a secret SECRET variable. To have access to an admin, you will need to hash a password using your own secret and replace the admin password in `app/seed/seed-db.json`

## Setup Database

Create a directory to store the database and start the database server:

`mkdir data`

## Start Node and MongoDB

`npm start`

or

`mongod --dbpath data`

`node app.js`

When Node starts up, it will check if the database is empty automatically seed the database if it is. In order to clear the database and restart with the initial seed use the following command when starting node:

`npm reseed`

or

`mongod --dbpath data`

`node app.js reseed`


## Web Interface

Admin status and username is stored in a cookie on the front end in order to restrict viewing parts of the site and completing restricted actions.

The app supports the following features

**Visitors/Signed in/Admin**
 * Home page is a view of all stores (same as clicking stores on the sidebar)
 * View all products by choosing products in the side bar
    * Filter by season on the products page
 * View the details of a specific product by clicking on its photo
    * type
    * store
    * unit of sale (ie weight of package or weight of single item)
    * price
    * view comments
 * View all stores by choosing stores in the side bar
 * View the details of a specific store by clicking on its photo
    * name
    * address
    * view of all available procuts (photo can be clicked on to jump to that product)
    * view comments

**Visitor only**
    * Sign in
        * requires valid username and password
    * Sign up
        * requires unique username and email

**Admin and Signed in only**

* View account page to see
    * user type
    * username
    * first and last name
    * email
    * address
    * photo
    * **all orders ?**
* Modify account info
    * first and last name
    * email
    * address
    * photo
* View cart
* Add products to cart
* Add comments to stores and products
* Checkout
    * Deletes cart, but creates an order

**Admin only**
* See all users by choosing users in sidebar
* See all carts by choosing carts in sidebar
* Delete button appears beside products and stores in the full list view and will delete that single item
* Stores and products can be **added ?**
* Stores and products can be modified by an edit button visible only to admins on the store/product detail page


Did not manage to complete rating stores on the front end, but ratings can be viewed in the Stores view

## Backend features

Sessions are used to track username and admin status. Some features are blocked by the server to users with different permission levels (visitor, signed in, admin.

Most of the validation is done in the Mongo schemas. Descriptive error messages are used to enforce unique and required fields in the database.

Some validation is done on the server when checking signup and login fields before sending to database.

Virtuals are used in database to get relationships between stores, products, users and comments.

Errors are always sent in JSON format {msg: error}. For POST and DELETE a success is represented as {msg: 'Success'}


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

## Get responses

###/stores
```
{
[
      {
            "storeId": ,
            "name": ,
            "rateValue": ,
            "rateCount": ,
            "photo": "",
            "address": {
              "street": "",
              "city": "",
              "province": "",
              "postalcode": ""
            },
            "comments": [] or null,
            "fruits": null
      }
]
}
```

###/stores/:id (Store storeId)
```
{
    "storeId": """,
    "name": """,
    "rateValue": ,
    "rateCount": ,
    "photo": "",
    "address": {
      "street": "",
      "city": "",
      "province": "",
      "postalcode": ""
    },
    "comments": [{
        "storeId": "",
        "username": "",
        "message": "",
        "user": {
            "username": "",
            "photo": ""
        }
    }],
    "fruits": [{
      "_id": "",
      "storeId": "",
      "type": "",
      "season": "",
      "unit": "",
      "quantity": ,
      "price": ,
      "photo": "",
      "comments": null,
    }],
}
```

###/fruits
```
{
[
      {
          "_id": "",
          "storeId": "",
          "type": "",
          "season": "",
          "unit": "",
          "quantity": ,
          "price": ,
          "photo": "",
          "comments": null,
      }
]
}
```

###/fruits/:id (Fruit _id)
```

{
  "_id": "",
  "storeId": "",
  "type": "",
  "season": "",
  "unit": "",
  "quantity": ,
  "price": ,
  "photo": "",
  "comments": [{
      "storeId": "",
      "username": "",
      "message": "",
      "user": {
         "username": "",
         "photo": ""
      }
  }]
}

```

###/signout
```
{
  "msg": "Success"
}
```

###/users
```
[
  {
    "_id": ""
    "username": "",
    "firstname": "",
    "lastname": "",
    "email": "",
    "photo": "",
    "address": {
      "street": "",
      "city": "",
      "province": "",
      "postalcode": ""
    },
    "admin":
  }
]
```

###/users/:id (User username)
```
{
    "_id": ""
    "username": "",
    "firstname": "",
    "lastname": "",
    "email": "",
    "photo": "",
    "address": {
      "street": "",
      "city": "",
      "province": "",
      "postalcode": ""
    },
    "admin":
}
```

###/carts
```
[
  {
    "_id": "",
    "username": ""
    "lastUpdated": "",
    "total": ,
    "items": [
      {
        "fruit": {
          "_id": "",
          "storeId": "",
          "type": "",
          "season": "",
          "unit": "",
          "quantity": ,
          "price": ,
          "photo": "",
          "comments": [],
          "id": ""
        }
        "quantity":
      }
    ]
  }
]
```

###/carts/:id (User username)
```
{
  "_id": "",
  "username": "",
  "lastUpdated": "",
  "total": ,
  "items": [
    {
      "fruit": {
        "_id": "",
        "storeId": "",
        "type": "",
        "season": "",
        "unit": "",
        "quantity": ,
        "price": ,
        "photo": "",
        "comments": [],
        "id": ""
      },
      "quantity":
    }
  ]
}
```

###/orders/
```
[
  {
    "_id": "",
    "username": "",
    "createdAt": "",
    "total": ,
    "items": [
      {
        "id": "",
        "price": ,
        "storeId": "",
        "type": "",
        "quantity": ,
      }
    ]
  }
]
```

###/orders/:id (Order _id)
```

{
    "_id": "",
    "username": "",
    "createdAt": "",
    "total": ,
    "items": [
      {
        "id": "",
        "price": ,
        "storeId": "",
        "type": "",
        "quantity": ,
      }
    ]
}

```

##/comments
```
[
  {
    "_id": "",
    "username": "",
    "message": "",
    "fruitId": "", // or storeId
    "created": "",
    "user": null,
    "id": ""
  }
]
```
