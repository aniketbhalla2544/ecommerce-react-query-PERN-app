import React, { useEffect } from "react"
import { updatedSettingsState, vendorSettingsStateContextType } from "./vendorSettingsContextTypes"
import { useQuery } from "@tanstack/react-query";
import { getVendor, updateVendor } from "../../../../api/vendor";
import { Vendor } from "../../../../types/vendor";
import toast from "react-hot-toast";

export const VendorSettingsContext = React.createContext<vendorSettingsStateContextType | null>(null);
// provider for vendros setting page
const VendorSettingsProvider = ({ children }: Record<"children", React.ReactNode>) => {
    //  states for just changed fields insted of updating all the vendor settings
    const [changedFields, setChangedFields] = React.useState<updatedSettingsState>({})
    // vendor profile data from DB 
    const {
        data: queryResponseData,
        isPending,
        isError,
        error,
    } = useQuery({ queryKey: [], queryFn: () => getVendor() });

    // used useState to update changes
    const [vendorData, setVendorData] = React.useState<Vendor | undefined>(queryResponseData);
    // will help to conditionalRendering of save button 
    const [isChanged, setIsChanged] = React.useState<boolean>(false);

    // to update the UI after promiss resolve and got the data 
    useEffect(() => {
        setVendorData(queryResponseData)
    }, [queryResponseData])
    // separate for isChanged due to synchronous behaviour of usestate 
    useEffect(() => {
        setIsChanged(JSON.stringify(vendorData) === JSON.stringify(queryResponseData) ? false : true);
    }, [vendorData])

    // to update the profile data from UI  
    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        e.preventDefault();

        setVendorData((prevVendorData) => ({
            ...prevVendorData,
            [e.target.name]: e.target.value,
        } as Vendor));
        setChangedFields({ ...changedFields, [e.target.name]: e.target.value, })
    }
    // to update the profile data in DB  
    const handleSubmit = async () => {
        const res = await updateVendor(changedFields)

        if (res.success)
            toast("Settings updated ! ✅")
        else
            toast("Something went wrong ! ❌")
        // to remove save button 
        setIsChanged(false)
        setChangedFields({})
    }

    // 
    return <VendorSettingsContext.Provider
        value={{
            vendorSettingsQueryState: {
                isError, isPending, queryResponseData: vendorData, error, isChanged,
                handleSubmit,
                handleChange
            },

        }}
    >
        {children}
    </VendorSettingsContext.Provider >
}

export default VendorSettingsProvider;