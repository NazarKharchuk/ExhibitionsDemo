import * as React from 'react';
import FullScreenDialog from '../../UI/FullScreenDialog';
import { Box, Step, StepLabel, Stepper, Typography } from '@mui/material';
import { exhibitionAPI } from '../../../API/exhibitionAPI';
import { useForm } from 'react-hook-form';
import { useDispatch } from 'react-redux';
import { showAlert } from '../../../Store/headerSlice';
import ExhibitionForm from './ExhibitionForm';
import StepButtons from '../../UI/StepButtons';
import { tagAPI } from '../../../API/tagAPI';
import StepContent from '../../UI/StepContent';

const ExhibitionCreateUpdate = ({ isCreateUpdateDialogOpen, setIsCreateUpdateDialogOpen, selectedExhibition, setSelectedExhibition, setNeedRefetch }) => {
    const dispatch = useDispatch();

    const [data, setData] = React.useState(null);
    const [activeStep, setActiveStep] = React.useState(0);
    const [completedSteps, setCompletedSteps] = React.useState([]);
    const [needRefetchExhibition, setNeedRefetchExhibition] = React.useState(new Date());
    const [isLoaded, setIsLoaded] = React.useState(true);

    const [tags, setTags] = React.useState(null);

    React.useEffect(() => {
        if (selectedExhibition !== null) fetchData(selectedExhibition);
        else setData(null);
    }, [selectedExhibition, needRefetchExhibition]);

    React.useEffect(() => {
        if (activeStep === 0) {
            if (selectedExhibition !== null) reset();
        }
        if (activeStep === 1 && tags === null) {
            fetchTags();
        }
    }, [activeStep, tags]);

    const fetchData = async (exhibitionId) => {
        setIsLoaded(false);
        const result = await exhibitionAPI.exhibition(exhibitionId);
        if (result.successfully === true) {
            setData(result.data);
            reset();
        } else {
            dispatch(showAlert({ message: "Не вдалось отримати дані: " + result.message, severity: 'error', hideTime: 10000 }));
        }
        setIsLoaded(true);
    };

    const fetchTags = async () => {
        setIsLoaded(false);
        const result = await tagAPI.allTags();
        if (result.successfully === true) {
            setTags(result.data);
        } else {
            dispatch(showAlert({ message: "Не вдалось отримати дані: " + result.message, severity: 'error', hideTime: 10000 }));
        }
        setIsLoaded(true);
    };

    const { register, control, handleSubmit, reset, formState: { isSubmitting, isDirty, isValid } } = useForm({
        mode: 'onTouched'
    });

    const fieldsSettings = {
        exhibitionId: {
            defaultValue: data ? data.exhibitionId : "",
            disabled: true
        },
        name: {
            defaultValue: data ? data.name : "Назва виставки",
            disabled: false
        },
        description: {
            defaultValue: data ? data.description : "Опис виставки",
            disabled: false
        },
        needConfirmation: {
            defaultValue: data ? data.needConfirmation : true,
            disabled: false,
            validation: {}
        },
        painterLimit: {
            defaultValue: data ? data.painterLimit ? data.painterLimit : "" : "",
            disabled: false,
            validation: {
                validate: {
                    isInteger: (value) => (value ? /^[0-9]+$/.test(value) : true) ||
                        'Ліміт кількості картин одного художника на конкурсі має бути цілочисловим значенням',
                    ...(data ? {
                        lessThanBefore: (value) => ((data.painterLimit ? data.painterLimit : "") <= value) ||
                            'Не можна зменшувати ліміт кількості заявок від одного художника'
                    } : {})
                }
            }
        },
    }

    const steps = [
        {
            label: selectedExhibition !== null ? "Редагувати виставки" : "Додати виставку",
            optional: false
        },
        {
            label: "Теги",
            optional: true
        },
    ];

    const handleCreate = async (data) => {
        try {
            const res = await exhibitionAPI.createExhibition(data);

            if (res.successfully === true) {
                dispatch(showAlert({ message: "виставку успішно додано", severity: 'success', hideTime: 4000 }));
                setSelectedExhibition(res.data.exhibitionId);
                setCompletedSteps((prev) => [...prev, 0]);
                handleSkip();
            } else {
                dispatch(showAlert({ message: res.message, severity: 'error', hideTime: 6000 }));
            }
        } catch (error) {
            console.error("Помилка під час додавання виставки:", error);
        }
    };

    const handleUpdate = async (data) => {
        try {
            const res = await exhibitionAPI.updateExhibition(data.exhibitionId, data);

            if (res.successfully === true) {
                dispatch(showAlert({ message: "Виставку успішно змінено", severity: 'success', hideTime: 4000 }));
                setCompletedSteps((prev) => [...prev, 0]);
                handleSkip();
                setNeedRefetchExhibition(new Date());
            } else {
                dispatch(showAlert({ message: res.message, severity: 'error', hideTime: 6000 }));
            }
        } catch (error) {
            console.error("Помилка під час редагування виставки:", error);
        }
    };

    const renderSteps = () => {
        switch (activeStep) {
            /*case 0: {
                return renderAddUpdateStep;
            }*/
            case 1: {
                return renderTagStep;
            }
        }
    }

    const handleClose = () => {
        setIsCreateUpdateDialogOpen(false);
        setNeedRefetch(Date.now());
    };

    const handleBack = () => {
        if (activeStep > 0) setActiveStep((prevActiveStep) => prevActiveStep - 1);
    };

    const handleSkip = () => {
        if (activeStep < (steps.length - 1)) setActiveStep((prevActiveStep) => prevActiveStep + 1);
    };

    const renderAddUpdateStep = (
        <div style={{ display: activeStep === 0 ? 'block' : 'none' }}>
            <ExhibitionForm control={control} fieldsSettings={fieldsSettings} />
            <StepButtons disabledBack={true} disabledSkip={selectedExhibition !== null ? false : true} handleSkip={handleSkip}
                nextButtonName={selectedExhibition !== null ? "Змінити" : "Зберегти"} disabledNext={isSubmitting || !isDirty || !isValid}
                handleNext={handleSubmit(selectedExhibition !== null ? handleUpdate : handleCreate)} />
        </div>
    )

    const renderTagStep = (
        <StepContent singularName="Тег" pluralName="Теги" stepIndex={1} data={data} allOptions={tags} nameValuesInArrayObj="tags"
            selectedObject={selectedExhibition} valueName="tagName" valueId="tagId" setIsLoaded={setIsLoaded}
            setCompletedSteps={setCompletedSteps} setNeedRefetchObject={setNeedRefetchExhibition} addMethod={exhibitionAPI.addTag}
            deleteMethod={exhibitionAPI.deleteTag} disabledBack={false} handleBack={handleBack} disabledSkip={true}
            handleSkip={handleSkip} nextButtonName={"Закінчити"} disabledNext={false} handleNext={handleClose} />
    );

    return (
        <FullScreenDialog
            isDialogOpen={isCreateUpdateDialogOpen}
            setIsDialogOpen={setIsCreateUpdateDialogOpen}
            dialogTitle="Виставка картин"
            buttonName="Закрити"
            handleClick={handleClose}
            disabled={isSubmitting}
            isSubmitting={isSubmitting || !isLoaded}
        >
            <Stepper activeStep={activeStep}>
                {steps.map((step, index) => (
                    <Step key={step.label} completed={completedSteps.length > 0 ? completedSteps.includes(index) : false}>
                        <StepLabel optional={step.optional && (<Typography variant="caption">Не обов'язково</Typography>)}>{step.label}</StepLabel>
                    </Step>
                ))}
            </Stepper>
            <Box sx={{ paddingTop: 2 }}>
                {renderAddUpdateStep}
                {renderSteps()}
            </Box>
        </FullScreenDialog>
    );
}

export default ExhibitionCreateUpdate;
