import * as React from 'react';
import { useDispatch } from 'react-redux';
import { showAlert } from '../../Store/headerSlice';
import { Autocomplete, Box, Button, Chip, Stack, TextField, Typography } from '@mui/material';
import StepButtons from './StepButtons';

const StepContent = (props) => {
    const { singularName, pluralName, stepIndex, data, allOptions, nameValuesInArrayObj, selectedObject, valueName, valueId,
        setIsLoaded, setCompletedSteps, setNeedRefetchObject, addMethod, deleteMethod, disabledBack, handleBack, disabledSkip,
        handleSkip, nextButtonName, disabledNext, handleNext } = props;

    const dispatch = useDispatch();

    const [valueInput, setValueInput] = React.useState(null);

    const handleAdd = async (objectId, id) => {
        setIsLoaded(false);
        try {
            const res = await addMethod(objectId, id);

            if (res.successfully === true) {
                dispatch(showAlert({ message: singularName + " успішно додано", severity: 'success', hideTime: 4000 }));
                setCompletedSteps((prev) => [...prev, stepIndex]);
                setNeedRefetchObject(new Date());
            } else {
                dispatch(showAlert({ message: res.message, severity: 'error', hideTime: 6000 }));
            }
        } catch (error) {
            console.error("Помилка під час додавання:", error);
        } finally { setIsLoaded(true); }
    };

    const handleDelete = async (objectId, id) => {
        setIsLoaded(false);
        try {
            const res = await deleteMethod(objectId, id);

            if (res.successfully === true) {
                dispatch(showAlert({ message: singularName + " успішно видалено", severity: 'success', hideTime: 4000 }));
                setCompletedSteps((prev) => [...prev, stepIndex]);
                setNeedRefetchObject(new Date());
            } else {
                dispatch(showAlert({ message: res.message, severity: 'error', hideTime: 6000 }));
            }
        } catch (error) {
            console.error("Помилка під час видалення:", error);
        } finally { setIsLoaded(true); }
    };

    return (
        <>
            {data !== null ? (
                <>
                    <Box sx={{ minHeight: 450 }}>
                        <Typography variant="h6" gutterBottom>
                            Додати {singularName.toLowerCase()}:
                        </Typography>
                        <Stack direction="row" spacing={1} alignItems="center" sx={{ marginBottom: 2 }}>
                            <Autocomplete
                                disablePortal
                                value={valueInput}
                                onChange={(_, newValue) => setValueInput(newValue)}
                                options={allOptions !== null ? allOptions : []}
                                getOptionLabel={(option) => option[valueName]}
                                renderInput={(params) => <TextField {...params} label={"Додати " + singularName.toLowerCase()} variant="outlined" size="small" />}
                                isOptionEqualToValue={(option, value) => option[valueId] === value[valueId]}
                                getOptionDisabled={(option) => data[nameValuesInArrayObj].some((value) => value[valueId] === option[valueId])}
                                fullWidth
                            />
                            <Button variant="contained" color="primary" disabled={!valueInput} sx={{ whiteSpace: 'nowrap' }} onClick={() => {
                                handleAdd(selectedObject, valueInput[valueId]);
                                setValueInput(null);
                            }}
                            >
                                Додати {singularName.toLowerCase()}
                            </Button>
                        </Stack>
                        <Typography variant="h6" gutterBottom>
                            Всі {pluralName.toLowerCase()}:
                        </Typography>
                        <Stack direction="row" spacing={1} flexWrap="wrap" alignItems="center">
                            {data[nameValuesInArrayObj].length !== 0 ? (
                                data[nameValuesInArrayObj].map((value) => (
                                    <Chip key={value[valueId]} onDelete={() => handleDelete(selectedObject, value[valueId])}
                                        color="primary" variant="outlined" label={value[valueName]} />
                                ))
                            ) : (
                                <Typography>Жоден {singularName.toLowerCase()} ще не доданий</Typography>
                            )}
                        </Stack>
                    </Box>
                    <StepButtons disabledBack={disabledBack} handleBack={handleBack} disabledSkip={(disabledSkip || valueInput)} handleSkip={handleSkip}
                        nextButtonName={nextButtonName} disabledNext={(disabledNext || valueInput)} handleNext={handleNext} />
                </>
            ) : (
                <Typography>Ви виконали не всі попередні обов'язкові кроки</Typography>
            )}
        </>
    );
}

export default StepContent;
