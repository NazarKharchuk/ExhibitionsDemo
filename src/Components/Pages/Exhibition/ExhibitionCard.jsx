import { Avatar, Card, CardContent, Typography, IconButton, CardHeader, CardActions, Button, Box, Menu, MenuItem, Chip } from '@mui/material';
import { Icon } from '@mui/material';
import { amber, green, teal, blue } from '@mui/material/colors';
import { getColorFromSentence } from "../../../Helper/ColorFunctions"
import * as React from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { setLoading, showAlert } from '../../../Store/headerSlice';
import { exhibitionAPI } from '../../../API/exhibitionAPI';

const ExhibitionCard = (props) => {
    const { exhibitionId, name, addedDate, needConfirmation, confirmedApplicationsCount, notConfirmedApplicationsCount, tags } = props.exhibition;
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const handleViewExhibition = () => {
        navigate("/exhibitions/" + exhibitionId, { replace: true });
    };

    const avatarColor = getColorFromSentence(name);

    const [menuAnchor, setMenuAnchor] = React.useState(null);

    const handleMenuOpen = (event) => {
        setMenuAnchor(event.currentTarget);
    };

    const handleMenuClose = () => {
        setMenuAnchor(null);
    };

    const handleDeleteExhibition = async () => {
        const deleteExhibition = async (exhibitionId) => {
            try {
                dispatch(setLoading({ isLoading: true }));
                const res = await exhibitionAPI.deleteExhibition(exhibitionId);

                if (res.successfully === true) {
                    dispatch(showAlert({ message: "Виставку успішно видалено", severity: 'success', hideTime: 4000 }));
                    props.setPage(1);
                    props.setNeedRefetch(Date.now());
                } else {
                    dispatch(showAlert({ message: res.message, severity: 'error', hideTime: 6000 }));
                }
            } catch (error) {
                console.error("Помилка під час видалення виставки:", error);
            }
            dispatch(setLoading({ isLoading: false }));
        }
        await deleteExhibition(exhibitionId);
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
            {props.isAdmin ? ([
                <MenuItem key="edit" onClick={() => { props.handleUpdateExhibition(exhibitionId); handleMenuClose(); }}> <Icon>edit</Icon> Змінити</MenuItem>,
                <MenuItem key="delete" onClick={handleDeleteExhibition}> <Icon>delete</Icon> Видалити</MenuItem>
            ]) : <Typography>Немає дозволених вам дій</Typography>}
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
                <Button onClick={handleViewExhibition}>
                    Дізнатись більше
                </Button>
            </CardActions>
            {renderMenu}
        </Card>
    );
}

export default ExhibitionCard;
