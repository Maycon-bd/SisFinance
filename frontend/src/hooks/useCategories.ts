import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '../services/api';
import type { Category } from '../types';

export function useCategories() {
    return useQuery<Category[]>({
        queryKey: ['categories'],
        queryFn: async () => {
            const response = await api.get('/categories/');
            return response.data;
        }
    });
}

export function useCreateCategory() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async (data: Partial<Category>) => {
            const response = await api.post('/categories/', data);
            return response.data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['categories'] });
        }
    });
}

export function useUpdateCategory() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async ({ id, data }: { id: number; data: Partial<Category> }) => {
            const response = await api.put(`/categories/${id}`, data);
            return response.data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['categories'] });
        }
    });
}

export function useDeleteCategory() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async (id: number) => {
            await api.delete(`/categories/${id}`);
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['categories'] });
        }
    });
}
