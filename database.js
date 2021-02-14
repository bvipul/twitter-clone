const mongoose = require('mongoose');

mongoose.set('useNewUrlParser', true);
mongoose.set('useUnifiedTopology', true);
mongoose.set('useFindAndModify', false);

class Database {
    constructor() {
        this.connect();
    }

    connect() {
        mongoose.connect(process.env.CONNECTION_STRING)
            .then(() => console.log("Connected to the database."))
            .catch(() => console.log("Error connecting to the database."));
    }
}

module.exports = new Database();