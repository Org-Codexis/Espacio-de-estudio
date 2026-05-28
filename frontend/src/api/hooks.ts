import { useQuery } from "@tanstack/react-query";
import { getSpaces } from "./services";

export function useSpaces() {
  return useQuery({
    queryKey: ["spaces"], // La "llave" que identifica estos datos
    queryFn: getSpaces,
  });
}