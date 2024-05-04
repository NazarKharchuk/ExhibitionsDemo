export const exhibitionNameRules = {
    required: { value: true, message: 'Назва конкурсу є обов\'язковим' },
    maxLength: { value: 50, message: 'Довжина назви конкурсу не повинна перевищувати 50 символів' }
};

export const exhibitionDescriptionRules = {
    required: { value: true, message: 'Опис конкурсу є обов\'язковим' },
    maxLength: { value: 500, message: 'Довжина опису конкурсу не повинна перевищувати 500 символів' }
};

export const exhibitionNeedConfirmationRules = {
};

export const exhibitionPainterLimitRules = {
    min: { value: 1, message: 'Ліміт кількості картин одного художника на конкурсі повинен бути більшим або рівним 1' },
    valueAsNumber: { value: true, message: 'Ліміт кількості картин одного художника на конкурсі має бути числовим значенням' },
};
