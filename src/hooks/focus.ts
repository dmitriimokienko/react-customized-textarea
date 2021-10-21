import { useCallback, useState } from "react";

export const useFocus = () => {
  const [isFocus, setIsFocus] = useState<boolean>(false);
  const [isTouched, setIsTouched] = useState<boolean>(false);

  const onFocus = useCallback(() => {
    setIsFocus(true);
    setIsTouched(true);
  }, []);

  const onBlur = useCallback(() => {
    setIsFocus(false);
  }, []);

  return { isFocus, isTouched, onFocus, onBlur };
};
