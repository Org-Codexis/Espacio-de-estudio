// src/hooks/useSpaces.ts
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import type { Space } from '../types';

const fetchSpaces = async (): Promise<Space[]> => {
  const { data } = await axios.get(`${import.meta.env.VITE_API_URL}/spaces`);
  return data;
};

export function useSpaces() {
  return useQuery({
    queryKey: ['spaces'],
    queryFn: fetchSpaces,
  });
}