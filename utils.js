// Debounce receives an input function, and wait to evaluate it until there is a sufficient delay inbetween firing
function debounce(func, delay = 1000) {
    let timeoutId;
    return (...args) => {
        clearTimeout(timeoutId)
        timeoutId = setTimeout(() => {
            func.apply(null, args);
        }, delay);
    };
};