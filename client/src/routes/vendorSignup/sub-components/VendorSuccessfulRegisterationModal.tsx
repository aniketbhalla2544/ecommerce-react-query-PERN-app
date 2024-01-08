import Modal from '../../../components/utils/Modal';
import clebImg from '../../../assets/celeberation-cone.gif';
import { useNavigate } from 'react-router-dom';
import appRoutes from '../../../constants/app.routes';

const CELEBERATION_IMG_SIZE = 150;

type ThisProps = {
  showModal: boolean;
};

const VendorSuccessfulRegisterationModal = ({ showModal }: ThisProps) => {
  const navigate = useNavigate();

  const handleSignInBtnClick = () => {
    navigate(appRoutes.SIGNIN, {
      replace: true,
    });
  };

  return (
    <Modal showModal={showModal}>
      <div className='w-[400px]  bg-white rounded-xl overflow-hidden'>
        <div className='px-10 py-8 bg-green-300 h-[200px] flex justify-center items-center'>
          <img
            src={clebImg}
            alt='celeberation-img'
            width={CELEBERATION_IMG_SIZE}
            height={CELEBERATION_IMG_SIZE}
          />
        </div>
        {/* ---------------- body */}
        <div className='h-full relative min-h-[150px] py-12 flex flex-col gap-y-10 justify-center items-center'>
          <p className='text-base text-center'>Vendor successfully registered 🙂</p>
          <button
            onClick={handleSignInBtnClick}
            className='block bg-green-500 hover:bg-green-600 rounded-md px-5 py-2 text-white'
          >
            Sign In
          </button>
        </div>
      </div>
    </Modal>
  );
};

export default VendorSuccessfulRegisterationModal;
