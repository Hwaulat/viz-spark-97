import * as React from "react"
import { ArrowUpDown, ArrowUp, ArrowDown } from "lucide-react"
import type { SortDir } from "./table"

export const SortIcon = ({ column, sortKey, sortDir }: { column: string, sortKey: string, sortDir: SortDir }) => {
  if (sortKey !== column) {
    return <ArrowUpDown className="ml-1 h-3 w-3 opacity-50 inline-block" />
  }
  return sortDir === 'ASC' 
    ? <ArrowUp className="ml-1 h-3 w-3 inline-block" /> 
    : <ArrowDown className="ml-1 h-3 w-3 inline-block" />
}
