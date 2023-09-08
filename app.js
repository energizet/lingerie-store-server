'use strict';

require('dotenv').config();
const express = require('express');
const jwt = require("jsonwebtoken");
const cors = require("cors");

const Response = require("./Response");
const path = require("path");
const fs = require("fs");

const httpPort = 3030;

const app = express();

app.use(express.json());
app.use(express.static(path.join(__dirname, 'http/public')));
app.use(cors());

app.get("/api/hello", async (req, res) => {
    sendResponse(res, Response.ok({
        hello: "world",
    }));
});

app.post("/api/hello", express.raw({type: 'application/json'}), async (req, res) => {
    let body = req.body;
    sendResponse(res, Response.ok(body));
});

app.get('/*', (req, res, next) => {
    let pathFile = path.join(__dirname, 'http/public', `${req.path}.html`);
    if (fs.existsSync(pathFile)) {
        res.end(fs.readFileSync(pathFile));
        return;
    }

    next();
});

app.listen(httpPort, '0.0.0.0', () => {
    console.log(`HTTP listener started on port ${httpPort}`);
    console.log(`http://localhost:${httpPort}`);
});

function sendResponse(res, response) {

    if (response.type === 'html') {
        let result = res;
        let headers = response.headers;

        for (const headersKey in headers) {
            result = result.header(headersKey, headers[headersKey]);
        }

        result.status(response.meta.status).end(response.body);
        return;
    }

    if (response.type != null && response.type !== 'json') {
        response = Response.error(500, "Unknown type response", response);
    }

    res.header('Content-Type', 'application/json')
        .status(response.meta.status)
        .end(JSON.stringify(response));
}