

You will need to create 2 Databases;

istay and istay test. To do this, follow these instructions:



#Setting up a Database:

```
$ mongod

In a seperate terminal window:

$ mongo

```

```
use istaytest;
```
###CREATING TABLE (COLLECTION):

```
db.createCollection('users')
db.createCollection('properties')
```

###CREATE INDEXES:

```
db.users.createIndex( { "email" : 1 }, { unique : true } )
```
