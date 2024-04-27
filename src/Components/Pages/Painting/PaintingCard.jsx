import { Avatar, Card, CardContent, Typography, IconButton, CardHeader, CardActions, Button, Box, Rating, Menu, MenuItem, CardMedia } from '@mui/material';
import { Icon } from '@mui/material';
import { red, yellow, amber, teal } from '@mui/material/colors';
import { getColorFromSentence } from "../../../Helper/ColorFunctions"
import * as React from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { setLoading, showAlert } from '../../../Store/headerSlice';
import { paintingAPI } from '../../../API/paintingAPI';
import { baseURL } from '../../../API/api';

const PaintingCard = (props) => {
    const { paintingId, name, painter, likesCount, isLiked, ratingCount, avgRating,
        contestVictoriesCount, width, height, imagePath } = props.painting;

    const navigate = useNavigate();
    const dispatch = useDispatch();
    const myProfileId = useSelector((store) => store.user.profileId);
    const myPainterId = useSelector((store) => store.user.painterId);

    const handleViewPainting = () => {
        navigate("/paintings/" + paintingId, { replace: true });
    };

    const avatarColor = getColorFromSentence(painter.pseudonym + painter.firstName + painter.lastName);

    const [menuAnchor, setMenuAnchor] = React.useState(null);

    const handleMenuOpen = (event) => {
        setMenuAnchor(event.currentTarget);
    };

    const handleMenuClose = () => {
        setMenuAnchor(null);
    };

    const handleDeletePainting = async () => {
        const deletePainting = async (paintingId) => {
            try {
                dispatch(setLoading({ isLoading: true }));
                const res = await paintingAPI.deletePainting(paintingId);

                if (res.successfully === true) {
                    dispatch(showAlert({ message: "Картину успішно видалено", severity: 'success', hideTime: 4000 }));
                    props.setPage(1);
                    props.setNeedRefetch(Date.now());
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
                    props.setNeedRefetch(Date.now());
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
                    props.setNeedRefetch(Date.now());
                } else {
                    dispatch(showAlert({ message: res.message, severity: 'error', hideTime: 6000 }));
                }
            } catch (error) {
                console.error("Помилка під час скасування вподобання картини:", error);
            }
            dispatch(setLoading({ isLoading: false }));
        }
        if (isLiked !== null && myProfileId !== null) {
            if (isLiked) await deleteLike(paintingId, myProfileId);
            else await addLike(paintingId, myProfileId);
            props.setNeedRefetch(Date.now());
        }
    };

    const renderMenu = (
        <Menu
            anchorEl={menuAnchor}
            anchorOrigin={{ vertical: "top", horizontal: "right" }}
            id={"menu"}
            keepMounted
            transformOrigin={{ vertical: "top", horizontal: "right" }}
            open={Boolean(menuAnchor)}
            onClose={handleMenuClose}
        >
            <MenuItem onClick={() => { props.handleUpdatePainting(paintingId); handleMenuClose(); }}> <Icon>edit</Icon> Змінити</MenuItem>
            <MenuItem onClick={handleDeletePainting}> <Icon>delete</Icon> Видалити</MenuItem>
        </Menu>
    );

    return (
        <Card sx={{ height: '100%' }}>
            <CardHeader
                avatar={
                    <Avatar sx={{ bgcolor: avatarColor }} />
                }
                action={
                    <IconButton onClick={handleMenuOpen}>
                        <Icon>more_vert</Icon>
                    </IconButton>
                }
                title={`${name}`}
                subheader={`${painter.pseudonym}`}
            />
            <CardMedia
                component="img"
                height="200"
                image={baseURL + "/" + imagePath}
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
                        {contestVictoriesCount}
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
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', marginRight: 2 }}>
                        <Icon sx={{ color: teal[500] }}>straighten</Icon>
                        <Typography variant="body2" color="text.secondary" sx={{ marginLeft: 1 }}>
                            Розміри:
                        </Typography>
                    </Box>
                    <Typography variant="body1" color="primary">
                        {`${width}x${height}`}
                    </Typography>
                </Box>
            </CardContent>
            <CardActions disableSpacing>
                <IconButton disabled={isLiked === null} onClick={handleFavoriteClick}>
                    <Icon sx={{ color: isLiked && red[500] }} >favorite</Icon>
                </IconButton>
                <Button onClick={handleViewPainting}>
                    Дізнатись більше
                </Button>
            </CardActions>
            {renderMenu}
        </Card>
    );
}

export default PaintingCard;
