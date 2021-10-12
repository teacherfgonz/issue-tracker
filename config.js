module.exports = {
    /**
     * Port where the server will run
     */
    port: process.env.PORT || 3000,

    session: {
        secret: process.env.APP_SECRET || "StrongSecret",
        cookieName: process.env.SESSION_COOKIE_NAME || 'issue_tracker_session',
    },

    /**
     * MongoDB connection parameters
     */

    mongodb: {
        uri: process.env.MONGO_URI || "mongodb://localhost:27017/issue-tracker",
    }
}