import * as React from 'react';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Button, TablePagination, Typography, IconButton } from '@mui/material';
import Icon from '@mui/material/Icon';
import { useSelector } from 'react-redux';

const FullTable = ({ tableTitle, addButtonName, handleAdd, columns, data, rowId, totalCount, rowsPerPage, page,
    handleEdit, handleDelete, handleChangePage, handleChangeRowsPerPage, additionalCols, children }) => {

    const myRoles = useSelector((store) => store.user.roles);
    const myIsAdmin = myRoles !== null ? myRoles.includes("Admin") : false;

    return (
        <Paper elevation={3} sx={{ width: "100%", overflow: "hidden" }}>
            <TableContainer sx={{ maxHeight: 530 }}>
                <Table stickyHeader sx={{ backgroundColor: 'background.paper' }}>
                    <TableHead>
                        <TableRow>
                            <TableCell colSpan={10} sx={{ backgroundColor: 'background.paper' }}>
                                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                                    <Typography variant="h4">{tableTitle}</Typography>
                                    {(addButtonName && myIsAdmin) &&
                                        <Button variant="contained" color="primary" onClick={handleAdd} startIcon={<Icon>add</Icon>}>
                                            {addButtonName}
                                        </Button>
                                    }
                                </div>
                            </TableCell>
                        </TableRow>
                        <TableRow>
                            {columns.map((column) => (
                                <TableCell key={column.id} style={{ top: 60, minWidth: column.minWidth }} sx={{ backgroundColor: 'background.paper' }}>
                                    {column.label}
                                </TableCell>
                            ))}
                            {additionalCols !== undefined ? (
                                additionalCols
                            ) : (
                                myIsAdmin &&
                                <TableCell key="actions" style={{ top: 60 }} sx={{ backgroundColor: 'background.paper' }}>
                                    Дії
                                </TableCell>
                            )}
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {data.map((row) => (
                            <TableRow key={row[rowId]}>
                                {columns.map((column) => {
                                    const value = row[column.id];
                                    return (
                                        <TableCell key={column.id}>
                                            {column.format
                                                ? column.format(value)
                                                : value}
                                        </TableCell>
                                    );
                                })}
                                {children !== undefined ? (
                                    children(row, rowId)
                                ) : (
                                    myIsAdmin &&
                                    <TableCell key="actions">
                                        <IconButton onClick={() => handleEdit(row)} aria-label="edit">
                                            <Icon>edit</Icon>
                                        </IconButton>
                                        <IconButton onClick={() => handleDelete(row[rowId])} aria-label="delete">
                                            <Icon>delete</Icon>
                                        </IconButton>
                                    </TableCell>
                                )}
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
            <TablePagination
                rowsPerPageOptions={[5, 10, 15, 20]}
                component="div"
                count={totalCount}
                rowsPerPage={rowsPerPage}
                page={page}
                onPageChange={handleChangePage}
                onRowsPerPageChange={handleChangeRowsPerPage}
            />
        </Paper>
    );
}

export default FullTable;
