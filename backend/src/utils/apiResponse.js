class apiResponse{
    constructor(
        statusCode,
        data,
        message = "Successful",   
    ){
        this.statusCode = statusCode;
        this.message = message;
        this.success = statusCode < 400;
        this.data = data;
    }
}
export default apiResponse;