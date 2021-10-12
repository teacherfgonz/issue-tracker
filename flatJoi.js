module.exports = function flatJoi(error) {
    if (!error) return {};
    return error.details.reduce(
        (result, current) => ({
            ...result,
            [current.path[0]]: current.message,
        }),
        {}
    );
}