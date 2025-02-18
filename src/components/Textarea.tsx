import {
    ClipboardEvent,
    ElementType,
    FC,
    FocusEvent,
    FormEvent,
    HTMLAttributes,
    isValidElement,
    KeyboardEvent,
    ReactNode,
    useEffect,
    useMemo,
    useRef,
    useState,
} from "react";
import classNames from "classnames";
import styles from "../styles.module.css";
import {
    parseContent,
    formatContent,
    extractText,
    clearElement,
    isEmptyMessage,
    pasteText,
    appendReactDOMElement,
    appendString,
} from "../utils";
import { useFocus, useCalcHeight } from "../hooks";
import { BUTTON_ID, TEXT_FIELD_ID, TEXTAREA_ID } from "../constants";

type Props = Partial<{
    Button: ElementType;
    defaultValue: string | ReactNode;
    onSend: (text: string) => void;
    minRows: number;
    maxRows: number;
    lineHeight: number;
    isClearOnSubmit: boolean;
    isButtonVisible: boolean;
    isLinkParse: boolean;
    beforeChange: (e: FormEvent<HTMLDivElement>) => void;
    afterChange: (e: FormEvent<HTMLDivElement>) => void;
    beforePaste: (e: ClipboardEvent<HTMLDivElement>) => void;
    afterPaste: (e: ClipboardEvent<HTMLDivElement>) => void;
    beforeFocus: (e: FocusEvent<HTMLDivElement>) => void;
    afterFocus: (e: FocusEvent<HTMLDivElement>) => void;
    beforeBlur: () => void;
    afterBlur: () => void;
    props: Omit<
        HTMLAttributes<HTMLDivElement>,
        "id" | "contentEditable" | "className" | "ref" | "style" | "onKeyDown" | "onInput" | "onPaste"
    >;
}>;

// todo: add max-length
// todo: add disable
export const Textarea: FC<Props> = ({
    onSend,
    Button,
    isButtonVisible,
    minRows = 1,
    maxRows = 5,
    lineHeight = 22,
    isClearOnSubmit = true,
    isLinkParse = true,
    props = {},
    defaultValue,
    beforeChange,
    afterChange,
    beforePaste,
    afterPaste,
    beforeFocus,
    afterFocus,
    beforeBlur,
    afterBlur,
}) => {
    const [text, setText] = useState("");

    const divRef = useRef<HTMLDivElement>(null);
    const textareaRef = useRef<HTMLTextAreaElement>(null);

    const { isFocus, onFocus, onBlur } = useFocus();
    const height = useCalcHeight(textareaRef.current, text, {
        minRows,
        maxRows,
        lineHeight,
    });

    const [isRender, setIsRender] = useState(false);
    useEffect(() => {
        if (!defaultValue) return;
        if (typeof defaultValue === "string") {
            appendString(divRef.current, defaultValue);
            setText(defaultValue);
        }
        if (isValidElement(defaultValue)) {
            appendReactDOMElement(divRef.current, defaultValue, isLinkParse);
            setIsRender(true);
        }
    }, [defaultValue, isLinkParse]);
    useEffect(() => {
        if (isRender) {
            setText(extractText(divRef.current));
            setIsRender(false);
        }
    }, [isRender]);

    const submit = () => {
        onSend?.(text);
        if (isClearOnSubmit) {
            clearElement(divRef.current);
            setText("");
        }
        onBlur();
    };

    const handleKeyPress = (e: KeyboardEvent<HTMLDivElement>) => {
        if ((e.code === "Enter" || e.code === "NumpadEnter") && e.ctrlKey) {
            submit();
        }
    };
    const handleChange = (e: FormEvent<HTMLDivElement>) => {
        beforeChange?.(e);
        setText(extractText(e.target as HTMLDivElement));
        afterChange?.(e);
    };
    const handlePaste = (e: ClipboardEvent<HTMLDivElement>) => {
        beforePaste?.(e);
        e.preventDefault();
        pasteText(e);
        setText(extractText(divRef.current));
        afterPaste?.(e);
    };
    const handleFocus = (e: FocusEvent<HTMLDivElement>) => {
        beforeFocus?.(e);
        if (e.target instanceof HTMLAnchorElement) return;
        parseContent(divRef.current);
        onFocus();
        afterFocus?.(e);
    };
    const handleBlur = () => {
        setTimeout(() => {
            beforeBlur?.();
            formatContent(divRef.current, text, isLinkParse);
            onBlur();
            afterBlur?.();
        }, 5);
    };

    const _isButtonVisible = useMemo(() => isButtonVisible ?? !isEmptyMessage(text), [isButtonVisible, text]);

    return (
        <div
            id={TEXTAREA_ID}
            className={classNames(styles.textarea, {
                [styles.focusTextarea]: isFocus,
            })}
            onFocus={handleFocus}
            onBlur={handleBlur}
            style={{ height: `${height}px` }}
        >
            {_isButtonVisible ? (
                <button type="submit" id={BUTTON_ID} className={styles.sendButton} onClick={submit}>
                    {Button ? <Button /> : "Send"}
                </button>
            ) : null}
            <div
                aria-multiline
                role="textbox"
                placeholder="Введите текст..."
                {...props}
                contentEditable
                id={TEXT_FIELD_ID}
                className={styles.textField}
                ref={divRef}
                style={{ height: `${height}px` }}
                onKeyDown={handleKeyPress}
                onInput={handleChange}
                onPaste={handlePaste}
            />
            <textarea ref={textareaRef} className={classNames(styles.textField, styles.helperTextField)} />
        </div>
    );
};
