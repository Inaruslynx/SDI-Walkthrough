import { StringToBoolean } from "class-variance-authority/types";

type ModalProps = {
  children: React.ReactNode;
  id: string;
  onClick: (e: any) => void;
};
export default function Modal({ children, id, onClick }: ModalProps) {
  return (
    <dialog id={id} className="modal">
      <div className="modal-box">
        <h3 className="font-bold text-lg text-center">Name New Walkthrough</h3>
        <div className="modal-action">
          <form method="dialog" className="w-full justify-center">
            <input
              id="walkthroughName"
              type="text"
              placeholder="Type here"
              className="input input-bordered w-full"
            />
            <div className="container flex justify-center">
              <button
                className="btn btn-primary m-2"
                type="button"
                onClick={onClick}
              >
                {children}
              </button>
              <button className="btn btn-error m-2">Cancel</button>
            </div>
          </form>
        </div>
      </div>
    </dialog>
  );
}
