import { ClipboardEvent, DOMAttributes, DOMElement, ReactNode } from "react";
import ReactDOM from "react-dom";
import { TEXT_FIELD_ID } from "../constants";
import { formatTextLiterals, isEmptyMessage, isMatchUrl, splitBy } from "./common";
import { clearElement, createContentLineWrapper, createLinkNode, createTextNode, getNodeText, isInline } from "./nodes";

declare global {
    interface Window {
        clipboardData?: DataTransfer;
    }
}

export const pasteText = (e: ClipboardEvent<HTMLDivElement>) => {
    const clipboardData = e.clipboardData || window.clipboardData;
    const paste = formatTextLiterals(clipboardData?.getData("text") ?? "");
    const selection = window.getSelection();
    if (!selection) return;
    selection.deleteFromDocument();
    const span = document.createElement("span");
    span.innerText = paste;
    selection.getRangeAt(0).insertNode(span);
    selection.collapseToEnd();
};

export const extractText = (content: HTMLDivElement | null) => {
    if (!content) return "";
    const messageLines: string[] = [];
    content.childNodes.forEach((node, i, arr) => {
        const text = formatTextLiterals(getNodeText(node));
        if (text !== "\n") {
            messageLines.push(text);
        }
        if (isInline(node.nodeName) && isInline(arr[i + 1]?.nodeName)) {
            return;
        }
        if (i !== arr.length - 1) {
            messageLines.push("\n");
        }
    });
    return messageLines.join("");
};

export const formatContent = (content: HTMLDivElement | null, message: string, isLinkParse: boolean) => {
    if (!content) return;
    if (isEmptyMessage(message)) {
        clearElement(content);
        return;
    }
    const nodes: HTMLElement[] = [];
    content.childNodes.forEach((line) => {
        const lineParts = splitBy(getNodeText(line)).map((part, i, arr) =>
            isLinkParse && isMatchUrl(part)
                ? createLinkNode(part, i === arr.length - 1)
                : createTextNode(part, i === arr.length - 1)
        );
        const wrapper = createContentLineWrapper(line.nodeName);
        wrapper.append(...lineParts);
        nodes.push(wrapper);
    });
    clearElement(content);
    content.append(...nodes);
};

export const parseContent = (content: HTMLDivElement | null) => {
    if (!content) return;
    const links = content.querySelectorAll("a");
    links?.forEach((link) => {
        link.replaceWith(document.createTextNode(link.innerText));
    });
};

export const appendString = (content: HTMLDivElement | null, text: string) => {
    if (!content) return "";
    content.append(...[createTextNode(text, false)]);
    return text;
};

export const appendReactDOMElement = (content: HTMLDivElement | null, element: ReactNode, isLinkParse: boolean) => {
    let text = "";
    if (!content) return text;
    ReactDOM.render(
        element as DOMElement<DOMAttributes<Element>, Element>,
        document.getElementById(TEXT_FIELD_ID),
        () => {
            text = extractText(content);
            formatContent(content, text, isLinkParse);
        }
    );
    return text;
};
