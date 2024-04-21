import { AppBar, Button, CircularProgress, Dialog, DialogContent, Icon, IconButton, LinearProgress, Slide, Toolbar, Typography } from '@mui/material';
import * as React from 'react';

const Transition = React.forwardRef(function Transition(props, ref) {
    return <Slide direction="up" ref={ref} {...props} />;
});

const FullScreenDialog = ({ children, isDialogOpen, setIsDialogOpen, dialogTitle, buttonName, handleClick, disabled, isSubmitting }) => {
    const handleClose = () => {
        setIsDialogOpen(false);
    };

    return (
        <Dialog fullScreen open={isDialogOpen} onClose={handleClose} TransitionComponent={Transition} style={{ zIndex: 1500 }}>
            <AppBar sx={{ position: 'relative' }}>
                <Toolbar>
                    <IconButton edge="start" color="inherit" onClick={handleClose}>
                        <Icon>close</Icon>
                    </ IconButton>
                    <Typography sx={{ ml: 2, flex: 1 }} variant="h6" component="div">
                        {dialogTitle}
                    </Typography>
                    <Button color="inherit" onClick={handleClick} disabled={disabled} startIcon={<Icon>done</Icon>}>
                        {!isSubmitting ? buttonName : <CircularProgress size={25} />}
                    </Button>
                </Toolbar>
            </AppBar>
            {isSubmitting && <LinearProgress color="secondary" />}
            <DialogContent>
                {children}
            </DialogContent>
        </Dialog>
    );
}

export default FullScreenDialog;
