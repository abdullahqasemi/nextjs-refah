import { ColumnsType } from "antd/es/table";
import { FilterValue, TablePaginationConfig } from "antd/es/table/interface";

interface UserType {
  id: string;
  name: string;
  email: string;
  profile: string,
}

interface TableParams {
  pagination?: TablePaginationConfig;
  sortField?: string;
  sortOrder?: string;
  filters?: Record<string, FilterValue>;
}


export type { TableParams,UserType };

