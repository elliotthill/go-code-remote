export default {
    "development": {
        "username": "root",
        "password": "root",
        "database": "testing",
        "host": "127.0.0.1",
        "port": 3306,
        "dialect": "mysql",
        "dialectOptions": {
            "charset": "utf8mb4"
        },
        "pool": {
            "max": 10,
            "min": 0,
            "idle": 10000
        },
        "logging": false
    },
    "docker": {
        "username": "root",
        "password": "root",
        "database": "testing",
        "host": "db",
        "port": 3307,
        "dialect": "mysql",
        "dialectOptions": {
            "charset": "utf8mb4"
        },
        "pool": {
            "max": 10,
            "min": 0,
            "idle": 10000
        },
        "logging": false
    },
    "production": {
        "username": process.env.DB_USERNAME,
        "password": process.env.DB_PASSWORD,
        "database": process.env.DB_DATABASE,
        "host": process.env.DB_HOST,
        "port": 3306,
        "dialect": "mysql",
        "dialectOptions": {
            "charset": "utf8mb4"
        },
        "pool": {
            "max": 10,
            "min": 0,
            "idle": 10000
        },
        "logging": false
    }
};
