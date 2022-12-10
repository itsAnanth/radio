import statusCodes from "./statusCodes";

abstract class IResponse {
    static status: typeof statusCodes; 
}

class Response extends IResponse {
    static error({ message, code }: { message: string | object, code?: number }) {
        return JSON.stringify({ success: false, message: message, code: code });
    }

    static success({ message, code }: { message: string | object, code?: number }) {
        return JSON.stringify({ success: true, message: message, code: code });
    }
}

Response.status = statusCodes;


export default Response;