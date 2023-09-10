import dotenv from "dotenv";
import express from 'express';
import jwt from 'jsonwebtoken';
import cors from 'cors';
import fs from 'fs';

import Response from './Response.js';
import ProductController from './api/ProductController.js';

dotenv.config();
{
    const app = express();

    app.use(express.json());
    app.use(express.static('wwwroot'));
    app.use(cors());

    app.get("/api/products", async (req, res) => {
        await interceptHttp(req, res, () => ProductController.getItems());
    });

    app.get("/api/product/:id", async (req, res) => {
        await interceptHttp(req, res, () => ProductController.getItem(req.params.id));
    });

    app.post("/api/hello", express.raw({type: 'application/json'}), async (req, res) => {
        let body = req.body;
        sendResponse(res, Response.ok(body));
    });

    app.get('/*', (req, res, next) => {
        let pathFile = new URL(`wwwroot${req.path}.html`, import.meta.url);
        if (fs.existsSync(pathFile)) {
            res.end(fs.readFileSync(pathFile));
            return;
        }

        next();
    });

    app.listen(process.env.PORT, process.env.ADDRESS, () => {
        console.log(`HTTP listener started on port ${process.env.PORT}`);
        console.log(`${process.env.SSL === 'true' ? 'https' : 'http'}://${process.env.ADDRESS}:${process.env.PORT}`);
    });
}

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