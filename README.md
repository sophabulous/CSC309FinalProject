#RESTInPeace

## Setup Database

Create a directory to store the database and start the database server:

`
mkdir data
mongod --dbpath=$PWD/data
`


## Seeding Database

Use the following commands to import data into the database:

`mongoimport --db fruitsdb --collection fruits --type json --file fruits-data.json --jsonArray`

`mongoimport --db storesdb --collection stores --type json --file stores-data.json --jsonArray`