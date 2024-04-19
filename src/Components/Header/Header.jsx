import * as React from 'react';
import { styled, Box, CssBaseline } from '@mui/material';
import HeaderBar from "../HeaderBar/HeaderBar";
import Navigation, { DrawerHeader } from "../Navigation/Navigation";

const drawerWidth = 250;

const Main = styled('main', { shouldForwardProp: (prop) => prop !== 'openDrawer' })(
    ({ theme, openDrawer }) => ({
        flexGrow: 1,
        padding: theme.spacing(3),
        transition: theme.transitions.create('margin', {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.leavingScreen,
        }),
        marginLeft: `-${drawerWidth}px`,
        ...(openDrawer && {
            transition: theme.transitions.create('margin', {
                easing: theme.transitions.easing.easeOut,
                duration: theme.transitions.duration.enteringScreen,
            }),
            marginLeft: 0,
        }),
    }),
);

const Header = (props) => {
    const [openDrawer, setDrawerOpen] = React.useState(false);

    const handleDrawerOpen = () => {
        setDrawerOpen(true);
    };

    const handleDrawerClose = () => {
        setDrawerOpen(false);
    };

    return (
        <Box sx={{ display: 'flex' }}>
            <CssBaseline />
            <HeaderBar drawer={{ openDrawer, handleDrawerOpen, drawerWidth }} />
            <Navigation drawer={{ openDrawer, handleDrawerClose, drawerWidth }} />
            <Main openDrawer={openDrawer}>
                <DrawerHeader />
                {props.children}
            </Main>
        </Box>
    );
}

export default Header;
