import * as React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { setLoading, setTitle, showAlert } from '../../../Store/headerSlice';
import PaintingCard from './PaintingCard';
import { Accordion, AccordionDetails, AccordionSummary, Alert, Box, Button, Collapse, FormControl, Grid, Icon, IconButton, InputLabel, MenuItem, Pagination, Select, Typography } from '@mui/material';
import { paintingAPI } from '../../../API/paintingAPI';
import PaintingCreateUpdate from './PaintingCreateUpdate';
import { useNavigate } from 'react-router-dom';
import { tagAPI } from '../../../API/tagAPI';
import { genreAPI } from '../../../API/genreAPI';
import { styleAPI } from '../../../API/styleAPI';
import { materialAPI } from '../../../API/materialAPI';

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

    const [filters, setFilters] = React.useState({
        tagsIds: [],
        genresIds: [],
        stylesIds: [],
        materialsIds: [],
        sortBy: "",
        sortOrder: "",
    });
    const [tags, setTags] = React.useState(null);
    const [genres, setGenres] = React.useState(null);
    const [styles, setStyles] = React.useState(null);
    const [materials, setMaterials] = React.useState(null);

    React.useEffect(() => {
        dispatch(setTitle({ title: "Список картин" }));
        fetchTags();
        fetchGenres();
        fetchStyles();
        fetchMaterials();
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
        const result = await paintingAPI.paintings(page, rowsPerPage, getFilters());
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

    const fetchGenres = async () => {
        const result = await genreAPI.allGenres();
        if (result.successfully === true) {
            setGenres(result.data);
        } else {
            console.log("Не вдалось отримати жанри");
        }
    };

    const fetchStyles = async () => {
        const result = await styleAPI.allStyles();
        if (result.successfully === true) {
            setStyles(result.data);
        } else {
            console.log("Не вдалось отримати стилі");
        }
    };

    const fetchMaterials = async () => {
        const result = await materialAPI.allMaterials();
        if (result.successfully === true) {
            setMaterials(result.data);
        } else {
            console.log("Не вдалось отримати матеріали");
        }
    };

    const getFilters = () => {
        return {
            tagsIds: filters.tagsIds.length !== 0 ? filters.tagsIds : undefined,
            genresIds: filters.genresIds.length !== 0 ? filters.genresIds : undefined,
            stylesIds: filters.stylesIds.length !== 0 ? filters.stylesIds : undefined,
            materialsIds: filters.materialsIds.length !== 0 ? filters.materialsIds : undefined,
            sortBy: filters.sortBy !== "" ? filters.sortBy : undefined,
            sortOrder: filters.sortOrder !== "" ? filters.sortOrder : undefined,
        }
    };

    const clearFilters = () => {
        setFilters({
            tagsIds: [],
            genresIds: [],
            stylesIds: [],
            materialsIds: [],
            sortBy: "",
            sortOrder: "",
        });
    };

    const renderInfoAlert = (
        <Box sx={{ width: '100%' }}>
            <Collapse in={isInfoOpen} >
                <Alert
                    variant="outlined" severity="info"
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
                        {genres !== null && <FormControl fullWidth sx={{ mb: 2 }}>
                            <InputLabel>Жанри</InputLabel>
                            <Select
                                multiple
                                value={filters.genresIds}
                                onChange={(e) => setFilters({ ...filters, genresIds: e.target.value })}
                                renderValue={(selected) => selected.join(', ')}
                            >
                                {genres.map((genre) => <MenuItem key={genre.genreId} value={genre.genreId}>{genre.genreName}</MenuItem>)}
                            </Select>
                        </FormControl>}
                        {styles !== null && <FormControl fullWidth sx={{ mb: 2 }}>
                            <InputLabel>Стилі</InputLabel>
                            <Select
                                multiple
                                value={filters.stylesIds}
                                onChange={(e) => setFilters({ ...filters, stylesIds: e.target.value })}
                                renderValue={(selected) => selected.join(', ')}
                            >
                                {styles.map((style) => <MenuItem key={style.styleId} value={style.styleId}>{style.styleName}</MenuItem>)}
                            </Select>
                        </FormControl>}
                        {materials !== null && <FormControl fullWidth sx={{ mb: 2 }}>
                            <InputLabel>Матеріали</InputLabel>
                            <Select
                                multiple
                                value={filters.materialsIds}
                                onChange={(e) => setFilters({ ...filters, materialsIds: e.target.value })}
                                renderValue={(selected) => selected.join(', ')}
                            >
                                {materials.map((material) => <MenuItem key={material.materialId} value={material.materialId}>{material.materialName}</MenuItem>)}
                            </Select>
                        </FormControl>}
                        <FormControl fullWidth sx={{ mb: 2 }}>
                            <InputLabel>Сортувати за ...</InputLabel>
                            <Select
                                value={filters.sortBy}
                                onChange={(e) => setFilters({ ...filters, sortBy: e.target.value })}
                            >
                                <MenuItem value=""><em>-</em></MenuItem>
                                <MenuItem value="PaintingId">Ідентифікатор картини</MenuItem>
                                <MenuItem value="Name">Назва картини</MenuItem>
                                <MenuItem value="CretionDate">Дата створення</MenuItem>
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
