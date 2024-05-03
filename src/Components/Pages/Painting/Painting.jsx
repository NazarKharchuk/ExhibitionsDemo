import * as React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { setLoading, setTitle, showAlert } from '../../../Store/headerSlice';
import { useNavigate, useParams } from 'react-router-dom';
import { paintingAPI } from '../../../API/paintingAPI';
import { Avatar, Box, Card, CardHeader, CardMedia, Chip, Icon, IconButton, LinearProgress, Menu, MenuItem, Rating, Tab, Tabs, Typography } from '@mui/material';
import TabPanel from '../../UI/TabPanel';
import { getColorFromSentence } from '../../../Helper/ColorFunctions';
import { amber, blue, deepOrange, green, purple, red, yellow } from '@mui/material/colors';
import PaintingCreateUpdate from './PaintingCreateUpdate';
import { baseURL } from '../../../API/api';

const Painting = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const params = useParams();
    const myProfileId = useSelector((store) => store.user.profileId);
    const myPainterId = useSelector((store) => store.user.painterId);

    const [paintingInfo, setPaintingInfo] = React.useState(null);
    const [exhibitions, setExhibitions] = React.useState([]);
    const [currentTab, setCurrentTab] = React.useState(0);
    const [menuAnchor, setMenuAnchor] = React.useState(null);
    const [selectedPainting, setSelectedPainting] = React.useState(params.paintingId);
    const [isCreateUpdateDialogOpen, setIsCreateUpdateDialogOpen] = React.useState(false);
    const [needRefetch, setNeedRefetch] = React.useState(Date.now());

    React.useEffect(() => {
        dispatch(setTitle({ title: "Картина" }));
        fetchInfo();
    }, [needRefetch]);

    const fetchInfo = async () => {
        dispatch(setLoading({ isLoading: true }));
        const result = await paintingAPI.painting(params.paintingId);
        if (result.successfully === true) {
            setPaintingInfo(result.data);
            dispatch(setLoading({ isLoading: false }));
        } else {
            dispatch(setLoading({ isLoading: false }));
            dispatch(showAlert({ message: "Не вдалось отримати дані: " + result.message, severity: 'error', hideTime: 10000 }));
        }
    };

    if (paintingInfo == null) return <></>

    const fetchExhibitions = async () => {
        /*dispatch(setLoading({ isLoading: true }));
        const result = await exhibitionsAPI.exhibitions({ page: 1, rowsPerPage: 2 });
        if (result.successfully === true) {
            setExhibitions(result.data.pageContent);
            dispatch(setLoading({ isLoading: false }));
        } else {
            dispatch(setLoading({ isLoading: false }));
            dispatch(showAlert({ message: "Не вдалось отримати дані: " + result.message, severity: 'error', hideTime: 10000 }));
        }*/
        console.log("Fetching exhibitions");
    };

    const handleChangeTab = (_, newValue) => {
        switch (newValue) {
            case 1:
                if (exhibitions.length === 0) fetchExhibitions();
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
            <MenuItem onClick={handleEditPainting}> <Icon>edit</Icon> Змінити</MenuItem>
            <MenuItem onClick={() => handleDeletePainting(paintingInfo.paintingId)}> <Icon>delete</Icon> Видалити</MenuItem>
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

    const renderExhibitionsTab = (
        exhibitions.length !== 0 ? (
            <>
                <div>Yes exhibitions</div>
                {exhibitions.map((exhibition, index) => (
                    <div key={index}>{exhibition.exhibitionId}</div>
                ))}
            </>
        ) : (
            <div>No exhibitions</div>
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
                            <Tab label="Виставки" id={"tab-1"} aria-controls={"tabpanel-1"} />
                        </Tabs>
                    </Box>
                    <TabPanel value={currentTab} index={0}>
                        {renderInfoTab}
                    </TabPanel>
                    <TabPanel value={currentTab} index={1}>
                        {renderExhibitionsTab}
                    </TabPanel>
                </Box>
            </div>
            {isCreateUpdateDialogOpen &&
                <PaintingCreateUpdate isCreateUpdateDialogOpen={isCreateUpdateDialogOpen} selectedPainting={selectedPainting}
                    setSelectedPainting={setSelectedPainting} setIsCreateUpdateDialogOpen={setIsCreateUpdateDialogOpen}
                    setNeedRefetch={setNeedRefetch} />
            }
        </>
    );
}

export default Painting;
