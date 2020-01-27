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

### Racks

The racks table has 3 columns:

- `identifier` (primary key) - unique identifier
- `row_letter` - row letter
- `row_number` - row number

### Instances

The instances table has 8 columns:

- `identifier` (primary key) - unique identifier
- `model_id` - identifier of model database entry
- `hostname` - host name
- `row_letter` - row letter of rack
- `row_number` - row number of rack
- `rack_u` - vertical position in rack
- `owner` - owner username
- `comment` - comment

## Routes

The following routes are available to interact with the database:

### Users

`GET /db/user/<string:username>` - get a user

`POST /db/user/create` - create a user

### Racks

`GET /db/rack/<string:row_letter>-<string:row_number>` - get a rack

`POST /db/rack/create` - create a user

### Instances

`GET /db/instance/<int:identifier>` - get an instance

`POST /db/instance/create` - create an instance
