export const paintingNameRules = {
    required: { value: true, message: 'Назва картини є обов\'язковою' },
    maxLength: { value: 50, message: 'Довжина назви картини не повинна перевищувати 50 символів' }
};

export const paintingDescriptionRules = {
    required: { value: true, message: 'Опис картини є обов\'язковим' },
    maxLength: { value: 500, message: 'Довжина опису картини не повинна перевищувати 500 символів' }
};

export const paintingCretionDateRules = {
    required: { value: true, message: 'Дата створення картини є обов\'язковою' },
    valueAsDate: { value: true, message: 'Дата створення картини має бути датою' },
    validate: (value) => new Date(value) <= new Date() || 'Дата створення картини не може бути пізнішою за сьогодні'
};

export const paintingWidthRules = {
    required: { value: true, message: 'Ширина картини є обов\'язковою' },
    valueAsNumber: { value: true, message: 'Ширина картини має бути числовим значенням' },
    min: { value: 0.01, message: 'Ширина картини повинна бути більшою за нуль' }
};

export const paintingHeightRules = {
    required: { value: true, message: 'Висота картини є обов\'язковою' },
    valueAsNumber: { value: true, message: 'Висота картини має бути числовим значенням' },
    min: { value: 0.01, message: 'Висота картини повинна бути більшою за нуль' }
};

export const paintingLocationRules = {
    maxLength: { value: 100, message: 'Довжина опису локації картини не повинна перевищувати 100 символів' }
};

export const paintingImageRules = {
    required: { value: true, message: 'Зображення є обов\'язковим' },
};
