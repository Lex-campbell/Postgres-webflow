# Postgres to Webflow Synchronization Service

This is a simple Express.js service that syncs data from a Postgres database to Webflow. The service fetches data from a Postgres database, checks if it exists in a specific Webflow collection, creates new items if they don't exist, updates existing ones if they do, and deletes items that no longer exist in the Postgres database.

## Prerequisites

- Node.js (v14 or newer)
- Access to a PostgreSQL database
- Webflow account and access to the necessary collection

## Getting Started

To get a local copy up and running, follow these steps:

1. Clone the repository:
```
git clone https://github.com/Lex-campbell/Postgres-webflow.git
```

2. Install NPM packages:
```
npm install
```

3. Create a `.env` file in the root directory (use the `.env.example` file as a template) and fill in your actual values.

```plaintext
# Database configuration
DB_HOST=<your-database-host>
DB_PORT=<your-database-port>
DB_USER=<your-database-username>
DB_PASSWORD=<your-database-password>
DB_DATABASE=<your-database-name>

# Webflow configuration
WEBFLOW_AUTH=<your-webflow-authorization-token>
WEBFLOW_API_URL=<your-webflow-api-url>

# App configuration
APP_PORT=<your-app-port>
```

Remember not to commit the `.env` file to your Git repository. It's already included in the `.gitignore` file.

4. Run the server:
```
npm start
```

The server should now be running at `http://localhost:<your-app-port>`.

## Usage

Once your server is running, you can use the `/submitData` endpoint. This endpoint is intended to be triggered when you want to synchronize your Postgres database with your Webflow collection. Here's how you can use it:

1. **Send a POST request to `/submitData`:**

```bash
curl -X POST http://localhost:<your-app-port>/submitData
```

Replace `<your-app-port>` with the port number you've defined in your `.env` file. 

This will trigger the synchronization process. The process follows these steps:

- It fetches the data from your Postgres database using the specified query.
- It checks the existing items in your Webflow collection.
- For each item in your Postgres database:
  - If the item does not exist in your Webflow collection, it creates a new item in the collection.
  - If the item exists in your Webflow collection, it updates the existing item.
- It also checks for any items that exist in your Webflow collection but not in your Postgres database and deletes them from the collection.

**Important:** Be careful when using the `/submitData` endpoint, as it could make significant changes to your Webflow collection.

2. **Monitor the Synchronization Process:**

The service logs each operation it performs to the console. You can monitor these logs to see the progress of the synchronization process. It logs the status and ID for each item it creates, updates, or deletes. 

This endpoint responds with a `200 OK` HTTP status code when the request is received. Note that this does not mean the synchronization process has completed, only that it has started. The process runs asynchronously and can take some time, depending on the amount of data.

Please note that this is a very simple service and does not provide error handling or any advanced features. If you need more complex functionality, consider further development or find a more sophisticated solution.

## Contributing

Any contributions you make are greatly appreciated. Please follow these steps to contribute:

1. Fork

 the project
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

Distributed under the MIT License. See `LICENSE` for more information.
