const purchaseService = require("../services/purchaseService");
const logActivity = require("../utils/activityLogger");


// Create purchase
const createPurchase = async (req, res) => {

    try {

        const purchase =
            await purchaseService.createPurchase(
                req.body,
                req.user.id,
                req.storeId
            );


        await logActivity({

            user_id: req.user.id,

            action: "CREATE",

            module: "Purchases",

            description:
                `Created purchase ${purchase.purchaseId}`,

            ip_address: req.ip

        });


        res.status(201).json({

            success: true,

            message: "Purchase created successfully.",

            data: purchase

        });


    } catch (error) {

        res.status(400).json({

            success: false,

            message: error.message

        });

    }

};




// Get all purchases
const getPurchases = async (req, res) => {

    try {

        const purchases =
            await purchaseService.getPurchases(
                req.storeId
            );


        res.json({

            success: true,

            count: purchases.length,

            data: purchases

        });


    } catch (error) {

        res.status(500).json({

            success: false,

            message: error.message

        });

    }

};




// Get purchase by ID
const getPurchase = async (req, res) => {

    try {

        const purchase =
            await purchaseService.getPurchase(
                req.params.id,
                req.storeId
            );


        res.json({

            success: true,

            data: purchase

        });


    } catch (error) {

        res.status(404).json({

            success: false,

            message: error.message

        });

    }

};




// Update purchase
const updatePurchase = async (req, res) => {

    try {

        const purchase =
            await purchaseService.updatePurchase(
                req.params.id,
                req.body
            );


        await logActivity({

            user_id: req.user.id,

            action: "UPDATE",

            module: "Purchases",

            description:
                `Updated purchase ID ${req.params.id}`,

            ip_address: req.ip

        });


        res.json({

            success: true,

            message: "Purchase updated successfully.",

            data: purchase

        });


    } catch (error) {

        res.status(400).json({

            success: false,

            message: error.message

        });

    }

};




// Delete purchase
const deletePurchase = async (req, res) => {

    try {

        await purchaseService.deletePurchase(
            req.params.id
        );


        await logActivity({

            user_id: req.user.id,

            action: "DELETE",

            module: "Purchases",

            description:
                `Deleted purchase ID ${req.params.id}`,

            ip_address: req.ip

        });


        res.json({

            success: true,

            message: "Purchase deleted successfully."

        });


    } catch (error) {

        res.status(400).json({

            success: false,

            message: error.message

        });

    }

};




// Search purchases
const searchPurchases = async (req, res) => {

    try {

        const keyword =
            req.query.keyword || "";


        const purchases =
            await purchaseService.searchPurchases(
                keyword,
                req.storeId
            );


        res.json({

            success: true,

            count: purchases.length,

            data: purchases

        });


    } catch (error) {

        res.status(500).json({

            success: false,

            message: error.message

        });

    }

};




// Pagination
const getPurchasesPaginated = async (req, res) => {

    try {

        const page =
            Math.max(
                parseInt(req.query.page) || 1,
                1
            );


        const limit =
            Math.min(
                Math.max(
                    parseInt(req.query.limit) || 10,
                    1
                ),
                100
            );


        const result =
            await purchaseService.getPurchasesPaginated(
                page,
                limit,
                req.storeId
            );


        res.json({

            success: true,

            page,

            limit,

            total: result.total,

            totalPages:
                Math.ceil(
                    result.total / limit
                ),

            count:
                result.purchases.length,

            data:
                result.purchases

        });


    } catch (error) {

        res.status(500).json({

            success: false,

            message: error.message

        });

    }

};




// Purchase statistics
const getPurchaseStatistics = async (req, res) => {

    try {

        const stats =
            await purchaseService.getPurchaseStatistics(
                req.storeId
            );


        res.json({

            success: true,

            data: stats

        });


    } catch (error) {

        res.status(500).json({

            success: false,

            message: error.message

        });

    }

};



module.exports = {

    createPurchase,

    getPurchases,

    getPurchase,

    updatePurchase,

    deletePurchase,

    searchPurchases,

    getPurchasesPaginated,

    getPurchaseStatistics

};