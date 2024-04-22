import * as React from 'react';
import { useDispatch } from 'react-redux';
import { setLoading, setTitle, showAlert } from '../../../Store/headerSlice';
import PainterCard from './PainterCard';
import { Grid, TablePagination } from '@mui/material';
import { painterAPI } from '../../../API/painterAPI';

const PainterList = () => {
    const dispatch = useDispatch();
    const [page, setPage] = React.useState(0);
    const [rowsPerPage, setRowsPerPage] = React.useState(12);
    const [data, setData] = React.useState([]);
    const [totalCount, setTotalCount] = React.useState(0);

    React.useEffect(() => {
        dispatch(setTitle({ title: "Список художників" }));
    }, []);

    React.useEffect(() => {
        fetchData();
    }, [page, rowsPerPage]);

    const handleChangePage = (_, newPage) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(+event.target.value);
        setPage(0);
    };

    const fetchData = async () => {
        dispatch(setLoading({ isLoading: true }));
        const result = await painterAPI.painters(page + 1, rowsPerPage);
        if (result.successfully === true) {
            setData(result.data.pageContent);
            setTotalCount(result.data.totalCount);
            dispatch(setLoading({ isLoading: false }));
        } else {
            dispatch(setLoading({ isLoading: false }));
            dispatch(showAlert({ message: "Не вдалось отримати дані", severity: 'error', hideTime: 10000 }));
        }
    };

    return (
        <>
            <Grid container spacing={2}>
                {data.map((painter, index) => (
                    <Grid item xs={12} sm={12} md={6} lg={4} key={index}>
                        <PainterCard painter={painter} />
                    </Grid>
                ))}
            </Grid>
            <Grid container justifyContent="center">
                <TablePagination
                    component="div"
                    count={Math.ceil(totalCount / rowsPerPage)}
                    page={page}
                    onPageChange={handleChangePage}
                    rowsPerPageOptions={[12, 15, 18, 21]}
                    rowsPerPage={rowsPerPage}
                    onRowsPerPageChange={handleChangeRowsPerPage}
                    labelRowsPerPage="Кількість художників на сторінці:"
                />
            </Grid>
        </>
    );
}

export default PainterList;
