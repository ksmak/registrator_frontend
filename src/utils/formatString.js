export const replaceStr = (str) => {
     return str.replace(/_/g, '')
        .replace(/\(/g, '')
        .replace(/\)/g, '')
        .replace(/-/g, '');
}