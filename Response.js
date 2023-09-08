'use strict';

class Response {
    meta = {
        status: 0,
        message: null
    };
    data = {};
    type;
    headers;
    body;

    constructor(status, data, message) {
        this.meta.status = status ?? this.meta.status;
        this.meta.message = message ?? this.meta.message;

        this.data = data ?? this.data;
    }

    static ok(data = null, meta = null) {
        return Response.full(200, data, meta);
    }

    static full(status, data, meta = null) {
        let response = new Response(status, data);
        if (meta != null) {
            response.meta = {
                ...response.meta,
                ...meta,
            }
        }
        return response;
    }

    static error(status, message, data = {}) {
        return new Response(status, data, message);
    }

    static html(status, headers = null, body = null) {
        let response = new Response(status);
        response.type = 'html';
        response.headers = headers;
        response.body = body;
        return response;
    }
}

module.exports = Response;