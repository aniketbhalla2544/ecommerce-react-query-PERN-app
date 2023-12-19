import VendorSettingsProvider from "./providers/VendorSettingsProvider";
import useVendroSettingsContext from "./hooks/useVendorSettingsContext";

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
        handleSubmit,
        register,
        onSubmit,
        errors
    } = useVendroSettingsContext();

    const vendor = queryResponseData;

    return (
        <form onSubmit={handleSubmit(onSubmit)}>
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
                            defaultValue={vendor?.fullname || ""}
                            {...register("fullname")}
                        />
                        <p className="text-red-600 p-3"> {errors?.fullname ? errors.fullname.message : null} </p>
                    </span>
                    <span>
                        <h1 className="font-small text-lg  mt-1 font-semibold flex">Email</h1>
                        <input
                            className="p-2 mt-2 outline-gray-300  border border-black-50 rounded-lg bg-white"
                            spellCheck="false"
                            type="text"
                            defaultValue={vendor?.email || ""}
                            {...register("email", { pattern: /^\S+@\S+$/i })}

                        />
                        <p className="text-red-600 p-3"> {errors?.email ? errors.email.message : null} </p>
                    </span>
                    <span>
                        <h1 className="font-small text-lg  mt-1 font-semibold flex">Slug</h1>
                        <input
                            className="p-2 mt-2 outline-gray-300  border border-black-50 rounded-lg bg-white"
                            spellCheck="false"
                            type="text"
                            defaultValue={vendor?.vendorSlug || ""}
                            {...register("vendorSlug")}
                        />
                        <p className="text-red-600 p-3"> {errors?.vendorSlug ? errors.vendorSlug.message : null} </p>
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
                <input type="submit" className="btn bg-blue-500 hover:bg-blue-600 ml-8 mt-5 text-white flex items-center justify-center gap-x-4" value="Save" />
            </div>
        </form>
    );
};

export default DashboardVendorSettings;
