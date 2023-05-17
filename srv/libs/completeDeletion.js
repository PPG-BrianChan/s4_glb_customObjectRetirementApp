module.exports = async function (req, customObject) {
    try {
        const query_getData = SELECT.one.from(customObject).columns('objectName', 'status_code').where({ ID: req.params[0].ID })
        const getResult = await cds.run(query_getData);

        if (getResult !== null) {
            if (getResult.status_code !== 'A') {
                throw new Error(`Error when completing object deletion ${getResult.objectName}: Not allowed due to status`)
            } else {
                const query_releaseOrder = UPDATE(customObject, { ID: req.params[0].ID }).set({ status_code: 'D' });
                const updateResult = await cds.run(query_releaseOrder);
                console.log("Deletion status updated successfully");
            }
        }
    } catch (error) {
        console.log(error.message)
        return req.error ({
            code: "INVALID_STATUS",
            message: error.message,
            status: 502
          })
    }
}