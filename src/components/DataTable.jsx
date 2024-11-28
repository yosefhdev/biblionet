/* eslint-disable react/prop-types */
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuCheckboxItem, DropdownMenuContent, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";

import { Badge } from "@/components/ui/badge";
import { ChevronDown, Edit, Trash, BookIcon } from "lucide-react";
import { useState } from "react";

const DataTable = ({ data, columns, onEdit, onDelete, tipoDato = null }) => {

    const [searchTerm, setSearchTerm] = useState("");
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage, setItemsPerPage] = useState(5);
    const [sortConfig, setSortConfig] = useState({ key: null, direction: "ascending" });

    const handleSearch = (e) => {
        setSearchTerm(e.target.value);
        setCurrentPage(1);
    };

    const handleSort = (key) => {
        let direction = "ascending";
        if (sortConfig.key === key && sortConfig.direction === "ascending") {
            direction = "descending";
        }
        setSortConfig({ key, direction });
    };

    const filteredData = data.filter((item) => {
        return Object.values(item).some(
            (value) =>
                value && value.toString().toLowerCase().includes(searchTerm.toLowerCase())
        );
    });

    const sortedData = [...filteredData].sort((a, b) => {
        if (sortConfig.key) {
            const aValue = a[sortConfig.key];
            const bValue = b[sortConfig.key];
            if (aValue < bValue) return sortConfig.direction === "ascending" ? -1 : 1;
            if (aValue > bValue) return sortConfig.direction === "ascending" ? 1 : -1;
        }
        return 0;
    });

    const paginatedData = sortedData.slice(
        (currentPage - 1) * itemsPerPage,
        currentPage * itemsPerPage
    );

    const totalPages = Math.ceil(sortedData.length / itemsPerPage);

    const getStatusColor = (status) => {
        switch (status) {
            case "Pendiente":
                return "bg-yellow-200 text-yellow-800";
            case "Atrasado":
                return "bg-red-200 text-red-800";
            case "Completado":
                return "bg-green-200 text-green-800";
            default:
                return "bg-gray-200 text-gray-800";
        }
    };

    const renderCell = (item, column) => {
        switch (column.cell) {
            case "image":
                return item[column.accessorKey] ? (
                    <img
                        src={item[column.accessorKey]}
                        alt={`Portada de ${item.titulo}`}
                        className="w-12 h-16 object-cover rounded"
                    />
                ) : (
                    <div className="w-12 h-16 bg-gray-200 flex items-center justify-center rounded">
                        <BookIcon className="h-6 w-6 text-gray-400" />
                    </div>
                );
            case "text":
                return item[column.accessorKey];
            case "id":
                return <span className="text-gray-500 text-sm">{item[column.accessorKey]}</span>;
            default:
                return item[column.accessorKey];
        }
    };

    return (
        <div>
            <div className="flex justify-between items-center gap-4 mb-4">
                <Input
                    placeholder="Buscar..."
                    value={searchTerm}
                    onChange={handleSearch}
                    className="max-w-sm"
                />
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant="outline" className="ml-auto">
                            Mostrar {itemsPerPage} <ChevronDown className="ml-2 h-4 w-4" />
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                        {[5, 10, 20, 30, 40, 50].map((pageSize) => (
                            <DropdownMenuCheckboxItem
                                key={pageSize}
                                className="capitalize"
                                checked={itemsPerPage === pageSize}
                                onCheckedChange={() => setItemsPerPage(pageSize)}
                            >
                                {pageSize}
                            </DropdownMenuCheckboxItem>
                        ))}
                    </DropdownMenuContent>
                </DropdownMenu>
            </div>
            <Table>
                <TableHeader>
                    <TableRow>
                        {columns && columns.map((column) => (
                            <TableHead
                                key={column.accessorKey}
                                className="capitalize cursor-pointer"
                                onClick={() => handleSort(column.accessorKey)}
                            >
                                {column.header}
                                {sortConfig.key === column.accessorKey && (
                                    <span>{sortConfig.direction === "ascending" ? " ▲" : " ▼"}</span>
                                )}
                            </TableHead>
                        ))}
                        <TableHead>Acciones</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {paginatedData.map((item) => (
                        <TableRow key={item.id}>
                            {columns && columns.map((column) => (
                                <TableCell key={column.accessorKey}>
                                    {column.accessorKey === "estatus" && tipoDato === "prestamo" ? (
                                        <Badge className={getStatusColor(item[column.accessorKey])}>
                                            {item[column.accessorKey]}
                                        </Badge>
                                    ) : (
                                        renderCell(item, column)
                                    )}
                                </TableCell>
                            ))}
                            <TableCell>
                                <div className="flex space-x-2">
                                    {tipoDato === 'prestamo' ? (
                                        <Button variant="outline" size="icon" onClick={() => onEdit(item)}>
                                            <Edit className="h-4 w-4" />
                                            <span className="sr-only">Cambiar Estatus</span>
                                        </Button>
                                    ) : (
                                        <>
                                            <Button variant="outline" size="icon" onClick={() => onEdit(item)}>
                                                <Edit className="h-4 w-4" />
                                                <span className="sr-only">Editar</span>
                                            </Button>
                                            <Button variant="outline" size="icon" onClick={() => onDelete(item)}>
                                                <Trash className="h-4 w-4" />
                                                <span className="sr-only">Eliminar</span>
                                            </Button>
                                        </>
                                    )}
                                </div>
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
            <div className="flex items-center justify-end space-x-2 py-4">
                <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setCurrentPage((old) => Math.max(old - 1, 1))}
                    disabled={currentPage === 1}
                >
                    Anterior
                </Button>
                <div>Página {currentPage} de {totalPages}</div>
                <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setCurrentPage((old) => Math.min(old + 1, totalPages))}
                    disabled={currentPage === totalPages}
                >
                    Siguiente
                </Button>
            </div>
        </div>
    );
};

export default DataTable;
