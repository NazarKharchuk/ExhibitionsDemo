import * as React from 'react';
import { useDispatch } from 'react-redux';
import { setTitle } from '../../../Store/headerSlice';
import { Box, CircularProgress, ImageList, ImageListItem, Typography } from '@mui/material';
import { paintingAPI } from '../../../API/paintingAPI';
import { baseURL } from '../../../API/api';
import { useNavigate } from 'react-router-dom';

const Home = () => {
    var dispatch = useDispatch();
    var navigate = useNavigate();

    React.useEffect(() => {
        dispatch(setTitle({ title: "Вебсервіс для онлайн-виставок картин" }));
        fetchPaintings();
    }, []);

    const [paintings, setPaintings] = React.useState(null);

    const fetchPaintings = async () => {
        const result = await paintingAPI.paintings(1, 6, { sortBy: "CretionDate", sortOrder: "asc" });
        if (result.successfully === true) {
            setPaintings(result.data.pageContent);
        }
    };


    const styles = {
        landingContainer: {
            textAlign: 'center',
        },
        animatedText: {
            fontSize: '6rem',
            background: 'linear-gradient(45deg, #ff0066, #ffcc00, #33cc33, #0099ff, #9933ff, #ff0066)',
            backgroundSize: '600% 100%',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            animation: 'gradientAnimation 15s infinite',
            marginBottom: '-25px'
        },
        brushStroke: {
            width: '700px',
            height: 'auto',
            position: 'absolute',
            top: '120px',
            transform: 'translateX(-50%)',
            zIndex: -1,
        },
        '@keyframes gradientAnimation': {
            '0%': {
                backgroundPosition: '0% 50%',
            },
            '50%': {
                backgroundPosition: '100% 50%',
            },
            '100%': {
                backgroundPosition: '0% 50%',
            },
        },
    };

    return (
        <div sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
            <div style={styles.landingContainer}>
                <h1 style={styles.animatedText}>Art Area</h1>
                <Typography variant="h5" fontWeight="bold" style={{ color: 'white' }}>Вебсервіс для онлайн-виставок картин</Typography>
                <img src="https://i.pinimg.com/originals/74/d1/d6/74d1d6e5d5d687888c31c0b1f21a5ed5.png" style={styles.brushStroke} />
            </div>
            <style>
                {`
                    @keyframes gradientAnimation {
                        0% {
                            background-position: 0% 50%;
                        }
                        50% {
                            background-position: 100% 50%;
                        }
                        100% {
                            background-position: 0% 50%;
                        }
                    }
                `}
            </style>
            <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', paddingTop: '100px' }}>
                {paintings !== null ?
                    <>
                        <Typography>Останні роботи наших художників</Typography>
                        <Box sx={{ width: 700, }}>
                            <ImageList variant="masonry" cols={3} gap={8}>
                                {paintings.map((item) => (
                                    <ImageListItem key={item.imagePath} onClick={() => navigate(`/paintings/${item.paintingId}`, { replace: true })}>
                                        <img
                                            srcSet={baseURL + "/" + item.imagePath}
                                            src={baseURL + "/" + item.imagePath}
                                            alt={item.name}
                                            loading="lazy"
                                        />
                                    </ImageListItem>
                                ))}
                            </ImageList>
                        </Box>
                    </>
                    : <><CircularProgress /></>}
            </div>
        </div >
    );
};

export default Home;
