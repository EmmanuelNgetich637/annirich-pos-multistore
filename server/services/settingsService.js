const Settings = require("../models/settingsModel");

/*
|--------------------------------------------------------------------------
| Get Settings
|--------------------------------------------------------------------------
*/

const getSettings = async (storeId) => {

    return await Settings.getSettings(storeId);

};


/*
|--------------------------------------------------------------------------
| Save Settings
|--------------------------------------------------------------------------
*/

const saveSettings = async (data, storeId) => {

    const existingSettings =
        await Settings.getSettings(storeId);

    if (!existingSettings) {

        await Settings.createSettings(
            data,
            storeId
        );

    } else {

        await Settings.updateSettings(
            data,
            storeId
        );

    }

    return await Settings.getSettings(storeId);
};


module.exports = {
    getSettings,
    saveSettings
};