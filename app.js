'use strict';

require('dotenv').config();
const express = require('express');
const jwt = require("jsonwebtoken");
const cors = require("cors");
const path = require("path");
const fs = require("fs");

const Response = require("./Response");
const ItemController = require('./api/ItemController');

const httpPort = 3030;

const app = express();

app.use(express.json());
app.use(express.static(path.join(__dirname, 'http/public')));
app.use(cors());

app.get("/api/items", async (req, res) => {
    await interceptHttp(req, res, ItemController.getItems);
});

app.get("/api/item/:id", async (req, res) => {
    await interceptHttp(req, res, () => ItemController.getItem(req.params.id));
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

async function interceptHttp(req, res, callback) {
    try {
        let result = await callback(req);
        if (!(result instanceof Response)) {
            throw result;
        }

        sendResponse(res, result);
    } catch (ex) {
        interceptHttpExceptions(res, ex);
    }
}

function interceptHttpExceptions(res, ex) {
    let error;

    if (ex instanceof Error) {
        error = Response.error(500, ex.message);
    } else if (ex instanceof Response) {
        error = ex;
    } else {
        error = Response.error(500, ex);
    }

    sendResponse(res, error);
}

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