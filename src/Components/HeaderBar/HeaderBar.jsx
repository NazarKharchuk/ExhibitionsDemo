import * as React from 'react';
import { Icon, IconButton, Menu, MenuItem, styled, Toolbar, Typography, LinearProgress } from '@mui/material';
import MuiAppBar from '@mui/material/AppBar';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { userLogout } from '../../Store/userSlice';
import { RemoveAccessToken, RemoveRefreshToken } from '../../Helper/TokenFunctions';
import { instance } from '../../API/api';
import CustomAlert from '../UI/CustomAlert';

const AppBar = styled(MuiAppBar, {
    shouldForwardProp: (prop) => prop !== 'openDrawer' && prop !== 'drawerWidth',
})(({ theme, openDrawer, drawerWidth }) => ({
    transition: theme.transitions.create(['margin', 'width'], {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.leavingScreen,
    }),
    ...(openDrawer && {
        width: `calc(100% - ${drawerWidth}px)`,
        marginLeft: `${drawerWidth}px`,
        transition: theme.transitions.create(['margin', 'width'], {
            easing: theme.transitions.easing.easeOut,
            duration: theme.transitions.duration.enteringScreen,
        }),
    }),
}));

const HeaderBar = (props) => {
    const [menuAnchor, setMenuAnchor] = React.useState(null);
    const isAuth = useSelector((store) => store.user.isAuth);
    const email = useSelector((store) => store.user.email);
    const title = useSelector((store) => store.header.title);
    const isLoading = useSelector((store) => store.header.isLoading);

    const dispatch = useDispatch();

    const handleMenuOpen = (event) => {
        setMenuAnchor(event.currentTarget);
    };

    const handleMenuClose = () => {
        setMenuAnchor(null);
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
            {isAuth ? (
                <MenuItem onClick={() => {
                    handleMenuClose();
                    dispatch(userLogout());
                    RemoveAccessToken();
                    RemoveRefreshToken();
                    delete instance.defaults.headers.common["Authorization"];
                }
                } component={Link} to="/home">
                    Вийти
                </MenuItem>
            ) : (
                <MenuItem onClick={handleMenuClose} component={Link} to="/login">
                    Увійти
                </MenuItem>
            )}
        </Menu>
    );

    return (
        <AppBar position="fixed" openDrawer={props.drawer.openDrawer} drawerWidth={props.drawer.drawerWidth}>
            <Toolbar>
                <IconButton
                    color="inherit"
                    onClick={props.drawer.handleDrawerOpen}
                    edge="start"
                    sx={{ mr: 2, ...(props.drawer.openDrawer && { display: 'none' }) }}
                >
                    <Icon>menu</Icon>
                </IconButton>
                <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
                    {title}
                </Typography>
                <Typography variant="body1">
                    {email}
                </Typography>
                <IconButton
                    aria-controls="account-menu"
                    aria-haspopup="true"
                    onClick={handleMenuOpen}
                    color="inherit"
                >
                    <Icon>account_circle</Icon>
                </IconButton>
            </Toolbar>
            {renderMenu}
            {isLoading && <LinearProgress color="secondary" />}
            <CustomAlert />
        </AppBar>
    );
}

export default HeaderBar;
