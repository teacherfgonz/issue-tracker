module.exports = {
    /**
     * Port where the server will run
     */
    port: process.env.PORT || 3000,

    /**
     * MongoDB connection parameters
     */

    mongodb: {
        uri: process.env.MONGO_URI || "mongodb://localhost:27017/issue-tracker",
    }
}