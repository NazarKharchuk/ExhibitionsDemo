import * as colors from '@mui/material/colors';

export const getColorFromSentence = (sentence) => {
    const colorKeys = Object.keys(colors);
    const hash = sentence.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
    const colorIndex = Math.abs(hash) % colorKeys.length;
    const colorName = colorKeys[colorIndex];
    const colorShades = colors[colorName];
    const shadeKeys = [300, 400, 500, 600, 700];
    const shadeIndex = Math.abs(hash) % shadeKeys.length;
    const shadeKey = shadeKeys[shadeIndex];
    return colorShades[shadeKey];
};
