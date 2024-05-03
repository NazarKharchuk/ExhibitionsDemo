import * as React from 'react';
import FullScreenDialog from '../../UI/FullScreenDialog';
import { Button, CircularProgress, Container, Grid, Pagination, Typography } from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';
import { showAlert } from '../../../Store/headerSlice';
import { contestApplicationAPI } from '../../../API/contestApplicationAPI';
import { paintingAPI } from '../../../API/paintingAPI';
import PaintingCardTemplate from '../Painting/PaintingCardTemplate';

const ApplicationCreate = ({ isCreateDialogOpen, setIsCreateDialogOpen, setNeedRefetch, contestId }) => {
    const dispatch = useDispatch();
    const myPainterId = useSelector((store) => store.user.painterId);

    const [isLoading, setIsLoading] = React.useState(false);
    const [page, setPage] = React.useState(1);
    const rowsPerPage = 12;
    const [data, setData] = React.useState(null);
    const [totalCount, setTotalCount] = React.useState(0);

    React.useEffect(() => {
        fetchData();
    }, [page, myPainterId]);

    const fetchData = async () => {
        setIsLoading(true);
        const result = await paintingAPI.paintings(page, rowsPerPage, myPainterId);
        if (result.successfully === true) {
            setData(result.data.pageContent);
            setTotalCount(result.data.totalCount);
            setIsLoading(false);
        } else {
            setIsLoading(false);
            dispatch(showAlert({ message: "Не вдалось отримати картини художника: " + result.message, severity: 'error', hideTime: 10000 }));
        }
    };

    const handleClose = () => {
        setIsCreateDialogOpen(false);
        setNeedRefetch(Date.now());
    };

    const handleAddApplication = async (contestId, paintingId) => {
        try {
            const res = await contestApplicationAPI.createContestApplication(contestId, paintingId);

            if (res.successfully === true) {
                dispatch(showAlert({ message: "Картину успішно подано на участь в конкурсі", severity: 'success', hideTime: 4000 }));
                handleClose();
            } else {
                dispatch(showAlert({ message: res.message, severity: 'error', hideTime: 6000 }));
            }
        } catch (error) {
            console.error("Помилка під час створення заявки:", error);
        }
    };

    return (
        <FullScreenDialog
            isDialogOpen={isCreateDialogOpen}
            setIsDialogOpen={setIsCreateDialogOpen}
            dialogTitle="Подання заявки на участь в конкурсі"
            buttonName="Закрити"
            handleClick={handleClose}
            disabled={false}
            isSubmitting={isLoading}
        >
            <Container>
                {myPainterId !== null ? (
                    data !== null ? (
                        data.length > 0 ? (
                            <>
                                <Grid container spacing={2}>
                                    {data.map((painting, index) => (
                                        <Grid item xs={12} sm={12} md={6} lg={4} key={index}>
                                            <PaintingCardTemplate painting={painting} menu={null} cardActions={
                                                <Button onClick={() => handleAddApplication(contestId, painting.paintingId)}>Подати на участь в конкурсі</Button>
                                            } />
                                        </Grid>
                                    ))}
                                </Grid>
                                <Grid container justifyContent="center" sx={{ mt: 2 }}>
                                    <Pagination
                                        component="div"
                                        count={Math.ceil(totalCount / rowsPerPage)}
                                        page={page}
                                        onChange={(_, newPage) => setPage(newPage)}
                                    />
                                </Grid>
                            </>
                        ) : (<Typography>Ви ще не додали жодної картини</Typography>)
                    ) : (<CircularProgress />)
                ) : (<Typography>Подавати заявки на участь в конкурсі можуть тільки художники</Typography>)}
            </Container>
        </FullScreenDialog>
    );
}

export default ApplicationCreate;
