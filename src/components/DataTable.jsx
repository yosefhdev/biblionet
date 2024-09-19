/* eslint-disable react/prop-types */
import { useState } from "react";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuCheckboxItem, DropdownMenuContent, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { ChevronDown, Edit, Trash } from "lucide-react";

// eslint-disable-next-line no-unused-vars
const DataTable = ({ data, columns, onEdit, onDelete, onAdd}) => {
    
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
                                    {item[column.accessorKey]}
                                </TableCell>
                            ))}
                            <TableCell>
                                <div className="flex space-x-2">
                                    <Button variant="outline" size="icon" onClick={() => onEdit(item)}>
                                        <Edit className="h-4 w-4" />
                                    </Button>
                                    <Button variant="outline" size="icon" onClick={() => onDelete(item)}>
                                        <Trash className="h-4 w-4" />
                                    </Button>
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
