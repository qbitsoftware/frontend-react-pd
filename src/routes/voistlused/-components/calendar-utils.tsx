export const getDaysInMonth = (year: number) => {
    const isLeapYear = (year % 4 === 0 && year % 100 !== 0) || year % 400 === 0
    return [31, isLeapYear ? 29 : 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31]
}

export const getTournamentColor = (id: number | string) => {
    const hash = typeof id === 'string'
        ? id.split('').reduce((a, b) => {
            a = ((a << 5) - a) + b.charCodeAt(0);
            return a & a;
        }, 0)
        : id;

    // Base colors with matching saturation and lightness levels
    const hues = [
        210, // blue
        180, // cyan/teal
        150, // green
        120, // lime
        80,  // yellow/amber
        30,  // orange
        0,   // red
        330, // rose/pink
        300, // fuchsia
        270, // purple
        240  // indigo
    ];

    // Choose a hue based on the hash
    const hueIndex = Math.abs(hash) % hues.length;
    const hue = hues[hueIndex];

    // Create 2-3 variations per hue by slightly adjusting the saturation/lightness
    const variations = [
        { s: 70, l: 50 }, // Very light, subtle
        { s: 70, l: 40 }, // Medium light
        { s: 80, l: 30 }  // Slightly more saturated
    ];

    // Select a variation based on further hash manipulation
    const variationIndex = Math.floor(Math.abs(hash / 11)) % variations.length;
    const { s, l } = variations[variationIndex];

    // For browsers that support HSL in background-color
    return `hsl(${hue}, ${s}%, ${l}%)`;
};