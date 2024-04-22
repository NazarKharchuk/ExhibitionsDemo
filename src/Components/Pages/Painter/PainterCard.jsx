import { Avatar, Card, CardContent, Typography, IconButton, CardHeader, CardActions, Button, Box, Rating } from '@mui/material';
import { Icon } from '@mui/material';
import { red, amber } from '@mui/material/colors';
import { getColorFromSentence } from "../../../Helper/ColorFunctions"
import * as React from 'react';
import { useNavigate } from 'react-router-dom';

const PainterCard = (props) => {
    const { painterId, pseudonym, firstName, lastName, likesCount, ratingCount, avgRating } = props.painter;
    const navigate = useNavigate();

    const handleViewProfile = () => {
        navigate("/painters/" + painterId, { replace: true });
    };

    const avatarColor = getColorFromSentence(pseudonym + firstName + lastName);

    return (
        <Card sx={{ height: '100%' }}>
            <CardHeader
                avatar={
                    <Avatar sx={{ bgcolor: avatarColor }}>
                        {firstName[0] + (lastName ? lastName[0] : '')}
                    </Avatar>
                }
                action={
                    <IconButton>
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
        </Card>
    );
}

export default PainterCard;
