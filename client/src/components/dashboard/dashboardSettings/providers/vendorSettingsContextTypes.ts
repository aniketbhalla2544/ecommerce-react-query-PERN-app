
import { FieldErrors, FieldValues, UseFormHandleSubmit, UseFormRegister } from "react-hook-form";
import { Vendor } from "../../../../types/vendor";

// global contextType for the VendorSettings page
type vendorSettingsState = {
    queryResponseData: Vendor | undefined; // TODO: FIX TYPE
      
    register:UseFormRegister<FieldValues>;
    handleSubmit: UseFormHandleSubmit<FieldValues, undefined>; 
    handleDelete : ()=> void;
    onSubmit : (data:updatedSettingsState)=> void;
    errors:FieldErrors<updatedSettingsState>;
};
 
export type updatedSettingsState = Partial<
  Pick<Vendor, 'email' | 'fullname' | 'isPremium' | 'vendorId' |'vendorSlug'>
>;





export type vendorSettingsStateContextType = {
    vendorSettingsQueryState: vendorSettingsState;
}