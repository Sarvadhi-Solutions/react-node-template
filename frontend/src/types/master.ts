export interface MasterItem {
  id: number;
  name: string;
  code: string;
  description?: string;
  parent_id?: number | null;
  parent_code?: string | null;
  active: boolean;
  display: boolean;
}

export interface MasterQueryParams {
  search?: string;
  page?: number;
  page_size?: number;
}

export interface MasterUpsertPayload {
  name: string;
  code: string;
  description?: string;
  parent_id?: number;
  active: boolean;
  display: boolean;
}
