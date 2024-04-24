import * as React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { setLoading, setTitle, showAlert } from '../../../Store/headerSlice';
import PainterCard from './PainterCard';
import { Alert, Box, Button, Collapse, Grid, Icon, IconButton, Pagination } from '@mui/material';
import { painterAPI } from '../../../API/painterAPI';
import PainterCreate from './PainterCreate';
import { useNavigate } from 'react-router-dom';

const PainterList = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const myPainterId = useSelector((store) => store.user.painterId);

    const [page, setPage] = React.useState(1);
    const rowsPerPage = 12;
    const [data, setData] = React.useState([]);
    const [totalCount, setTotalCount] = React.useState(0);
    const [needRefetch, setNeedRefetch] = React.useState(Date.now());
    const [isCreateDialogOpen, setIsCreateDialogOpen] = React.useState(false);
    const [isInfoOpen, setIsInfoOpen] = React.useState(true);

    React.useEffect(() => {
        dispatch(setTitle({ title: "Список художників" }));
    }, []);

    React.useEffect(() => {
        fetchData();
    }, [page, needRefetch]);

    const handleChangePage = (_, newPage) => {
        setPage(newPage);
    };

    const handleCreatePainter = async () => {
        setIsCreateDialogOpen(true);
    };

    const fetchData = async () => {
        dispatch(setLoading({ isLoading: true }));
        const result = await painterAPI.painters(page, rowsPerPage);
        if (result.successfully === true) {
            setData(result.data.pageContent);
            setTotalCount(result.data.totalCount);
            dispatch(setLoading({ isLoading: false }));
        } else {
            dispatch(setLoading({ isLoading: false }));
            dispatch(showAlert({ message: "Не вдалось отримати дані: " + result.message, severity: 'error', hideTime: 10000 }));
        }
    };

    const renderInfoAlert = (
        <Box sx={{ width: '100%' }}>
            <Collapse in={isInfoOpen} >
                <Alert
                    severity="info"
                    action={
                        <>
                            {myPainterId === null ? (
                                <Button onClick={handleCreatePainter} color="inherit" size="small">
                                    Стати художником
                                </Button>
                            ) : (
                                <Button onClick={() => navigate("/painters/" + myPainterId, { replace: true })} color="inherit" size="small">
                                    Перейти
                                </Button>
                            )}
                            <IconButton color="inherit" size="small" onClick={() => setIsInfoOpen(false)}>
                                <Icon>close</Icon>
                            </IconButton>
                        </>
                    }
                    sx={{ mb: 2 }}
                >
                    {myPainterId === null ? (
                        "Ще не маєш облікового запису художника? Реєструйся!"
                    ) : (
                        "Переходь на сторінку свого облікового запису художника"
                    )}
                </Alert>
            </Collapse>
        </Box >
    );

    return (
        <>
            {renderInfoAlert}
            <Grid container spacing={2}>
                {data.map((painter, index) => (
                    <Grid item xs={12} sm={12} md={6} lg={4} key={index}>
                        <PainterCard painter={painter} setPage={setPage} setNeedRefetch={setNeedRefetch} myPainterId={myPainterId} />
                    </Grid>
                ))}
            </Grid>
            <Grid container justifyContent="center" sx={{ mt: 2 }}>
                <Pagination
                    component="div"
                    count={Math.ceil(totalCount / rowsPerPage)}
                    page={page}
                    onChange={handleChangePage}
                />
            </Grid>
            {isCreateDialogOpen &&
                <PainterCreate isCreateDialogOpen={isCreateDialogOpen} setIsCreateDialogOpen={setIsCreateDialogOpen}
                    defaultValues={null} setNeedRefetch={setNeedRefetch} />
            }
        </>
    );
}

export default PainterList;
