import fs from 'fs';
import type { Application } from 'express';
import Logger from '../../utils/Logger';
import Endpoint from './Endpoint';
import { RESTTypes } from './RESTtypes';

class Server {

    server: Application;
    methods: Map<string, Endpoint[]>;
    PORT: number;
    autoHandle: boolean;
    configured: boolean;

    constructor(server: Application, {
        PORT, autoHandle
    }: { PORT: number, autoHandle: boolean }) {
        this.server = server;
        this.methods = new Map();
        this.PORT = PORT || 3000;
        this.autoHandle = autoHandle || true;
        this.configured = true;

        this.init().then(() => {
            if (!this.configured) return;

            this.handleRequests();

            if (this.autoHandle)
                this.listenToPort();
        })
    }

    // async init() {
    //     this.configured = false;
    //     Logger.info('[WARN] -> ', 'define Server init function body');
    // }

    async init() {
        const methodsPath = (fs.readdirSync('./methods').filter(x => ['get', 'post', 'delete', 'update'].includes(x.toLowerCase())) as ('get' | 'post' | 'put' | 'delete')[]);

        if (!methodsPath || methodsPath.length === 0)
            return Logger.log('[server]', `methods path is empty. skipping route register`);

        for (let i = 0; i < methodsPath.length; i++) {
            let method: 'get' | 'put' | 'post' | 'delete' = methodsPath[i];
            let routesPath = fs.readdirSync(`./methods/${method}`);
            for (let j = 0; j < routesPath.length; j++) {
                let _filename = routesPath[j].slice(0, routesPath[j].lastIndexOf('.'));
                const _path = `../../methods/${method}/${_filename}`;
                const route: Endpoint = (await import(`${_path}`)).default;

                if (!(route instanceof Endpoint)) {
                    Logger.log('[server]', `at ${_path} expected type Enpoint got ${typeof route}`);
                    continue;
                }

                method = method.toLowerCase() as 'get' | 'post' | 'put' | 'delete';
                !this.methods.has(method) && (this.methods.set(method, []));
                (this.methods.get(method).push(route));
                Logger.log('[server]', `Registered [${method}]`, `${route}`)
            }
        }
    }

    handleRequests() {
        for (const [method, endpoints] of this.methods.entries()) {

            for (let i = 0; i < endpoints.length; i++) {
                const { path, callback, type } = endpoints[i];
                const stringType: string = RESTTypes[type];
                const ckey = (stringType.toLowerCase() as ('get' | 'post' | 'put' | 'delete'));

                //@ts-ignore
                this.server[`${ckey}`].apply(this.server, [path, callback]);
            }

        }
        return true;
    }

    listenToPort() {
        this.server.listen(this.PORT, () => console.log(`[server] server running on port ${this.PORT}`));
    }
}


export default Server;