import React from "react";

type ModalProps = {
  children: React.ReactNode;
  id: string;
  type: "primary" | "error";
  onClick: () => void;
  onClose: () => void;
  targetInput?: React.RefObject<HTMLInputElement | null>;
};
const Modal = React.forwardRef<HTMLDialogElement, ModalProps>((props, ref) => {
  const { children, id, type, onClick, onClose, targetInput } = props;
  const handleClose = () => {
    if (onClose) {
      onClose();
    }
  };

  return (
    <dialog id={id} className="modal" ref={ref}>
      <div className="modal-box">
        <h3 className="font-bold text-lg text-center">
          {children} Walkthrough
        </h3>
        <div className="modal-action">
          <form method="dialog" className="w-full justify-center">
            {type === "primary" ? (
              <input
                id="walkthroughName"
                type="text"
                ref={targetInput}
                placeholder="Type here"
                className="input input-bordered w-full"
              />
            ) : (
              <h4 className="text-center">
                Please confirm that you want to delete walkthrough
              </h4>
            )}
            <div className="container flex justify-center">
              <button
                className={`btn ${type === "primary" ? "btn-primary" : "btn-error"}  m-2`}
                type="button"
                onClick={() => {
                  onClick();
                  handleClose();
                }}
              >
                {children}
              </button>
              <button
                className={`btn ${type === "error" ? "btn-primary" : "btn-error"}  m-2`}
                onClick={handleClose}
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      </div>
    </dialog>
  );
});

Modal.displayName = "Modal";

export default Modal;
