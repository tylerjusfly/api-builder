# Managing the Prisma Database

This guide explains how to set up, manage, and reset the SQLite database using Prisma in this project.

## Initial Database Setup

If you are setting up the project for the first time or if the local database file (`dev.db`) is missing, you need to generate it and apply the existing data schema.

Run the following command in your terminal:

```bash
npx prisma migrate dev
```

This command does three things:

1.  **Creates the Database**: It creates a new SQLite database file named `dev.db` in the `prisma` directory.
2.  **Applies Migrations**: It runs all the existing migration files from the `prisma/migrations` directory to set up the database schema (tables, columns, etc.).
3.  **Generates Prisma Client**: It ensures the Prisma Client is up-to-date with the database schema.

## Making Changes to the Database Schema

Whenever you change your data model in the `prisma/schema.prisma` file, you must create a new migration to apply those changes to the database.

1.  **Modify `schema.prisma`**: Make your desired changes (e.g., add a new model or a field).

2.  **Run `migrate dev`**: Execute the following command:

    ```bash
    npx prisma migrate dev --name <your_migration_name>
    ```

    Replace `<your_migration_name>` with a short, descriptive name for your change (e.g., `add-user-avatar-url`).

    This will create a new SQL migration file and apply it to your database.

## Resetting the Database

If you need to completely reset your local database and start fresh, you can do so by deleting the `prisma/dev.db` file and then running the setup command again.

1.  **Delete the database file**:

    ```bash
    rm prisma/dev.db
    ```

2.  **Re-initialize the database**:

    ```bash
    npx prisma migrate dev
    ```

This will give you a clean, empty database that matches the current schema.
