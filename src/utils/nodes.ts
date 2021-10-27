import styles from "../styles.module.css";

export const createLinkNode = (url: string, isLast: boolean) => {
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("target", "_blank");
    link.setAttribute("contenteditable", "false");
    // todo: add custom
    link.className = styles.textFieldLink;
    link.innerHTML = isLast ? url : `${url} `;
    return link;
};

export const createTextNode = (text: string, isLast: boolean) => {
    if (text === "\n") {
        return document.createElement("br");
    }
    return document.createTextNode(isLast ? text : `${text} `);
};

export const isInline = (tag: string) => {
    return tag === "SPAN" || tag === "#text" || tag === "A";
};

export const getNodeText = (node: Node | HTMLElement) => {
    if (node instanceof HTMLElement) {
        return node.innerText || "";
    }
    return node.textContent || "";
};

export const createContentLineWrapper = (nodeName: string): HTMLElement => {
    if (nodeName === "#text") {
        return document.createElement("span");
    }
    const tag = nodeName.toLowerCase();
    return document.createElement(tag);
};

export const clearElement = (element: HTMLElement | null) => {
    if (!element) return "";
    element.innerHTML = "";
};
