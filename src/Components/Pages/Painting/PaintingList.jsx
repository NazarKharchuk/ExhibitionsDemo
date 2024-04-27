import * as React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { setLoading, setTitle, showAlert } from '../../../Store/headerSlice';
import PaintingCard from './PaintingCard';
import { Alert, Box, Button, Collapse, Grid, Icon, IconButton, Pagination } from '@mui/material';
import { paintingAPI } from '../../../API/paintingAPI';
import PaintingCreateUpdate from './PaintingCreateUpdate';
import { useNavigate } from 'react-router-dom';

const PaintingList = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const myProfileId = useSelector((store) => store.user.profileId);
    const myPainterId = useSelector((store) => store.user.painterId);

    const [page, setPage] = React.useState(1);
    const rowsPerPage = 12;
    const [data, setData] = React.useState([]);
    const [totalCount, setTotalCount] = React.useState(0);
    const [needRefetch, setNeedRefetch] = React.useState(Date.now());
    const [isCreateUpdateDialogOpen, setIsCreateUpdateDialogOpen] = React.useState(false);
    const [selectedPainting, setSelectedPainting] = React.useState(null);
    const [isInfoOpen, setIsInfoOpen] = React.useState(true);

    React.useEffect(() => {
        dispatch(setTitle({ title: "Список картин" }));
    }, []);

    React.useEffect(() => {
        fetchData();
    }, [page, needRefetch, myProfileId]);

    const handleChangePage = (_, newPage) => {
        setPage(newPage);
    };

    const handleCreatePainting = async () => {
        setSelectedPainting(null);
        setIsCreateUpdateDialogOpen(true);
    };

    const handleUpdatePainting = async (paintingId) => {
        setSelectedPainting(paintingId);
        setIsCreateUpdateDialogOpen(true);
    };

    const fetchData = async () => {
        dispatch(setLoading({ isLoading: true }));
        const result = await paintingAPI.paintings(page, rowsPerPage);
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
                            {myProfileId === null ? (
                                <Button onClick={() => navigate("/register", { replace: true })} color="inherit" size="small">
                                    Зареєструватись
                                </Button>
                            ) : (
                                myPainterId === null ? (
                                    <Button onClick={() => navigate("/painters", { replace: true })} color="inherit" size="small">
                                        Стати художником
                                    </Button>
                                ) : (
                                    <Button onClick={handleCreatePainting} color="inherit" size="small">
                                        Додати картину
                                    </Button>
                                )
                            )}
                            <IconButton color="inherit" size="small" onClick={() => setIsInfoOpen(false)}>
                                <Icon>close</Icon>
                            </IconButton>
                        </>
                    }
                    sx={{ mb: 2 }}
                >
                    {myProfileId === null ? (
                        "Ще не маєш облікового запису? Реєструйся!"
                    ) : (
                        myPainterId === null ? (
                            "Ще не маєш облікового запису художника? Реєструйся!"
                        ) : (
                            "Хочеш додати картину? Натискай!"
                        )
                    )}
                </Alert>
            </Collapse>
        </Box >
    );

    return (
        <>
            {renderInfoAlert}
            <Grid container spacing={2}>
                {data.map((painting, index) => (
                    <Grid item xs={12} sm={12} md={6} lg={4} key={index}>
                        <PaintingCard painting={painting} setPage={setPage} setNeedRefetch={setNeedRefetch} handleUpdatePainting={handleUpdatePainting} />
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
            {isCreateUpdateDialogOpen &&
                <PaintingCreateUpdate isCreateUpdateDialogOpen={isCreateUpdateDialogOpen} selectedPainting={selectedPainting}
                    setSelectedPainting={setSelectedPainting} setIsCreateUpdateDialogOpen={setIsCreateUpdateDialogOpen}
                    setNeedRefetch={setNeedRefetch} />
            }
        </>
    );
}

export default PaintingList;
