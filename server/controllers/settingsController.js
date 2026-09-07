const settingsService =
    require("../services/settingsService");

const logActivity =
    require("../utils/activityLogger");


/*
|--------------------------------------------------------------------------
| Get Settings
|--------------------------------------------------------------------------
*/

const getSettings = async (req, res) => {

    try {

        const settings =
            await settingsService.getSettings(
                req.storeId
            );

        return res.status(200).json({
            success: true,
            data: settings
        });

    } catch (error) {

        return res.status(500).json({
            success: false,
            message: error.message
        });

    }
};


/*
|--------------------------------------------------------------------------
| Save Settings
|--------------------------------------------------------------------------
*/

const saveSettings = async (req, res) => {

    try {

        const settings =
            await settingsService.saveSettings(
                req.body,
                req.storeId
            );

        await logActivity({
            user_id: req.user.id,
            action: "UPDATE",
            module: "Settings",
            description: "Updated store settings",
            ip_address: req.ip
        });

        return res.status(200).json({
            success: true,
            message: "Settings saved successfully.",
            data: settings
        });

    } catch (error) {

        return res.status(500).json({
            success: false,
            message: error.message
        });

    }
};


module.exports = {
    getSettings,
    saveSettings
};