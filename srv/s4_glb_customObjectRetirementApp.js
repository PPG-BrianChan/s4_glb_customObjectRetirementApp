const getUsers = require('./libs/getUsers.js')
const executeProcess = require('./libs/executeProcess.js')
const updateApprovalStatus = require('./libs/updateApprovalStatus.js')
const completeDeletion = require('./libs/completeDeletion.js')

module.exports = (srv) => {
    const { customObject } = srv.entities;

    srv.on('READ', 'user', async (req) => {
        const userList = await getUsers(req);
        return userList;
    })

    srv.before('CREATE','customObject', async (req) =>{
        req.data.status_code = 'S'
    })

    srv.after('CREATE','customObject', async (req) =>{
        await executeProcess(req);
    })

    srv.on('updateApprovalStatus', async (req) => {
        await updateApprovalStatus(req,customObject);
    })

    srv.on('completeDeletion', async (req) => {
        await completeDeletion(req,customObject)
    })

    srv.on('PUT','excelUpload', async (req) => {
        console.log("Uploading Excel")
    })
}