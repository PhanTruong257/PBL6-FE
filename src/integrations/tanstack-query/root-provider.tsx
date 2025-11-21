import { QueryClient, QueryClientProvider } from '@tanstack/react-query'

/**
 * Create a new QueryClient context.
 *
 * @returns An object containing the QueryClient instance.
 */
export function getContext() {
  const queryClient = new QueryClient()
  return {
    queryClient,
  }
}

/**
 * Root provider for TanStack Query.
 * Childs can use the QueryClient (ReactQuery) instance from context.
 *
 * @param param - Object containing children and queryClient.
 * @returns The QueryClientProvider wrapping the children.
 */
export function Provider({
  children,
  queryClient,
}: {
  children: React.ReactNode
  queryClient: QueryClient
}) {
  return (
    <QueryClientProvider client={queryClient}>
      {children}
    </QueryClientProvider>
  )
}
