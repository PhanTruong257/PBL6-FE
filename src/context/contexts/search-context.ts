import { createContext } from 'react'

export type SearchContextType = {
  open: boolean
  setOpen: React.Dispatch<React.SetStateAction<boolean>>
}

export const SearchContext = createContext<SearchContextType | null>(null)