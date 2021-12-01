import React, {useEffect, useState } from "react";
import { useTable } from "react-table";

export const  BaseTable = ({ columns = [], data = []}) => {
    const [tableProps, setTableProps] = useState([]);
    const [tableBodyProps, setTableBodyProps] = useState([]);
    const [tableHeaderGroups, setTableHeaderGroups] = useState([]);
    const [tableRows, setTableRows] = useState([]);

    const {
        getTableProps,
        getTableBodyProps,
        headerGroups,
        rows,
        prepareRow
    } = useTable({
        columns,
        data,
    })

    useEffect(() => {
        setTableProps(getTableProps());
        setTableBodyProps(getTableBodyProps());
        setTableHeaderGroups(headerGroups);
        setTableRows(rows);


    }, [columns, data])


    return (
        <table {...tableProps}>
            <thead>
            {tableHeaderGroups.map(headerGroup => (
                <tr {...headerGroup.getHeaderGroupProps()}>
                    {headerGroup.headers.map(column => (
                        <th {...column.getHeaderProps()}>{column.render('Header')}</th>
                    ))}
                </tr>
            ))}
            </thead>
            <tbody {...tableBodyProps}>
            {tableRows.map((row, i) => {
                prepareRow(row)
                return (
                    <tr {...row.getRowProps()}>
                        {row.cells.map(cell => {
                            return <td {...cell.getCellProps()}>{cell.render('Cell')}</td>
                        })}
                    </tr>
                )
            })}
            </tbody>
        </table>
    )
}