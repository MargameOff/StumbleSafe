class RequestParsingError extends Error {
    constructor(code, message) {
        super(message);
        this.name = "RequestParsingError";
        this.code = code;
    }
}

export default RequestParsingError;