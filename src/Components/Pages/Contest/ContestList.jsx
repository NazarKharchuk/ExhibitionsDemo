import * as React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { setLoading, setTitle, showAlert } from '../../../Store/headerSlice';
import ContestCard from './ContestCard';
import { Accordion, AccordionDetails, AccordionSummary, Alert, Box, Button, Collapse, FormControl, Grid, Icon, IconButton, InputLabel, MenuItem, Pagination, Select, Typography } from '@mui/material';
import { contestAPI } from '../../../API/contestAPI';
import ContestCreateUpdate from './ContestCreateUpdate';
import { tagAPI } from '../../../API/tagAPI';

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

    const [filters, setFilters] = React.useState({
        tagsIds: [],
        needConfirmation: "",
        status: "",
        sortBy: "",
        sortOrder: "",
    });
    const [tags, setTags] = React.useState(null);

    React.useEffect(() => {
        dispatch(setTitle({ title: "Список конкурсів картин" }));
        fetchTags();
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
        const result = await contestAPI.contests(page, rowsPerPage, getFilters());
        if (result.successfully === true) {
            setData(result.data.pageContent);
            setTotalCount(result.data.totalCount);
            dispatch(setLoading({ isLoading: false }));
        } else {
            dispatch(setLoading({ isLoading: false }));
            dispatch(showAlert({ message: "Не вдалось отримати дані: " + result.message, severity: 'error', hideTime: 10000 }));
        }
    };

    const fetchTags = async () => {
        const result = await tagAPI.allTags();
        if (result.successfully === true) {
            setTags(result.data);
        } else {
            console.log("Не вдалось отримати теги");
        }
    };

    const getFilters = () => {
        return {
            tagsIds: filters.tagsIds.length !== 0 ? filters.tagsIds : undefined,
            needConfirmation: filters.needConfirmation !== null ? filters.needConfirmation : undefined,
            status: filters.status !== "" ? filters.status : undefined,
            sortBy: filters.sortBy !== "" ? filters.sortBy : undefined,
            sortOrder: filters.sortOrder !== "" ? filters.sortOrder : undefined,
        }
    };

    const clearFilters = () => {
        setFilters({
            tagsIds: [],
            needConfirmation: "",
            status: "",
            sortBy: "",
            sortOrder: "",
        });
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
            <Accordion sx={{ mb: 2 }}>
                <AccordionSummary expandIcon={<Icon>expand_more</Icon>}>
                    <Typography>Фільтри</Typography>
                </AccordionSummary>
                <AccordionDetails>
                    <Box sx={{ width: '100%' }}>
                        {tags !== null && <FormControl fullWidth sx={{ mb: 2 }}>
                            <InputLabel>Теги</InputLabel>
                            <Select
                                multiple
                                value={filters.tagsIds}
                                onChange={(e) => setFilters({ ...filters, tagsIds: e.target.value })}
                                renderValue={(selected) => selected.join(', ')}
                            >
                                {tags.map((tag) => <MenuItem key={tag.tagId} value={tag.tagId}>{tag.tagName}</MenuItem>)}
                            </Select>
                        </FormControl>}
                        <FormControl fullWidth sx={{ mb: 2 }}>
                            <InputLabel>Чи потребує підтвердження заявки адміністратором?</InputLabel>
                            <Select
                                value={filters.needConfirmation}
                                onChange={(e) => setFilters({ ...filters, needConfirmation: e.target.value })}
                            >
                                <MenuItem value=""><em>-</em></MenuItem>
                                <MenuItem value="true">Підтверждення обов'язкове</MenuItem>
                                <MenuItem value="false">Підтверждення не обов'язкове</MenuItem>
                            </Select>
                        </FormControl>
                        <FormControl fullWidth sx={{ mb: 2 }}>
                            <InputLabel>Статус</InputLabel>
                            <Select
                                value={filters.status}
                                onChange={(e) => setFilters({ ...filters, status: e.target.value })}
                            >
                                <MenuItem value=""><em>-</em></MenuItem>
                                <MenuItem value="ApplicationOpen">Відкриті заявки</MenuItem>
                                <MenuItem value="Voting">Голосування</MenuItem>
                                <MenuItem value="Closed">Закриті</MenuItem>
                            </Select>
                        </FormControl>
                        <FormControl fullWidth sx={{ mb: 2 }}>
                            <InputLabel>Сортувати за ...</InputLabel>
                            <Select
                                value={filters.sortBy}
                                onChange={(e) => setFilters({ ...filters, sortBy: e.target.value })}
                            >
                                <MenuItem value=""><em>-</em></MenuItem>
                                <MenuItem value="Name">Назва конкурсу</MenuItem>
                                <MenuItem value="AddedDate">Дата створення конкурсу</MenuItem>
                                <MenuItem value="StartDate">Дата початку голосування</MenuItem>
                                <MenuItem value="EndDate">Дата завершення голосування</MenuItem>
                            </Select>
                        </FormControl>
                        <FormControl fullWidth sx={{ mb: 2 }}>
                            <InputLabel>Порядок сортування</InputLabel>
                            <Select
                                value={filters.sortOrder}
                                onChange={(e) => setFilters({ ...filters, sortOrder: e.target.value })}
                            >
                                <MenuItem value=""><em>-</em></MenuItem>
                                <MenuItem value="asc">За зростанням</MenuItem>
                                <MenuItem value="desc">За спаданням</MenuItem>
                            </Select>
                        </FormControl>
                        <Button onClick={fetchData} variant="contained" color="primary" sx={{ mb: 2 }}>
                            Застосувати
                        </Button>
                        <Button onClick={clearFilters} variant="outlined" color="primary" sx={{ mb: 2, ml: 2 }}>
                            Очистити
                        </Button>
                    </Box>
                </AccordionDetails>
            </Accordion>
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
