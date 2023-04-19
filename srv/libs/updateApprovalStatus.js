const { executeHttpRequest } = require('@sap-cloud-sdk/core');
module.exports = async function (req, customObject) {
    console.log(`Received request from workflow with data:Object ID=${req.data.objectID},Decision=${req.data.decision}`)
    var updateStatus;
    if (req.data.decision == 'Approve') {
        updateStatus = 'A'
    } else {
        updateStatus = 'R'
    }
    try {
        const query_update_status = UPDATE(customObject, { ID: req.data.objectID }).set({ status_code: updateStatus });
        await cds.run(query_update_status)
        console.log("Data updated successfully")
        console.log("Proceeding to send mail")
        await _sendMail(req, customObject);
    } catch (error) {
        console.log(error.message);
    }
}

async function _sendMail(req, customObject) {
    //Find object name
    let query = SELECT.from(customObject).columns("ID","objectName").where({ ID: req.data.objectID });
    let selectResult = await cds.run(query);

    if (selectResult) {
        var objectName = selectResult[0].objectName
        var objectID = selectResult[0].ID
    }

    var payload = {
        "sender": "sapcoebtpgeneral@ppg.com",
        "recipient": "CChan@ppg.com",  //For testing
        "subject": `TESTING : ABAP Object ${objectName} to be withdrawn`,
        "type": "HTML",
        "body": `You have been assigned to decommission the ABAP object ${objectName}.Once done you may visit the app at 
                <br>https://crossfunctional-dev-56c89xus.launchpad.cfapps.eu10.hana.ondemand.com/site/DEV#customObjects-Manage?sap-ui-app-id-hint=saas_approuter_objectRetirementApp.s4glbcustomobjectretirementappui&ID=${objectID} 
                <br>to update the status of the object.`
    }

    try {
        // console.log("Mail sending disabled for now");
        await executeHttpRequest(
            {
                destinationName: "Mail_Service_API"
            },
            {
                method: 'POST',
                data: payload,
                url: "/mailrequests"
            }
        )
        console.log("Mail sent successfully")
    }
    catch (error) {
        console.log(error.message);
        console.log("Error occured during mail sending, kindly check at mail service");
    }
}