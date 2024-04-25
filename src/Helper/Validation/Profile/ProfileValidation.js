export const profileFirstNameRules = {
    required: { value: true, message: 'Ім\'я є обов\'язковим' },
    maxLength: { value: 20, message: 'Довжина ім\'я не повинна перевищувати 20 символів' }
};

export const profileLastNameRules = {
    maxLength: { value: 20, message: 'Довжина прізвища не повинна перевищувати 20 символів' }
};
