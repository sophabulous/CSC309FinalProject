#RESTInPeace's RIPeFruts App

Checkout out the live website [here](https://ripefruitsuoft.herokuapp.com).


Checkout out the live website [here](https://ripefruitsuoft.herokuapp.com).


## Set up .env (optional)

To specify environment variables, create a new file named `.env` and see `.env.example` to see which variables must be specified. You can do this manually or run the following command:

`node setup.js`

Note that the admin seed was created using a secret SECRET variable. To have access to an admin, you will need to hash a password using your own secret and replace the admin password in `app/seed/seed-db.json`

A quick and hacky way for the TA that marks this to bypass authentication on the backend is to modify all functions in `app/services/authorize.js` to always return true.

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
    * view of all available products (photo can be clicked on to jump to that product)
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
* Stores can be added in the stores page view
* Product can be added in the store detail page view
* Stores and products can be modified by an edit button visible only to admins on the store/product detail page


Did not manage to complete rating stores on the front end, but ratings can be viewed in the Stores view. Also, the cart page doesn't allow users to update the cart there. Products and only be added to a cart from a prodcut detail page and there's no way to delete them.

## Backend features

Sessions are used to track username and admin status. Some features are blocked by the server to users with different permission levels (visitor, signed in, admin.

Most of the validation is done in the Mongo schemas. Descriptive error messages are used to enforce unique and required fields in the database.

Some validation is done on the server when checking signup and login fields before sending to database.

Virtuals are used in database to get relationships between stores, products, users and comments.

Errors are always sent in JSON format `{msg: error}`. For POST and DELETE a success is represented as `{msg: 'Success'}`.

The shopping cart, regretfully, does not "reserve" items. This means that when a user tries to "checkout" parts of their order may not be available. In this case, a "Partial Success" response is sent and the order goes through with only the items that were available. All items that were available for the order, will then be removed from inventory (quantity of fruit item decreases in database) and the order will only contain these items. Decided to make the carts expire after an hour since they were last modified.

## Express API

| ROUTE                | QUERY                      | GET                                  | POST                                              | DELETE                       |
| -------------------- | -------------------------- |------------------------------------- | ------------------------------------------------- | ---------------------------- |
| /stores              |                            | Get all stores                       | Create new store <sup>1</sup>                     | N/A                          |
| /stores/:id          |                            | Get a store                          | Modify a store  <sup>1</sup>                      | Delete a store <sup>1</sup>  |
| /rate/:id            |                            | N/A                                  | Rate a store  <sup>2</sup>                        | N/A                          |
| /fruits              | type, season, storeId      | Get all fruits                       | Create a new fruit  <sup>1</sup>                  | N/A                          |
| /fruits/:id          |                            | Get a fruit                          | Modify a fruit <sup>1</sup>                       | Delete a fruit <sup>1</sup>  |
| /signup              |                            | N/A                                  | Create new user                                   | N/A                          |
| /login               |                            | N/A                                  | Start user session                                | N/A                          |
| /signout             |                            | End user session  <sup>2</sup>       | N/A                                               | N/A                          |
| /users               |                            | Get all users <sup>1</sup>           | N/A                                               | N/A                          |
| /users/:id           |                            | Get a user <sup>2</sup>              | Modify a user<sup>2</sup>                         | Delete a user  <sup>1</sup>  |
| /carts               |                            | Get all carts <sup>1</sup>           | N/A                                               | N/A                          |
| /carts/:id           |                            | Get a cart  <sup>2</sup>             | Modify a cart <sup>2</sup>                        | Delete a cart <sup>2</sup>   |
| /checkout/:id        |                            | N/A                                  | Deletes a cart and creates an order <sup>2</sup>  | N/A                          |
| /orders              | username                   | Get all orders <sup>1</sup>          | N/A                                               | N/A                          |
| /orders:id           |                            | Get an order <sup>2</sup>            | N/A                                               | N/A                          |
| /comments            | username, storeId, fruitId | Get all comments <sup>1</sup>        | N/A                                               | N/A                          |
| /comments/fruits/:id |                            |  N/A                                 | Add a fruit comment <sup>2</sup>                  | N/A                          |
| /comments/stores/:id |                            |  N/A                                 | Add a store comment <sup>2</sup>                  | N/A                          |
| /comments/:id        |                            |  N/A                                 | N/A                                               | Delete a comment <sup>1</sup>|
<sup>1</sup>: Requires admin
<sup>2</sup>: Requires logged in

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

## POST JSON data expectations

###/stores
```
{
   "storeId": "",
   "name": "",
   "address": {
       "street": "",
       "city": "",
       "province": "",
       "postalcode": ""
   }
}
```

###/stores/:id (Store storeId)
```
{
   "storeId": "", // optional
   "name": "", // optional
   "address": {
       "street": "", // optional
       "city": "", // optional
       "province": "", // optional
       "postalcode": "" // optional
   }
   "photo": "" // optional URL
}
```

###/rate/:id (Store storeId)
```
{
    "rating": // Integer
}
```
###/fruits
```
{
    "storeId": "",
    "type": "",
    "season": "",
    "unit": "",
    "quantity": "",
    "price": "",
    "photo": "" // optional URL
}
```

###/fruits/:id (Fruit _id)
```
{
    "unit": "", // optional
    "quantity": "", // optional
    "price": "", // optional
    "photo": "" // optional URL
}
```

###/signup
```
{

   "username": "",
   "password": "",
   "confirmpassword": "",
   "firstname": """,
   "lastname": """,
   "address": {
       "street": "",
       "city": "",
       "province": "",
       "postalcode": "",
       }
   "email": ""
}
```

###/login
```
{
   "username": "",
   "password": ""
}
```

###/users/:id (User username)
```
{
   "firstname": """, // optional
   "lastname": """, // optional
   "address": {
       "street": "", // optional
       "city": "", // optional
       "province": "", // optional
       "postalcode": "" // optional
       }
   "email": "", // optional
   "photo": "" // optional URL
}
```

###/carts/:id (User username)
```
{
   "fruitId": """,
   "quantity": """
}
```

###/checkout/:id (User username)
```
{
}
```

###/comments/fruits/:id (Fruit _id)
```
{
    "username": "",
    "message": ""
}
```

###/comments/stores/:id (Store storeId)
```
{
    "username": "",
    "message": ""
}
```
