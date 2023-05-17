const getUsers = require('./libs/getUsers.js')
const executeProcess = require('./libs/executeProcess.js')
const updateApprovalStatus = require('./libs/updateApprovalStatus.js')
const completeDeletion = require('./libs/completeDeletion.js')
const expandAssociation = require('./libs/expandAssociation.js')
const massUpload = require('./libs/massUpload.js')
const validateEntry = require('./libs/validateEntry.js')

module.exports = (srv) => {
    const { customObject } = srv.entities;

    srv.on('READ', 'user', async (req) => {
        const userList = await getUsers(req);
        return userList;
    })

    srv.before('CREATE', 'customObject', async (req) => {
        console.log("Setting generated values")
        req.data.status_code = 'C'
        let isValid = await validateEntry(req.data,customObject);
        if(!isValid){
            return req.error ({
                code: "KEYS_EXIST",
                message: 'Keys already exist in Database!',
                status: 502
              })
        }
    })

    srv.on('executeProcess', async (req) => {
        await executeProcess(req, customObject);
    })

    srv.on('updateApprovalStatus', async (req) => {
        await updateApprovalStatus(req, customObject);
    })

    srv.on('completeDeletion', async (req) => {
        await completeDeletion(req, customObject)
    })

    srv.on('PUT', 'excelUpload', async (req) => {
        await massUpload(req,customObject)
    })

    srv.after('READ', 'customObject', async (req, result) => {
        await expandAssociation(req, result, srv);
    })
}