import useAppStore from "../../../stores/zustand/appStore";

const DashboardSettings = () => {
    const data = useAppStore((state) => ({
        vendorName: state.vendor.fullname.trim(),
        vendorEmail: state.vendor.email,
    }));
    console.log(data)
    return <div className='py-20 px-10'>
        <h1 className='text-2xl font-bold mb-4'>Settings</h1>

    </div>
}


export default DashboardSettings;