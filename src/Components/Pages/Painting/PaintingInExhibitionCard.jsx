import { IconButton, Button, MenuItem } from '@mui/material';
import { Icon } from '@mui/material';
import { red } from '@mui/material/colors';
import * as React from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { setLoading, showAlert } from '../../../Store/headerSlice';
import { paintingAPI } from '../../../API/paintingAPI';
import PaintingCardTemplate from './PaintingCardTemplate';
import { exhibitionApplicationAPI } from '../../../API/exhibitionApplicationAPI';

const PaintingInExhibitionCard = (props) => {
    const { applicationId, painting } = props.application;
    const { paintingId, isLiked } = painting;

    const navigate = useNavigate();
    const dispatch = useDispatch();
    const myProfileId = useSelector((store) => store.user.profileId);
    const myPainterId = useSelector((store) => store.user.painterId);

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

    const handleConfirmApplication = async () => {
        const confirmApplication = async (applicationId) => {
            try {
                dispatch(setLoading({ isLoading: true }));
                const res = await exhibitionApplicationAPI.confirmExhibitionApplication(applicationId);

                if (res.successfully === true) {
                    dispatch(showAlert({ message: "Заявку успішно підтверджено", severity: 'success', hideTime: 4000 }));
                    props.setNeedRefetch(Date.now());
                } else {
                    dispatch(showAlert({ message: res.message, severity: 'error', hideTime: 6000 }));
                }
            } catch (error) {
                console.error("Помилка під час підтвердження заявки:", error);
            }
            dispatch(setLoading({ isLoading: false }));
        }
        await confirmApplication(applicationId);
        handleMenuClose();
    };

    const handleDeleteApplication = async () => {
        const deleteApplication = async (applicationId) => {
            try {
                dispatch(setLoading({ isLoading: true }));
                const res = await exhibitionApplicationAPI.deleteExhibitionApplication(applicationId);

                if (res.successfully === true) {
                    dispatch(showAlert({ message: "Заявку успішно видалено", severity: 'success', hideTime: 4000 }));
                    props.setPage(1);
                    props.setNeedRefetch(Date.now());
                } else {
                    dispatch(showAlert({ message: res.message, severity: 'error', hideTime: 6000 }));
                }
            } catch (error) {
                console.error("Помилка під час видалення заявки:", error);
            }
            dispatch(setLoading({ isLoading: false }));
        }
        await deleteApplication(applicationId);
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
            <MenuItem key={2} onClick={() => handleDeleteApplication(applicationId)}> <Icon>delete</Icon> Видалити заявку</MenuItem>
        ]
    };

    const middleButton = () => {
        switch (props.actionMode) {
            case "deleteApplication": {
                return (
                    <Button onClick={handleDeleteApplication} startIcon={<Icon>delete</Icon>} >
                        Видалити заявку
                    </Button>
                )
            }
            case "confirmApplication": {
                return (
                    <Button onClick={() => handleConfirmApplication(applicationId)} startIcon={<Icon>check</Icon>} >
                        Підтвердити заявку
                    </Button>
                )
            }
        }
    }

    const cardActions = (
        <>
            <IconButton disabled={isLiked === null} onClick={handleFavoriteClick}>
                <Icon sx={{ color: isLiked && red[500] }} >favorite</Icon>
            </IconButton>
            {middleButton()}
            <Button onClick={handleViewPainting}>
                Дізнатись більше
            </Button>
        </>
    );

    return (
        <PaintingCardTemplate painting={painting} menu={menuProps} cardActions={cardActions} />
    );
}

export default PaintingInExhibitionCard;
