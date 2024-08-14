"use client";

import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import modalStyles from "./modal.module.scss";
import { ButtonSimple } from "@/app/components/Button/Button";
import Panel from "@/app/components/Panel/Panel";

const Modal = ({
  children,
  title,
  isOpen,
  onClose,
  setOpened,
}: {
  children: React.ReactNode;
  title?: React.ReactNode;
  isOpen: boolean;
  onClose?: () => void;
  setOpened: (isOpened: boolean) => void;
}): JSX.Element | null => {
  const modalRef = useRef<HTMLDialogElement | null>(null);
  const [containerEl, setContainerEl] = useState<HTMLElement | null>(null);

  const handleClose = () => {
    if (onClose) {
      onClose();
    }
    setOpened(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLDialogElement>) => {
    if (e.key === "Escape") {
      handleClose();
    }
  };

  const handleOutsideClick = (e: React.MouseEvent<HTMLDialogElement>) => {
    const modalEl = modalRef.current;

    if (modalEl) {
      const rect = modalEl.getBoundingClientRect();

      if (
        rect.left > e.clientX ||
        rect.right < e.clientX ||
        rect.top > e.clientY ||
        rect.bottom < e.clientY
      ) {
        handleClose();
      }
    }
  };

  useEffect(() => {
    setContainerEl(typeof window !== "undefined" ? document.body : null);
  }, []);

  useEffect(() => {
    const modalEl = modalRef.current;

    if (modalEl) {
      if (isOpen) {
        modalEl.showModal();
      } else {
        modalEl.close();
      }
    }
  }, [isOpen]);

  const headContent = () => (
    <>
      {title && <h3>{title}</h3>}
      <ButtonSimple onClick={handleClose}>❌</ButtonSimple>
    </>
  );

  return containerEl ? (
    <>
      {createPortal(
        <dialog
          ref={modalRef}
          onKeyDown={handleKeyDown}
          className={modalStyles.modal}
          onClick={handleOutsideClick}
          aria-hidden={!isOpen}
        >
          <Panel headContent={headContent()} bodyContent={children} />
        </dialog>,
        containerEl
      )}
    </>
  ) : null;
};

export default Modal;
