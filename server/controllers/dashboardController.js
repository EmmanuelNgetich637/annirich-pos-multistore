const dashboardService =
    require("../services/dashboardService");


/*
|--------------------------------------------------------------------------
| Dashboard
|--------------------------------------------------------------------------
*/

const getDashboard = async (req, res) => {

    try {

        const data =
            await dashboardService.getDashboard(
                req.storeId
            );

        return res.status(200).json({

            success: true,

            data

        });

    } catch (error) {

        console.error(error);

        return res.status(500).json({

            success: false,

            message: error.message

        });

    }

};


module.exports = {

    getDashboard

};