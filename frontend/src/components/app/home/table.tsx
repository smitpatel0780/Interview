"use client"

import { useState, useMemo } from "react"
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Pencil } from "lucide-react"

type Props = {
  data: any[];
  onEdit: (row: any, index: number) => void;
}

export default function RecordsTable({ data, onEdit }: Props) {
  const [search, setSearch] = useState("")
  const [sortConfig, setSortConfig] = useState<{ key: string; direction: "asc" | "desc" } | null>(null)
  const [currentPage, setCurrentPage] = useState(1)
  const [pageSize, setPageSize] = useState(8)

  const filteredData = useMemo(() => {
    return data.filter((row) =>
      Object.values(row).some((val: any) =>
        val?.toString().toLowerCase().includes(search.toLowerCase())
      )
    )
  }, [search, data])

  const sortedData = useMemo(() => {
    if (!sortConfig) return filteredData
    return [...filteredData].sort((a, b) => {
      const valA = a[sortConfig.key as keyof typeof a] ?? ""
      const valB = b[sortConfig.key as keyof typeof b] ?? ""
      if (valA < valB) return sortConfig.direction === "asc" ? -1 : 1
      if (valA > valB) return sortConfig.direction === "asc" ? 1 : -1
      return 0
    })
  }, [filteredData, sortConfig])

  const totalPages = Math.ceil(sortedData.length / pageSize)

  const paginatedData = sortedData.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  )

  const handleSort = (key: string) => {
    setSortConfig((prev) =>
      prev?.key === key
        ? { key, direction: prev.direction === "asc" ? "desc" : "asc" }
        : { key, direction: "asc" }
    )
  }

  return (
    <>
      <div className="flex flex-col md:flex-row items-center justify-between mb-2 gap-2">
        <Input
          type="text"
          placeholder="Search records..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full md:w-1/3"
        />
      </div>

      <div className="rounded-md border overflow-x-auto">
        <div
          className={`${pageSize > 8 ? "max-h-[365px] overflow-y-auto" : ""
            }`}
        >
          <Table className="w-full">
            <TableHeader className="sticky top-0 bg-gray-50 z-10">
              <TableRow>
                <TableHead>Action</TableHead>
                {["firstName", "lastName", "phone", "email", "address", "city", "zip"].map((key) => {
                  const isSortable = !["city", "zip"].includes(key)
                  return (
                    <TableHead
                      key={key}
                      className={`select-none ${isSortable ? "cursor-pointer hover:bg-gray-100" : "cursor-default bg-transparent"
                        }`}
                      onClick={isSortable ? () => handleSort(key) : undefined}
                    >
                      {key.charAt(0).toUpperCase() + key.slice(1)}
                      {isSortable &&
                        (sortConfig?.key === key
                          ? sortConfig.direction === "asc"
                            ? " ↑"
                            : " ↓"
                          : "")}
                    </TableHead>
                  )
                })}
              </TableRow>

            </TableHeader>

            <TableBody>
              {paginatedData.length > 0 ? (
                paginatedData.map((row, index) => (
                  <TableRow
                    key={index}
                    className="hover:bg-gray-50 transition-colors"
                  >
                    <TableCell className="py-1 px-2 text-sm">
                      <Button
                        size="icon"
                        variant="ghost"
                        className="h-6 w-6 p-2 rounded-lg border border-gray-300 hover:bg-gray-100"
                        onClick={() => onEdit(row, index)}
                      >
                        <Pencil className="h-5 w-5 text-indigo-500" />
                      </Button>
                    </TableCell>
                    <TruncatedCell value={row.firstName} />
                    <TruncatedCell value={row.lastName} />
                    <TruncatedCell value={row.phone} />
                    <TruncatedCell value={row.email} />
                    <TruncatedCell value={row.address} />
                    <TruncatedCell value={row.city} />
                    <TruncatedCell value={row.zip} />
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell
                    colSpan={8}
                    className="text-center py-4 text-gray-500"
                  >
                    No records found
                  </TableCell>
                </TableRow>
              )}
            </TableBody>

          </Table>
        </div>
      </div>

      <div className="flex flex-col md:flex-row items-center justify-between mt-4 text-sm text-gray-600 gap-2">
        <div className="flex items-center gap-2">
          <span>Show</span>
          <select
            className="border rounded px-2 py-1 text-sm"
            value={pageSize}
            onChange={(e) => {
              setPageSize(Number(e.target.value))
              setCurrentPage(1)
            }}
          >
            <option value={8}>8</option>
            <option value={10}>10</option>
            <option value={20}>20</option>
          </select>
          <span>entries</span>
        </div>

        <div>{`${(currentPage - 1) * pageSize + 1}-${Math.min(
          currentPage * pageSize,
          sortedData.length
        )} of ${sortedData.length}`}</div>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            disabled={currentPage === 1}
            onClick={() => setCurrentPage((p) => p - 1)}
          >
            {"<"}
          </Button>
          <Button
            variant="outline"
            size="sm"
            disabled={currentPage === totalPages}
            onClick={() => setCurrentPage((p) => p + 1)}
          >
            {">"}
          </Button>
        </div>
      </div>
    </>
  )
}


function TruncatedCell({ value }: { value: string }) {
  return (
    <TableCell
      className="truncate max-w-[150px] py-2.5 px-2 text-sm"
      title={value}
    >
      {value}
    </TableCell>
  );
}
