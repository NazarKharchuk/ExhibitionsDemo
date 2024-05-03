import * as React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { setLoading, setTitle, showAlert } from '../../../Store/headerSlice';
import { useNavigate, useParams } from 'react-router-dom';
import { contestAPI } from '../../../API/contestAPI';
import { Accordion, AccordionDetails, AccordionSummary, Avatar, Box, Button, CardHeader, Chip, CircularProgress, Grid, Icon, IconButton, Menu, MenuItem, Pagination, Tab, Tabs, Typography } from '@mui/material';
import TabPanel from '../../UI/TabPanel';
import { getColorFromSentence } from '../../../Helper/ColorFunctions';
import { amber, blue, green, purple, red, teal, yellow } from '@mui/material/colors';
import ContestCreateUpdate from './ContestCreateUpdate';
import PaintingInContestCard from '../Painting/PaintingInContestCard';
import ApplicationCreate from './ApplicationCreate';

const Contest = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const params = useParams();
    const myProfileId = useSelector((store) => store.user.profileId);
    const myPainterId = useSelector((store) => store.user.painterId);
    const myRoles = useSelector((store) => store.user.roles);
    const myIsAdmin = myRoles !== null ? myRoles.includes("Admin") : false;

    const [contestInfo, setContestInfo] = React.useState(null);
    const [currentTab, setCurrentTab] = React.useState(0);
    const [menuAnchor, setMenuAnchor] = React.useState(null);
    const [isCreateUpdateDialogOpen, setIsCreateUpdateDialogOpen] = React.useState(false);
    const [selectedContest, setSelectedContest] = React.useState(null);

    const [needRefetch, setNeedRefetch] = React.useState(Date.now());

    const [applications, setApplications] = React.useState(null);
    const [totalAppsCount, setTotalAppsCount] = React.useState(0);
    const [pageApplications, setPageApplications] = React.useState(1);
    const applicationsPerPage = 12;
    const [votes, setVotes] = React.useState(null);
    const [totalVotesCount, setTotalVotesCount] = React.useState(0);
    const [pageVotes, setPageVotes] = React.useState(1);
    const votesPerPage = 12;
    const [needAppsRefetch, setNeedAppsRefetch] = React.useState(Date.now());

    const [submissions, setSubmissions] = React.useState(null);
    const [totalSubmissionsCount, setTotalSubmissionsCount] = React.useState(0);
    const [pageSubmissions, setPageSubmissions] = React.useState(1);
    const submissionsPerPage = 12;
    const [isCreateApplicationDialogOpen, setIsCreateApplicationDialogOpen] = React.useState(false);
    const [needSubmissionsRefetch, setNeedSubmissionsRefetch] = React.useState(Date.now());

    const [notConfirmeds, setNotConfirmeds] = React.useState(null);
    const [totalNotConfirmedsCount, setTotalNotConfirmedsCount] = React.useState(0);
    const [pageNotConfirmeds, setPageNotConfirmeds] = React.useState(1);
    const notConfirmedsPerPage = 12;
    const [needNotConfirmedsRefetch, setNeedNotConfirmedsRefetch] = React.useState(Date.now());

    React.useEffect(() => {
        dispatch(setTitle({ title: "Конкурс" }));
        fetchInfo();
    }, [needRefetch, myProfileId, myPainterId, needAppsRefetch, needSubmissionsRefetch, needNotConfirmedsRefetch]);

    React.useEffect(() => {
        if (applications !== null) fetchApplications();
        if (myProfileId !== null && votes !== null) fetchVotes();
    }, [needAppsRefetch, needSubmissionsRefetch, needNotConfirmedsRefetch, needRefetch]);

    React.useEffect(() => {
        if (myPainterId !== null && submissions !== null) fetchSubmissions();
    }, [needSubmissionsRefetch, needNotConfirmedsRefetch, needRefetch]);

    React.useEffect(() => {
        if (myIsAdmin !== false && notConfirmeds !== null) fetchNotConfirmeds();
    }, [needNotConfirmedsRefetch, needSubmissionsRefetch, needRefetch]);

    const fetchInfo = async () => {
        dispatch(setLoading({ isLoading: true }));
        const result = await contestAPI.contest(params.contestId);
        if (result.successfully === true) {
            setContestInfo(result.data);
            dispatch(setLoading({ isLoading: false }));
        } else {
            dispatch(setLoading({ isLoading: false }));
            dispatch(showAlert({ message: "Не вдалось отримати дані: " + result.message, severity: 'error', hideTime: 10000 }));
        }
    };

    if (contestInfo == null) return <></>

    const fetchApplications = async () => {
        dispatch(setLoading({ isLoading: true }));
        const result = await contestAPI.contestApplications(params.contestId, pageApplications, applicationsPerPage);
        if (result.successfully === true) {
            setApplications(result.data.pageContent);
            setTotalAppsCount(result.data.totalCount);
            dispatch(setLoading({ isLoading: false }));
        } else {
            dispatch(setLoading({ isLoading: false }));
            dispatch(showAlert({ message: "Не вдалось отримати заявки: " + result.message, severity: 'error', hideTime: 10000 }));
        }
    };

    const fetchVotes = async () => {
        dispatch(setLoading({ isLoading: true }));
        const result = await contestAPI.contestVotes(params.contestId, pageVotes, votesPerPage);
        if (result.successfully === true) {
            setVotes(result.data.pageContent);
            setTotalVotesCount(result.data.totalCount);
            dispatch(setLoading({ isLoading: false }));
        } else {
            dispatch(setLoading({ isLoading: false }));
            dispatch(showAlert({ message: "Не вдалось отримати голоси: " + result.message, severity: 'error', hideTime: 10000 }));
        }
    };

    const fetchSubmissions = async () => {
        dispatch(setLoading({ isLoading: true }));
        const result = await contestAPI.contestSubmissions(params.contestId, pageVotes, votesPerPage);
        if (result.successfully === true) {
            setSubmissions(result.data.pageContent);
            setTotalSubmissionsCount(result.data.totalCount);
            dispatch(setLoading({ isLoading: false }));
        } else {
            dispatch(setLoading({ isLoading: false }));
            dispatch(showAlert({ message: "Не вдалось отримати подані картини: " + result.message, severity: 'error', hideTime: 10000 }));
        }
    };

    const fetchNotConfirmeds = async () => {
        dispatch(setLoading({ isLoading: true }));
        const result = await contestAPI.contestNotConfirmeds(params.contestId, pageVotes, votesPerPage);
        if (result.successfully === true) {
            setNotConfirmeds(result.data.pageContent);
            setTotalNotConfirmedsCount(result.data.totalCount);
            dispatch(setLoading({ isLoading: false }));
        } else {
            dispatch(setLoading({ isLoading: false }));
            dispatch(showAlert({ message: "Не вдалось отримати не підтверджені картини: " + result.message, severity: 'error', hideTime: 10000 }));
        }
    };

    const handleChangeTab = (_, newValue) => {
        switch (newValue) {
            case 1:
                if (applications === null) {
                    fetchApplications();
                    if (myProfileId !== null) fetchVotes();
                }
                break;
            case 2:
                if (myPainterId !== null && submissions === null) {
                    fetchSubmissions();
                }
                if (myPainterId === null) {
                    if (myIsAdmin !== false && notConfirmeds === null) {
                        fetchNotConfirmeds();
                    }
                }
                break;
            case 3:
                if (myIsAdmin !== false && notConfirmeds === null) {
                    fetchNotConfirmeds();
                }
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

    const handleEditContest = async () => {
        setSelectedContest(params.contestId);
        setIsCreateUpdateDialogOpen(true);
        handleMenuClose();
    };

    const handleDeleteContest = async (contestId) => {
        const deleteContest = async (contestId) => {
            try {
                dispatch(setLoading({ isLoading: true }));
                const res = await contestAPI.deleteContest(contestId);

                if (res.successfully === true) {
                    dispatch(showAlert({ message: "Конкурс успішно видалено", severity: 'success', hideTime: 4000 }));
                    navigate("/contests", { replace: true });
                } else {
                    dispatch(showAlert({ message: res.message, severity: 'error', hideTime: 6000 }));
                }
            } catch (error) {
                console.error("Помилка під час видалення кункурсу:", error);
            }
            dispatch(setLoading({ isLoading: false }));
        }
        await deleteContest(contestId);
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
            {myIsAdmin ? ([
                <MenuItem key="edit" onClick={handleEditContest}> <Icon>edit</Icon> Змінити</MenuItem>,
                <MenuItem key="delete" onClick={() => handleDeleteContest(contestInfo.contestId)}> <Icon>delete</Icon> Видалити</MenuItem>
            ]) : <Typography>Немає дозволених вам дій</Typography>}
        </Menu>
    );

    const contestStatus = () => {
        var date = new Date();
        if (new Date(contestInfo.startDate) > date) return <Chip key="status" color="info" variant="outlined" label="Прийом заявок" />
        if (new Date(contestInfo.endDate) > date) return <Chip key="status" color="success" variant="outlined" label="Голосування" />
        if (date > new Date(contestInfo.endDate)) return <Chip key="status" color="warning" variant="outlined" label="Завершено" />
    };

    const renderInfoTab = (
        <Box>
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <Box sx={{ display: 'flex', alignItems: 'center', marginRight: 2 }}>
                    <Icon sx={{ color: blue[500] }}>account_circle</Icon>
                    <Typography variant="body2" color="text.secondary" sx={{ marginLeft: 1 }}>
                        ID конкурсу:
                    </Typography>
                </Box>
                <Typography variant="body1" color="primary">
                    {contestInfo.contestId}
                </Typography>
            </Box>
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <Box sx={{ display: 'flex', alignItems: 'center', marginRight: 2 }}>
                    <Icon sx={{ color: blue[500] }}>bolt</Icon>
                    <Typography variant="body2" color="text.secondary" sx={{ marginLeft: 1 }}>
                        Статус:
                    </Typography>
                </Box>
                <div style={{ display: 'flex', alignItems: 'center' }}>
                    {contestStatus()}
                </div>
            </Box>
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <Box sx={{ display: 'flex', alignItems: 'center', marginRight: 2 }}>
                    <Icon sx={{ color: green[500] }}>calendar_month</Icon>
                    <Typography variant="body2" color="text.secondary" sx={{ marginLeft: 1 }}>
                        Дата створення конкурсу:
                    </Typography>
                </Box>
                <Typography variant="body1" color="primary">
                    {contestInfo.addedDate.slice(0, 10)}
                </Typography>
            </Box>
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <Box sx={{ display: 'flex', alignItems: 'center', marginRight: 2 }}>
                    <Icon sx={{ color: yellow[500] }}>calendar_month</Icon>
                    <Typography variant="body2" color="text.secondary" sx={{ marginLeft: 1 }}>
                        Дата початку голосування:
                    </Typography>
                </Box>
                <Typography variant="body1" color="primary">
                    {contestInfo.startDate.slice(0, 10)}
                </Typography>
            </Box>
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <Box sx={{ display: 'flex', alignItems: 'center', marginRight: 2 }}>
                    <Icon sx={{ color: red[500] }}>calendar_month</Icon>
                    <Typography variant="body2" color="text.secondary" sx={{ marginLeft: 1 }}>
                        Дата закінчення голосування:
                    </Typography>
                </Box>
                <Typography variant="body1" color="primary">
                    {contestInfo.endDate.slice(0, 10)}
                </Typography>
            </Box>
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <Box sx={{ display: 'flex', alignItems: 'center', marginRight: 2 }}>
                    <Icon sx={{ color: amber[500] }}>emoji_events</Icon>
                    <Typography variant="body2" color="text.secondary" sx={{ marginLeft: 1 }}>
                        Кількість переможців конкурсу:
                    </Typography>
                </Box>
                <Typography variant="body1" color="primary">
                    {contestInfo.winnersCount}
                </Typography>
            </Box>
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <Box sx={{ display: 'flex', alignItems: 'center', marginRight: 2 }}>
                    <Icon sx={{ color: blue[500] }}>info</Icon>
                    <Typography variant="body2" color="text.secondary" sx={{ marginLeft: 1 }}>
                        Ліміт кількості заявок від одного художника:
                    </Typography>
                </Box>
                <Typography variant="body1" color="primary">
                    {contestInfo.painterLimit !== null ? contestInfo.painterLimit : '∞'}
                </Typography>
            </Box>
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <Box sx={{ display: 'flex', alignItems: 'center', marginRight: 2 }}>
                    <Icon sx={{ color: blue[500] }}>info</Icon>
                    <Typography variant="body2" color="text.secondary" sx={{ marginLeft: 1 }}>
                        Ліміт кількості голосів від одного користувача:
                    </Typography>
                </Box>
                <Typography variant="body1" color="primary">
                    {contestInfo.votesLimit !== null ? contestInfo.votesLimit : '∞'}
                </Typography>
            </Box>
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <Box sx={{ display: 'flex', alignItems: 'center', marginRight: 2 }}>
                    <Icon sx={{ color: teal[500] }}>admin_panel_settings</Icon>
                    <Typography variant="body2" color="text.secondary" sx={{ marginLeft: 1 }}>
                        Необхідність підтвердження заявок адміністраторами:
                    </Typography>
                </Box>
                <Typography variant="body1" color="primary">
                    {contestInfo.needConfirmation === true ? "так" : " ні"}
                </Typography>
            </Box>
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <Box sx={{ display: 'flex', alignItems: 'center', marginRight: 2 }}>
                    <Icon sx={{ color: green[500] }}>check_circle</Icon>
                    <Typography variant="body2" color="text.secondary" sx={{ marginLeft: 1 }}>
                        Кількість допущених до конкурсу заявок:
                    </Typography>
                </Box>
                <Typography variant="body1" color="primary">
                    {contestInfo.needConfirmation === true ? contestInfo.confirmedApplicationsCount : contestInfo.confirmedApplicationsCount + contestInfo.notConfirmedApplicationsCount}
                </Typography>
            </Box>
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <Box sx={{ display: 'flex', alignItems: 'center', marginRight: 2 }}>
                    <Icon sx={{ color: amber[500] }}>cancel</Icon>
                    <Typography variant="body2" color="text.secondary" sx={{ marginLeft: 1 }}>
                        Кількість не допущених до конкурсу заявок:
                    </Typography>
                </Box>
                <Typography variant="body1" color="primary">
                    {contestInfo.needConfirmation === true ? contestInfo.notConfirmedApplicationsCount : 0}
                </Typography>
            </Box>
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <Box sx={{ display: 'flex', alignItems: 'center', marginRight: 2 }}>
                    <Icon sx={{ color: blue[500] }}>local_offer</Icon>
                    <Typography variant="body2" color="text.secondary" sx={{ marginLeft: 1 }}>
                        Теги конкурсу:
                    </Typography>
                </Box>
                <div>
                    {contestInfo.tags.length === 0 && "-"}
                    {contestInfo.tags.map(tag => (
                        <Chip key={tag.tagId} color="primary" variant="outlined" label={tag.tagName} />
                    ))}
                </div>
            </Box>
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <Box sx={{ display: 'flex', alignItems: 'center', marginRight: 2 }}>
                    <Icon sx={{ color: purple[500] }}>description</Icon>
                    <Typography variant="body2" color="text.secondary" sx={{ marginLeft: 1 }}>
                        Опис картини:
                    </Typography>
                </Box>
                <Typography variant="body1" color="primary">
                    {contestInfo.description}
                </Typography>
            </Box>
        </Box>
    );

    const isNotVotingPeriod = !(new Date(contestInfo.startDate) <= new Date() && new Date(contestInfo.endDate) >= new Date());

    const renderApplicationsTab = (
        applications === null && <CircularProgress />,
        applications !== null && applications.length !== 0 ? (
            <>
                {myProfileId !== null &&
                    <Accordion>
                        <AccordionSummary
                            expandIcon={<Icon>expand_more</Icon>}
                            id="user_votes"
                        >
                            Підтримані заявки
                        </AccordionSummary>
                        <AccordionDetails>
                            {(new Date(contestInfo.startDate) <= new Date()) ?
                                <>
                                    {votes !== null ? (
                                        <>
                                            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '10px' }}>
                                                <Typography>
                                                    Кількість голосів, що залишилась:{" "}
                                                    {contestInfo.votesLimit !== null ? contestInfo.votesLimit - totalVotesCount : "∞"}
                                                </Typography>
                                            </div>
                                            {votes.length !== 0 ? (
                                                <>
                                                    <Grid container spacing={2}>
                                                        {votes.map((votedPainting, index) => (
                                                            <Grid item xs={12} sm={12} md={6} lg={4} key={index}>
                                                                <PaintingInContestCard application={votedPainting} setPage={setPageVotes}
                                                                setNeedRefetch={setNeedAppsRefetch} actionMode="unvote"
                                                                disabledButton={isNotVotingPeriod} />
                                                            </Grid>
                                                        ))}
                                                    </Grid>
                                                    <Grid container justifyContent="center" sx={{ mt: 2 }}>
                                                        <Pagination
                                                            component="div"
                                                            count={Math.ceil(totalVotesCount / votesPerPage)}
                                                            page={pageVotes}
                                                            onChange={(_, newPage) => setPageVotes(newPage)}
                                                        />
                                                    </Grid>
                                                </>
                                            ) : (<div>Не проголосовано за жодну заявку</div>)}
                                        </>
                                    ) : (<CircularProgress />)}
                                </>
                                : <Typography>Голосування ще не розпочалося</Typography>}
                        </AccordionDetails>
                    </Accordion>
                }
                <Accordion defaultExpanded>
                    <AccordionSummary
                        expandIcon={<Icon>expand_more</Icon>}
                        id="user_votes"
                    >
                        Допущені заявки
                    </AccordionSummary>
                    <AccordionDetails>
                        <>
                            <Grid container spacing={2}>
                                {applications.map((application, index) => (
                                    <Grid item xs={12} sm={12} md={6} lg={4} key={index}>
                                        <PaintingInContestCard application={application} setPage={setPageApplications}
                                            setNeedRefetch={setNeedAppsRefetch} actionMode="vote"
                                            disabledButton={isNotVotingPeriod || myProfileId === null} />
                                    </Grid>
                                ))}
                            </Grid>
                            <Grid container justifyContent="center" sx={{ mt: 2 }}>
                                <Pagination
                                    component="div"
                                    count={Math.ceil(totalAppsCount / applicationsPerPage)}
                                    page={pageApplications}
                                    onChange={(_, newPage) => setPageApplications(newPage)}
                                />
                            </Grid>
                        </>
                    </AccordionDetails>
                </Accordion>
            </>
        ) : (
            <div>Немає жодної доступної заявки</div>
        )
    );

    const renderSubmissionsTab = (
        myPainterId !== null ? (
            submissions !== null ? (
                (new Date(contestInfo.startDate) >= new Date()) ? (
                    <>
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '10px' }}>
                            <Typography>
                                Кількість заявок, що залишилась:{" "}
                                {contestInfo.painterLimit !== null ? contestInfo.painterLimit - totalSubmissionsCount : "∞"}
                            </Typography>
                            {(contestInfo.painterLimit === null || contestInfo.painterLimit - totalSubmissionsCount > 0) &&
                                <Button onClick={() => setIsCreateApplicationDialogOpen(true)}>Подати заявку</Button>
                            }
                        </div>
                        {submissions.length !== 0 ? (
                            <>
                                <Grid container spacing={2}>
                                    {submissions.map((submission, index) => (
                                        <Grid item xs={12} sm={12} md={6} lg={4} key={index}>
                                            <PaintingInContestCard application={submission} setPage={setPageSubmissions}
                                                setNeedRefetch={setNeedSubmissionsRefetch} actionMode="deleteApplication" />
                                        </Grid>
                                    ))}
                                </Grid>
                                <Grid container justifyContent="center" sx={{ mt: 2 }}>
                                    <Pagination
                                        component="div"
                                        count={Math.ceil(totalSubmissionsCount / submissionsPerPage)}
                                        page={pageSubmissions}
                                        onChange={(_, newPage) => setPageSubmissions(newPage)}
                                    />
                                </Grid>
                            </>
                        ) : (<div>Не подано жодної заявки</div>)}
                    </>
                ) : (<div>Вже не можна подавати заявки</div>)
            ) : (<CircularProgress />)
        ) : (<div>Щоб мати можливість подавати заявки, потрібнно мати обліковий запис художника</div>)
    );

    const renderNotConfirmedsTab = (
        myIsAdmin !== false ? (
            contestInfo.needConfirmation !== false ? (
                notConfirmeds !== null ? (
                    (new Date(contestInfo.endDate) >= new Date()) ? (
                        notConfirmeds.length !== 0 ? (
                            <>
                                <Grid container spacing={2}>
                                    {notConfirmeds.map((application, index) => (
                                        <Grid item xs={12} sm={12} md={6} lg={4} key={index}>
                                            <PaintingInContestCard application={application} setPage={setPageNotConfirmeds}
                                                setNeedRefetch={setNeedNotConfirmedsRefetch} actionMode="confirmApplication" />
                                        </Grid>
                                    ))}
                                </Grid>
                                <Grid container justifyContent="center" sx={{ mt: 2 }}>
                                    <Pagination
                                        component="div"
                                        count={Math.ceil(totalNotConfirmedsCount / notConfirmedsPerPage)}
                                        page={pageNotConfirmeds}
                                        onChange={(_, newPage) => setPageNotConfirmeds(newPage)}
                                    />
                                </Grid>
                            </>
                        ) : (<div>Немає жодної не підтвердженої заявки</div>)
                    ) : (<div>Вже не можна підтверджувати заявки</div>)
                ) : (<CircularProgress />)
            ) : (<div>Конкурс не потребує підтвердження участі заявок в конкурсі</div>)
        ) : (<div>Щоб мати можливість підтверджувати заявки, потрібнно мати раль адміна</div>)
    );

    return (
        <>
            <CardHeader
                avatar={
                    <Avatar
                        sx={{
                            bgcolor: getColorFromSentence(contestInfo.name),
                            width: 100,
                            height: 100,
                            fontSize: '3rem'
                        }}
                    >
                        {contestInfo.name[0]}
                    </Avatar>
                }
                action={
                    <IconButton onClick={handleMenuOpen}>
                        <Icon>more_vert</Icon>
                    </IconButton>
                }
                title={contestInfo.name}
                titleTypographyProps={{ variant: 'h5' }}
            />
            {renderMenu}
            <div>
                <Box sx={{ width: '100%' }}>
                    <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                        <Tabs value={currentTab} onChange={handleChangeTab}>
                            <Tab label="Інформація" id={"tab-0"} aria-controls={"tabpanel-0"} />
                            <Tab label="Картини" id={"tab-1"} aria-controls={"tabpanel-1"} />
                            {myPainterId !== null && <Tab label="Подати заявку" id={"tab-2"} aria-controls={"tabpanel-2"} />}
                            {myIsAdmin !== false && <Tab label="Підтвердити заявки" id={"tab-3"} aria-controls={"tabpanel-3"} />}
                        </Tabs>
                    </Box>
                    <TabPanel value={currentTab} index={0}>
                        {renderInfoTab}
                    </TabPanel>
                    <TabPanel value={currentTab} index={1}>
                        {renderApplicationsTab}
                    </TabPanel>
                    {myPainterId !== null &&
                        <TabPanel value={currentTab} index={2}>
                            {renderSubmissionsTab}
                        </TabPanel>
                    }
                    {myIsAdmin !== false &&
                        <TabPanel value={currentTab} index={myPainterId !== null ? 3 : 2}>
                            {renderNotConfirmedsTab}
                        </TabPanel>
                    }
                </Box>
            </div>
            {isCreateUpdateDialogOpen &&
                <ContestCreateUpdate isCreateUpdateDialogOpen={isCreateUpdateDialogOpen} selectedContest={selectedContest}
                    setSelectedContest={setSelectedContest} setIsCreateUpdateDialogOpen={setIsCreateUpdateDialogOpen}
                    setNeedRefetch={setNeedRefetch} />
            }
            {isCreateApplicationDialogOpen &&
                <ApplicationCreate isCreateDialogOpen={isCreateApplicationDialogOpen} setIsCreateDialogOpen={setIsCreateApplicationDialogOpen}
                    setNeedRefetch={setNeedSubmissionsRefetch} contestId={contestInfo.contestId} />
            }
        </>
    );
}

export default Contest;
