const express = require("express");
const app = express();
const { db, dbInit } = require("./database");
const fs = require("fs");
const { parse } = require("csv-parse");
const path = require("path");
const router = require("./expressRouter");
const port = process.env.PORT || 5555;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.resolve(__dirname, "../../build")));
let usrname = "";

// check if databases have been created
dbInit();
const executed = db.prepare(`SELECT EXISTS (SELECT 1 FROM state);`).pluck().get();

// TO DO: more middleware functions that insert into database
// log database middleware
app.use((req, res, next) => {
    let logdata = {
        remoteaddr: req.ip,
        remoteuser: req.user,
        time: Date.now(),
        method: req.method,
        url: req.url,
        protocol: req.protocol,
        httpversion: req.httpVersion,
        status: res.statusCode,
        referer: req.headers["referer"],
        useragent: req.headers["user-agent"],
    };
    const stmt = db.prepare(
        `INSERT INTO accesslog (remoteaddr, remoteuser, time, method, url, protocol, httpversion, status, referer, useragent) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`
    );
    stmt.run(Object.values(logdata));
    next();
});

// if database for counties and state is present, skip over more insert
if (executed === 0) {
    function countiesEntry() {
        const coolPath1 = path.join(__dirname, "./data/county.csv");
        fs.createReadStream(coolPath1)
            .pipe(parse({ delimiter: ",", from_line: 2 }))
            .on("data", function (row) {
                let countydata = {
                    rownumber: row[0],
                    date: row[1],
                    county: row[2],
                    dailycases: row[3],
                    deaths: row[4],
                };
                const stmt = db.prepare(
                    `INSERT INTO counties (rownumber, date, county, dailycases, deaths) VALUES (?, ?, ?, ?, ?)`
                );
                stmt.run(Object.values(countydata));
            });
    }
    countiesEntry();
    
    function stateEntry() {
        const coolPath = path.join(__dirname, "./data/state.csv");
        fs.createReadStream(coolPath)
            .pipe(parse({ delimiter: ",", from_line: 2 }))
            .on("data", function (row) {
                let statedata = {
                    date: row[0],
                    positive: row[1],
                    deaths: row[2],
                };
                const stmt = db.prepare(
                    `INSERT INTO state (date, positive, deaths) VALUES (?, ?, ?)`
                );
                stmt.run(Object.values(statedata));
            });
    }
    stateEntry();

    function hospitalEntry() {
        const coolPath = path.join(__dirname, "./data/hospital.csv");
        fs.createReadStream(coolPath)
            .pipe(parse({ delimiter: ",", from_line: 2 }))
            .on("data", function (row) {
                let hospitaldata = {
                    date: row[0],
                    hospitalizations: row[1]
                };
                const stmt = db.prepare(
                    `INSERT INTO hospital (date, hospitalizations) VALUES (?, ?)`
                );
                stmt.run(Object.values(hospitaldata));
            });
    }
    hospitalEntry();

    function waterEntry() {
        const coolPath = path.join(__dirname, "./data/wastewater.csv");
        fs.createReadStream(coolPath)
            .pipe(parse({ delimiter: ",", from_line: 2 }))
            .on("data", function (row) {
                let waterdata = {
                    plant: row[0],
                    county: row[1],
                    date: row[2],
                    population: row[3],
                    particles: row[4]
                };
                const stmt = db.prepare(
                    `INSERT INTO wastewater (plant, county, date, population, particles) VALUES (?, ?, ?, ?, ?)`
                );
                stmt.run(Object.values(waterdata));
            });
    }
    waterEntry();

    function vaccineEntry() {
        const coolPath = path.join(__dirname, "./data/vaccine.csv");
        fs.createReadStream(coolPath)
            .pipe(parse({ delimiter: ",", from_line: 2 }))
            .on("data", function (row) {
                let vaccinedata = {
                    county: row[0],
                    onedose: row[1],
                    twodoses: row[2],
                    booster: row[3],
                    population: row[4],
                    totalpopulation: row[5],
                    totaltwo: row[6],
                    totalboost: row[7]
                };
                const stmt = db.prepare(
                    `INSERT INTO vaccine (county, onedose, twodoses, booster, population, totalpopulation, totaltwo, totalboost) VALUES (?, ?, ?, ?, ?, ?, ?, ?)`
                );
                stmt.run(Object.values(vaccinedata));
            });
    }
    vaccineEntry();

    function outbreakEntry() {
        const coolPath = path.join(__dirname, "./data/outbreaks.csv");
        fs.createReadStream(coolPath)
            .pipe(parse({ delimiter: ",", from_line: 2 }))
            .on("data", function (row) {
                let outbreakdata = {
                    county: row[0],
                    nursinghome: row[1],
                    carefacility: row[2],
                    correctionalfacility: row[3],
                    other: row[4]
                };
                const stmt = db.prepare(
                    `INSERT INTO outbreaks (county, nursinghome, carefacility, correctionalfacility, other) VALUES (?, ?, ?, ?, ?)`
                );
                stmt.run(Object.values(outbreakdata));
            });
    }
    outbreakEntry();
}

// set up router for api endpoints (logs, state, county)
app.use("/api", router);

// define check endpoint
// app.get("/app", (req, res) => {
//     res.sendFile(path.resolve(__dirname, "../../build", "index.html"), err => {
//         if (err) {
//             console.log(err);
//         }
//     });
// });

// start up the server
app.listen(port, () => {
    console.log(`App is running on port ${port}`);
});



// login
app.post("/app/login", (req, res) => {
    let {
        username,
        password
    } = req.body;
    try {
        const row = db.prepare('SELECT * FROM accounts WHERE username=? AND password=?').get(username, password);
        if (!row) {
            res.status(200).json({
                code: -1,
                msg: 'Wrong username or password.'
            });
            return;
        }
        usrname = username;
        res.status(200).json({
            code: 200,
            data: row,
            msg: 'Success!'
        });
    } catch (e) {
        res.status(500).json({
            code: -1,
            msg: 'The server encountered an error.'
        });
        console.error(e);
    }
});

// signup
app.post("/app/register", (req, res) => {
    let {
        username,
        password,
        name,
        emailaddr,
        age,
        county
    } = req.body;
    try {
        const row = db.prepare('SELECT * FROM accounts WHERE username=?').get(username);
        if (row) {
            res.status(200).json({
                code: -1,
                msg: 'Username already exists.'
            });
            return;
        }
        const stmt = db.prepare(
            `INSERT INTO accounts (username, password, name, emailaddr, age, county) VALUES (?, ?, ?, ?, ?, ?)`
        );
        stmt.run(username,
            password,
            name,
            emailaddr,
            age,
            county);
        usrname = username;
        res.status(200).json({
            code: 200,
            msg: 'Success!'
        });
    } catch (e) {
        res.status(500).json({
            code: -1,
            msg: 'The server encountered an error.'
        });
        console.error(e);
    }
});

// get users
app.get("/app/getUserList", (req, res) => {
    try {
        const rows = db.prepare('SELECT * FROM accounts').all();
        res.status(200).json({
            code: 200,
            data: rows,
            msg: 'Success!'
        });
    } catch (e) {
        res.status(500).json({
            code: -1,
            msg: 'The server encountered an error.'
        });
        console.error(e);
    }
});

// get specific account info data
app.get("/app/userAccountData", (req, res) => {
    try {
        const rows = db.prepare(`SELECT name, username, password, emailaddr, age, county FROM accounts WHERE username = ?`).all(usrname);
        res.status(200).json({
            code: 200,
            data: rows,
            msg: 'Success!'
        });
    } catch (e) {
        console.error(e);
    }
});

// update
app.post("/app/updateUser", (req, res) => {
    let {
        name,
        username,
        emailaddr,
        age,
        county
    } = req.body;
    try {
        const stmt = db.prepare(
            `UPDATE accounts SET name=?, username=?, emailaddr=?, age=?, county=? WHERE username=?`
        );
        stmt.run(name,
            username,
            emailaddr,
            age,
            county, username);
        usrname = username;
        res.status(200).json({
            code: 200,
            msg: 'Success!'
        });
    } catch (e) {
        res.status(500).json({
            code: -1,
            msg: 'server wrong'
        });
        console.error(e);
    }
});

// delete
app.post("/app/deleteUser", (req, res) => {
    let {
        username
    } = req.body;
    try {
        const stmt = db.prepare(
            `DELETE FROM accounts WHERE username=?`
        );
        stmt.run(username);
        usrname = username;
        res.status(200).json({
            code: 200,
            msg: 'Success!'
        });
    } catch (e) {
        res.status(500).json({
            code: -1,
            msg: 'server wrong'
        });
        console.error(e);
    }
});

app.post("/app/login-user", (req, res) => {
    let {
        username
    } = req.body;
    try {
        const row = db.prepare('SELECT * FROM accounts WHERE username=?').get(username);
        if (!row) {
            res.status(200).json({
                code: -1,
                msg: 'Wrong username.'
            });
            return;
        }
        usrname = username;
        res.status(200).json({
            code: 200,
            data: row,
            msg: 'Success!'
        });
    } catch (e) {
        res.status(500).json({
            code: -1,
            msg: 'The server has encountered an error.'
        });
        console.error(e);
    }
});

// get data on user-specific county
app.get("/app/getCountyData", (req, res) => {
    try {
        const select = db.prepare(`SELECT county FROM accounts WHERE username = ?`).get(usrname);
        const county = select.county;
        const rows = db.prepare(`SELECT * FROM counties WHERE county = '` + county + ` '`).all();

        res.status(200).json(rows);
    } catch (e) {
        console.error(e);
    }
});