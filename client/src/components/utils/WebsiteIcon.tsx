import { FaOpencart } from 'react-icons/fa';

type ThisProps = {
  textSize?: string;
};

const WebsiteIcon = ({ textSize = 'text-3xl' }: ThisProps) => {
  return (
    <h1
      className={`flex items-center gap-x-2 flex-wrap text-2xl ${textSize} font-bold text-blue-500`}
    >
      Vendor Dashboard
      <span>
        <FaOpencart />
      </span>
    </h1>
  );
};

export default WebsiteIcon;
