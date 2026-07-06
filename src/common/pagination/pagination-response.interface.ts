import { PaginationMeta } from './pagination-meta.interface';

export interface PaginationResponse<T> {
  items: T[];
  pagination: PaginationMeta;
}
