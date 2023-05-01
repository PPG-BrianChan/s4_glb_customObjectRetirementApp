const cdsapi = require('@sapmentors/cds-scp-api');
module.exports = async function (req, result, srv) {
    console.log("Expanding associations");

    let entityLists = srv.entities;
    console.log(Object.keys(entityLists))
    let expand = result?._query?.$expand
    let expandList;
    try {
        expandList = expand.replace(/\([^)]*\)/g, '').split(',');

        for (i = 0; i < expandList.length; i++) {
            expandEntry = expandList[i];
            if (expandEntry == 'DraftAdministrativeData') {
                continue;
            } else {
                let readField = req[expandEntry];
                if (readField == null) {
                    //Get association details
                    let associationTarget = entityLists.customObject.associations[expandEntry].target.split('.')[1]
                    let generatedKeyField = entityLists.customObject.associations[expandEntry].keys[0].$generatedFieldName
                    let foreignKey = entityLists.customObject.associations[expandEntry].keys[0].ref[0];

                    if (associationTarget == 'user') {
                        //currently only implemented for users association
                        if (result.results.length == undefined) {
                            let keyValue = req[generatedKeyField];
                            let expandResult = await _getExpandedUser(associationTarget, foreignKey, keyValue)
                            result.results[expandEntry] = expandResult;
                        } else {
                            // for (i = 0; i < result.results.length; i++) {
                            //     let readResult = result.results[i];
                            //     let keyValue = readResult[generatedKeyField];
                            //     let expandResult = await _getExpandedUser(associationTarget, foreignKey, keyValue)
                            //     result.results[i][expandEntry] = expandResult;
                            // }
                        }
                    }
                }
            }

        }
    }
    catch (error) {
    }
}

async function _getExpandedUser(target, key, value) {
    const destination = "User_List_Service_API";
    const userServiceAction_post = `/getUsers`;
    const basicParams = `$select=mailNickname,displayName,mail&$count=true`
    const requrl = '/v1.0/users'

    let graphKey = 'mailNickName';
    let reqparams = `${basicParams}&$filter=${graphKey} eq '${value}'`

    let data = {
        "requrl": requrl,
        "reqparams": reqparams
    }

    try {
        const service = await cdsapi.connect.to(destination);
        const graphUser = await service.run({
            url: userServiceAction_post,
            data: data,
            method: "POST",
        })

        let returnUser = {};

        returnUser.userID = graphUser.value.value[0].mailNickname;
        returnUser.userFullName = graphUser.value.value[0].displayName;
        returnUser.userEmail = graphUser.value.value[0].mail;

        return returnUser
    }
    catch (error) {
        if (error.response.data !== undefined) {
            req.error({ "code": error.response.data.error.code, "message": error.response.data.error.message })
        } else {
            req.error({ "message": error.message });
        }
    }


}