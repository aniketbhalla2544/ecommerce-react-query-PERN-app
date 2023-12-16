import VendorSettingsProvider from "./providers/VendorSettingsProvider";
import useVendroSettingsContext from "./hooks/useVendorSettingsContext";
import Spinner from "../../utils/Spinner";
import { logger } from "../../../utils/logger";

const DashboardVendorSettings = () => {
    return (
        <VendorSettingsProvider>
            <div className="py-20 px-10">
                <h1 className="text-2xl font-bold mb-4">Settings</h1>
                <DashboardSettings />
            </div>
        </VendorSettingsProvider>
    );
};

const DashboardSettings = () => {
    const {
        queryResponseData,
        isError,
        isPending,
        error,
        isChanged,
        handleSubmit,
        handleChange,
    } = useVendroSettingsContext();

    if (isPending) return <Spinner />;
    if (isError) {
        logger.error("Error while while fetching data: ", error?.message);
        return <h3 className="font-bold text-xl">🔴 Error loading profile.</h3>;
    }

    const vendor = queryResponseData;

    return (
        <div className="ml-10">
            <h1 className="font-bold text-lg "> Account and Security Settings</h1>

            <div className="ml-5 mt-5 bg-white p-5  border border-s-4 border-s-blue-500 rounded-xl grid grid-cols-2  ">
                <span>
                    <h1 className="font-small text-lg  mt-1 font-semibold flex">
                        Full Name
                    </h1>
                    <input
                        className="p-2 mt-2 outline-gray-300  border border-black-50 rounded-lg bg-white"
                        spellCheck="false"
                        type="text"
                        value={vendor?.fullname || ""}
                        name="fullname"
                        onChange={(e) => handleChange(e)}
                    />
                </span>
                <span>
                    <h1 className="font-small text-lg  mt-1 font-semibold flex">Email</h1>
                    <input
                        className="p-2 mt-2 outline-gray-300  border border-black-50 rounded-lg bg-white"
                        spellCheck="false"
                        type="text"
                        value={vendor?.email || ""}
                        name="email"
                        onChange={(e) => handleChange(e)}
                    />
                </span>
                <span>
                    <h1 className="font-small text-lg  mt-1 font-semibold flex">Slug</h1>
                    <input
                        className="p-2 mt-2 outline-gray-300  border border-black-50 rounded-lg bg-white"
                        spellCheck="false"
                        type="text"
                        value={vendor?.vendorSlug || ""}
                        name="vendorSlug"
                        onChange={(e) => handleChange(e)}
                    />
                </span>
            </div>
            <h1 className="font-bold text-lg mt-5"> Customizations  </h1>

            <div className="ml-5 mt-5 bg-white p-5  border border-s-4 border-s-blue-500 rounded-xl grid grid-cols-2  ">
                <span>
                    <h1 className="font-small text-lg  mt-1 font-semibold flex">
                        in progress
                    </h1>
                </span>
            </div>
            <h1 className="font-bold text-lg mt-5"> Product Management Settings </h1>

            <div className="ml-5 mt-5 bg-white p-5  border border-s-4 border-s-blue-500 rounded-xl grid grid-cols-2  ">
                <span>
                    <h1 className="font-small text-lg  mt-1 font-semibold flex">
                        in progress
                    </h1>
                </span>
            </div>
            {/* will show the buuton only if the changes are made */}
            {isChanged ? (
                <button
                    type="submit"
                    className="btn bg-blue-500 hover:bg-blue-600 ml-8 mt-5 text-white flex items-center justify-center gap-x-4"
                    onClick={() => handleSubmit()}
                >
                    Save
                </button>
            ) : null}
        </div>
    );
};

export default DashboardVendorSettings;
