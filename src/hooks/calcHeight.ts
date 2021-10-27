import { useEffect, useState } from "react";

const DEFAULT_HEIGHT = 24;

export const useCalcHeight = (
    textArea: HTMLTextAreaElement | null,
    message: string,
    config: {
        minRows: number;
        maxRows: number;
        lineHeight: number;
    }
) => {
    const [height, setHeight] = useState<number>(DEFAULT_HEIGHT);

    const calcHeight = (scrollHeight: number) => {
        const { minRows, maxRows, lineHeight } = config;
        const minHeight = lineHeight * minRows;
        if (scrollHeight < minHeight) {
            return minHeight;
        }
        const maxHeight = lineHeight * maxRows;
        if (scrollHeight > maxHeight) {
            return maxHeight;
        }
        return scrollHeight;
    };

    useEffect(() => {
        if (!textArea) {
            setHeight(DEFAULT_HEIGHT);
            return;
        }
        textArea.value = message;
        const currentHeight = calcHeight(textArea.scrollHeight);
        if (currentHeight !== height) {
            setHeight(currentHeight);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [message]);

    return height;
};
