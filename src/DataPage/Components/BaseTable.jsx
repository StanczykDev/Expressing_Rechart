import React, {useEffect, useMemo, useState} from "react";
import { useTable } from "react-table";

import "./BaseTable.css";

export const BaseTable = ({ columns = [], data = [], requestCounter}) => {
    const [tableProps, setTableProps] = useState([]);
    const [tableBodyProps, setTableBodyProps] = useState([]);
    const [tableHeaderGroups, setTableHeaderGroups] = useState([]);
    const [tableRows, setTableRows] = useState([]);

    const getPointCellFunction = () => ({ value }) => {
        return <>
            <div>
                {`X: ${value[0]}, Y: ${value[1]}`}
            </div>
        </>
    }

    const viewTableProps = {
        valueOne: {
            Cell: getPointCellFunction()
        },
        valueTwo: {
            Cell: getPointCellFunction()
        }
    }

    const getCompleteTableProps = () => {
        const appliedColumns = columns.map(column => {
            if (viewTableProps[column.accessor]) {
                return {
                    ...column,
                    ...viewTableProps[column.accessor]
                }
            }

            return column;
        })


        return appliedColumns;
    }

    const completeColumns = useMemo(() => getCompleteTableProps(),
        [requestCounter]);



    const {
        getTableProps,
        getTableBodyProps,
        headerGroups,
        rows,
        prepareRow
    } = useTable({
        columns: completeColumns,
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
                    {headerGroup.headers.map(column => {
                        return <th {...column.getHeaderProps()}>{column.render('Header')}</th>
                    })}
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