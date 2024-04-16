import * as React from 'react';
import { Divider, Drawer, Icon, IconButton, List, ListItem, ListItemButton, ListItemIcon, ListItemText, styled } from '@mui/material';
import { Link } from 'react-router-dom';

export const DrawerHeader = styled('div')(({ theme }) => ({
    display: 'flex',
    alignItems: 'center',
    padding: theme.spacing(0, 1),
    ...theme.mixins.toolbar,
    justifyContent: 'flex-end',
}));

const firstDrawerItems = [
    { name: "Exhibitions", iconName: "collections", link: "/exhibitions" },
    { name: "Contests", iconName: "poll", link: "/contests" },
];

const secondDrawerItems = [
    { name: "Painters", iconName: "groups", link: "/painters" },
    { name: "Paintings", iconName: "image", link: "/paintings" },
];

const Navigation = (props) => {
    return (
        <Drawer
            sx={{
                width: props.drawer.drawerWidth,
                flexShrink: 0,
                '& .MuiDrawer-paper': {
                    width: props.drawer.drawerWidth,
                    boxSizing: 'border-box',
                },
            }}
            variant="persistent"
            anchor="left"
            open={props.drawer.openDrawer}
        >
            <DrawerHeader>
                <IconButton onClick={props.drawer.handleDrawerClose}>
                    <Icon>chevron_left</Icon>
                </IconButton>
            </DrawerHeader>
            <Divider />
            <List>
                {firstDrawerItems.map((item) => (
                    <ListItem key={item.name} disablePadding>
                        <ListItemButton component={Link} to={item.link}>
                            <ListItemIcon>
                                <Icon>{item.iconName}</Icon>
                            </ListItemIcon>
                            <ListItemText primary={item.name} />
                        </ListItemButton>
                    </ListItem>
                ))}
            </List>
            <Divider />
            <List>
                {secondDrawerItems.map((item) => (
                    <ListItem key={item.name} disablePadding>
                        <ListItemButton component={Link} to={item.link}>
                            <ListItemIcon>
                                <Icon>{item.iconName}</Icon>
                            </ListItemIcon>
                            <ListItemText primary={item.name} />
                        </ListItemButton>
                    </ListItem>
                ))}
            </List>
        </Drawer>
    );
}

export default Navigation;
