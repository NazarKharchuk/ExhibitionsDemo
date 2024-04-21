import * as React from 'react';
import { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { setLoading, setTitle, showAlert } from '../../../Store/headerSlice';
import { materialAPI } from '../../../API/materialAPI';
import MaterialUpdate from './MaterialUpdate';
import MaterialCreate from './MaterialCreate';
import FullTable from '../../UI/FullTable';

const columns = [
    {
        id: "materialId",
        label: "Id матеріалу",
        minWidth: 200,
    },
    {
        id: "materialName",
        label: "Ім'я матеріалу",
        minWidth: 300,
    },
    {
        id: "actions",
        label: "Дії",
    },
];

const Material = () => {
    const dispatch = useDispatch();
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(10);
    const [data, setData] = useState([]);
    const [totalCount, setTotalCount] = useState(0);
    const [isUpdateDialogOpen, setIsUpdateDialogOpen] = useState(false);
    const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
    const [selectedMaterial, setSelectedMaterial] = useState({ materialId: '', materialName: '' });
    const [needRefetch, setNeedRefetch] = useState(Date.now());

    useEffect(() => {
        dispatch(setTitle({ title: "Матеріали картин" }));
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
        const result = await materialAPI.materials(page + 1, rowsPerPage);
        if (result.successfully === true) {
            setData(result.data.pageContent);
            setTotalCount(result.data.totalCount);
            dispatch(setLoading({ isLoading: false }));
        } else {
            dispatch(setLoading({ isLoading: false }));
            dispatch(showAlert({ message: "Не вдалось отримати дані", severity: 'error', hideTime: 10000 }));
        }
    };

    const handleEdit = (material) => {
        setSelectedMaterial(material);
        setIsUpdateDialogOpen(true);
    };

    const handleDelete = (materialId) => {
        const deleteMaterial = async (materialId) => {
            try {
                dispatch(setLoading({ isLoading: true }));
                const res = await materialAPI.deleteMaterial(materialId);

                if (res.successfully === true) {
                    dispatch(showAlert({ message: "Матеріал успішно видалено", severity: 'success', hideTime: 4000 }));
                    setNeedRefetch(Date.now());
                } else {
                    dispatch(showAlert({ message: res.message, severity: 'error', hideTime: 6000 }));
                }
            } catch (error) {
                console.error("Помилка під час видалення матеріалу:", error);
            }
            dispatch(setLoading({ isLoading: false }));
        }
        deleteMaterial(materialId);
    };

    const handleAdd = () => {
        setSelectedMaterial({ materialId: '', materialName: '' });
        setIsCreateDialogOpen(true);
    };

    return (
        <>
            <FullTable tableTitle="Таблиця матеріалів" addButtonName="Додати матеріал" handleAdd={handleAdd} columns={columns} data={data}
                rowId="materialId" totalCount={totalCount} handleEdit={handleEdit} handleDelete={handleDelete} rowsPerPage={rowsPerPage}
                page={page} handleChangePage={handleChangePage} handleChangeRowsPerPage={handleChangeRowsPerPage} />
            {isUpdateDialogOpen &&
                <MaterialUpdate isUpdateDialogOpen={isUpdateDialogOpen} setIsUpdateDialogOpen={setIsUpdateDialogOpen}
                    defaultValues={selectedMaterial} setNeedRefetch={setNeedRefetch} />
            }
            {isCreateDialogOpen &&
                <MaterialCreate isCreateDialogOpen={isCreateDialogOpen} setIsCreateDialogOpen={setIsCreateDialogOpen}
                    defaultValues={selectedMaterial} setNeedRefetch={setNeedRefetch} />
            }
        </>
    );
}

export default Material;
