import * as React from 'react';
import { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { setLoading, setTitle, showAlert } from '../../../Store/headerSlice';
import { styleAPI } from '../../../API/styleAPI';
import StyleUpdate from './StyleUpdate';
import StyleCreate from './StyleCreate';
import FullTable from '../../UI/FullTable';

const columns = [
    {
        id: "styleId",
        label: "Id стилю",
        minWidth: 200,
    },
    {
        id: "styleName",
        label: "Ім'я стилю",
        minWidth: 300,
    },
    {
        id: "actions",
        label: "Дії",
    },
];

const Style = () => {
    const dispatch = useDispatch();
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(10);
    const [data, setData] = useState([]);
    const [totalCount, setTotalCount] = useState(0);
    const [isUpdateDialogOpen, setIsUpdateDialogOpen] = useState(false);
    const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
    const [selectedStyle, setSelectedStyle] = useState({ styleId: '', styleName: '' });
    const [needRefetch, setNeedRefetch] = useState(Date.now());

    useEffect(() => {
        dispatch(setTitle({ title: "Стилі картин" }));
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
        const result = await styleAPI.styles(page + 1, rowsPerPage);
        if (result.successfully === true) {
            setData(result.data.pageContent);
            setTotalCount(result.data.totalCount);
            dispatch(setLoading({ isLoading: false }));
        } else {
            dispatch(setLoading({ isLoading: false }));
            dispatch(showAlert({ message: "Не вдалось отримати дані: " + result.message, severity: 'error', hideTime: 10000 }));
        }
    };

    const handleEdit = (style) => {
        setSelectedStyle(style);
        setIsUpdateDialogOpen(true);
    };

    const handleDelete = (styleId) => {
        const deleteStyle = async (styleId) => {
            try {
                dispatch(setLoading({ isLoading: true }));
                const res = await styleAPI.deleteStyle(styleId);

                if (res.successfully === true) {
                    dispatch(showAlert({ message: "Стиль успішно видалено", severity: 'success', hideTime: 4000 }));
                    setPage(0);
                    setNeedRefetch(Date.now());
                } else {
                    dispatch(showAlert({ message: res.message, severity: 'error', hideTime: 6000 }));
                }
            } catch (error) {
                console.error("Помилка під час видалення стилю:", error);
            }
            dispatch(setLoading({ isLoading: false }));
        }
        deleteStyle(styleId);
    };

    const handleAdd = () => {
        setSelectedStyle({ styleId: '', styleName: '' });
        setIsCreateDialogOpen(true);
    };

    return (
        <>
            <FullTable tableTitle="Таблиця стилів" addButtonName="Додати стиль" handleAdd={handleAdd} columns={columns} data={data}
                rowId="styleId" totalCount={totalCount} handleEdit={handleEdit} handleDelete={handleDelete} rowsPerPage={rowsPerPage}
                page={page} handleChangePage={handleChangePage} handleChangeRowsPerPage={handleChangeRowsPerPage} />
            {isUpdateDialogOpen &&
                <StyleUpdate isUpdateDialogOpen={isUpdateDialogOpen} setIsUpdateDialogOpen={setIsUpdateDialogOpen}
                    defaultValues={selectedStyle} setNeedRefetch={setNeedRefetch} />
            }
            {isCreateDialogOpen &&
                <StyleCreate isCreateDialogOpen={isCreateDialogOpen} setIsCreateDialogOpen={setIsCreateDialogOpen}
                    defaultValues={selectedStyle} setNeedRefetch={setNeedRefetch} />
            }
        </>
    );
}

export default Style;
