let selectedFile;
//console.log(window.XLSX);
document.getElementById('input').addEventListener("change", (event) => {
    selectedFile = event.target.files[0];
})

let data=[{
    "name":"jayanth",
    "data":"scd",
    "abc":"sdef"
}];

let playerJsonData;
document.getElementById('button').addEventListener("click", () => {
    XLSX.utils.json_to_sheet(data, 'out.xlsx');
    if(selectedFile){
        let fileReader = new FileReader();
        fileReader.readAsBinaryString(selectedFile);
        fileReader.onload = (event)=>{
         let data = event.target.result;
         let workbook = XLSX.read(data,{type:"binary"});
         //console.log(workbook);
         workbook.SheetNames.forEach(sheet => {
              playerJsonData = XLSX.utils.sheet_to_row_object_array(workbook.Sheets[sheet]);
              console.log(playerJsonData);
              document.getElementById("jsondata").innerHTML = JSON.stringify(playerJsonData,undefined,4)
         });
        }
    }
});