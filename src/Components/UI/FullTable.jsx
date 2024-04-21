import * as React from 'react';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Button, IconButton, TablePagination, Typography } from '@mui/material';
import Icon from '@mui/material/Icon';

const FullTable = ({ tableTitle, addButtonName, handleAdd, columns, data, rowId, handleEdit, handleDelete,
    totalCount, rowsPerPage, page, handleChangePage, handleChangeRowsPerPage }) => {
    return (
        <Paper elevation={3} sx={{ width: "100%", overflow: "hidden" }}>
            <TableContainer sx={{ maxHeight: 530 }}>
                <Table stickyHeader>
                    <TableHead>
                        <TableRow>
                            <TableCell colSpan={4}>
                                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                                    <Typography variant="h4">{tableTitle}</Typography>
                                    <Button variant="contained" color="primary" onClick={handleAdd} startIcon={<Icon>add</Icon>}>
                                        {addButtonName}
                                    </Button>
                                </div>
                            </TableCell>
                        </TableRow>
                        <TableRow>
                            {columns.map((column) => (
                                <TableCell key={column.id} style={{ top: 60, minWidth: column.minWidth }}>
                                    {column.label}
                                </TableCell>
                            ))}
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {data.map((row) => (
                            <TableRow key={row[rowId]}>
                                {columns.map((column) => {
                                    const value = row[column.id];
                                    return (
                                        <TableCell key={column.id}>
                                            {column.id === 'actions' ? (
                                                <>
                                                    <IconButton onClick={() => handleEdit(row)} aria-label="edit">
                                                        <Icon>edit</Icon>
                                                    </IconButton>
                                                    <IconButton onClick={() => handleDelete(row[rowId])} aria-label="delete">
                                                        <Icon>delete</Icon>
                                                    </IconButton>
                                                </>
                                            ) : (
                                                value
                                            )}
                                        </TableCell>
                                    );
                                })}
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
