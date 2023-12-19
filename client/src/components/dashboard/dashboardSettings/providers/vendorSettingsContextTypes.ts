
import { FieldValues, UseFormHandleSubmit, UseFormRegister } from "react-hook-form";
import { Vendor } from "../../../../types/vendor";

// global contextType for the VendorSettings page
type vendorSettingsState = {
    queryResponseData: Vendor | undefined; // TODO: FIX TYPE
    isPending: boolean;
    isError: boolean;
    error: Error | null;
    // handleChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElem ent>) => void;
    // handleSubmit: () => void;
    handleChange: UseFormRegister<FieldValues>;
    handleSubmit:UseFormHandleSubmit<FieldValues, undefined>;
    onSubmit: (data:any) =>void;
    isChanged: boolean;
} & {};
 
export type updatedSettingsState = Partial<
  Pick<Vendor, 'email' | 'fullname' | 'isPremium' | 'vendorId' |'vendorSlug'>
>;





export type vendorSettingsStateContextType = {
    vendorSettingsQueryState: vendorSettingsState;
}