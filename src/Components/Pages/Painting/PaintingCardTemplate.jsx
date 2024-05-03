import { Avatar, Card, CardContent, Typography, IconButton, CardHeader, CardActions, Button, Box, Rating, Menu, MenuItem, CardMedia } from '@mui/material';
import { Icon } from '@mui/material';
import { red, yellow, amber, teal } from '@mui/material/colors';
import { getColorFromSentence } from "../../../Helper/ColorFunctions"
import * as React from 'react';
import { baseURL } from '../../../API/api';

const PaintingCardTemplate = (props) => {
    const { paintingId, name, painter, likesCount, isLiked, ratingCount, avgRating,
        contestVictoriesCount, width, height, imagePath, contentRest } = props.painting;

    const { menuAnchor, handleMenuOpen, handleMenuClose, menuItems } = props.menu || {};

    const avatarColor = getColorFromSentence(painter.pseudonym + painter.firstName + painter.lastName);

    const renderMenu = props.menu ? (
        <Menu
            anchorEl={menuAnchor}
            anchorOrigin={{ vertical: "top", horizontal: "right" }}
            id={"menu"}
            keepMounted
            transformOrigin={{ vertical: "top", horizontal: "right" }}
            open={Boolean(menuAnchor)}
            onClose={handleMenuClose}
        >
            {menuItems.map((item) => item)}
        </Menu>
    ) : null;

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
            <div style={{ position: 'relative' }}>
                <CardMedia
                    component="img"
                    height="200"
                    image={baseURL + "/" + imagePath}
                />
                {(props.isWon !== undefined && props.isWon === true) &&
                    <Icon sx={{ color: yellow[500], fontSize: 100, position: 'absolute', zIndex: 2, right: '2rem', bottom: 0, transform: 'translateY(50%)', }}>emoji_events</Icon>
                }
            </div>
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
                {props.contentRest !== undefined && props.contentRest.map((item) => item)}
            </CardContent>
            <CardActions disableSpacing>
                {props.cardActions}
            </CardActions>
            {renderMenu}
        </Card>
    );
}

export default PaintingCardTemplate;
