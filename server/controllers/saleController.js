const saleService = require("../services/saleService");

const logActivity =
    require("../utils/activityLogger");


// CREATE SALE
const createSale = async (req, res) => {

    try {

        const sale =
            await saleService.createSale(
                req.body,
                req.user.id,
                req.storeId
            );


        await logActivity({

            user_id: req.user.id,

            action: "CREATE",

            module: "Sales",

            description:
                `Created sale ${sale.saleId}`,

            ip_address: req.ip

        });


        res.status(201).json({

            success: true,

            message:
                "Sale created successfully.",

            data: sale

        });


    } catch (error) {

        res.status(400).json({

            success: false,

            message: error.message

        });

    }

};


// GET ALL SALES
const getSales = async (req, res) => {

    try {

        const sales =
            await saleService.getSales(
                req.storeId
            );


        res.json({

            success: true,

            count: sales.length,

            data: sales

        });


    } catch (error) {

        res.status(500).json({

            success: false,

            message: error.message

        });

    }

};


// GET SALE BY ID
const getSale = async (req, res) => {

    try {

        const sale =
            await saleService.getSale(
                req.params.id,
                req.storeId
            );


        res.json({

            success: true,

            data: sale

        });


    } catch (error) {

        res.status(404).json({

            success: false,

            message: error.message

        });

    }

};


// SEARCH SALES
const searchSales = async (req, res) => {

    try {

        const keyword =
            req.query.keyword || "";


        const sales =
            await saleService.searchSales(
                keyword,
                req.storeId
            );


        res.json({

            success: true,

            count: sales.length,

            data: sales

        });


    } catch (error) {

        res.status(500).json({

            success: false,

            message: error.message

        });

    }

};


// PAGINATION
const getSalesPaginated =
async (req, res) => {

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
            await saleService.getSalesPaginated(
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
                result.sales.length,

            data:
                result.sales

        });

    } catch (error) {

        res.status(500).json({

            success: false,

            message: error.message

        });

    }

};


// STATISTICS
const getSaleStatistics =
async (req, res) => {

    try {

        const stats =
            await saleService.getSaleStatistics(
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

    createSale,

    getSales,

    getSale,

    searchSales,

    getSalesPaginated,

    getSaleStatistics

};
