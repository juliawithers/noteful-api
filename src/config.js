module.exports = {
    PORT: process.env.PORT || 8000,
    NODE_ENV: process.env.NODE_ENV || 'development',
    // whatever api token or anything else to add?
    DB_URL: "postgresql://postgres@localhost/noteful"
    
}