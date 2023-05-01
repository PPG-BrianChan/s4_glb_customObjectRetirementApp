const XLSX = require('xlsx')
const stream = require('stream')

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
                let data = []
                const sheets = workbook.SheetNames
                for (let i = 0; i < sheets.length; i++) {
                    const temp = XLSX.utils.sheet_to_json(
                        workbook.Sheets[workbook.SheetNames[i]], { dateNF: 'yyyy-mm-dd' })
                    temp.forEach((res, index) => {
                        data.push(JSON.parse(JSON.stringify(res)))
                    })
                }
                if (data) {
                    //Find date fields
                    const dateFields = Object.keys(data[0]).filter(key => key.toLowerCase().includes('date'));

                    //Convert Date Format
                    //At the same time, set status
                    for (i = 0; i < dateFields.length; i++) {
                        let field = dateFields[i];
                        for (j = 0; j < data.length; j++) {
                            let read = data[j][field];
                            let converted = new Date((read - (25567 + 2)) * 86400 * 1000).toISOString().substring(0, 10);
                            data[j][field] = converted;
                            data[j].status_code = 'C';
                        }
                    }

                    //Execute insert
                    try {
                        const insertQuery = INSERT.into(customObject).entries(data)
                        const insertResult = cds.run(insertQuery);
                        console.log("insertResult")
                        resolve(req.notify({
                            message: 'Upload Successful',
                            status: 200
                        }));
                    }
                    catch (error) {
                        console.log(error.message);
                        reject(req.reject({
                            message: error.message,
                            status: 502
                        }))
                    }
                }
            });
        });
    } else {
        return next();
    }
}