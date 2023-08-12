# Requirements

1. NodeJS
2. Yarn
3. MySQL 8.0 (MySQL server or docker)
4. VScode extensions: eslint, prettier

# Initial setup

-   Copy file `.env.example` to `.env`
-   SQL server running at port 3306, with DB, username, password the same as in `.env` file

```
docker-compose up -d
```

-   Install required library packages:

```
yarn install
```

-   Migrate DB tables:

```
yarn typeorm migration:run
```

-   Run seeding:

```
yarn typeorm:seeding seed
```

# Running application

-   Run development API server

```
yarn start:dev

```

# Development commands

-   Generate migration:

```
yarn typeorm migration:generate src/database/migrations/MigrationLabel -p
```

-   Run specified seed:

```
yarn typeorm:seeding seed -s ClassName
```
