import * as React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { setLoading, setTitle, showAlert } from '../../../Store/headerSlice';
import ExhibitionCard from './ExhibitionCard';
import { Accordion, AccordionDetails, AccordionSummary, Alert, Box, Button, Collapse, FormControl, Grid, Icon, IconButton, InputLabel, MenuItem, Pagination, Select, Typography } from '@mui/material';
import { exhibitionAPI } from '../../../API/exhibitionAPI';
import ExhibitionCreateUpdate from './ExhibitionCreateUpdate';
import { tagAPI } from '../../../API/tagAPI';

const ExhibitionList = () => {
    const dispatch = useDispatch();
    const myRoles = useSelector((store) => store.user.roles);

    const [page, setPage] = React.useState(1);
    const rowsPerPage = 12;
    const [data, setData] = React.useState([]);
    const [totalCount, setTotalCount] = React.useState(0);
    const [needRefetch, setNeedRefetch] = React.useState(Date.now());
    const [isCreateUpdateDialogOpen, setIsCreateUpdateDialogOpen] = React.useState(false);
    const [selectedExhibition, setSelectedExhibition] = React.useState(null);
    const [isInfoOpen, setIsInfoOpen] = React.useState(true);

    const [filters, setFilters] = React.useState({
        tagsIds: [],
        needConfirmation: "",
        sortBy: "",
        sortOrder: "",
    });
    const [tags, setTags] = React.useState(null);

    React.useEffect(() => {
        dispatch(setTitle({ title: "Список виставок картин" }));
        fetchTags();
    }, []);

    React.useEffect(() => {
        fetchData();
    }, [page, needRefetch]);

    const handleChangePage = (_, newPage) => {
        setPage(newPage);
    };

    const handleCreateExhibition = async () => {
        setSelectedExhibition(null);
        setIsCreateUpdateDialogOpen(true);
    };

    const handleUpdateExhibition = async (exhibitionId) => {
        setSelectedExhibition(exhibitionId);
        setIsCreateUpdateDialogOpen(true);
    };

    const fetchData = async () => {
        dispatch(setLoading({ isLoading: true }));
        const result = await exhibitionAPI.exhibitions(page, rowsPerPage, getFilters());
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
            sortBy: filters.sortBy !== "" ? filters.sortBy : undefined,
            sortOrder: filters.sortOrder !== "" ? filters.sortOrder : undefined,
        }
    };

    const clearFilters = () => {
        setFilters({
            tagsIds: [],
            needConfirmation: "",
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
                            <Button onClick={handleCreateExhibition} color="inherit" size="small">
                                Створити виставку
                            </Button>
                            <IconButton color="inherit" size="small" onClick={() => setIsInfoOpen(false)}>
                                <Icon>close</Icon>
                            </IconButton>
                        </>
                    }
                    sx={{ mb: 2 }}
                >
                    Хочеш додати нову виставку картин?
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
                            <InputLabel>Сортувати за ...</InputLabel>
                            <Select
                                value={filters.sortBy}
                                onChange={(e) => setFilters({ ...filters, sortBy: e.target.value })}
                            >
                                <MenuItem value=""><em>-</em></MenuItem>
                                <MenuItem value="Name">Назва виставки</MenuItem>
                                <MenuItem value="AddedDate">Дата створення виставки</MenuItem>
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
                {data.map((exhibition, index) => (
                    <Grid item xs={12} sm={12} md={6} lg={4} key={index}>
                        <ExhibitionCard exhibition={exhibition} setPage={setPage} setNeedRefetch={setNeedRefetch}
                            handleUpdateExhibition={handleUpdateExhibition} isAdmin={(myRoles !== null && myRoles.includes("Admin"))} />
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
                <ExhibitionCreateUpdate isCreateUpdateDialogOpen={isCreateUpdateDialogOpen} selectedExhibition={selectedExhibition}
                    setSelectedExhibition={setSelectedExhibition} setIsCreateUpdateDialogOpen={setIsCreateUpdateDialogOpen}
                    setNeedRefetch={setNeedRefetch} />
            }
        </>
    );
}

export default ExhibitionList;
