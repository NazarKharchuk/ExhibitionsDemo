import { Avatar, Card, CardContent, Typography, IconButton, CardHeader, CardActions, Button, Box, Rating, Menu, MenuItem, Chip } from '@mui/material';
import { Icon } from '@mui/material';
import { red, yellow, amber, green, teal, blue } from '@mui/material/colors';
import { getColorFromSentence } from "../../../Helper/ColorFunctions"
import * as React from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { setLoading, showAlert } from '../../../Store/headerSlice';
import { contestAPI } from '../../../API/contestAPI';

const ContestCard = (props) => {
    const { contestId, name, addedDate, startDate, endDate, needConfirmation, winnersCount,
        confirmedApplicationsCount, notConfirmedApplicationsCount, tags } = props.contest;
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const handleViewContest = () => {
        navigate("/contests/" + contestId, { replace: true });
    };

    const avatarColor = getColorFromSentence(name);

    const [menuAnchor, setMenuAnchor] = React.useState(null);

    const handleMenuOpen = (event) => {
        setMenuAnchor(event.currentTarget);
    };

    const handleMenuClose = () => {
        setMenuAnchor(null);
    };

    const handleDeleteContest = async () => {
        const deleteContest = async (contestId) => {
            try {
                dispatch(setLoading({ isLoading: true }));
                const res = await contestAPI.deleteContest(contestId);

                if (res.successfully === true) {
                    dispatch(showAlert({ message: "Конкурс успішно видалено", severity: 'success', hideTime: 4000 }));
                    props.setPage(1);
                    props.setNeedRefetch(Date.now());
                } else {
                    dispatch(showAlert({ message: res.message, severity: 'error', hideTime: 6000 }));
                }
            } catch (error) {
                console.error("Помилка під час видалення конкурсу:", error);
            }
            dispatch(setLoading({ isLoading: false }));
        }
        await deleteContest(contestId);
        handleMenuClose();
    };

    const contestStatus = () => {
        var date = new Date();
        if (new Date(startDate) > date) return <Chip key="status" color="info" variant="outlined" label="Прийом заявок" />
        if (new Date(endDate) > date) return <Chip key="status" color="success" variant="outlined" label="Голосування" />
        if (date > new Date(endDate)) return <Chip key="status" color="warning" variant="outlined" label="Завершено" />
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
            {!(props.isWithoutMenu !== undefined && props.isWithoutMenu === true) ? (
                props.isAdmin ? ([
                    <MenuItem key="edit" onClick={() => { props.handleUpdateContest(contestId); handleMenuClose(); }}> <Icon>edit</Icon> Змінити</MenuItem>,
                    <MenuItem key="delete" onClick={handleDeleteContest}> <Icon>delete</Icon> Видалити</MenuItem>
                ]) : <Typography>Немає дозволених вам дій</Typography>
            ) : <Typography>Немає дозволених вам дій</Typography>}
        </Menu>
    );

    return (
        <Card sx={{ height: '100%' }}>
            <CardHeader
                avatar={<Avatar sx={{ bgcolor: avatarColor }}> {name[0]} </Avatar>}
                action={
                    <IconButton onClick={handleMenuOpen}>
                        <Icon>more_vert</Icon>
                    </IconButton>
                }
                title={`${name}`}
            />
            <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', marginRight: 2 }}>
                        <Icon sx={{ color: green[500] }}>calendar_month</Icon>
                        <Typography variant="body2" color="text.secondary" sx={{ marginLeft: 1 }}>
                            Дата створення:
                        </Typography>
                    </Box>
                    <Typography variant="body1" color="primary">
                        {addedDate.slice(0, 10)}
                    </Typography>
                </Box>
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', marginRight: 2 }}>
                        <Icon sx={{ color: yellow[500] }}>calendar_month</Icon>
                        <Typography variant="body2" color="text.secondary" sx={{ marginLeft: 1 }}>
                            Початок голосування:
                        </Typography>
                    </Box>
                    <Typography variant="body1" color="primary">
                        {startDate.slice(0, 10)}
                    </Typography>
                </Box>
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', marginRight: 2 }}>
                        <Icon sx={{ color: red[500] }}>calendar_month</Icon>
                        <Typography variant="body2" color="text.secondary" sx={{ marginLeft: 1 }}>
                            Кінець голосування:
                        </Typography>
                    </Box>
                    <Typography variant="body1" color="primary">
                        {endDate.slice(0, 10)}
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
                        <Icon sx={{ color: amber[500] }}>emoji_events</Icon>
                        <Typography variant="body2" color="text.secondary" sx={{ marginLeft: 1 }}>
                            Кількість переможців:
                        </Typography>
                    </Box>
                    <Typography variant="body1" color="primary">
                        {winnersCount}
                    </Typography>
                </Box>
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', marginRight: 2 }}>
                        <Icon sx={{ color: teal[500] }}>admin_panel_settings</Icon>
                        <Typography variant="body2" color="text.secondary" sx={{ marginLeft: 1 }}>
                            Підтвердження заявок:
                        </Typography>
                    </Box>
                    <Typography variant="body1" color="primary">
                        {needConfirmation === true ? "так" : " ні"}
                    </Typography>
                </Box>
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', marginRight: 2 }}>
                        <Icon sx={{ color: green[500] }}>check_circle</Icon>
                        <Typography variant="body2" color="text.secondary" sx={{ marginLeft: 1 }}>
                            Допущено заявок:
                        </Typography>
                    </Box>
                    <Typography variant="body1" color="primary">
                        {needConfirmation === true ? confirmedApplicationsCount : confirmedApplicationsCount + notConfirmedApplicationsCount}
                    </Typography>
                </Box>
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', marginRight: 2 }}>
                        <Icon sx={{ color: amber[500] }}>cancel</Icon>
                        <Typography variant="body2" color="text.secondary" sx={{ marginLeft: 1 }}>
                            Не допущено заявок:
                        </Typography>
                    </Box>
                    <Typography variant="body1" color="primary">
                        {needConfirmation === true ? notConfirmedApplicationsCount : 0}
                    </Typography>
                </Box>
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', marginRight: 2 }}>
                        <Icon sx={{ color: blue[500] }}>local_offer</Icon>
                        <Typography variant="body2" color="text.secondary" sx={{ marginLeft: 1 }}>
                            Теги:
                        </Typography>
                    </Box>
                    <div style={{ display: 'flex', alignItems: 'center' }}>
                        {tags.length === 0 && "-"}
                        {tags.slice(0, 5).map(tag => (
                            <Chip key={tag.tagId} color="primary" variant="outlined" label={tag.tagName} />
                        ))}
                        {tags.length - 5 > 0 && <Avatar>+{tags.length - 5}</Avatar>}
                    </div>
                </Box>
            </CardContent>
            <CardActions>
                <Button onClick={handleViewContest}>
                    Дізнатись більше
                </Button>
            </CardActions>
            {renderMenu}
        </Card>
    );
}

export default ContestCard;
