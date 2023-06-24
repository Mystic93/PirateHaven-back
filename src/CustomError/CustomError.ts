class CustomError extends Error {
  constructor(
    public statusCode: number,
    message: string,
    public publicMessage?: string
  ) {
    super(message);
    this.publicMessage = publicMessage ?? message;
    this.statusCode = statusCode;
  }
}

export default CustomError;
