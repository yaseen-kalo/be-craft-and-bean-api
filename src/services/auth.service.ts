import { APIRequestContext } from "@playwright/test";

export class AuthService {
  private request: APIRequestContext;

  constructor(request: APIRequestContext) {
    this.request = request;
  }

  async register(payload: Record<string, unknown>) {
    const response = await this.request.post("auth/register", {
      data: payload,
    });
    return response;
  }

  async login(payload: Record<string, unknown>) {
    const response = await this.request.post("auth/login", {
      data: payload,
    });
    return response;
  }
}
