import * as React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { setLoading, setTitle, showAlert } from '../../../Store/headerSlice';
import ContestCard from './ContestCard';
import { Alert, Box, Button, Collapse, Grid, Icon, IconButton, Pagination } from '@mui/material';
import { contestAPI } from '../../../API/contestAPI';
import ContestCreateUpdate from './ContestCreateUpdate';

const ContestList = () => {
    const dispatch = useDispatch();
    const myRoles = useSelector((store) => store.user.roles);

    const [page, setPage] = React.useState(1);
    const rowsPerPage = 12;
    const [data, setData] = React.useState([]);
    const [totalCount, setTotalCount] = React.useState(0);
    const [needRefetch, setNeedRefetch] = React.useState(Date.now());
    const [isCreateUpdateDialogOpen, setIsCreateUpdateDialogOpen] = React.useState(false);
    const [selectedContest, setSelectedContest] = React.useState(null);
    const [isInfoOpen, setIsInfoOpen] = React.useState(true);

    React.useEffect(() => {
        dispatch(setTitle({ title: "Список конкурсів картин" }));
    }, []);

    React.useEffect(() => {
        fetchData();
    }, [page, needRefetch]);

    const handleChangePage = (_, newPage) => {
        setPage(newPage);
    };

    const handleCreateContest = async () => {
        setSelectedContest(null);
        setIsCreateUpdateDialogOpen(true);
    };

    const handleUpdateContest = async (contestId) => {
        setSelectedContest(contestId);
        setIsCreateUpdateDialogOpen(true);
    };

    const fetchData = async () => {
        dispatch(setLoading({ isLoading: true }));
        const result = await contestAPI.contests(page, rowsPerPage);
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
                            <Button onClick={handleCreateContest} color="inherit" size="small">
                                Створити конкурс
                            </Button>
                            <IconButton color="inherit" size="small" onClick={() => setIsInfoOpen(false)}>
                                <Icon>close</Icon>
                            </IconButton>
                        </>
                    }
                    sx={{ mb: 2 }}
                >
                    Хочеш додати новий конкурс картин?
                </Alert>
            </Collapse>
        </Box >
    );

    return (
        <>
            {myRoles !== null && myRoles.includes("Admin") && renderInfoAlert}
            <Grid container spacing={2}>
                {data.map((contest, index) => (
                    <Grid item xs={12} sm={12} md={6} lg={4} key={index}>
                        <ContestCard contest={contest} setPage={setPage} setNeedRefetch={setNeedRefetch}
                            handleUpdateContest={handleUpdateContest} isAdmin={(myRoles !== null && myRoles.includes("Admin"))} />
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
                <ContestCreateUpdate isCreateUpdateDialogOpen={isCreateUpdateDialogOpen} selectedContest={selectedContest}
                    setSelectedContest={setSelectedContest} setIsCreateUpdateDialogOpen={setIsCreateUpdateDialogOpen}
                    setNeedRefetch={setNeedRefetch} />
            }
        </>
    );
}

export default ContestList;
