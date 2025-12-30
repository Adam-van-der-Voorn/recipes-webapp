import { useRef, useState } from "react";
import ValidChild from "../../types/ValidChild.ts";

type Callback<T> = (v: T) => void;

type openDialogParams<Input, Result> = {
  input?: Input;
  onClose?: (result: Result) => void;
};

type RenderProps<Input, Result> = {
  input: Input;
  confirm: (result: Result) => void;
  cancel: () => void;
};

export default function useModal<Input, Result>(
  render: (renderProps: RenderProps<Input, Result>) => ValidChild,
) {
  const inputRef = useRef<undefined | Input>();
  const onCloseRef = useRef<undefined | Callback<Result>>();

  const [modalIsOpen, setModalIsOpen] = useState(false);

  const openModal = ({ input, onClose }: openDialogParams<Input, Result>) => {
    if (input) {
      inputRef.current = input;
    }
    setModalIsOpen(true);
    onCloseRef.current = onClose;
  };

  const closeModal = () => {
    setModalIsOpen(false);
    inputRef.current = undefined;
    onCloseRef.current = undefined;
  };

  const confirm = (result: Result) => {
    onCloseRef.current!(result);
    closeModal();
  };

  let modal = null;
  if (modalIsOpen) {
    modal = render({ input: inputRef.current!, confirm, cancel: closeModal });
  }

  return { openModal, modal };
}
