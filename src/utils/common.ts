// TODO: find regexp
export const isMatchUrl = (str: string) => {
    // eslint-disable-next-line no-useless-escape
    return /https?:\/\/[a-zA-Z0-9:\.\-\/]+/.test(str);
};

export const formatTextLiterals = (str: string) => str.replace(/\r(\n)?/g, "\n");

export const splitBy = (str: string, separator: string | RegExp = /[^\S\r\n]/) =>
    formatTextLiterals(str).replace(/\n/g, " \n ").split(separator);

export const isEmptyMessage = (message: string) => !message.replace(/\n|\s/g, "");
