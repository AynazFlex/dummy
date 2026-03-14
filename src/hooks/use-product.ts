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
  setSkip: (skip: number) => void;
  setLimit: (limit: number) => void;
  setSort: (sortBy: string) => void;
  setSearch: (search?: string) => void;
}

export const useProducts = create<IProductsState>((set) => ({
  skip: 0,
  limit: 10,
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
      const params = search ? { q: search } : { skip, limit, sortBy, order };
      const url = search ? `${ENDPOINTS.PRODUCTS}/search` : ENDPOINTS.PRODUCTS;
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
