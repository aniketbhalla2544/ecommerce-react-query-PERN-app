import React from "react";
import { VendorSettingsContext } from "../providers/VendorSettingsProvider";
import { logger } from "../../../../utils/logger";


const useVendroSettingsContext = () => {
    const vendorSettings = React.useContext(VendorSettingsContext);
    if (!vendorSettings) {
        logger.error('paginatedProductsContext must be used inside of the provider.');
        throw new Error('app internal error');
    }

    return vendorSettings.vendorSettingsQueryState;
};

export default useVendroSettingsContext;