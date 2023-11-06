import { createPortal } from 'react-dom';

type ThisProps = {
  showModal: boolean;
  children: React.ReactNode;
};

const Modal = ({ showModal, children }: ThisProps) => {
  return (
    <>
      {showModal &&
        createPortal(
          <div className='fixed top-0 right-0 bottom-0 left-0 bg-black/80 flex justify-center items-center'>
            {children}
          </div>,
          document.body
        )}
    </>
  );
};

export default Modal;
