import { AuthUser } from "@/type/auth";
import { PaginatedExceptionLogs } from "@/type/exception-logs";
import { GroupCategory } from "@/type/group-category";
import {
  AutoRedeemVoucher,
  GroupAutoRedeemPayload,
} from "@/type/group-member-payload";
import { GroupSyncStatus } from "@/type/group-sync-status";
import { Customer, GroupMember, GroupType, status } from "@/type/group-type";
import {
  GroupVoucherGenerationPayload,
  Voucher,
} from "@/type/voucher-generation-payload";
import { apiUrls } from "./apiUrls";
import HttpClient from "./http-client";

export type SyncGroupPayload = {
  groupCategory: GroupCategory;
  contactIds: string[];
};

class ApiClient {
  static getRefreshCache(data: any): Promise<unknown> {
    throw new Error("Method not implemented.");
  }
  private apiUrl = process.env.NEXT_PUBLIC_API_URL;

  private baseUrl: string = `${this.apiUrl}`;

  private httpClient: HttpClient;

  constructor() {
    this.httpClient = new HttpClient(this.baseUrl);
  }

  public async getUserData(userId: number): Promise<any> {
    return this.httpClient.request<any>(`/users/${userId}`);
  }

  public async postData(endpoint: string, data: any): Promise<any> {
    return this.httpClient.request<any>(endpoint, "POST", {}, data);
  }

  public async login(data: {
    username: string;
    password: string;
  }): Promise<AuthUser> {
    return this.httpClient.unauthenticatedRequest<AuthUser>(
      apiUrls.auth.login,
      "POST",
      {},
      data
    );
  }

  public async getGroups(): Promise<GroupType[]> {
    return this.httpClient.request<GroupType[]>(apiUrls.groups.get);
  }

  public async getGroupMembers(contactId: string): Promise<GroupMember[]> {
    return this.httpClient.request<GroupMember[]>(
      `${apiUrls.groups.get}/${contactId}`
    );
  }
  public async generateVoucher(
    groupId: string,
    payload: GroupVoucherGenerationPayload
  ): Promise<Voucher[]> {
    return this.httpClient.request<Voucher[]>(
      `${apiUrls.groups.get}/generate-vouchers/${groupId}`,
      "POST",
      {},
      payload
    );
  }

  public async generateVoucherStatus(groupId: string): Promise<status> {
    return this.httpClient.request<status>(
      `${apiUrls.groups.get}/generate-vouchers/status/${groupId}`,
      "GET",
      {}
    );
  }
  public async getGroupCustomer(emails: string[]): Promise<Customer[]> {
    return this.httpClient.request<Customer[]>(
      `${apiUrls.groups.get}/get-participants`,
      "POST",
      {},
      emails
    );
  }

  //@Deprecated("Use generateWithAutoRedeem instead")
  public async generateAutoRedeem(
    groupId: string,
    payload: GroupAutoRedeemPayload
  ): Promise<AutoRedeemVoucher[]> {
    return this.httpClient.request<AutoRedeemVoucher[]>(
      `${apiUrls.groups.get}/generate-vouchers/${groupId}/auto-redeem`,
      "POST",
      {},
      payload
    );
  }

  public async generateWithAutoRedeem(
    groupId: string,
    payload: GroupAutoRedeemPayload
  ): Promise<AutoRedeemVoucher[]> {
    return this.httpClient.request<AutoRedeemVoucher[]>(
      `${apiUrls.groups.generate_voucher}`.replace(":id", groupId),
      "POST",
      {},
      payload
    );
  }
  public async syncGroupMembers(
    groupId: string,
    payload: SyncGroupPayload
  ): Promise<void> {
    return this.httpClient.request<void>(
      `${apiUrls.groups.sync}`.replace(":id", groupId),
      "POST",
      {},
      payload
    );
  }

  public async getSyncStatus(groupId: string): Promise<GroupSyncStatus> {
    return this.httpClient.request<GroupSyncStatus>(
      `${apiUrls.groups.syncStatus}`.replace(":id", groupId)
    );
  }

  public async getRefreshCache(): Promise<void> {
    return this.httpClient.request<void>(`${apiUrls.groups.refresh_cache}`);
  }

  public async getExceptionLogs(): Promise<PaginatedExceptionLogs> {
    return this.httpClient.request<PaginatedExceptionLogs>(
      `${apiUrls.exceptionLogs}`
    );
  }
}

export default ApiClient;
