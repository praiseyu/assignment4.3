# Initialization Instructions

1. **Install dependencies**

```bash
npm install
```

2. **Set up environment variables**

Create a `.env` file in the root directory and add your environment variables based on the .env.example file.

3. **Connect the database**
   This was created with MySQL. Create a connection with whichever application you would like using your own host, username, password, with a database name of "blogs".

4. **Run database migrations**
   In the terminal:

```bash
knex migrate:latest
```

5. **Seed the database**
   In the terminal:

```bash
knex seed:run
```

6. **Run the program**
   In the terminal:

```bash
node index.js
```

7. **Open in browser**
   In your browser of choice, navigate to "http://localhost:{port of choice}"
