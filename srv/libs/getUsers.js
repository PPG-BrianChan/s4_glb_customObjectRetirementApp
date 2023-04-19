const baaGroupIDs = ['02faedb6-8a7e-413b-b2fc-dffd9543e132', '1776573d-774d-4d69-978e-95edb9522abe',
    '1e868fd0-0eb4-4872-96bf-2b40d141406f', '40b5433a-f44c-4c6c-99c7-a12cd5b68248',
    'e4067f89-2cae-4e28-bf8f-ff67e716536b'];

const userServiceAction_post = `/getUsers`;
const basicParams = `$select=mailNickname,displayName,mail&$count=true`
const cdsapi = require('@sapmentors/cds-scp-api');
const sorty = require('sorty');

module.exports = async function(req) {
    console.log("Start of getUsers function");
    var destination = "User_List_Service_API";
    var graphQuery = '';

    if (req._queryOptions !== null && req._queryOptions !== undefined && req._queryOptions.$search !== undefined && req._queryOptions.$search !== null) {
        let search = req._queryOptions.$search;
        search = search.replace(/\*/g, '');
        let output = [search.slice(0, 1), 'displayName:', search.slice(1)].join('');
        graphQuery = `$search=${output}`
    }

    var userlist = [];
    var url = '';
    url = userServiceAction_post
    var count = 0;

    for (let baaGroupID of baaGroupIDs.entries()) {
        let baaUsersURL = `/v1.0/groups/${baaGroupID[1]}/members`
        let data = {
            "requrl": baaUsersURL,
            "reqparams": `${basicParams}&${graphQuery}`
        }
        const service = await cdsapi.connect.to(destination);
        try {
            const graphUser = await service.run({
                url: url,
                data: data,
                method: "POST",
            })

            let tempuserlist = graphUser.value.value.map(graph_user => {
                let user = {};
                user.userID = graph_user.mailNickname;
                user.userFullName = graph_user.displayName;
                user.userEmail = graph_user.mail;
                return user;
            });
            userlist = userlist.concat(tempuserlist);
        }
        catch (error) {
            if (error.response.data !== undefined) {
                req.error({ "code": error.response.data.error.code, "message": error.response.data.error.message })
            } else {
                req.error({ "message": error.message });
            }
        }
    }

    //Order by --> graph only supports orderby for fullname --> we will do the sort manually in js
    var criteria = [];
    if (req.query.SELECT.orderBy) {
        for (let orderBy of req.query.SELECT.orderBy.entries()) {
            if (orderBy[1].sort == 'asc') {
                criteria.push({ name: `${orderBy[1].ref}`, dir: 'asc' })
            } else {
                criteria.push({ name: `${orderBy[1].ref}`, dir: 'desc' })
            }
        }
    }
    sorty(criteria, userlist);

    //filter duplicates
    userlist = _getUniqueListBy(userlist, 'userFullName');

    //Local value
    const test = {
        "userID" : "V614944",
        "userFullName" : "Brian Chan",
        "userEmail" : "cchan@ppg.com"
    }

    userlist.push(test);

    //Get count
    count = userlist.length;
    Object.assign(userlist, { $count: count });
    return userlist;
};

function _getUniqueListBy(arr, key) {
    return [...new Map(arr.map(item => [item[key], item])).values()]
}