import { api, ENDPOINTS } from "@/api";
import { useQuery } from "@tanstack/react-query";
import { create } from "zustand";

export interface IProduct {
  id: number;
  title: string;
  brand: string;
  sku: string;
  rating: number;
  price: number;
}

interface IProductsResponse {
  products: IProduct[];
  total: number;
  skip: number;
  limit: number;
}

interface IProductsState {
  skip: number;
  limit: number;
  sortBy?: string;
  order?: "asc" | "desc";
  search?: string;
  selectedProducts: number[];
  setSkip: (skip: number) => void;
  setLimit: (limit: number) => void;
  setSort: (sortBy: string) => void;
  setSearch: (search?: string) => void;
  setSelectedProducts: (products: number[]) => void;
}

export const useProducts = create<IProductsState>((set) => ({
  skip: 0,
  limit: 10,
  selectedProducts: [],
  setSkip: (skip) => {
    set({ skip });
  },
  setLimit: (limit) => {
    set({ limit });
  },
  setSort: (sortBy) => {
    set((state) => {
      const isSameSort = state.sortBy === sortBy;
      const order = isSameSort && state.order === "asc" ? "desc" : "asc";
      return { sortBy, order };
    });
  },
  setSearch: (search) => {
    set({ search, skip: 0 });
  },
  setSelectedProducts: (products) => {
    set({
      selectedProducts: products
    })
  }
}));

export const useProductsQuery = () => {
  const skip = useProducts((state) => state.skip);
  const limit = useProducts((state) => state.limit);
  const sortBy = useProducts((state) => state.sortBy);
  const order = useProducts((state) => state.order);
  const search = useProducts((state) => state.search);

  const query = useQuery({
    queryKey: ["products", skip, limit, sortBy, order, search],
    queryFn: async () => {
      const params = { skip, limit, sortBy, order, q: search || undefined };
      const url = search ? ENDPOINTS.PRODUCTS_SEARCH : ENDPOINTS.PRODUCTS;
      const { data } = await api.get<IProductsResponse>(url, {
        params,
      });

      return data;
    },
    staleTime: 5000,
    placeholderData: (previousData) => previousData,
  });

  return query;
};
