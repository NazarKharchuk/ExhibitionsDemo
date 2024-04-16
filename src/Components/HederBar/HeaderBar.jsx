import * as React from 'react';
import { Icon, IconButton, Menu, MenuItem, styled, Toolbar, Typography } from '@mui/material';
import MuiAppBar from '@mui/material/AppBar';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { userLogout } from '../../Store/userSlice';
import { RemoveAccessToken } from '../../Helper/TokenFunctions';
import { instance } from '../../API/api';

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
                    dispatch(userLogout);
                    RemoveAccessToken();
                    delete instance.defaults.headers.common["Authorization"];
                }
                } component={Link} to="/login">
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
                    Exhibition
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
        </AppBar>
    );
}

export default HeaderBar;
