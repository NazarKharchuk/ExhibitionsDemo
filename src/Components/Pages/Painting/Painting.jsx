import * as React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { setLoading, setTitle, showAlert } from '../../../Store/headerSlice';
import { useNavigate, useParams } from 'react-router-dom';
import { paintingAPI } from '../../../API/paintingAPI';
import { Accordion, AccordionDetails, AccordionSummary, Avatar, Box, Button, Card, CardHeader, CardMedia, Chip, CircularProgress, Grid, Icon, IconButton, LinearProgress, Menu, MenuItem, Pagination, Rating, Tab, Tabs, Typography } from '@mui/material';
import TabPanel from '../../UI/TabPanel';
import { getColorFromSentence } from '../../../Helper/ColorFunctions';
import { amber, blue, deepOrange, green, purple, red, yellow } from '@mui/material/colors';
import PaintingCreateUpdate from './PaintingCreateUpdate';
import { baseURL } from '../../../API/api';
import { paintingRatingAPI } from '../../../API/paintingRatingAPI';
import PaintingRatingCard from '../PaintingRating/PaintingRatingCard';
import PaintingRatingCreate from '../PaintingRating/PaintingRatingCreate';
import PaintingRatingUpdate from '../PaintingRating/PaintingRatingUpdate';
import StatisticsTab from '../../UI/StatisticsTab';

const Painting = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const params = useParams();
    const myProfileId = useSelector((store) => store.user.profileId);
    const myPainterId = useSelector((store) => store.user.painterId);
    const myRoles = useSelector((store) => store.user.roles);
    const myIsAdmin = myRoles !== null ? myRoles.includes("Admin") : false;

    const [paintingInfo, setPaintingInfo] = React.useState(null);
    const [currentTab, setCurrentTab] = React.useState(0);
    const [menuAnchor, setMenuAnchor] = React.useState(null);
    const [selectedPainting, setSelectedPainting] = React.useState(params.paintingId);
    const [isCreateUpdateDialogOpen, setIsCreateUpdateDialogOpen] = React.useState(false);
    const [needRefetch, setNeedRefetch] = React.useState(Date.now());

    const [ratings, setRatings] = React.useState(null);
    const [totalRatingsCount, setTotalRatingsCount] = React.useState(0);
    const [pageRatings, setPageRatings] = React.useState(1);
    const ratingsPerPage = 12;
    const [myRating, setMyRating] = React.useState(null);
    const [isCreateRatingDialogOpen, setIsCreateRatingDialogOpen] = React.useState(false);
    const [isUpdateRatingDialogOpen, setIsUpdateRatingDialogOpen] = React.useState(false);
    const [selectedRating, setSelectedRating] = React.useState(false);
    const [needRatingsRefetch, setNeedRatingsRefetch] = React.useState(Date.now());

    const [exhibitions, setExhibitions] = React.useState(null);
    const [totalExhibitionsCount, setTotalExhibitionsCount] = React.useState(0);
    const [pageExhibitions, setPageExhibitions] = React.useState(1);
    const exhibitionsPerPage = 12;
    const [needExhibitionsRefetch, setNeedExhibitionsRefetch] = React.useState(Date.now());

    const [contests, setContests] = React.useState(null);
    const [totalContestsCount, setTotalContestsCount] = React.useState(0);
    const [pageContests, setPageContests] = React.useState(1);
    const contestsPerPage = 12;
    const [needContestsRefetch, setNeedContestsRefetch] = React.useState(Date.now());

    React.useEffect(() => {
        dispatch(setTitle({ title: "Картина" }));
        fetchInfo();
    }, [needRefetch, myProfileId, myPainterId, myIsAdmin, needRatingsRefetch, needExhibitionsRefetch, needContestsRefetch]);

    React.useEffect(() => {
        if (ratings !== null) fetchRatings();
        if (myProfileId !== null && ratings !== null) fetchMyRating();
    }, [needRatingsRefetch, pageRatings]);

    React.useEffect(() => {
        if (exhibitions !== null) fetchExhibitions();
    }, [needExhibitionsRefetch, pageExhibitions]);

    React.useEffect(() => {
        if (contests !== null) fetchContests();
    }, [needContestsRefetch, pageContests]);

    const fetchInfo = async () => {
        dispatch(setLoading({ isLoading: true }));
        const result = await paintingAPI.painting(params.paintingId);
        if (result.successfully === true) {
            setPaintingInfo(result.data);
            dispatch(setLoading({ isLoading: false }));
        } else {
            dispatch(setLoading({ isLoading: false }));
            dispatch(showAlert({ message: "Не вдалось отримати дані про картину: " + result.message, severity: 'error', hideTime: 10000 }));
        }
    };

    if (paintingInfo == null) return <></>

    const fetchRatings = async () => {
        dispatch(setLoading({ isLoading: true }));
        const result = await paintingRatingAPI.paintingRatings(params.paintingId, pageRatings, ratingsPerPage);
        if (result.successfully === true) {
            setRatings(result.data.pageContent);
            setTotalRatingsCount(result.data.totalCount);
            dispatch(setLoading({ isLoading: false }));
        } else {
            dispatch(setLoading({ isLoading: false }));
            dispatch(showAlert({ message: "Не вдалось отримати оцінки: " + result.message, severity: 'error', hideTime: 10000 }));
        }
    };

    const fetchMyRating = async () => {
        dispatch(setLoading({ isLoading: true }));
        const result = await paintingRatingAPI.myPaintingRating(params.paintingId);
        if (result.successfully === true) {
            setMyRating(result.data);
            dispatch(setLoading({ isLoading: false }));
        } else {
            dispatch(setLoading({ isLoading: false }));
            dispatch(showAlert({ message: "Не вдалось отримати власну оцінку: " + result.message, severity: 'error', hideTime: 10000 }));
        }
    };

    const fetchExhibitions = async () => {
        /*dispatch(setLoading({ isLoading: true }));
        const result = await paintingRatingAPI.paintingRatings(params.paintingId, pageRatings, ratingsPerPage);
        if (result.successfully === true) {
            setRatings(result.data.pageContent);
            setTotalRatingsCount(result.data.totalCount);
            dispatch(setLoading({ isLoading: false }));
        } else {
            dispatch(setLoading({ isLoading: false }));
            dispatch(showAlert({ message: "Не вдалось отримати список виставок: " + result.message, severity: 'error', hideTime: 10000 }));
        }*/
        console.log("Exhibitions fetch");
    };

    const fetchContests = async () => {
        /*dispatch(setLoading({ isLoading: true }));
        const result = await paintingRatingAPI.paintingRatings(params.paintingId, pageRatings, ratingsPerPage);
        if (result.successfully === true) {
            setRatings(result.data.pageContent);
            setTotalRatingsCount(result.data.totalCount);
            dispatch(setLoading({ isLoading: false }));
        } else {
            dispatch(setLoading({ isLoading: false }));
            dispatch(showAlert({ message: "Не вдалось отримати список конкурсів: " + result.message, severity: 'error', hideTime: 10000 }));
        }*/
        console.log("Contests fetch");
    };

    const handleChangeTab = (_, newValue) => {
        switch (newValue) {
            case 1:
                if (ratings === null) {
                    fetchRatings();
                    if (myProfileId !== null) fetchMyRating();
                }
                break;
            case 3:
                if (exhibitions === null) fetchExhibitions();
                break;
            case 4:
                if (contests === null) fetchContests();
                break;
        }
        setCurrentTab(newValue);
    };

    const handleMenuOpen = (event) => {
        setMenuAnchor(event.currentTarget);
    };

    const handleMenuClose = () => {
        setMenuAnchor(null);
    };

    const handleEditPainting = async () => {
        setIsCreateUpdateDialogOpen(true);
        handleMenuClose();
    };

    const handleUpdateRating = (rating) => {
        setSelectedRating(rating);
        setIsUpdateRatingDialogOpen(true);
    }

    const handleDeletePainting = async (paintingId) => {
        const deletePainting = async (paintingId) => {
            try {
                dispatch(setLoading({ isLoading: true }));
                const res = await paintingAPI.deletePainting(paintingId);

                if (res.successfully === true) {
                    dispatch(showAlert({ message: "Картину успішно видалено", severity: 'success', hideTime: 4000 }));
                    navigate("/paintings", { replace: true });
                } else {
                    dispatch(showAlert({ message: res.message, severity: 'error', hideTime: 6000 }));
                }
            } catch (error) {
                console.error("Помилка під час видалення картини:", error);
            }
            dispatch(setLoading({ isLoading: false }));
        }
        await deletePainting(paintingId);
        handleMenuClose();
    };

    const handleFavoriteClick = async () => {
        const addLike = async (paintingId, profileId) => {
            try {
                dispatch(setLoading({ isLoading: true }));
                const res = await paintingAPI.addLike(paintingId, profileId);

                if (res.successfully === true) {
                    dispatch(showAlert({ message: "Картину вподобано", severity: 'success', hideTime: 4000 }));
                } else {
                    dispatch(showAlert({ message: res.message, severity: 'error', hideTime: 6000 }));
                }
            } catch (error) {
                console.error("Помилка під час вподобання картини:", error);
            }
            dispatch(setLoading({ isLoading: false }));
        }
        const deleteLike = async (paintingId, profileId) => {
            try {
                dispatch(setLoading({ isLoading: true }));
                const res = await paintingAPI.deleteLike(paintingId, profileId);

                if (res.successfully === true) {
                    dispatch(showAlert({ message: "Вподобання скасовано", severity: 'success', hideTime: 4000 }));
                } else {
                    dispatch(showAlert({ message: res.message, severity: 'error', hideTime: 6000 }));
                }
            } catch (error) {
                console.error("Помилка під час скасування вподобання картини:", error);
            }
            dispatch(setLoading({ isLoading: false }));
        }
        if (paintingInfo.isLiked !== null && myProfileId !== null) {
            if (paintingInfo.isLiked) await deleteLike(paintingInfo.paintingId, myProfileId);
            else await addLike(paintingInfo.paintingId, myProfileId);
            setNeedRefetch(Date.now());
        }
    };

    const renderMenu = (
        <Menu
            anchorEl={menuAnchor}
            anchorOrigin={{ vertical: "top", horizontal: "right" }}
            id={"painting-menu"}
            keepMounted
            transformOrigin={{ vertical: "top", horizontal: "right" }}
            open={Boolean(menuAnchor)}
            onClose={handleMenuClose}
        >
            {(myIsAdmin || myPainterId !== null) ? ([
                <MenuItem key="delete" onClick={() => handleDeletePainting(paintingInfo.paintingId)}> <Icon>delete</Icon> Видалити</MenuItem>,
                myPainterId === paintingInfo.painterId &&
                <MenuItem key="edit" onClick={handleEditPainting}> <Icon>edit</Icon> Змінити</MenuItem>
            ]) : <Typography>Немає дозволених вам дій</Typography>}
        </Menu>
    );

    const renderInfoTab = (
        <Box>
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <Box sx={{ display: 'flex', alignItems: 'center', marginRight: 2 }}>
                    <Icon sx={{ color: red[500] }}>favorite</Icon>
                    <Typography variant="body2" color="text.secondary" sx={{ marginLeft: 1 }}>
                        Кількість вподобань на картині:
                    </Typography>
                </Box>
                <Typography variant="body1" color="primary">
                    {paintingInfo.likesCount}
                </Typography>
            </Box>
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <Box sx={{ display: 'flex', alignItems: 'center', marginRight: 2 }}>
                    <Icon sx={{ color: yellow[500] }}>emoji_events</Icon>
                    <Typography variant="body2" color="text.secondary" sx={{ marginLeft: 1 }}>
                        Кількість перемог на конкурсах:
                    </Typography>
                </Box>
                <Typography variant="body1" color="primary">
                    {paintingInfo.contestVictoriesCount}
                </Typography>
            </Box>
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <Box sx={{ display: 'flex', alignItems: 'center', marginRight: 2 }}>
                    <Icon sx={{ color: amber[600] }}>star</Icon>
                    <Typography variant="body2" color="text.secondary" sx={{ marginLeft: 1 }}>
                        Середнє значення рейтингу:
                    </Typography>
                </Box>
                <Rating value={paintingInfo.avgRating} readOnly size="small" max={5} precision={0.1} />
                <Typography variant="body1" color="primary" sx={{ marginLeft: 1 }}>
                    {paintingInfo.avgRating}
                </Typography>
                <Typography variant="body1" color="primary" sx={{ marginLeft: 0.5 }}>
                    (Кількість голосів - {paintingInfo.ratingCount})
                </Typography>
            </Box>
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <Box sx={{ display: 'flex', alignItems: 'center', marginRight: 2 }}>
                    <Icon sx={{ color: blue[500] }}>fingerprint</Icon>
                    <Typography variant="body2" color="text.secondary" sx={{ marginLeft: 1 }}>
                        ID картини:
                    </Typography>
                </Box>
                <Typography variant="body1" color="primary">
                    {paintingInfo.paintingId}
                </Typography>
            </Box>
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <Box sx={{ display: 'flex', alignItems: 'center', marginRight: 2 }}>
                    <Icon sx={{ color: blue[500] }}>account_circle</Icon>
                    <Typography variant="body2" color="text.secondary" sx={{ marginLeft: 1 }}>
                        ID облікового запису художника:
                    </Typography>
                </Box>
                <Typography variant="body1" color="primary">
                    {paintingInfo.painter.painterId}
                </Typography>
            </Box>
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <Box sx={{ display: 'flex', alignItems: 'center', marginRight: 2 }}>
                    <Icon sx={{ color: green[500] }}>date_range</Icon>
                    <Typography variant="body2" color="text.secondary" sx={{ marginLeft: 1 }}>
                        Дата створення картини:
                    </Typography>
                </Box>
                <Typography variant="body1" color="primary">
                    {new Date(paintingInfo.cretionDate).toLocaleDateString()}
                </Typography>
            </Box>
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <Box sx={{ display: 'flex', alignItems: 'center', marginRight: 2 }}>
                    <Icon sx={{ color: deepOrange[500] }}>interests</Icon>
                    <Typography variant="body2" color="text.secondary" sx={{ marginLeft: 1 }}>
                        Жанри картини:
                    </Typography>
                </Box>
                {paintingInfo.genres.length === 0 && <Typography variant="body1" color="primary">Картина не має жодного жанру</Typography>}
                {paintingInfo.genres.map((genre) => (
                    <Chip key={genre.genreId} color="primary" variant="outlined" label={genre.genreName} />
                ))}
            </Box>
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <Box sx={{ display: 'flex', alignItems: 'center', marginRight: 2 }}>
                    <Icon sx={{ color: deepOrange[500] }}>interests</Icon>
                    <Typography variant="body2" color="text.secondary" sx={{ marginLeft: 1 }}>
                        Стилі картини:
                    </Typography>
                </Box>
                {paintingInfo.styles.length === 0 && <Typography variant="body1" color="primary">Картина не має жодного стилю</Typography>}
                {paintingInfo.styles.map((style) => (
                    <Chip key={style.styleId} color="primary" variant="outlined" label={style.styleName} />
                ))}
            </Box>
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <Box sx={{ display: 'flex', alignItems: 'center', marginRight: 2 }}>
                    <Icon sx={{ color: deepOrange[500] }}>interests</Icon>
                    <Typography variant="body2" color="text.secondary" sx={{ marginLeft: 1 }}>
                        Матеріали картини:
                    </Typography>
                </Box>
                {paintingInfo.materials.length === 0 && <Typography variant="body1" color="primary">Картина не має жодного матеріалу</Typography>}
                {paintingInfo.materials.map((material) => (
                    <Chip key={material.materialId} color="primary" variant="outlined" label={material.materialName} />
                ))}
            </Box>
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <Box sx={{ display: 'flex', alignItems: 'center', marginRight: 2 }}>
                    <Icon sx={{ color: deepOrange[500] }}>local_offer</Icon>
                    <Typography variant="body2" color="text.secondary" sx={{ marginLeft: 1 }}>
                        Теги картини:
                    </Typography>
                </Box>
                {paintingInfo.tags.length === 0 && <Typography variant="body1" color="primary">Картина не має жодного тегу</Typography>}
                {paintingInfo.tags.map((tag) => (
                    <Chip key={tag.tagId} color="primary" variant="outlined" label={tag.tagName} />
                ))}
            </Box>
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <Box sx={{ display: 'flex', alignItems: 'center', marginRight: 2 }}>
                    <Icon sx={{ color: purple[500] }}>description</Icon>
                    <Typography variant="body2" color="text.secondary" sx={{ marginLeft: 1 }}>
                        Опис картини:
                    </Typography>
                </Box>
                <Typography variant="body1" color="primary">
                    {paintingInfo.description}
                </Typography>
            </Box>
        </Box>
    );

    const renderRatingsTab = (
        ratings !== null ? (
            <>
                {myProfileId !== null &&
                    <Accordion>
                        <AccordionSummary
                            expandIcon={<Icon>expand_more</Icon>}
                            id="user_rating"
                        >
                            Залишений відгук
                        </AccordionSummary>
                        <AccordionDetails>
                            {myRating !== null ? (
                                <Grid container spacing={2}>
                                    <Grid item xs={12}>
                                        <PaintingRatingCard rating={myRating} setPage={setPageRatings} setNeedRefetch={setNeedRatingsRefetch} handleUpdateRating={handleUpdateRating} />
                                    </Grid>
                                </Grid>
                            ) : (
                                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '10px' }}>
                                    <Typography>
                                        Ви ще не оцінили цю картину. Ви можете додати свій відгук
                                    </Typography>
                                    <Button onClick={() => setIsCreateRatingDialogOpen(true)}>Додати відгук</Button>
                                </div>)}
                        </AccordionDetails>
                    </Accordion>
                }
                <Accordion defaultExpanded>
                    <AccordionSummary expandIcon={<Icon>expand_more</Icon>} id="ratings" > Відгуки про картину </AccordionSummary>
                    <AccordionDetails>
                        {ratings.length !== 0 ? (
                            <>
                                <Grid container spacing={2}>
                                    {ratings.map((rating, index) => (
                                        <Grid item xs={12} key={index}>
                                            <PaintingRatingCard rating={rating} setPage={setPageRatings}
                                                setNeedRefetch={setNeedRatingsRefetch} handleUpdateRating={handleUpdateRating} />
                                        </Grid>
                                    ))}
                                </Grid>
                                <Grid container justifyContent="center" sx={{ mt: 2 }}>
                                    <Pagination
                                        component="div"
                                        count={Math.ceil(totalRatingsCount / ratingsPerPage)}
                                        page={pageRatings}
                                        onChange={(_, newPage) => setPageRatings(newPage)}
                                    />
                                </Grid>
                            </>
                        ) : (<Typography>Ще немає жодного відгуку</Typography>)}
                    </AccordionDetails>
                </Accordion>
            </>
        ) : (<CircularProgress />)
    );

    const renderStatisticsTab = (
        <StatisticsTab currentTab={currentTab} index={2} valueId="paintingId" getLikes={paintingAPI.getLikesStatistic}
            getRatings={paintingAPI.getRatingsStatistic}></StatisticsTab>
    );

    const renderExhibitionsTab = (
        exhibitions !== null ? (
            <>
                <div>Є виставки</div>
                {exhibitions.map((exhibition, index) => (
                    <div key={index}>{exhibition.exhibitionId}</div>
                ))}
            </>
        ) : (
            <div>Немає виставок</div>
        )
    );

    const renderContestsTab = (
        contests !== null ? (
            <>
                <div>Є конкурси</div>
                {contests.map((contest, index) => (
                    <div key={index}>{contest.contestId}</div>
                ))}
            </>
        ) : (
            <div>Немає конкурсів</div>
        )
    );

    return (
        <>
            <Box sx={{ position: 'relative' }}>
                <Card>
                    <CardHeader
                        avatar={
                            <Avatar
                                sx={{
                                    bgcolor: getColorFromSentence(paintingInfo.painter.pseudonym + paintingInfo.painter.firstName + paintingInfo.painter.lastName),
                                }}
                            />
                        }
                        action={
                            <IconButton onClick={handleMenuOpen}>
                                <Icon>more_vert</Icon>
                            </IconButton>
                        }
                        title={paintingInfo.name}
                        subheader={paintingInfo.painter.pseudonym}
                    />
                    <CardMedia
                        component="img"
                        //height="500"
                        image={baseURL + "/" + paintingInfo.imagePath}
                    />
                </Card>
                <IconButton
                    disabled={paintingInfo.isLiked === null} onClick={handleFavoriteClick}
                    variant="solid"
                    sx={{
                        position: 'absolute', zIndex: 2, borderRadius: '100%', right: '2rem', bottom: 0, transform: 'translateY(50%)',
                        backgroundColor: "white"
                    }}
                >
                    <Icon sx={{ color: paintingInfo.isLiked && red[500], fontSize: 50 }}>favorite</Icon>
                </IconButton>
            </Box>
            {renderMenu}
            <div>
                <Box sx={{ width: '100%' }}>
                    <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                        <Tabs value={currentTab} onChange={handleChangeTab}>
                            <Tab label="Інформація" id={"tab-0"} aria-controls={"tabpanel-0"} />
                            <Tab label="Оцінки" id={"tab-1"} aria-controls={"tabpanel-1"} />
                            <Tab label="Статистика" id={"tab-2"} aria-controls={"tabpanel-2"} />
                            <Tab label="Виставки" id={"tab-3"} aria-controls={"tabpanel-3"} />
                            <Tab label="Конкурси" id={"tab-4"} aria-controls={"tabpanel-4"} />
                        </Tabs>
                    </Box>
                    <TabPanel value={currentTab} index={0}>
                        {renderInfoTab}
                    </TabPanel>
                    <TabPanel value={currentTab} index={1}>
                        {renderRatingsTab}
                    </TabPanel>
                    <TabPanel value={currentTab} index={2}>
                        {renderStatisticsTab}
                    </TabPanel>
                    <TabPanel value={currentTab} index={3}>
                        {renderExhibitionsTab}
                    </TabPanel>
                    <TabPanel value={currentTab} index={4}>
                        {renderContestsTab}
                    </TabPanel>
                </Box>
            </div>
            {isCreateUpdateDialogOpen &&
                <PaintingCreateUpdate isCreateUpdateDialogOpen={isCreateUpdateDialogOpen} selectedPainting={selectedPainting}
                    setSelectedPainting={setSelectedPainting} setIsCreateUpdateDialogOpen={setIsCreateUpdateDialogOpen}
                    setNeedRefetch={setNeedRefetch} />
            }
            {isCreateRatingDialogOpen &&
                <PaintingRatingCreate isCreateDialogOpen={isCreateRatingDialogOpen} setIsCreateDialogOpen={setIsCreateRatingDialogOpen}
                    setNeedRefetch={setNeedRatingsRefetch} profileId={myProfileId} paintingId={paintingInfo.paintingId} />
            }
            {isUpdateRatingDialogOpen &&
                <PaintingRatingUpdate isUpdateDialogOpen={isUpdateRatingDialogOpen} setIsUpdateDialogOpen={setIsUpdateRatingDialogOpen}
                    setNeedRefetch={setNeedRatingsRefetch} defaultValues={selectedRating} />
            }
        </>
    );
}

export default Painting;
