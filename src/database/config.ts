const { DB_HOST, DB_PORT, DB_NAME } = process.env;

const dbConfig = {
    url: `mongodb://${DB_HOST}:${DB_PORT}/${DB_NAME}`
}

export default dbConfig;