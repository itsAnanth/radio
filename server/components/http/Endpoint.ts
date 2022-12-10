import type { RequestHandler } from 'express';
import { RESTTypes } from './RESTtypes';

class Endpoint {

    path: string;
    callback: RequestHandler;
    type: RESTTypes;

    constructor({ path, callback, type = RESTTypes.get }: 
        { path: string, callback: RequestHandler, type: RESTTypes }) {
        this.path = path;
        this.callback = callback;
        this.type = type;
    }
}


export default Endpoint;