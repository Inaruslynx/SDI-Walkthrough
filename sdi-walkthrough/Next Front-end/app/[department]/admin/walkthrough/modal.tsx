type ModalProps = {
  children: React.ReactNode;
  id: string;
  type: 'primary' | 'error';
  onClick: (e: any) => void;
  target?: string
};
export default function Modal({ children, id, type, onClick, target }: ModalProps) {
  return (
    <dialog id={id} className="modal">
      <div className="modal-box">
        <h3 className="font-bold text-lg text-center">{children} Walkthrough</h3>
        <div className="modal-action">
          <form method="dialog" className="w-full justify-center">
            {type === 'primary' ? <input
              id="walkthroughName"
              type="text"
              placeholder="Type here"
              className="input input-bordered w-full"
            /> : <h4 className="text-center">Please confirm that you want to delete {target} walkthrough</h4>}
            <div className="container flex justify-center">
              <button
                className={`btn ${type === 'primary' ? 'btn-primary' : 'btn-error'}  m-2`}
                type="button"
                onClick={onClick}
              >
                {children}
              </button>
              <button className={`btn ${type === 'error' ? 'btn-primary' : 'btn-error' }  m-2`}>Cancel</button>
            </div>
          </form>
        </div>
      </div>
    </dialog>
  );
}
