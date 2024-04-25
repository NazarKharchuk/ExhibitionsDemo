import * as React from 'react';
import { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { setLoading, setTitle, showAlert } from '../../../Store/headerSlice';
import { genreAPI } from '../../../API/genreAPI';
import GenreUpdate from './GenreUpdate';
import GenreCreate from './GenreCreate';
import FullTable from '../../UI/FullTable';

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
            dispatch(showAlert({ message: "Не вдалось отримати дані: " + result.message, severity: 'error', hideTime: 10000 }));
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
                    setPage(0);
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
            <FullTable tableTitle="Таблиця жанрів" addButtonName="Додати жанр" handleAdd={handleAdd} columns={columns} data={data}
                rowId="genreId" totalCount={totalCount} handleEdit={handleEdit} handleDelete={handleDelete} rowsPerPage={rowsPerPage}
                page={page} handleChangePage={handleChangePage} handleChangeRowsPerPage={handleChangeRowsPerPage} />
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
