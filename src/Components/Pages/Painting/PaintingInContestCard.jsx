import { IconButton, Button, MenuItem, Box, Typography } from '@mui/material';
import { Icon } from '@mui/material';
import { amber, red, } from '@mui/material/colors';
import * as React from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { setLoading, showAlert } from '../../../Store/headerSlice';
import { paintingAPI } from '../../../API/paintingAPI';
import PaintingCardTemplate from './PaintingCardTemplate';
import { contestApplicationAPI } from '../../../API/contestApplicationAPI';

const PaintingInContestCard = (props) => {
    const { applicationId, votesCount, isWon, painting } = props.application;
    const { paintingId, isLiked } = painting;

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

    const handleConfirmApplication = async () => {
        const confirmApplication = async (applicationId) => {
            try {
                dispatch(setLoading({ isLoading: true }));
                const res = await contestApplicationAPI.confirmContestApplication(applicationId);

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
                const res = await contestApplicationAPI.deleteContestApplication(applicationId);

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

    const handleVoteClick = async () => {
        const addVote = async (applicationId) => {
            try {
                dispatch(setLoading({ isLoading: true }));
                const res = await contestApplicationAPI.addVote(applicationId);

                if (res.successfully === true) {
                    dispatch(showAlert({ message: "Ви успішно віддали свій голос", severity: 'success', hideTime: 4000 }));
                } else {
                    dispatch(showAlert({ message: res.message, severity: 'error', hideTime: 6000 }));
                }
            } catch (error) {
                console.error("Помилка під час голосування на заявку:", error);
            }
            dispatch(setLoading({ isLoading: false }));
        }
        if (myProfileId !== null) {
            await addVote(applicationId);
            props.setNeedRefetch(Date.now());
        }
    };

    const handleUnvoteClick = async () => {
        const addUnvote = async (applicationId) => {
            try {
                dispatch(setLoading({ isLoading: true }));
                const res = await contestApplicationAPI.deleteVote(applicationId);

                if (res.successfully === true) {
                    dispatch(showAlert({ message: "Ви успішно скасували свій голос", severity: 'success', hideTime: 4000 }));
                } else {
                    dispatch(showAlert({ message: res.message, severity: 'error', hideTime: 6000 }));
                }
            } catch (error) {
                console.error("Помилка під час скасування голосування за заявку:", error);
            }
            dispatch(setLoading({ isLoading: false }));
        }
        if (myProfileId !== null) {
            await addUnvote(applicationId);
            props.setNeedRefetch(Date.now());
        }
    };

    const menuProps = {
        menuAnchor: menuAnchor,
        handleMenuOpen: handleMenuOpen,
        handleMenuClose: handleMenuClose,
        menuItems: [
            (myProfileId && (myIsAdmin || painting.painterId == myPainterId)) ?
                <MenuItem key="delete" onClick={() => handleDeleteApplication(applicationId)}> <Icon>delete</Icon> Видалити заявку</MenuItem> :
                <Typography key="noActions">Немає дозволених вам дій</Typography>
        ]
    };

    const middleButton = () => {
        switch (props.actionMode) {
            case "vote": {
                return (
                    <Button onClick={handleVoteClick} startIcon={<Icon>how_to_vote</Icon>} disabled={props.disabledButton} >
                        Проголосувати
                    </Button>
                )
            }
            case "unvote": {
                return (
                    <Button onClick={handleUnvoteClick} startIcon={<Icon color='red'>how_to_vote</Icon>} disabled={props.disabledButton}>
                        Скасувати голос
                    </Button>
                )
            }
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

    const contentRest = [
        <Box key="votesCount" sx={{ display: 'flex', alignItems: 'center' }}>
            <Box sx={{ display: 'flex', alignItems: 'center', marginRight: 2 }}>
                <Icon sx={{ color: amber[500] }}>how_to_vote</Icon>
                <Typography variant="body2" color="text.secondary" sx={{ marginLeft: 1 }}>
                    Кількість голосів:
                </Typography>
            </Box>
            <Typography variant="body1" color="primary">
                {votesCount}
            </Typography>
        </Box>,
    ];

    return (
        <PaintingCardTemplate painting={painting} menu={menuProps} cardActions={cardActions} contentRest={contentRest} isWon={isWon} />
    );
}

export default PaintingInContestCard;
