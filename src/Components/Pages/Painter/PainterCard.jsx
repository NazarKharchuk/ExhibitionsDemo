import { Avatar, Card, CardContent, Typography, IconButton, CardHeader, CardActions, Button, Box, Rating, Menu, MenuItem } from '@mui/material';
import { Icon } from '@mui/material';
import { red, yellow, amber } from '@mui/material/colors';
import { getColorFromSentence } from "../../../Helper/ColorFunctions"
import * as React from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { setLoading, showAlert } from '../../../Store/headerSlice';
import { painterAPI } from '../../../API/painterAPI';
import { RefreshTokens } from '../../../Helper/RefreshTokens';

const PainterCard = (props) => {
    const { painterId, pseudonym, firstName, lastName, likesCount, victoriesCount, ratingCount, avgRating } = props.painter;
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const myPainterId = useSelector((store) => store.user.painterId);

    const handleViewProfile = () => {
        navigate("/painters/" + painterId, { replace: true });
    };

    const avatarColor = getColorFromSentence(pseudonym + firstName + lastName);

    const [menuAnchor, setMenuAnchor] = React.useState(null);

    const handleMenuOpen = (event) => {
        setMenuAnchor(event.currentTarget);
    };

    const handleMenuClose = () => {
        setMenuAnchor(null);
    };

    const handleDeletePainter = async () => {
        const deletePainter = async (painterId) => {
            try {
                dispatch(setLoading({ isLoading: true }));
                const res = await painterAPI.deletePainter(painterId);

                if (res.successfully === true) {
                    dispatch(showAlert({ message: "Художника успішно видалено", severity: 'success', hideTime: 4000 }));
                    props.setPage(1);
                    props.setNeedRefetch(Date.now());
                    if (myPainterId === painterId) RefreshTokens();
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
            <MenuItem onClick={handleDeletePainter}> <Icon>delete</Icon> Видалити</MenuItem>
        </Menu>
    );

    return (
        <Card sx={{ height: '100%' }}>
            <CardHeader
                avatar={
                    <Avatar sx={{ bgcolor: avatarColor }}>
                        {firstName[0] + (lastName ? lastName[0] : '')}
                    </Avatar>
                }
                action={
                    <IconButton onClick={handleMenuOpen}>
                        <Icon>more_vert</Icon>
                    </IconButton>
                }
                title={`${pseudonym}`}
                subheader={`${firstName} ${lastName}`}
            />
            <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', marginRight: 2 }}>
                        <Icon sx={{ color: red[500] }}>favorite</Icon>
                        <Typography variant="body2" color="text.secondary" sx={{ marginLeft: 1 }}>
                            Вподобання:
                        </Typography>
                    </Box>
                    <Typography variant="body1" color="primary">
                        {likesCount}
                    </Typography>
                </Box>
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', marginRight: 2 }}>
                        <Icon sx={{ color: yellow[500] }}>emoji_events</Icon>
                        <Typography variant="body2" color="text.secondary" sx={{ marginLeft: 1 }}>
                            Кількість перемог:
                        </Typography>
                    </Box>
                    <Typography variant="body1" color="primary">
                        {victoriesCount}
                    </Typography>
                </Box>
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', marginRight: 2 }}>
                        <Icon sx={{ color: amber[600] }}>star</Icon>
                        <Typography variant="body2" color="text.secondary" sx={{ marginLeft: 1 }}>
                            Рейтинг:
                        </Typography>
                    </Box>
                    <Rating value={avgRating} readOnly size="small" max={5} precision={0.1} />
                    <Typography variant="body1" color="primary" sx={{ marginLeft: 1 }}>
                        {avgRating}
                    </Typography>
                    <Typography variant="body1" color="primary" sx={{ marginLeft: 0.5 }}>
                        ({ratingCount})
                    </Typography>
                </Box>
            </CardContent>
            <CardActions>
                <Button onClick={handleViewProfile}>
                    Дізнатись більше
                </Button>
            </CardActions>
            {renderMenu}
        </Card>
    );
}

export default PainterCard;
