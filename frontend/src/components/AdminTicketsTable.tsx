"use client";

import React, { useState, useEffect } from "react";
import {
  useReactTable,
  getCoreRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  getFilteredRowModel,
  ColumnDef,
  flexRender,
  SortingState,
  ColumnFiltersState,
  PaginationState
} from "@tanstack/react-table";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { format } from "date-fns";
import { es } from "date-fns/locale";

// Componentes UI
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger
} from "@/components/ui/popover";
import {
  ArrowUpDown,
  Calendar as CalendarIcon,
  Loader2,
  Search,
  User,
  Mail
} from "lucide-react";

// Tipos
export enum TicketStatus {
  Disponible = "Disponible",
  Usado = "Usado",
  Anulado = "Anulado"
}

export interface UserInfo {
  _id: string;
  name: string;
  email: string;
  role?: string;
  becado?: boolean;
  estudianteID?: string;
}

export interface Ticket {
  _id: string;
  precioTicket: number;
  fechaEmision?: string;
  createdAt?: string;
  fechaUso: string | null;
  status: TicketStatus;
  userID: string;
  user?: UserInfo; // Información del usuario
}

interface AdminTicketsTableProps {
  showFilters?: boolean;
  showPagination?: boolean;
  pageSize?: number;
  className?: string;
}

const BACKEND_URL =
  process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:5500";

export default function AdminTicketsTable({
  showFilters = true,
  showPagination = true,
  pageSize = 5,
  className = ""
}: AdminTicketsTableProps) {
  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [pagination, setPagination] = useState<PaginationState>({
    pageIndex: 0,
    pageSize
  });

  // Filtros adicionales
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [fechaInicio, setFechaInicio] = useState<Date | undefined>(undefined);
  const [fechaFin, setFechaFin] = useState<Date | undefined>(undefined);
  const [nameFilter, setNameFilter] = useState<string>("");
  const [emailFilter, setEmailFilter] = useState<string>("");

  // Consulta para obtener tickets (ahora con información de usuario)
  const { data, isLoading, isError, refetch } = useQuery({
    queryKey: [
      "admin-tickets",
      pagination.pageIndex,
      pagination.pageSize,
      statusFilter,
      fechaInicio,
      fechaFin,
      nameFilter,
      emailFilter
    ],
    queryFn: async () => {
      const params = new URLSearchParams();
      params.append("page", String(pagination.pageIndex + 1));
      params.append("limit", String(pagination.pageSize));

      // Filtros de estado
      if (statusFilter !== "all") {
        params.append("status", statusFilter);
      }

      // Filtros de fecha
      if (fechaInicio) {
        params.append("fechaInicio", fechaInicio.toISOString());
      }

      if (fechaFin) {
        params.append("fechaFin", fechaFin.toISOString());
      }

      // Filtros de usuario
      if (nameFilter) {
        params.append("userName", nameFilter);
      }

      if (emailFilter) {
        params.append("userEmail", emailFilter);
      }

      const response = await axios.get(
        `${BACKEND_URL}/api/ticket?${params.toString()}`
      );

      console.log(response.data);

      return response.data;
    }
  });

  // Definición de columnas (ahora incluye info de usuario)
  const columns: ColumnDef<Ticket>[] = [
    {
      accessorKey: "_id",
      header: "ID Ticket",
      cell: ({ row }) => (
        <div className="font-mono text-xs">{row.getValue("_id")}</div>
      )
    },
    {
      accessorKey: "user.name",
      header: ({ column }) => (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className="p-0 font-medium"
        >
          Nombre Usuario
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      ),
      cell: ({ row }) => {
        const user = row.original.user;
        return (
          <div className="flex items-center">
            <User className="mr-2 h-4 w-4 text-gray-400" />
            <span>{user?.name || "Usuario desconocido"}</span>
          </div>
        );
      }
    },
    {
      accessorKey: "user.email",
      header: ({ column }) => (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className="p-0 font-medium"
        >
          Correo Usuario
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      ),
      cell: ({ row }) => {
        const user = row.original.user;
        return (
          <div className="flex items-center">
            <Mail className="mr-2 h-4 w-4 text-gray-400" />
            <span className="text-sm">{user?.email || "No disponible"}</span>
          </div>
        );
      }
    },
    {
      accessorKey: "precioTicket",
      header: ({ column }) => (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className="p-0 font-medium"
        >
          Precio
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      ),
      cell: ({ row }) => {
        const precio = parseFloat(row.getValue("precioTicket") || "0");
        return <div className="font-medium">{precio.toFixed(2)} Bs.</div>;
      }
    },
    {
      accessorKey: "createdAt",
      header: ({ column }) => (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className="p-0 font-medium"
        >
          Fecha Emisión
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      ),
      cell: ({ row }) => {
        const dateValue =
          row.getValue("createdAt") || row.original.fechaEmision;
        if (!dateValue)
          return <div className="text-gray-400">No disponible</div>;

        try {
          const date = new Date(dateValue as string);
          return <div>{format(date, "PPP", { locale: es })}</div>;
        } catch (error) {
          console.log(error);
          return <div className="text-gray-400">Fecha inválida</div>;
        }
      }
    },
    {
      accessorKey: "fechaUso",
      header: ({ column }) => (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className="p-0 font-medium"
        >
          Fecha Uso
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      ),
      cell: ({ row }) => {
        const fechaUso = row.getValue("fechaUso");
        if (!fechaUso) return <div className="text-gray-400">No usado</div>;

        try {
          return (
            <div>
              {format(new Date(fechaUso as string), "PPP", { locale: es })}
            </div>
          );
        } catch (error) {
          console.log(error);
          return <div className="text-gray-400">Fecha inválida</div>;
        }
      }
    },
    {
      accessorKey: "status",
      header: ({ column }) => (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className="p-0 font-medium"
        >
          Estado
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      ),
      cell: ({ row }) => {
        const status = row.getValue("status") as TicketStatus;
        return (
          <Badge
            className={
              status === TicketStatus.Disponible
                ? "bg-green-100 text-green-800 hover:bg-green-100"
                : status === TicketStatus.Usado
                ? "bg-blue-100 text-blue-800 hover:bg-blue-100"
                : "bg-red-100 text-red-800 hover:bg-red-100"
            }
          >
            {status}
          </Badge>
        );
      }
    },
    {
      id: "actions",
      header: "Acciones",
      cell: ({ row }) => {
        const ticket = row.original;
        return (
          <div className="flex space-x-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                // Implementar lógica de edición del ticket
                console.log("Editar ticket:", ticket._id);
              }}
            >
              Editar
            </Button>
            <Button
              variant="outline"
              size="sm"
              className={
                ticket.status === TicketStatus.Anulado
                  ? "text-gray-400"
                  : "text-red-500"
              }
              disabled={ticket.status === TicketStatus.Anulado}
              onClick={() => {
                // Implementar lógica de anulación del ticket
                console.log("Anular ticket:", ticket._id);
              }}
            >
              Anular
            </Button>
          </div>
        );
      }
    }
  ];

  // Configuración de la tabla
  const table = useReactTable({
    data: data?.data || [],
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    onPaginationChange: setPagination,
    state: {
      sorting,
      columnFilters,
      pagination
    },
    manualPagination: true,
    pageCount: data?.meta?.total
      ? Math.ceil(data.meta.total / pagination.pageSize)
      : -1
  });

  // Aplicar filtros y refrescar datos
  useEffect(() => {
    refetch();
  }, [statusFilter, fechaInicio, fechaFin, nameFilter, emailFilter, refetch]);

  // Limpiar filtros
  const handleClearFilters = () => {
    setStatusFilter("all");
    setFechaInicio(undefined);
    setFechaFin(undefined);
    setNameFilter("");
    setEmailFilter("");
    setColumnFilters([]);
  };

  // Búsqueda con temporizador
  const [nameSearchValue, setNameSearchValue] = useState("");
  const [emailSearchValue, setEmailSearchValue] = useState("");

  useEffect(() => {
    const timer = setTimeout(() => {
      setNameFilter(nameSearchValue);
    }, 500);
    return () => clearTimeout(timer);
  }, [nameSearchValue]);

  useEffect(() => {
    const timer = setTimeout(() => {
      setEmailFilter(emailSearchValue);
    }, 500);
    return () => clearTimeout(timer);
  }, [emailSearchValue]);

  return (
    <div className={`space-y-4 ${className}`}>
      {showFilters && (
        <div className="space-y-4">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div className="flex flex-col gap-2 md:flex-row md:items-center">
              <div className="relative flex items-center">
                <Search className="absolute left-2.5 h-4 w-4 text-gray-500" />
                <Input
                  placeholder="Buscar por nombre de usuario..."
                  value={nameSearchValue}
                  onChange={(e) => setNameSearchValue(e.target.value)}
                  className="pl-8 w-[240px]"
                />
              </div>

              <div className="relative flex items-center">
                <Mail className="absolute left-2.5 h-4 w-4 text-gray-500" />
                <Input
                  placeholder="Buscar por correo..."
                  value={emailSearchValue}
                  onChange={(e) => setEmailSearchValue(e.target.value)}
                  className="pl-8 w-[240px]"
                />
              </div>

              <Input
                placeholder="Buscar por ID de ticket..."
                value={
                  (table.getColumn("_id")?.getFilterValue() as string) ?? ""
                }
                onChange={(e) =>
                  table.getColumn("_id")?.setFilterValue(e.target.value)
                }
                className="max-w-sm"
              />
            </div>

            <Button variant="outline" onClick={handleClearFilters}>
              Limpiar filtros
            </Button>
          </div>

          <div className="flex flex-col gap-2 md:flex-row md:items-center">
            <Select
              value={statusFilter}
              onValueChange={(value) => setStatusFilter(value)}
            >
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Estado" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos</SelectItem>
                <SelectItem value={TicketStatus.Disponible}>
                  Disponible
                </SelectItem>
                <SelectItem value={TicketStatus.Usado}>Usado</SelectItem>
                <SelectItem value={TicketStatus.Anulado}>Anulado</SelectItem>
              </SelectContent>
            </Select>

            <div className="flex items-center gap-2">
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className="w-[150px] pl-3 text-left font-normal"
                  >
                    {fechaInicio
                      ? format(fechaInicio, "PPP", { locale: es })
                      : "Fecha inicio"}
                    <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={fechaInicio}
                    onSelect={setFechaInicio}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>

              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className="w-[150px] pl-3 text-left font-normal"
                  >
                    {fechaFin
                      ? format(fechaFin, "PPP", { locale: es })
                      : "Fecha fin"}
                    <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={fechaFin}
                    onSelect={setFechaFin}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>
          </div>
        </div>
      )}

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <TableHead key={header.id}>
                    {header.isPlaceholder
                      ? null
                      : flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-24 text-center"
                >
                  <div className="flex justify-center items-center">
                    <Loader2 className="h-6 w-6 animate-spin mr-2" />
                    Cargando tickets...
                  </div>
                </TableCell>
              </TableRow>
            ) : isError ? (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-24 text-center text-red-500"
                >
                  Error al cargar los tickets. Intente nuevamente.
                </TableCell>
              </TableRow>
            ) : table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && "selected"}
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-24 text-center"
                >
                  No se encontraron tickets.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {showPagination && (
        <div className="flex items-center justify-between">
          <div className="text-sm text-gray-500">
            {data?.meta?.total ? (
              <>
                Mostrando {pagination.pageIndex * pagination.pageSize + 1} a{" "}
                {Math.min(
                  (pagination.pageIndex + 1) * pagination.pageSize,
                  data.meta.total
                )}{" "}
                de {data.meta.total} tickets
              </>
            ) : (
              "No hay tickets disponibles"
            )}
          </div>
          <div className="flex items-center space-x-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => table.previousPage()}
              disabled={!table.getCanPreviousPage()}
            >
              Anterior
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => table.nextPage()}
              disabled={!table.getCanNextPage()}
            >
              Siguiente
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
