
export type CarFilterParams = {
  pageNumber: number;
  size: number;
  sort?: string;
  minPrice?: number;
  maxPrice?: number;
  brand?: number;
  year?: number;
  fuelType?: string;
  transmission?: string;
  condition?: string;
  search?: string;
};
