import type { UserFilters } from "../types";
import { UserService } from "../api/use-service";
import { useQuery } from "@tanstack/react-query";

export function useUser(filters: UserFilters) {
    return useQuery({
        queryKey: ['users', filters],
        queryFn: () => UserService.getUsers(filters),
    })
}