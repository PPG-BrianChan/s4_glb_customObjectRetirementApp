const definitionId = "eu10.crossfunctional-dev-56c89xus.customobjectretirementprocess.customObjectRetirementApprovalProcess"
const { executeHttpRequest } = require('@sap-cloud-sdk/core');

module.exports = async function (req,entity) {
    console.log("Executing SBPA");
    
    const payload = {
        "definitionId": definitionId,
        "context": {
            "objecttype": req.objectType,
            "objectname": req.objectName,
            "abappackage": req.abapPackage,
            "lastrundate": req.lastRunDate,
            "lastrunuser": req.lastRunUser,
            "approveremail": req.approverEmail,
            "approvalsubject": `Approval Request - ${req.objectName}`,
            "const_approve": "Approve",
            "const_reject": "Reject",
            "objectguid": req.ID
        }
    }
    try {
        const result = await executeHttpRequest(
            {
                destinationName: 'SBPA-Process_Trigger_Destination'
            },
            {
                method: 'POST',
                data: payload,
                headers: {
                    'content-type': 'application/json'
                }
            }
        )

        await _updateStatus(req.ID,entity);
        console.log('Success:', result.data)
    } catch (error) {
        console.log(error.message)
    }
}

async function _updateStatus(ID,entity) {
    let setStatus = 'S';
    const updateQuery = UPDATE(entity, { ID: ID }).set({ status_code: setStatus });
    const result = await cds.run(query_releaseOrder);
}
