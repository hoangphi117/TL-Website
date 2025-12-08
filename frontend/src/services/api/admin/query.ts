export interface ProductQuery {
  page?: number;
  limit?: number;
  search?: string | null;
  category?: string | null;
  brand?: string | null;
  status?: "active" | "inactive" | "out_of_stock" | string| null;
}

export interface UserQuery {
  page?: number;
  limit?: number;
  search?: string;
}

export interface IProductUpdate {
  name: string;
  sku: string;
  description?: string;
  price: number;
  originalPrice?: number;
  stockQuantity: number;
  category: string;   
  brand: string;     
  status: string;
  images: string[];
  specifications: Record<string, string>;
}