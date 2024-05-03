import * as React from 'react';
import FullScreenDialog from '../../UI/FullScreenDialog';
import { Box, Step, StepLabel, Stepper, Typography } from '@mui/material';
import { contestAPI } from '../../../API/contestAPI';
import { useForm } from 'react-hook-form';
import { useDispatch } from 'react-redux';
import { showAlert } from '../../../Store/headerSlice';
import ContestForm from './ContestForm';
import StepButtons from '../../UI/StepButtons';
import { tagAPI } from '../../../API/tagAPI';
import StepContent from '../../UI/StepContent';

const ContestCreateUpdate = ({ isCreateUpdateDialogOpen, setIsCreateUpdateDialogOpen, selectedContest, setSelectedContest, setNeedRefetch }) => {
    const dispatch = useDispatch();

    const [data, setData] = React.useState(null);
    const [activeStep, setActiveStep] = React.useState(0);
    const [completedSteps, setCompletedSteps] = React.useState([]);
    const [needRefetchContest, setNeedRefetchContest] = React.useState(new Date());
    const [isLoaded, setIsLoaded] = React.useState(true);

    const [tags, setTags] = React.useState(null);

    React.useEffect(() => {
        if (selectedContest !== null) fetchData(selectedContest);
        else setData(null);
    }, [selectedContest, needRefetchContest]);

    React.useEffect(() => {
        if (activeStep === 0) {
            if (selectedContest !== null) reset();
        }
        if (activeStep === 1 && tags === null) {
            fetchTags();
        }
    }, [activeStep, tags]);

    const fetchData = async (contestId) => {
        setIsLoaded(false);
        const result = await contestAPI.contest(contestId);
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

    function areDatesEqual(date1, date2) {
        const d1 = new Date(date1);
        const d2 = new Date(date2);
        d1.setHours(0, 0, 0, 0);
        d2.setHours(0, 0, 0, 0);
        return d1.getTime() === d2.getTime();
    }

    const { register, control, handleSubmit, reset, formState: { isSubmitting, isDirty, isValid } } = useForm({
        mode: 'onTouched'
    });

    const fieldsSettings = {
        contestId: {
            defaultValue: data ? data.contestId : "",
            disabled: true
        },
        name: {
            defaultValue: data ? data.name : "Назва конкурсу",
            disabled: false
        },
        description: {
            defaultValue: data ? data.description : "Опис конкурсу",
            disabled: false
        },
        startDate: {
            defaultValue: data ? data.startDate.slice(0, 10) : new Date(new Date().getTime() + 1 * 24 * 60 * 60 * 1000).toISOString().slice(0, 10),
            disabled: data ? data.startDate <= new Date() : false,
            register: register,
            validation: {
                validate: data ? {
                    afterStart: value => (!areDatesEqual(data.startDate, value) ? new Date(data.startDate) > new Date() : true) ||
                        'Голосування вже розпочалось. Це вже не можна змінити',
                    afterToday: value => (!areDatesEqual(data.startDate, value) ? new Date(value) > new Date() : true) ||
                        'Дата початку голосування не може бути раніше ніж сьогодні'
                } : {
                    afterToday: value => new Date(value) > new Date() || 'Дата початку голосування не може бути раніше ніж сьогодні'
                }
            }
        },
        endDate: {
            defaultValue: data ? data.endDate.slice(0, 10) : new Date(new Date().getTime() + 3 * 24 * 60 * 60 * 1000).toISOString().slice(0, 10),
            disabled: data ? data.endDate <= new Date() : false,
            register: register,
            validation: {
                validate: {
                    afterStartDate: (endDate, formValues) => new Date(endDate) > new Date(formValues.startDate) ||
                        'Дата закінчення голосування має бути пізнішою за дату початку голосування',
                    ...(data ? {
                        afterToday: value => (!areDatesEqual(data.endDate, value) ? new Date(value) > new Date() : true) ||
                            'Дата закінчення голосування не може бути раніше ніж сьогодні'
                    } : {})
                }
            }
        },
        needConfirmation: {
            defaultValue: data ? data.needConfirmation : true,
            disabled: data ? data.startDate <= new Date() : false,
            validation: {
                validate: data ? {
                    afterStart: (value) => (data.needConfirmation !== value ? new Date(data.startDate) > new Date() : true) ||
                        'Голосування вже розпочалось. Тепер зміни неможливі'
                } : {}
            }
        },
        painterLimit: {
            defaultValue: data ? data.painterLimit ? data.painterLimit : "" : "",
            disabled: data ? data.startDate <= new Date() : false,
            validation: {
                validate: {
                    isInteger: (value) => (value ? /^[0-9]+$/.test(value) : true) ||
                        'Ліміт кількості картин одного художника на конкурсі має бути цілочисловим значенням',
                    ...(data ? {
                        afterStart: (value) => ((data.painterLimit ? data.painterLimit : "").toString() !== value.toString() ? new Date(data.startDate) > new Date() : true) ||
                            'Голосування вже розпочалось. Зміни ліміту тепер неможливі',
                        lessThanBefore: (value) => ((data.painterLimit ? data.painterLimit : "") <= value) ||
                            'Не можна зменшувати ліміт кількості заявок від одного художника'
                    } : {})
                }
            }
        },
        winnersCount: {
            defaultValue: data ? data.winnersCount : 1,
            disabled: data ? data.endDate <= new Date() : false,
            validation: {
                validate: {
                    isInteger: (value) => /^[0-9]+$/.test(value) ||
                        'Ліміт кількості картин одного художника на конкурсі має бути цілочисловим значенням',
                    ...(data ? {
                        afterEnd: (value) => (data.winnersCount.toString() !== value.toString() ? new Date(data.endDate) > new Date() : true) ||
                            'Голосування вже закінчилось. Зміни кількості тепер неможливі',
                        lessThanBefore: (value) => (data.winnersCount <= value) ||
                            'Не можна зменшувати кількість переможців'
                    } : {})
                }
            }
        },
        votesLimit: {
            defaultValue: data ? data.votesLimit ? data.votesLimit : "" : "",
            disabled: data ? data.endDate <= new Date() : false,
            validation: {
                validate: {
                    isInteger: (value) => (value ? /^[0-9]+$/.test(value) : true) ||
                        'Ліміт кількості голосів від одного користувача на конкурсі має бути цілочисловим значенням',
                    ...(data ? {
                        afterEnd: (value) => ((data.votesLimit ? data.votesLimit : "").toString() !== value.toString() ? new Date(data.endDate) > new Date() : true) ||
                            'Голосування вже закінчилось. Зміни ліміту тепер неможливі',
                        lessThanBefore: (value) => ((data.votesLimit ? data.votesLimit : "") <= value) ||
                            'Не можна зменшувати ліміт кількості голосів від одного користувача'
                    } : {})
                }
            }
        }
    }

    const steps = [
        {
            label: selectedContest !== null ? "Редагувати конкурс" : "Додати конкурс",
            optional: false
        },
        {
            label: "Теги",
            optional: true
        },
    ];

    const handleCreate = async (data) => {
        try {
            data.startDate = data.startDate.toISOString();
            data.endDate = data.endDate.toISOString();
            const res = await contestAPI.createContest(data);

            if (res.successfully === true) {
                dispatch(showAlert({ message: "Конкурс успішно додано", severity: 'success', hideTime: 4000 }));
                setSelectedContest(res.data.contestId);
                setCompletedSteps((prev) => [...prev, 0]);
                handleSkip();
            } else {
                dispatch(showAlert({ message: res.message, severity: 'error', hideTime: 6000 }));
            }
        } catch (error) {
            console.error("Помилка під час додавання конкурсу:", error);
        }
    };

    const handleUpdate = async (data) => {
        try {
            data.startDate = data.startDate.toISOString();
            data.endDate = data.endDate.toISOString();
            const res = await contestAPI.updateContest(data.contestId, data);

            if (res.successfully === true) {
                dispatch(showAlert({ message: "Конкурс успішно змінено", severity: 'success', hideTime: 4000 }));
                setCompletedSteps((prev) => [...prev, 0]);
                handleSkip();
            } else {
                dispatch(showAlert({ message: res.message, severity: 'error', hideTime: 6000 }));
            }
        } catch (error) {
            console.error("Помилка під час редагування конкурсу:", error);
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
            <ContestForm control={control} fieldsSettings={fieldsSettings} />
            <StepButtons disabledBack={true} disabledSkip={selectedContest !== null ? false : true} handleSkip={handleSkip}
                nextButtonName={selectedContest !== null ? "Змінити" : "Зберегти"} disabledNext={isSubmitting || !isDirty || !isValid}
                handleNext={handleSubmit(selectedContest !== null ? handleUpdate : handleCreate)} />
        </div>
    )

    const renderTagStep = (
        <StepContent singularName="Тег" pluralName="Теги" stepIndex={1} data={data} allOptions={tags} nameValuesInArrayObj="tags"
            selectedObject={selectedContest} valueName="tagName" valueId="tagId" setIsLoaded={setIsLoaded}
            setCompletedSteps={setCompletedSteps} setNeedRefetchObject={setNeedRefetchContest} addMethod={contestAPI.addTag}
            deleteMethod={contestAPI.deleteTag} disabledBack={false} handleBack={handleBack} disabledSkip={true}
            handleSkip={handleSkip} nextButtonName={"Закінчити"} disabledNext={false} handleNext={handleClose} />
    );

    return (
        <FullScreenDialog
            isDialogOpen={isCreateUpdateDialogOpen}
            setIsDialogOpen={setIsCreateUpdateDialogOpen}
            dialogTitle="Конкурс картин"
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

export default ContestCreateUpdate;
