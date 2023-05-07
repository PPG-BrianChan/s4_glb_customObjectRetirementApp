const { and } = require("@sap-cloud-sdk/core");
const { data } = require("hdb/lib/protocol");

module.exports = async function (entry, customObject) {
    const checkResult = await SELECT.one.from(customObject).columns("objectName").where({ objectType:entry.objectType }).and({objectName:entry.objectName});

    if(!checkResult){
        return true;
    }else{
        return false;
    }    
}