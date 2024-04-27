import { Box, Button } from '@mui/material';
import * as React from 'react';

const StepButtons = (props) => {
    const { disabledBack, handleBack, disabledSkip, handleSkip, nextButtonName, disabledNext, handleNext } = props;
    return (
        <Box sx={{ display: 'flex', flexDirection: 'row', pt: 2 }}>
            <Button disabled={disabledBack} onClick={handleBack}>
                Попередній крок
            </Button>
            <Box sx={{ flex: '1 1 auto' }} />
            <Button disabled={disabledSkip} onClick={handleSkip} color="inherit" sx={{ mr: 1 }}>
                Пропустити крок
            </Button>
            <Button disabled={disabledNext} onClick={handleNext}>
                {nextButtonName}
            </Button>
        </Box>
    );
}

export default StepButtons;
