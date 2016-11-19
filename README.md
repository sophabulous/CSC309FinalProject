#RESTInPeace

## Setup Database

Create a directory to store the database and start the database server:

`mkdir data`
        
`mongod --dbpath=$PWD/data`


## Seeding Database

To seed the database use the following GET routes:

`/stores/seed`

`/fruits/seed`
