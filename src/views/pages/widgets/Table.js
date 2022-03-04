// Table.js component

import React from "react";
import { useTable, useFilters } from "react-table";

export default function Table({columns, data}){
    const {
        getTableProps,
        getTableBodyProps,
        headerGroups,
        rows,
        prepareRow
    } = useTable({
        columns,
        data
    },useFilters);
    return (
        
        <table {...getTableProps()} style={{ fontSize:12, width:'100%'}}>
        <thead style={{backgroundColor:'#1d1594', color:'white', fontSize:14, fontWeight:'bold' }}>
            {headerGroups.map(headerGroup => (
                <tr {...headerGroup.getHeaderGroupProps()}>
                {headerGroup.headers.map(column => (
                    <th {...column.getHeaderProps()} width={column.width} style={{padding:5}}>{column.render("Header")}</th>
                ))}
                </tr>
            ))}
        </thead>
        <tbody {...getTableBodyProps()}>
            {rows.map((row,i) => {
                prepareRow(row);
                return (
                    <tr {...row.getRowProps()} style={{backgroundColor:'#f7f7f7', borderWidth:1, borderColor:'#1d1594'}} >
                      {row.cells.map(cell => {
                      //console.log(cell.render("Cell"))
                         return <td {...cell.getCellProps()} style={{padding:5}}>{cell.render("Cell")}</td>; 
                      })}
                    </tr>
                );
            })}
    </tbody>
    </table>
    );
}