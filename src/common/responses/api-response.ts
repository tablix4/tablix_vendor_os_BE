export class ApiResponse<T = unknown> {
  constructor(
    public readonly message: string,
    public readonly data?: T,
  ) {}

  static success<T>(message: string, data?: T) {
    return new ApiResponse(message, data);
  }
}
