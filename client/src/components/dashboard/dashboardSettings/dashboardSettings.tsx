import React from "react";
import useAppStore from "../../../stores/zustand/appStore";

const DashboardSettings = () => {

    let appState = useAppStore.getState();
    let [vendor, setVendor] = React.useState({ ...appState?.vendor });


    let handleOnChange = (e: any, key: string) => {
        setVendor({ ...vendor, [key]: e.target.value })
    }
    let handleSubmit = () => {

    }
    return <div className='py-20 px-10'>
        <h1 className='text-2xl font-bold mb-4'>Settings</h1>
        <div className="ml-10">
            <h1 className="font-bold text-xl "> Account Settings</h1>

            <div className="ml-5 mt-5 bg-white p-5  border border-s-4 border-s-blue-500 rounded-xl grid grid-cols-2  ">
                {/* {Object.keys(vendor).map((key: Key) => {
                    return <div key={key}>
                        <h1 className="font-small text-lg font-semibold flex" > {key.toString()} </h1>
                        <input className="p-2 mt-2 outline-blue-500 border-red-50 rounded-lg bg-white" disabled={isEditing} spellCheck="false" type="text" value={vendor[key as keyof object]} onChange={handleOnChange} />

                    </div>
                })} */}
                <span>
                    <h1 className="font-small text-lg  mt-1 font-semibold flex" >Full Name</h1>
                    <input className="p-2 mt-2 outline-gray-300  border border-black-50 rounded-lg bg-white" spellCheck="false" type="text" value={vendor.fullname} onChange={(e) => { handleOnChange(e, "fullname"); console.log(vendor) }} />
                </span>
                <span>
                    <h1 className="font-small text-lg  mt-1 font-semibold flex" >Email</h1>
                    <input className="p-2 mt-2 outline-gray-300  border border-black-50 rounded-lg bg-white" spellCheck="false" type="text" value={vendor.email} onChange={(e) => handleOnChange(e, "email")} />
                </span>
                <span>
                    <h1 className="font-small text-lg  mt-1 font-semibold flex" >Slug</h1>
                    <input className="p-2 mt-2 outline-gray-300  border border-black-50 rounded-lg bg-white" spellCheck="false" type="text" value={vendor.vendorSlug} onChange={(e) => handleOnChange(e, "vendorSlug")} />
                </span>
            </div>
            {JSON.stringify(appState.vendor) != JSON.stringify(vendor) ? <button
                type='submit'
                className='btn bg-blue-500 hover:bg-blue-600 ml-8 mt-5 text-white flex items-center justify-center gap-x-4'
                onClick={() => handleSubmit()}
            >Save</button> : null}
        </div>
    </div>
}


export default DashboardSettings;