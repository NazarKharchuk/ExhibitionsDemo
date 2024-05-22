import * as React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { setLoading, setTitle, showAlert } from '../../../Store/headerSlice';
import PainterCard from './PainterCard';
import { Accordion, AccordionDetails, AccordionSummary, Alert, Box, Button, Collapse, FormControl, Grid, Icon, IconButton, InputLabel, MenuItem, Pagination, Select, Typography } from '@mui/material';
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

    const [filters, setFilters] = React.useState({
        sortBy: "",
        sortOrder: "",
    });

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
        const result = await painterAPI.painters(page, rowsPerPage, getFilters());
        if (result.successfully === true) {
            setData(result.data.pageContent);
            setTotalCount(result.data.totalCount);
            dispatch(setLoading({ isLoading: false }));
        } else {
            dispatch(setLoading({ isLoading: false }));
            dispatch(showAlert({ message: "Не вдалось отримати дані: " + result.message, severity: 'error', hideTime: 10000 }));
        }
    };

    const getFilters = () => {
        return {
            sortBy: filters.sortBy !== "" ? filters.sortBy : undefined,
            sortOrder: filters.sortOrder !== "" ? filters.sortOrder : undefined,
        }
    };

    const clearFilters = () => {
        setFilters({
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
            <Accordion sx={{ mb: 2 }}>
                <AccordionSummary expandIcon={<Icon>expand_more</Icon>}>
                    <Typography>Фільтри</Typography>
                </AccordionSummary>
                <AccordionDetails>
                    <Box sx={{ width: '100%' }}>
                        <FormControl fullWidth sx={{ mb: 2 }}>
                            <InputLabel>Сортувати за ...</InputLabel>
                            <Select
                                value={filters.sortBy}
                                onChange={(e) => setFilters({ ...filters, sortBy: e.target.value })}
                            >
                                <MenuItem value=""><em>-</em></MenuItem>
                                <MenuItem value="PainterId">Ідентифікатор художника</MenuItem>
                                <MenuItem value="Pseudonym">Псевдонім художника</MenuItem>
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
                {data.map((painter, index) => (
                    <Grid item xs={12} sm={12} md={6} lg={4} key={index}>
                        <PainterCard painter={painter} setPage={setPage} setNeedRefetch={setNeedRefetch} />
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
