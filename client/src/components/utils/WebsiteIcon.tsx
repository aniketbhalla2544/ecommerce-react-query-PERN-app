import { FaOpencart } from 'react-icons/fa';

type ThisProps = {
  textSize?: string;
};

const WebsiteIcon = ({ textSize = 'text-2xl' }: ThisProps) => {
  return (
    <h1
      className={`flex items-center gap-x-2 flex-wrap ${textSize} font-bold text-blue-500`}
    >
      EcomVendorWeb
      <span>
        <FaOpencart />
      </span>
    </h1>
  );
};

export default WebsiteIcon;
