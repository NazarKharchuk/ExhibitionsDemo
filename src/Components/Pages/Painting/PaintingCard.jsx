import { IconButton, Button, MenuItem, Typography } from '@mui/material';
import { Icon } from '@mui/material';
import { red, } from '@mui/material/colors';
import * as React from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { setLoading, showAlert } from '../../../Store/headerSlice';
import { paintingAPI } from '../../../API/paintingAPI';
import PaintingCardTemplate from './PaintingCardTemplate';

const PaintingCard = (props) => {
    const { paintingId, name, painter, likesCount, isLiked, ratingCount, avgRating,
        contestVictoriesCount, width, height, imagePath } = props.painting;

    const navigate = useNavigate();
    const dispatch = useDispatch();
    const myProfileId = useSelector((store) => store.user.profileId);
    const myPainterId = useSelector((store) => store.user.painterId);
    const myRoles = useSelector((store) => store.user.roles);
    const myIsAdmin = myRoles !== null ? myRoles.includes("Admin") : false;

    const handleViewPainting = () => {
        navigate("/paintings/" + paintingId, { replace: true });
    };

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

    const menuProps = {
        menuAnchor: menuAnchor,
        handleMenuOpen: handleMenuOpen,
        handleMenuClose: handleMenuClose,
        menuItems: [
            ...!(props.isWithoutMenu !== undefined && props.isWithoutMenu === true) ?
                (myIsAdmin || myPainterId === painter.painterId) ? ([
                    myPainterId === painter.painterId && <MenuItem key="edit" onClick={() => { props.handleUpdatePainting(paintingId); handleMenuClose(); }}> <Icon>edit</Icon> Змінити</MenuItem>,
                    <MenuItem key="delete" onClick={handleDeletePainting}> <Icon>delete</Icon> Видалити</MenuItem>
                ]) : [<Typography key="noActions">Немає дозволених вам дій</Typography>] :
                [<Typography key="noActions">Немає дозволених вам дій</Typography>]
        ]
    };

    const cardActions = (
        <>
            <IconButton disabled={isLiked === null} onClick={handleFavoriteClick}>
                <Icon sx={{ color: isLiked && red[500] }} >favorite</Icon>
            </IconButton>
            <Button onClick={handleViewPainting}>
                Дізнатись більше
            </Button>
        </>
    );

    return (
        <PaintingCardTemplate painting={props.painting} menu={menuProps} cardActions={cardActions} />
    );
}

export default PaintingCard;
