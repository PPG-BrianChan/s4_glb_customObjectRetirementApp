const XLSX = require('xlsx')
const stream = require('stream')
const validateEntry = require('./validateEntry.js')

module.exports = async function (req, customObject) {
    if (req.data.excel) {
        console.log("Uploading Excel")
        const streamObj = new stream.PassThrough();
        var buffers = [];
        req.data.excel.pipe(streamObj);

        //Read data stream
        await new Promise((resolve, reject) => {
            streamObj.on('data', dataChunk => {
                buffers.push(dataChunk);
            });
            streamObj.on('end', async () => {
                var buffer = Buffer.concat(buffers);
                var workbook = XLSX.read(buffer);
                let data = [];
                let errorData = [];
                let invalidMessage = "";
                const sheets = workbook.SheetNames;
                for (let i = 0; i < sheets.length; i++) {
                    const temp = XLSX.utils.sheet_to_json(
                        workbook.Sheets[workbook.SheetNames[i]], { dateNF: 'yyyy-mm-dd' });
                    temp.forEach((res, index) => {
                        data.push(JSON.parse(JSON.stringify(res)));
                    })
                }
                if (data) {
                    //Find date fields
                    const dateFields = Object.keys(data[0]).filter(key => key.toLowerCase().includes('date'));

                    for (i = 0; i < data.length; i++) {
                        //Validation
                        let valid = await validateEntry(data[i], customObject)

                        if (valid !== true) {
                            errorData.push(data[i])
                            data.splice(i, 1);
                            i--;
                            continue;
                        }
                        //Convert date format
                        for (j = 0; j < dateFields.length; j++) {
                            let field = dateFields[j];
                            let readDate = data[i][field];
                            let convertedDate = new Date((readDate - (25567 + 2)) * 86400 * 1000).toISOString().substring(0, 10);
                            data[i][field] = convertedDate;
                        }

                        //set default values
                        data[i].status_code = 'C'
                        data[i].createdBy = req.user.id;
                        data[i].modifiedBy = req.user.id;
                    }

                    //Prepare list of invalid entries
                    if (errorData.length > 0) {
                        for (i = 0; i < errorData.length; i++) {
                            let temp = `Object Type:${errorData[i].objectType};Object Name:${errorData[i].objectName}`;

                            if (i == 0) {
                                invalidMessage = temp
                            } else {
                                invalidMessage = invalidMessage.concat(`,${temp}`)
                            }
                        }
                    }

                    //Execute insert
                    if (data.length > 0) {
                        try {
                            const insertQuery = INSERT.into(customObject).entries(data)
                            const insertResult = await cds.run(insertQuery);
                            // console.log("insertResult:", insertResult)
                            if (errorData.length == 0) {
                                resolve(req.notify({
                                    message: 'All entries uploaded successfully',
                                    status: 200
                                }));
                            }
                            else {
                                console.log("List of invalid entries exist as below:")
                                console.log(invalidMessage)
                                resolve(req.notify({
                                    message: 'Conflicting data exist! Only valid entries are uploaded!',
                                    status: 207
                                }));
                            }
                        }
                        catch (error) {
                            console.log(error.message);
                            reject(req.error(502, error.message));
                        }
                    }else{
                        reject(req.error(502, "No valid entries exist!"));
                    }
                }
            });
        });
    } else {
        return next();
    }
}