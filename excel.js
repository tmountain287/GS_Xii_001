function createExcel(jsonData) {
    console.log("createExcel function called with data: ", jsonData); // �����
    var data = JSON.parse(jsonData);
    console.log("Parsed JSON Data: ", data); // �����
    var wb = XLSX.utils.book_new();

    data.keys.forEach((date, index) => {
        var ws_data = [["Name", "Count"]];
        var items = data.values[index];

        items.keys.forEach((name, idx) => {
            ws_data.push([name, items.values[idx]]);
            console.log("Adding row: ", [name, items.values[idx]]); // �����
        });

        if (ws_data.length > 1) {
            var ws = XLSX.utils.aoa_to_sheet(ws_data);
            XLSX.utils.book_append_sheet(wb, ws, date);
            console.log("Added sheet for date: ", date); // �����
        }
    });

    if (wb.SheetNames.length === 0) {
        var ws = XLSX.utils.aoa_to_sheet([["No Data"]]);
        XLSX.utils.book_append_sheet(wb, ws, "Sheet1");
    }

    var wbout = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });

    var blob = new Blob([wbout], { type: "application/octet-stream" });
    var unixTime = Math.floor(Date.now() / 1000);
    var link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = `report_${unixTime}.xlsx`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
}
