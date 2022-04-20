export const csvFileToArray = str => {
    const csvHeader = str.slice(0, str.indexOf("\n")).split(",");
    const csvRows = str.slice(str.indexOf("\n") + 1).split("\n");

    const array = csvRows.map(i => {
        const values = i.split(",");
        const obj = csvHeader.reduce((object, header, index) => {
            object[header] = values[index];
            return object;
        }, {});
        return obj;
    });
    return array;
};

export const processData = dataString => {
    const dataStringLines = dataString.split(/\r\n|\n/);
    const headers = dataStringLines[0].split(/,(?![^"]*"(?:(?:[^"]*"){2})*[^"]*$)/);

    const list = [];
    for (let i = 1; i < dataStringLines.length; i++) {
        const row = dataStringLines[i].split(/,(?![^"]*"(?:(?:[^"]*"){2})*[^"]*$)/);
        if (headers && row.length == headers.length) {
            const obj = {};
            for (let j = 0; j < headers.length; j++) {
                let d = row[j];
                if (d.length > 0) {
                    if (d[0] == '"')
                        d = d.substring(1, d.length - 1);
                    if (d[d.length - 1] == '"')
                        d = d.substring(d.length - 2, 1);
                }
                if (headers[j]) {
                    obj[headers[j]] = d;
                }
            }

            // remove the blank rows
            if (Object.values(obj).filter(x => x).length > 0) {
                list.push(obj);
            }
        }
    }

    // prepare columns list from headers
    const columns = headers.map(c => ({
        name: c,
        selector: c,
    }));
    return {
        data: list,
        columns: columns
    }
}