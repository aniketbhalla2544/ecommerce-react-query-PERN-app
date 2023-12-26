import VendorSettingsProvider from "./providers/VendorSettingsProvider";
import useVendroSettingsContext from "./hooks/useVendorSettingsContext";
import { useState } from "react";
import { PiWarningLight } from "react-icons/pi";
import Modal from "../../utils/Modal";

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
        handleDelete,
        register,
        onSubmit,
        errors
    } = useVendroSettingsContext();

    const vendor = queryResponseData;
    const [isDeleting, setIsDeleting] = useState(false)

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
                    <span>
                        <h1 className="font-small text-lg  mt-1 font-semibold flex">Account Deletion</h1>
                        <button
                            type="button"
                            onClick={() => setIsDeleting(true)}
                            className="p-2 mt-2 text-white  border border-black-50 rounded-lg bg-red-600 hover:bg-red-500gt  transition duration-300 ease-in-out "

                        >Delete Account</button>
                    </span>
                    <Modal showModal={isDeleting}>
                        <div className='rounded-lg bg-white opacity-100 overflow-hidden'>
                            <div className='flex gap-x-4 px-16 pt-8 pb-6'>
                                <div className='flex-center p-2 rounded-full w-10 h-10 bg-red-200 text-red-600 text-6xl font-bold'>
                                    <PiWarningLight />
                                </div>
                                <div>
                                    <p className='font-semibold mb-2'>Delete product with slug :  {vendor?.vendorSlug}?</p>
                                    <p className='text-gray-500 max-w-[40ch] text-sm'>
                                        Are you sure you want to delete your account ? also all products will be deleted ! This action cannot be undone.
                                    </p>
                                </div>
                            </div>
                            {/* ----- actions ---------- */}
                            <div className='px-6 py-4 bg-gray-50'>
                                <div className='flex justify-end items-center gap-x-4 text-sm'>
                                    <button
                                        onClick={() => setIsDeleting(false)}
                                        className='font-semibold px-4 py-2 rounded-[6px] bg-white border-gray-200 border-2 hover:bg-gray-50 disabled:opacity-60 disabled:cursor-not-allowed'
                                    >
                                        Cancel
                                    </button>
                                    <button

                                        onClick={() => { handleDelete(); setIsDeleting(false) }}
                                        className='flex gap-x-3 font-semibold px-4 py-2 rounded-[6px] bg-red-600 text-white hover:bg-red-500 disabled:opacity-60 disabled:cursor-not-allowed'
                                    >
                                        Delete

                                    </button>
                                </div>
                            </div>
                        </div>
                    </Modal>
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
