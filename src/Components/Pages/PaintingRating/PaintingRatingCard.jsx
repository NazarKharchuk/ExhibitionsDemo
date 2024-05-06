import { IconButton, MenuItem, Card, CardHeader, Avatar, CardContent, Box, Typography, Rating, Menu } from '@mui/material';
import { Icon } from '@mui/material';
import { amber, teal } from '@mui/material/colors';
import * as React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { setLoading, showAlert } from '../../../Store/headerSlice';
import { paintingRatingAPI } from '../../../API/paintingRatingAPI';
import { getColorFromSentence } from '../../../Helper/ColorFunctions';

const PaintingRatingCard = (props) => {
    const { ratingId, ratingValue, comment, addedDate, profileId, paintingId, authorFirstName, authorLastName } = props.rating;

    const dispatch = useDispatch();
    const myProfileId = useSelector((store) => store.user.profileId);
    const myRoles = useSelector((store) => store.user.roles);
    const myIsAdmin = myRoles !== null ? myRoles.includes("Admin") : false;

    const [menuAnchor, setMenuAnchor] = React.useState(null);

    const handleMenuOpen = (event) => {
        setMenuAnchor(event.currentTarget);
    };

    const handleMenuClose = () => {
        setMenuAnchor(null);
    };

    const handleDeleteRating = async () => {
        const deleteRating = async (ratingId) => {
            try {
                dispatch(setLoading({ isLoading: true }));
                const res = await paintingRatingAPI.deletePaintingRating(ratingId);

                if (res.successfully === true) {
                    dispatch(showAlert({ message: "Оцінку успішно видалено", severity: 'success', hideTime: 4000 }));
                    props.setPage(1);
                    props.setNeedRefetch(Date.now());
                } else {
                    dispatch(showAlert({ message: res.message, severity: 'error', hideTime: 6000 }));
                }
            } catch (error) {
                console.error("Помилка під час видалення оцінки:", error);
            }
            dispatch(setLoading({ isLoading: false }));
        }
        await deleteRating(ratingId);
        handleMenuClose();
    };

    const avatarColor = getColorFromSentence(authorFirstName + authorLastName);

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
            {(myIsAdmin || myProfileId === profileId) ? ([
                <MenuItem key="delete" onClick={handleDeleteRating}> <Icon>delete</Icon> Видалити</MenuItem>,
                myProfileId === profileId &&
                <MenuItem key="edit" onClick={() => { props.handleUpdateRating(props.rating); handleMenuClose(); }}> <Icon>edit</Icon> Змінити</MenuItem>
            ]) : <Typography>Немає дозволених вам дій</Typography>}
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
                title={`${authorFirstName} ${authorLastName}`}
                subheader={`${new Date(addedDate).toLocaleString()}`}
            />
            <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', marginRight: 2 }}>
                        <Icon sx={{ color: amber[600] }}>star</Icon>
                        <Typography variant="body2" color="text.secondary" sx={{ marginLeft: 1 }}>
                            Рейтинг:
                        </Typography>
                    </Box>
                    <Rating value={ratingValue} readOnly size="small" max={5} precision={0.1} />
                    <Typography variant="body1" color="primary" sx={{ marginLeft: 1 }}>
                        {ratingValue}
                    </Typography>
                </Box>
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', marginRight: 2 }}>
                        <Icon sx={{ color: teal[500] }}>comment</Icon>
                        <Typography variant="body2" color="text.secondary" sx={{ marginLeft: 1 }}>
                            Коментар:
                        </Typography>
                    </Box>
                    {comment !== null ? (
                        <Typography variant="body1" color="primary">
                            {comment}
                        </Typography>
                    ) : (
                        <Typography variant="body1">
                            Відсутній*
                        </Typography>
                    )}
                </Box>
            </CardContent>
            {renderMenu}
        </Card>
    );
}

export default PaintingRatingCard;
