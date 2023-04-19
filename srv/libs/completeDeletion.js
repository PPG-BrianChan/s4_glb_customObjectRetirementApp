module.exports = async function (req, customObject) {
    try {
        const query_getData = SELECT.one.from(customObject).columns('objectName', 'status_code').where({ ID: req.params[0].ID })
        const getResult = await cds.run(query_getData);

        if (getResult !== null) {
            if (getResult.status_code !== 'A') {
                req.error(`Error when completing object deletion ${getResult.objectName}: Not allowed due to status`)
            } else {
                const query_releaseOrder = UPDATE(customObject, { ID: req.params[0].ID }).set({ status_code: 'D' });
                const updateResult = await cds.run(query_releaseOrder);
            }
        }
    } catch (error) {
        console.log(error.message)
    }
}