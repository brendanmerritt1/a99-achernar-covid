const db = require("better-sqlite3")("database.db");

function dbInit() {
    const accountStmt = db.prepare(
        `SELECT name FROM sqlite_master WHERE type='table' AND name='accounts';`
    );
    const logStmt = db.prepare(
        `SELECT name FROM sqlite_master WHERE type='table' AND name='accesslog';`
    );
    const countyStmt = db.prepare(
        `SELECT name FROM sqlite_master WHERE type='table' AND name='counties';`
    );
    const stateStmt = db.prepare(
        `SELECT name FROM sqlite_master WHERE type='table' AND name='state';`
    );

    let accountRow = accountStmt.get();
    let logRow = logStmt.get();
    let countyRow = countyStmt.get();
    let stateRow = stateStmt.get();

    if (accountRow === undefined) {
        const accountInit = `
            CREATE TABLE accounts (
                id INTEGER PRIMARY KEY,
                name TEXT,
                username TEXT,
                password TEXT,
                emailaddr TEXT,
                age TEXT,
                county TEXT,
                profilepic TEXT,
                admin TEXT
            );
        `;
        db.exec(accountInit);
        console.log("Account database has been created.");
    } else {
        console.log("Account database already exists.");
    }

    if (logRow === undefined) {
        const logInit = `
            CREATE TABLE accesslog (
                id INTEGER PRIMARY KEY,
                remoteaddr TEXT,
                remoteuser TEXT,
                time INTEGER,
                method TEXT,
                url TEXT,
                protocol TEXT,
                httpversion INTEGER,
                status INTEGER,
                referer TEXT,
                useragent TEXT
            );    
        `;
        db.exec(logInit);
        console.log("Interaction database has been created.");
    } else {
        console.log("Interaction database already exists.");
    }

    if (countyRow === undefined) {
        const countyInit = `
            CREATE TABLE counties (
                id INTEGER PRIMARY KEY,
                rownumber INTEGER,
                date TEXT,
                county TEXT,
                dailycases INTEGER,
                deaths INTEGER
            );    
        `;
        db.exec(countyInit);
        console.log("County database has been created.");
    } else {
        console.log("County database already exists.");
    }

    if (stateRow === undefined) {
        const stateInit = `
            CREATE TABLE state (
                id INTEGER PRIMARY KEY,
                date TEXT,
                positive INTEGER,
                deaths INTEGER
            );      
        `;
        db.exec(stateInit);
        console.log("State database has been created.");
    } else {
        console.log("State database already exists.");
    }
}

function dropState() {
    db.exec(`DROP TABLE IF EXISTS state`);
    const stateInit = `
            CREATE TABLE state (
                id INTEGER PRIMARY KEY,
                date TEXT,
                positive INTEGER,
                deaths INTEGER
            );      
        `;
    db.exec(stateInit);
}

module.exports = { db, dbInit, dropState };
