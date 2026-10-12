import { request } from "./apiClient"
import { RecordFilterParams, RecordItem, RecordListResponse } from "@/types"
import { RecordFormData } from "@/schemas/recordSchemas"

export const recordsService = {
  async getRecords(params: RecordFilterParams = {}): Promise<RecordListResponse> {
    return request<RecordListResponse>("/records", {
      params,
    })
  },

  async getRecordById(id: number): Promise<RecordItem> {
    return request<RecordItem>(`/records/${id}`)
  },

  async createRecord(data: RecordFormData): Promise<RecordItem> {
    return request<RecordItem>("/records", {
      method: "POST",
      body: JSON.stringify(data),
    })
  },

  async updateRecord(id: number, data: Partial<RecordFormData>): Promise<RecordItem> {
    return request<RecordItem>(`/records/${id}`, {
      method: "PATCH",
      body: JSON.stringify(data),
    })
  },

  async deleteRecord(id: number): Promise<{ message: string }> {
    return request<{ message: string }>(`/records/${id}`, {
      method: "DELETE",
    })
  },

  async bulkDelete(ids: number[]): Promise<{ message: string }> {
    return request<{ message: string }>("/records/bulk-delete", {
      method: "POST",
      body: JSON.stringify(ids),
    })
  },

  async exportCsv(params: RecordFilterParams = {}): Promise<Blob> {
    return request<Blob>("/records/export", {
      params,
      headers: {
        Accept: "text/csv",
      },
    })
  },
}
