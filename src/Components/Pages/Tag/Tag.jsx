import * as React from 'react';
import { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { setLoading, setTitle, showAlert } from '../../../Store/headerSlice';
import { tagAPI } from '../../../API/tagAPI';
import TagUpdate from './TagUpdate';
import TagCreate from './TagCreate';
import FullTable from '../../UI/FullTable';

const columns = [
    {
        id: "tagId",
        label: "Id тега",
        minWidth: 200,
    },
    {
        id: "tagName",
        label: "Ім'я тега",
        minWidth: 300,
    },
];

const Tag = () => {
    const dispatch = useDispatch();
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(10);
    const [data, setData] = useState([]);
    const [totalCount, setTotalCount] = useState(0);
    const [isUpdateDialogOpen, setIsUpdateDialogOpen] = useState(false);
    const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
    const [selectedTag, setSelectedTag] = useState({ tagId: '', tagName: '' });
    const [needRefetch, setNeedRefetch] = useState(Date.now());

    useEffect(() => {
        dispatch(setTitle({ title: "Теги картин" }));
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
        const result = await tagAPI.tags(page + 1, rowsPerPage);
        if (result.successfully === true) {
            setData(result.data.pageContent);
            setTotalCount(result.data.totalCount);
            dispatch(setLoading({ isLoading: false }));
        } else {
            dispatch(setLoading({ isLoading: false }));
            dispatch(showAlert({ message: "Не вдалось отримати дані: " + result.message, severity: 'error', hideTime: 10000 }));
        }
    };

    const handleEdit = (tag) => {
        setSelectedTag(tag);
        setIsUpdateDialogOpen(true);
    };

    const handleDelete = (tagId) => {
        const deleteTag = async (tagId) => {
            try {
                dispatch(setLoading({ isLoading: true }));
                const res = await tagAPI.deleteTag(tagId);

                if (res.successfully === true) {
                    dispatch(showAlert({ message: "Тег успішно видалено", severity: 'success', hideTime: 4000 }));
                    setPage(0);
                    setNeedRefetch(Date.now());
                } else {
                    dispatch(showAlert({ message: res.message, severity: 'error', hideTime: 6000 }));
                }
            } catch (error) {
                console.error("Помилка під час видалення тега:", error);
            }
            dispatch(setLoading({ isLoading: false }));
        }
        deleteTag(tagId);
    };

    const handleAdd = () => {
        setSelectedTag({ tagId: '', tagName: '' });
        setIsCreateDialogOpen(true);
    };

    return (
        <>
            <FullTable tableTitle="Таблиця тегів" addButtonName="Додати тег" handleAdd={handleAdd} columns={columns} data={data}
                rowId="tagId" totalCount={totalCount} handleEdit={handleEdit} handleDelete={handleDelete} rowsPerPage={rowsPerPage}
                page={page} handleChangePage={handleChangePage} handleChangeRowsPerPage={handleChangeRowsPerPage} />
            {isUpdateDialogOpen &&
                <TagUpdate isUpdateDialogOpen={isUpdateDialogOpen} setIsUpdateDialogOpen={setIsUpdateDialogOpen}
                    defaultValues={selectedTag} setNeedRefetch={setNeedRefetch} />
            }
            {isCreateDialogOpen &&
                <TagCreate isCreateDialogOpen={isCreateDialogOpen} setIsCreateDialogOpen={setIsCreateDialogOpen}
                    defaultValues={selectedTag} setNeedRefetch={setNeedRefetch} />
            }
        </>
    );
}

export default Tag;
