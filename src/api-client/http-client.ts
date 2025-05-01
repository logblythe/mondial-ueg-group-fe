import { AuthUser } from "@/type/auth";

export default class HttpClient {
  private baseUrl: string;

  constructor(baseUrl: string) {
    this.baseUrl = baseUrl;
  }

  private getUserInfo(): AuthUser {
    const userFromStorage = localStorage.getItem("token") ?? "";
    return { token: userFromStorage };
  }

  public async request<T>(
    endpoint: string,
    method: string = "GET",
    headers: Record<string, string> = {},
    body: any = null
  ): Promise<T> {
    const { token } = this.getUserInfo();

    const defaultHeaders: Record<string, string> = {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
      ...headers,
    };

    const options: RequestInit = {
      method,
      headers: defaultHeaders,
    };

    if (body) {
      options.body = JSON.stringify(body);
    }

    const response = await fetch(`${this.baseUrl}${endpoint}`, options);

    if (!response.ok) {
      const responseJson = await response.json();
      throw new Error(responseJson.message);
    }
    if (method === "DELETE") {
      return response as T;
    }
    return await response.json();
  }

  public async unauthenticatedRequest<T>(
    endpoint: string,
    method: string = "GET",
    headers: Record<string, string> = {},
    body: any = null
  ): Promise<T> {
    const defaultHeaders: Record<string, string> = {
      "Content-Type": "application/json",
      credential: "include",
      "Access-Control-Allow-Origin": "*",
      ...headers,
    };

    const options: RequestInit = {
      method,
      headers: defaultHeaders,
    };

    if (body) {
      options.body = JSON.stringify(body);
    }

    const response = await fetch(`${this.baseUrl}${endpoint}`, options);

    if (!response.ok) {
      const responseJson = await response.json();
      throw new Error(responseJson.message);
    }
    if (method === "DELETE") {
      return response as T;
    }
    console.log("response", response);

    try {
      return await response.json();
    } catch (e) {
      return {
        status: "success",
      } as T;
    }
  }
}
