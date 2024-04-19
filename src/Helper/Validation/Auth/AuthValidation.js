export const emailRules = {
    required: { value: true, message: 'Електронна пошта є обов\'язковою' },
    pattern: { 
        value: /^[a-zA-Z0-9._%+-]{2,}@[a-zA-Z]{2,}\.[a-zA-Z]{2,}$/, 
        message: 'Неправильний формат електронної пошти' 
    }
};

export const firstNameRules = {
    required: { value: true, message: 'Ім\'я є обов\'язковим' },
    maxLength: { value: 20, message: 'Ім\'я не повинно перевищувати 20 символів' }
};

export const lastNameRules = {
    maxLength: { value: 20, message: 'Прізвище не повинно перевищувати 20 символів' }
};

export const passwordRules = {
    required: { value: true, message: 'Пароль є обов\'язковим' }
};
