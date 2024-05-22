import * as React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { setLoading, setTitle, showAlert } from '../../../Store/headerSlice';
import { useNavigate, useParams } from 'react-router-dom';
import { painterAPI } from '../../../API/painterAPI';
import { Avatar, Box, CardHeader, CircularProgress, Grid, Icon, IconButton, Menu, MenuItem, Pagination, Rating, Tab, Tabs, Typography } from '@mui/material';
import TabPanel from '../../UI/TabPanel';
import { getColorFromSentence } from '../../../Helper/ColorFunctions';
import { amber, blue, green, purple, red, yellow } from '@mui/material/colors';
import PainterUpdate from './PainterUpdate';
import { RefreshTokens } from '../../../Helper/RefreshTokens';
import StatisticsTab from '../../UI/StatisticsTab';
import { paintingAPI } from '../../../API/paintingAPI';
import PaintingCard from '../Painting/PaintingCard';

const Painter = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const params = useParams();
    const myPainterId = useSelector((store) => store.user.painterId);
    const myRoles = useSelector((store) => store.user.roles);
    const myIsAdmin = myRoles !== null ? myRoles.includes("Admin") : false;

    const [painterInfo, setPainterInfo] = React.useState(null);

    const [paintings, setPaintings] = React.useState(null);
    const [paintingsPage, setPaintingsPage] = React.useState(1);
    const paintingsPerPage = 12;
    const [paintingsTotalCount, setPaintingsTotalCount] = React.useState(0);
    const [needRefetchPaintings, setNeedRefetchPaintings] = React.useState(Date.now());

    const [currentTab, setCurrentTab] = React.useState(0);
    const [menuAnchor, setMenuAnchor] = React.useState(null);
    const [isUpdateDialogOpen, setIsUpdateDialogOpen] = React.useState(false);
    const [needRefetch, setNeedRefetch] = React.useState(Date.now());

    React.useEffect(() => {
        dispatch(setTitle({ title: "Художник" }));
        fetchInfo();
    }, [needRefetch, needRefetchPaintings]);

    React.useEffect(() => {
        if (paintings !== null) fetchPaintings();
    }, [needRefetchPaintings, paintingsPage]);

    const fetchInfo = async () => {
        dispatch(setLoading({ isLoading: true }));
        const result = await painterAPI.painter(params.painterId);
        if (result.successfully === true) {
            setPainterInfo(result.data);
            dispatch(setLoading({ isLoading: false }));
        } else {
            dispatch(setLoading({ isLoading: false }));
            dispatch(showAlert({ message: "Не вдалось отримати дані: " + result.message, severity: 'error', hideTime: 10000 }));
        }
    };

    if (painterInfo == null) return <></>

    const fetchPaintings = async () => {
        dispatch(setLoading({ isLoading: true }));
        const result = await paintingAPI.paintings(paintingsPage, paintingsPerPage, { painterId: params.painterId });
        if (result.successfully === true) {
            setPaintings(result.data.pageContent);
            setPaintingsTotalCount(result.data.totalCount);
        } else {
            dispatch(showAlert({ message: "Не вдалось отримати дані: " + result.message, severity: 'error', hideTime: 10000 }));
        }
        dispatch(setLoading({ isLoading: false }));
    };

    const handleChangeTab = (_, newValue) => {
        switch (newValue) {
            case 1:
                if (paintings === null) fetchPaintings();
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

    const handleEditPainter = async () => {
        setIsUpdateDialogOpen(true);
        handleMenuClose();
    };

    const handleDeletePainter = async (painterId) => {
        const deletePainter = async (painterId) => {
            try {
                dispatch(setLoading({ isLoading: true }));
                const res = await painterAPI.deletePainter(painterId);

                if (res.successfully === true) {
                    dispatch(showAlert({ message: "Художника успішно видалено", severity: 'success', hideTime: 4000 }));
                    if (myPainterId === painterId) RefreshTokens();
                    navigate("/painters", { replace: true });
                } else {
                    dispatch(showAlert({ message: res.message, severity: 'error', hideTime: 6000 }));
                }
            } catch (error) {
                console.error("Помилка під час видалення художника:", error);
            }
            dispatch(setLoading({ isLoading: false }));
        }
        await deletePainter(painterId);
        handleMenuClose();
    };

    const renderMenu = (
        <Menu
            anchorEl={menuAnchor}
            anchorOrigin={{ vertical: "top", horizontal: "right" }}
            id={"account-menu"}
            keepMounted
            transformOrigin={{ vertical: "top", horizontal: "right" }}
            open={Boolean(menuAnchor)}
            onClose={handleMenuClose}
        >
            {(myIsAdmin || myPainterId === painterInfo.painterId) ? ([
                myPainterId === painterInfo.painterId && <MenuItem key="edit" onClick={handleEditPainter}> <Icon>edit</Icon> Змінити</MenuItem>,
                <MenuItem key="delete" onClick={() => handleDeletePainter(painterInfo.painterId)}> <Icon>delete</Icon> Видалити</MenuItem>,
            ]) : <Typography>Немає дозволених вам дій</Typography>}
        </Menu>
    );

    const renderInfoTab = (
        <Box>
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <Box sx={{ display: 'flex', alignItems: 'center', marginRight: 2 }}>
                    <Icon sx={{ color: red[500] }}>favorite</Icon>
                    <Typography variant="body2" color="text.secondary" sx={{ marginLeft: 1 }}>
                        Кількість вподобань на картинах:
                    </Typography>
                </Box>
                <Typography variant="body1" color="primary">
                    {painterInfo.likesCount}
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
                    {painterInfo.victoriesCount}
                </Typography>
            </Box>
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <Box sx={{ display: 'flex', alignItems: 'center', marginRight: 2 }}>
                    <Icon sx={{ color: amber[600] }}>star</Icon>
                    <Typography variant="body2" color="text.secondary" sx={{ marginLeft: 1 }}>
                        Середнє значення рейтингу:
                    </Typography>
                </Box>
                <Rating value={painterInfo.avgRating} readOnly size="small" max={5} precision={0.1} />
                <Typography variant="body1" color="primary" sx={{ marginLeft: 1 }}>
                    {painterInfo.avgRating}
                </Typography>
                <Typography variant="body1" color="primary" sx={{ marginLeft: 0.5 }}>
                    (Кількість голосів - {painterInfo.ratingCount})
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
                    {painterInfo.painterId}
                </Typography>
            </Box>
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <Box sx={{ display: 'flex', alignItems: 'center', marginRight: 2 }}>
                    <Icon sx={{ color: blue[500] }}>account_circle</Icon>
                    <Typography variant="body2" color="text.secondary" sx={{ marginLeft: 1 }}>
                        ID профілю користувача:
                    </Typography>
                </Box>
                <Typography variant="body1" color="primary">
                    {painterInfo.profileId}
                </Typography>
            </Box>
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <Box sx={{ display: 'flex', alignItems: 'center', marginRight: 2 }}>
                    <Icon sx={{ color: green[500] }}>date_range</Icon>
                    <Typography variant="body2" color="text.secondary" sx={{ marginLeft: 1 }}>
                        Дата приєднання:
                    </Typography>
                </Box>
                <Typography variant="body1" color="primary">
                    {new Date(painterInfo.joiningDate).toLocaleDateString()}
                </Typography>
            </Box>
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <Box sx={{ display: 'flex', alignItems: 'center', marginRight: 2 }}>
                    <Icon sx={{ color: purple[500] }}>description</Icon>
                    <Typography variant="body2" color="text.secondary" sx={{ marginLeft: 1 }}>
                        Опис художника:
                    </Typography>
                </Box>
                <Typography variant="body1" color="primary">
                    {painterInfo.description}
                </Typography>
            </Box>
        </Box>
    );

    const renderStatisticsTab = (
        <StatisticsTab currentTab={currentTab} index={2} valueId="painterId" getLikes={painterAPI.getLikesStatistic}
            getRatings={painterAPI.getRatingsStatistic}></StatisticsTab>
    );

    const renderPaintingsTab = (
        paintings === null && <CircularProgress />,
        paintings !== null && paintings.length !== 0 ? (
            <>
                <Grid container spacing={2}>
                    {paintings.map((painting, index) => (
                        <Grid item xs={12} sm={12} md={6} lg={4} key={index}>
                            <PaintingCard painting={painting} setNeedRefetch={setNeedRefetchPaintings} isWithoutMenu={true} />
                        </Grid>
                    ))}
                </Grid>
                <Grid container justifyContent="center" sx={{ mt: 2 }}>
                    <Pagination
                        component="div"
                        count={Math.ceil(paintingsTotalCount / paintingsPerPage)}
                        page={paintingsPage}
                        onChange={(_, newPage) => setPaintingsPage(newPage)}
                    />
                </Grid>
            </>
        ) : (
            <div>Немає жодної доступної картини</div>
        )
    );

    return (
        <>
            <CardHeader
                avatar={
                    <Avatar
                        sx={{
                            bgcolor: getColorFromSentence(painterInfo.pseudonym + painterInfo.firstName + painterInfo.lastName),
                            width: 100,
                            height: 100,
                            fontSize: '3rem'
                        }}
                    >
                        {painterInfo.firstName[0] + (painterInfo.lastName ? painterInfo.lastName[0] : '')}
                    </Avatar>
                }
                action={
                    <IconButton onClick={handleMenuOpen}>
                        <Icon>more_vert</Icon>
                    </IconButton>
                }
                title={painterInfo.pseudonym}
                subheader={`${painterInfo.firstName} ${painterInfo.lastName}`}
                titleTypographyProps={{ variant: 'h5' }}
                subheaderTypographyProps={{ variant: 'h7' }}
            />
            {renderMenu}
            <div>
                <Box sx={{ width: '100%' }}>
                    <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                        <Tabs value={currentTab} onChange={handleChangeTab}>
                            <Tab label="Інформація" id={"tab-0"} aria-controls={"tabpanel-0"} />
                            <Tab label="Картини" id={"tab-1"} aria-controls={"tabpanel-1"} />
                            <Tab label="Статистика" id={"tab-2"} aria-controls={"tabpanel-2"} />
                        </Tabs>
                    </Box>
                    <TabPanel value={currentTab} index={0}>
                        {renderInfoTab}
                    </TabPanel>
                    <TabPanel value={currentTab} index={1}>
                        {renderPaintingsTab}
                    </TabPanel>
                    <TabPanel value={currentTab} index={2}>
                        {renderStatisticsTab}
                    </TabPanel>
                </Box>
            </div>
            {isUpdateDialogOpen &&
                <PainterUpdate isUpdateDialogOpen={isUpdateDialogOpen} setIsUpdateDialogOpen={setIsUpdateDialogOpen}
                    defaultValues={painterInfo} setNeedRefetch={setNeedRefetch} />
            }
        </>
    );
}

export default Painter;
