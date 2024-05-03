export const contestNameRules = {
    required: { value: true, message: 'Назва конкурсу є обов\'язковим' },
    maxLength: { value: 50, message: 'Довжина назви конкурсу не повинна перевищувати 50 символів' }
};

export const contestDescriptionRules = {
    required: { value: true, message: 'Опис конкурсу є обов\'язковим' },
    maxLength: { value: 500, message: 'Довжина опису конкурсу не повинна перевищувати 500 символів' }
};

export const contestStartDateRules = {
    required: { value: true, message: 'Дата початку голосування є обов\'язковою' },
    valueAsDate: { value: true, message: 'Дата початку голосування має бути датою' }
};

export const contestEndDateRules = {
    required: { value: true, message: 'Дата закінчення голосування є обов\'язковою' },
    valueAsDate: { value: true, message: 'Дата закінчення голосування має бути датою' }
};

export const contestNeedConfirmationRules = {
};

export const contestPainterLimitRules = {
    min: { value: 1, message: 'Ліміт кількості картин одного художника на конкурсі повинен бути більшим або рівним 1' },
    valueAsNumber: { value: true, message: 'Ліміт кількості картин одного художника на конкурсі має бути числовим значенням' },
};

export const contestWinnersCountRules = {
    required: { value: true, message: 'Задання кількості переможців конкурсу є обов\'язковим' },
    valueAsNumber: { value: true, message: 'Кількість переможців конкурсу має бути числовим значенням' },
    min: { value: 1, message: 'Кількість переможців конкурсу повинна бути більшою або рівною 1' },
};

export const contestVotesLimitnRules = {
    min: { value: 1, message: 'Ліміт кількості голосів від одного користувача на конкурсі повинен бути більшим або рівним 1' },
};
