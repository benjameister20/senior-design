# Database

The database used in this project is PostgresSQL.

## Local Setup

You must install `postgresql` locally.

### MacOS

`brew install postgresql` - installs `postgresql`

`brew services start postgresql` - runs the database server on localhost

`brew services stop postgresql` - stops the database server on localhost

`make setup-db` - creates the `test` database and all tables

## Tables

### Users

The users table has 4 columns:

- `username` (primary key) - username
- `password_hash` - hashed password
- `display_name` - user friendly display name
- `email` - user's email

To interact directly with the users table, run `make users`
