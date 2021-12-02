# Backend_Dev_CA1

This is the Backend Development CA1 Project for School Year 1 Semester 1.
This project supports API with a self-hosted SQL database with the provided SQL init file.

## Contents

- [Features](#Features)
- [Setup](#Setup)
- [dotENV](#dotENV)
- [API_Endpoints](#API_Endpoints)

## Features

This project supports the following API:
- Adds new user to database
- Returns all active users in database
- Returns single user given their userid
- Updates single user 
- Adds new category to database
- Returns all category
- Adds new product to database
- Returns product given its productid
- Deletes a product given its productid
- Adds a review for a product listing
- Returns all review of a particular product, along with the username of reviewer
- Adds a category interest under a user with a many-to-many relation

## Setup

Following are 
- Install dependencies with `npm install`
- Run the SQL query in it_product_db_init_with_data.sql to generate a new schema "it_products" along with all structured tables and datas.
- Create a `.env` file in the main project folder, with the variables: 
    - `DB_HOST` with the MySQL database host, if it's locally hosted, put `localhost`
    - `DB_USER` with the user for MySQL database, if it's not changed, it should be `root` by default
    - `DB_PORT` with the port number of the MySQL server host
    - `DB_PASS` with the MySQL server's user `DB_USER` password
- Run the server with `node server.js` in the main project folder with the command line
- Server's API will now be hosted on the URL `DB_HOST`:`DB_PORT`

## dotENV

Following is the example of dotENV set-up:
```sh
DB_HOST = localhost
DB_USER = root
DB_PORT = 8081
DB_PASS = password12!
```

## API_Endpoints

_To be completed_