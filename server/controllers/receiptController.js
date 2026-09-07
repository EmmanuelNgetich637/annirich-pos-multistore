const receiptService =
    require("../services/receiptService");


/*
|--------------------------------------------------------------------------
| Get Receipt By Sale ID
|--------------------------------------------------------------------------
*/

const getReceiptBySaleId = async (
    req,
    res,
    next
) => {

    try {

        const receipt =
            await receiptService.getReceiptBySaleId(
                req.params.saleId,
                req.storeId
            );

        res.status(200).json({
            success: true,
            data: receipt
        });

    } catch (error) {

        next(error);

    }

};


module.exports = {
    getReceiptBySaleId
};