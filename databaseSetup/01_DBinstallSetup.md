# install

--Install MongoDB with Homebrew-- // if needed use sudo

brew install mongodb
mkdir -p /data/db

--Set permissions for the data directory--
sudo chmod 0755 /data/db
sudo chown $USER /data/db

--Run MongoDB!--
iTerm buffer 1: mongod
iTerm buffer 2: mongo


# instructions

//SHOW EXISTING TABLES(COLLECTIONS)

show collections;


//SHOW CONTENT OF TABLE(COLLECTION)

db.users.find()    //showing all elements of users table
db.properties.find()    //showing all elements of properties table
