
import { Vendor } from "../../../../types/vendor";

// global contextType for the VendorSettings page
type vendorSettingsState = {
    queryResponseData: Vendor | undefined; // TODO: FIX TYPE
    isPending: boolean;
    isError: boolean;
    error: Error | null;
    handleChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
    handleSubmit: () => void;
    isChanged: boolean;
} & {};

export type vendorSettingsStateContextType = {
    vendorSettingsQueryState: vendorSettingsState;
}