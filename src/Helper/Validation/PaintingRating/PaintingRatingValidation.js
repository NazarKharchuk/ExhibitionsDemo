export const paintingRatingRatingValueRules = {
    required: { value: true, message: 'Рейтинг картини є обов\'язковим' },
    valueAsNumber: { value: true, message: 'Рейтинг картини має бути числовим значенням' },
    min: { value: 0, message: 'Рейтинг картини повинен бути не меншим за нуль' },
    max: { value: 5, message: 'Рейтинг картини повинен бути не більшим за п\'ять' },
};

export const paintingRatingCommentRules = {
    maxLength: { value: 500, message: 'Довжина коментаря картини не повинна перевищувати 500 символів' }
};
