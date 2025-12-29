class ApiResponse {
  constructor(status, obj, message) {
    this.status = status;
    this.data = obj;
    this.message = message;
  }
}

export default ApiResponse;
