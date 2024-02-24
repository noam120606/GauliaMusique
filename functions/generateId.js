module.exports = (length=16, prefix=undefined) => {
    const chars = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789"
    let result = prefix?.toUpperCase() ?? "";
    for (let i = 0; i<length; i++) result+=chars[Math.floor(Math.random() * chars.length)];
    return result;
};