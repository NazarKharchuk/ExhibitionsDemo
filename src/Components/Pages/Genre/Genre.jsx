import * as React from 'react';
import { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { setLoading, setTitle, showAlert } from '../../../Store/headerSlice';
import { genreAPI } from '../../../API/genreAPI';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Button, IconButton, TablePagination, Typography } from '@mui/material';
import Icon from '@mui/material/Icon';
import GenreUpdate from './GenreUpdate';
import GenreCreate from './GenreCreate';

const columns = [
    {
        id: "genreId",
        label: "Id жанру",
        minWidth: 200,
    },
    {
        id: "genreName",
        label: "Ім'я жанру",
        minWidth: 300,
    },
    {
        id: "actions",
        label: "Дії",
    },
];

const Genre = () => {
    const dispatch = useDispatch();
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(10);
    const [data, setData] = useState([]);
    const [totalCount, setTotalCount] = useState(0);
    const [isUpdateDialogOpen, setIsUpdateDialogOpen] = useState(false);
    const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
    const [selectedGenre, setSelectedGenre] = useState({ genreId: '', genreName: '' });
    const [needRefetch, setNeedRefetch] = useState(Date.now());

    useEffect(() => {
        dispatch(setTitle({ title: "Жанри картин" }));
    }, []);

    useEffect(() => {
        fetchData();
    }, [page, rowsPerPage, needRefetch]);

    const handleChangePage = (_, newPage) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(+event.target.value);
        setPage(0);
    };

    const fetchData = async () => {
        dispatch(setLoading({ isLoading: true }));
        const result = await genreAPI.genres(page + 1, rowsPerPage);
        if (result.successfully === true) {
            setData(result.data.pageContent);
            setTotalCount(result.data.totalCount);
            dispatch(setLoading({ isLoading: false }));
        } else {
            dispatch(setLoading({ isLoading: false }));
            dispatch(showAlert({ message: "Не вдалось отримати дані", severity: 'error', hideTime: 10000 }));
        }
    };

    const handleEdit = (genre) => {
        setSelectedGenre(genre);
        setIsUpdateDialogOpen(true);
    };

    const handleDelete = (genreId) => {
        const deleteGenre = async (genreId) => {
            try {
                dispatch(setLoading({ isLoading: true }));
                const res = await genreAPI.deleteGenre(genreId);

                if (res.successfully === true) {
                    dispatch(showAlert({ message: "Жанр успішно видалено", severity: 'success', hideTime: 4000 }));
                    setNeedRefetch(Date.now());
                } else {
                    dispatch(showAlert({ message: res.message, severity: 'error', hideTime: 6000 }));
                }
            } catch (error) {
                console.error("Помилка під час видалення жанру:", error);
            }
            dispatch(setLoading({ isLoading: false }));
        }
        deleteGenre(genreId);
    };

    const handleAdd = () => {
        setSelectedGenre({ genreId: '', genreName: '' });
        setIsCreateDialogOpen(true);
    };

    return (
        <>
            <Paper elevation={3} sx={{ width: "100%", overflow: "hidden" }}>
                <TableContainer sx={{ maxHeight: 530 }}>
                    <Table stickyHeader>
                        <TableHead>
                            <TableRow>
                                <TableCell colSpan={4}>
                                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                                        <Typography variant="h4">Таблиця жанрів</Typography>
                                        <Button variant="contained" color="primary" onClick={handleAdd} startIcon={<Icon>add</Icon>}>
                                            Додати жанр
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
                                <TableRow key={row.genreId}>
                                    {columns.map((column) => {
                                        const value = row[column.id];
                                        return (
                                            <TableCell key={column.id}>
                                                {column.id === 'actions' ? (
                                                    <>
                                                        <IconButton onClick={() => handleEdit(row)} aria-label="edit">
                                                            <Icon>edit</Icon>
                                                        </IconButton>
                                                        <IconButton onClick={() => handleDelete(row.genreId)} aria-label="delete">
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
            {isUpdateDialogOpen &&
                <GenreUpdate isUpdateDialogOpen={isUpdateDialogOpen} setIsUpdateDialogOpen={setIsUpdateDialogOpen}
                    defaultValues={selectedGenre} setNeedRefetch={setNeedRefetch} />
            }
            {isCreateDialogOpen &&
                <GenreCreate isCreateDialogOpen={isCreateDialogOpen} setIsCreateDialogOpen={setIsCreateDialogOpen}
                    defaultValues={selectedGenre} setNeedRefetch={setNeedRefetch} />
            }
        </>
    );
}

export default Genre;
