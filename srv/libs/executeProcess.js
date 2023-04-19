const definitionId = "eu10.crossfunctional-dev-56c89xus.customobjectretirementprocess.customObjectRetirementApprovalProcess"
const { executeHttpRequest } = require('@sap-cloud-sdk/core');

module.exports = async function (req) {
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
        console.log('Success:', result.data)
    } catch (error) {
        console.log(error.message)
    }
}
