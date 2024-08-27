export interface IPagination {
  page: number;
  limit: number;
  forEmp: number;
}

export interface IReturnPagination<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
}
