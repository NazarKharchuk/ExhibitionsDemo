export const painterDescriptionRules = {
    required: { value: true, message: 'Опис художника є обов\'язковим' },
    maxLength: { value: 500, message: 'Довжина опису художника не повинна перевищувати 500 символів' }
};

export const painterPseudonymRules = {
    required: { value: true, message: 'Псевдонім художника є обов\'язковим' },
    maxLength: { value: 20, message: 'Довжина псевдоніму художника не повинна перевищувати 20 символів' }
};
