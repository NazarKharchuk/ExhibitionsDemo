import * as React from 'react';
import FullScreenDialog from '../../UI/FullScreenDialog';
import { Box, Step, StepLabel, Stepper, Typography } from '@mui/material';
import { paintingAPI } from '../../../API/paintingAPI';
import { useForm } from 'react-hook-form';
import { useDispatch, useSelector } from 'react-redux';
import { showAlert } from '../../../Store/headerSlice';
import PaintingForm from './PaintingForm';
import { paintingImageRules } from '../../../Helper/Validation/Painting/PaintingValidation';
import StepButtons from '../../UI/StepButtons';
import { genreAPI } from '../../../API/genreAPI';
import { styleAPI } from '../../../API/styleAPI';
import { materialAPI } from '../../../API/materialAPI';
import { tagAPI } from '../../../API/tagAPI';
import StepContent from '../../UI/StepContent';

const PaintingCreateUpdate = ({ isCreateUpdateDialogOpen, setIsCreateUpdateDialogOpen, selectedPainting, setSelectedPainting, setNeedRefetch }) => {
    const dispatch = useDispatch();
    const painterId = useSelector((store) => store.user.painterId);

    const [data, setData] = React.useState(null);
    const [activeStep, setActiveStep] = React.useState(0);
    const [completedSteps, setCompletedSteps] = React.useState([]);
    const [needRefetchPainting, setNeedRefetchPainting] = React.useState(new Date());
    const [isLoaded, setIsLoaded] = React.useState(true);

    const [genres, setGenres] = React.useState(null);
    const [styles, setStyles] = React.useState(null);
    const [materials, setMaterials] = React.useState(null);
    const [tags, setTags] = React.useState(null);

    React.useEffect(() => {
        if (selectedPainting !== null) fetchData(selectedPainting);
        else setData(null);
    }, [selectedPainting, needRefetchPainting]);

    React.useEffect(() => {
        if (activeStep === 0) {
            if (selectedPainting !== null) reset();
        }
        if (activeStep === 1 && genres === null) {
            fetchGenres();
        }
        if (activeStep === 2 && styles === null) {
            fetchStyles();
        }
        if (activeStep === 3 && materials === null) {
            fetchMaterials();
        }
        if (activeStep === 4 && tags === null) {
            fetchTags();
        }
    }, [activeStep, genres, styles, materials, tags]);

    const fetchData = async (paintingId) => {
        setIsLoaded(false);
        const result = await paintingAPI.painting(paintingId);
        if (result.successfully === true) {
            setData(result.data);
            reset();
        } else {
            dispatch(showAlert({ message: "Не вдалось отримати дані: " + result.message, severity: 'error', hideTime: 10000 }));
        }
        setIsLoaded(true);
    };

    const fetchGenres = async () => {
        setIsLoaded(false);
        const result = await genreAPI.allGenres();
        if (result.successfully === true) {
            setGenres(result.data);
        } else {
            dispatch(showAlert({ message: "Не вдалось отримати дані: " + result.message, severity: 'error', hideTime: 10000 }));
        }
        setIsLoaded(true);
    };

    const fetchStyles = async () => {
        setIsLoaded(false);
        const result = await styleAPI.allStyles();
        if (result.successfully === true) {
            setStyles(result.data);
        } else {
            dispatch(showAlert({ message: "Не вдалось отримати дані: " + result.message, severity: 'error', hideTime: 10000 }));
        }
        setIsLoaded(true);
    };

    const fetchMaterials = async () => {
        setIsLoaded(false);
        const result = await materialAPI.allMaterials();
        if (result.successfully === true) {
            setMaterials(result.data);
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
        paintingId: {
            defaultValue: data ? data.paintingId : "",
            disabled: true
        },
        name: {
            defaultValue: data ? data.name : "Назва картини",
            disabled: false
        },
        description: {
            defaultValue: data ? data.description : "Опис картини",
            disabled: false
        },
        cretionDate: {
            defaultValue: data ? data.cretionDate.slice(0, 10) : new Date().toISOString().slice(0, 10),
            disabled: false
        },
        width: {
            defaultValue: data ? data.width : 40,
            disabled: false
        },
        height: {
            defaultValue: data ? data.height : 30,
            disabled: false
        },
        location: {
            defaultValue: data ? data.location ? data.location : "" : "Київ",
            disabled: false
        },
        image: {
            defaultValue: "",
            disabled: false,
            register: register,
            rules: data ? {} : paintingImageRules
        },
    }

    const steps = [
        {
            label: selectedPainting !== null ? "Редагувати картину" : "Додати картину",
            optional: false
        },
        {
            label: "Жанри",
            optional: true
        },
        {
            label: "Стилі",
            optional: true
        },
        {
            label: "Матеріали",
            optional: true
        },
        {
            label: "Теги",
            optional: true
        },
    ];

    const handleCreate = async (data) => {
        try {
            data.painterId = painterId;
            data.cretionDate = data.cretionDate.toISOString();
            const res = await paintingAPI.createPainting(data);

            if (res.successfully === true) {
                dispatch(showAlert({ message: "Картину успішно додано", severity: 'success', hideTime: 4000 }));
                setSelectedPainting(res.data.paintingId);
                setCompletedSteps((prev) => [...prev, 0]);
                handleSkip();
            } else {
                dispatch(showAlert({ message: res.message, severity: 'error', hideTime: 6000 }));
            }
        } catch (error) {
            console.error("Помилка під час додавання картини:", error);
        }
    };

    const handleUpdate = async (data) => {
        try {
            data.cretionDate = data.cretionDate.toISOString();
            const res = await paintingAPI.updatePainting(data.paintingId, data);

            if (res.successfully === true) {
                dispatch(showAlert({ message: "Картину успішно змінено", severity: 'success', hideTime: 4000 }));
                setCompletedSteps((prev) => [...prev, 0]);
                handleSkip();
            } else {
                dispatch(showAlert({ message: res.message, severity: 'error', hideTime: 6000 }));
            }
        } catch (error) {
            console.error("Помилка під час редагування картини:", error);
        }
    };

    const renderSteps = () => {
        switch (activeStep) {
            /*case 0: {
                return renderAddUpdateStep;
            }*/
            case 1: {
                return renderGenreStep;
            }
            case 2: {
                return renderStyleStep;
            }
            case 3: {
                return renderMaterialStep;
            }
            case 4: {
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
            <PaintingForm control={control} fieldsSettings={fieldsSettings} />
            <StepButtons disabledBack={true} disabledSkip={selectedPainting !== null ? false : true} handleSkip={handleSkip}
                nextButtonName={selectedPainting !== null ? "Змінити" : "Зберегти"} disabledNext={isSubmitting || !isDirty || !isValid}
                handleNext={handleSubmit(selectedPainting !== null ? handleUpdate : handleCreate)} />
        </div>
    )

    const renderGenreStep = (
        <StepContent singularName="Жанр" pluralName="Жанри" stepIndex={1} data={data} allOptions={genres} nameValuesInArrayObj="genres"
            selectedObject={selectedPainting} valueName="genreName" valueId="genreId" setIsLoaded={setIsLoaded}
            setCompletedSteps={setCompletedSteps} setNeedRefetchObject={setNeedRefetchPainting} addMethod={paintingAPI.addGenre}
            deleteMethod={paintingAPI.deleteGenre} disabledBack={false} handleBack={handleBack} disabledSkip={false}
            handleSkip={handleSkip} nextButtonName={"Далі"} disabledNext={false} handleNext={handleSkip} />
    );

    const renderStyleStep = (
        <StepContent singularName="Стиль" pluralName="Стилі" stepIndex={2} data={data} allOptions={styles} nameValuesInArrayObj="styles"
            selectedObject={selectedPainting} valueName="styleName" valueId="styleId" setIsLoaded={setIsLoaded}
            setCompletedSteps={setCompletedSteps} setNeedRefetchObject={setNeedRefetchPainting} addMethod={paintingAPI.addStyle}
            deleteMethod={paintingAPI.deleteStyle} disabledBack={false} handleBack={handleBack} disabledSkip={false}
            handleSkip={handleSkip} nextButtonName={"Далі"} disabledNext={false} handleNext={handleSkip} />
    );

    const renderMaterialStep = (
        <StepContent singularName="Матеріал" pluralName="Матеріали" stepIndex={3} data={data} allOptions={materials} nameValuesInArrayObj="materials"
            selectedObject={selectedPainting} valueName="materialName" valueId="materialId" setIsLoaded={setIsLoaded}
            setCompletedSteps={setCompletedSteps} setNeedRefetchObject={setNeedRefetchPainting} addMethod={paintingAPI.addMaterial}
            deleteMethod={paintingAPI.deleteMaterial} disabledBack={false} handleBack={handleBack} disabledSkip={false}
            handleSkip={handleSkip} nextButtonName={"Далі"} disabledNext={false} handleNext={handleSkip} />
    );

    const renderTagStep = (
        <StepContent singularName="Тег" pluralName="Теги" stepIndex={4} data={data} allOptions={tags} nameValuesInArrayObj="tags"
            selectedObject={selectedPainting} valueName="tagName" valueId="tagId" setIsLoaded={setIsLoaded}
            setCompletedSteps={setCompletedSteps} setNeedRefetchObject={setNeedRefetchPainting} addMethod={paintingAPI.addTag}
            deleteMethod={paintingAPI.deleteTag} disabledBack={false} handleBack={handleBack} disabledSkip={true}
            handleSkip={handleSkip} nextButtonName={"Закінчити"} disabledNext={false} handleNext={handleClose} />
    );

    return (
        <FullScreenDialog
            isDialogOpen={isCreateUpdateDialogOpen}
            setIsDialogOpen={setIsCreateUpdateDialogOpen}
            dialogTitle="Картина художника"
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

export default PaintingCreateUpdate;
