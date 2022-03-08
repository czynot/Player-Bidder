'use strict'

const playerName1=document.getElementById("player-name1");
const playerName=document.getElementById("player-name2");
const dept=document.getElementById("dept");
const year=document.getElementById("year");
const bidValue=document.getElementById("bid-value");
const bidderName=document.getElementById("bidder-name");
const bidButton=document.getElementById("bid-button");
const newBidValue=document.getElementById("new-bid-value");
const newBidderName=document.getElementById("new-bidder-name");
const resetBtn=document.getElementById("reset");
const startBtn=document.getElementById("start");
const submitBtn=document.getElementById("submit");
const skillSpeciality=document.getElementById("speciality");
const skillWk=document.getElementById("skill-wk");
const playerImage = document.getElementById("player-image");


//fetching data from sheet1
let playerJsonData;
let sNo;
const getData = async () => {
    try {
      const res = await fetch(
        //"https://sheet.best/api/sheets/0f7a6adf-3eab-4c4f-bf25-9fd9d7adabd0"  //sheet link (from sheet.best)
        "https://sheet.best/api/sheets/49f53ffd-474d-4f7b-9538-06519c0175f2"
      );
      playerJsonData = await res.json();
      console.log(playerJsonData); // player data
      console.log("size:"+playerJsonData.length);
      //setData(Object.keys(data).map((key) => data[key]));
    } catch (error) {
      console.log(error);
    }
  };
  getData();


  //Function for Selecting random player from the list
  let currentPlayerName="";
  let currentPlayerDept="";
  let currentPlayerYear="";
  let currentPlayerTeam="";
  let currentPlayerPoints="";

function randomPlayer(){
    sNo=Math.floor(Math.random() * playerJsonData.length); //generating random number between 0 to length of data
    currentPlayerName=playerJsonData[sNo].Name;
    currentPlayerDept=playerJsonData[sNo].Dept;
    currentPlayerYear=playerJsonData[sNo].Year;

    playerImage.src="https://drive.google.com/uc?id="+playerJsonData[sNo].Photo;
    //changing player name
    playerName1.innerHTML=`${currentPlayerName}`;

    playerName.innerHTML=`<i class="fa fa-user fa-fw w3-margin-right w3-xxlarge w3-text-teal"></i>
    ${currentPlayerName}`;

    //changing player dept and year
    dept.innerHTML=`${currentPlayerDept}`;

    year.innerHTML=`${currentPlayerYear}`;

    skillSpeciality.innerText=playerJsonData[sNo].Speciality;

    if(playerJsonData[sNo].WK=="no"){
      skillWk.style.display="none";
    }
    else{
      skillWk.style.display="block";
    }

}

//Selecting random player from the list
startBtn.addEventListener("click",()=>{
    if(confirm("Start Bidding ?")==true){
      startBtn.innerText=`Next Player`;
      bidValue.innerHTML="0000";
      bidderName.innerHTML="Unsold";
      newBidValue.value="";
      newBidderName.value="select";
      randomPlayer(); 
    }

});


//Updating player bid values
bidButton.addEventListener("click",()=>{
    const val=newBidValue.value;
    const bidder=newBidderName.value;

    if(val==''){
        alert('Bid Value Field Empty!')
    }
    else if(bidder=='select'){
        alert('Select the Bidder!')
    }
    else if(parseInt(val)<parseInt(bidValue.innerText)){
      alert("Current bid value less than previous bid!");
    }
    else{
        bidValue.innerHTML=val;
        bidderName.innerHTML=bidder;
        newBidValue.value="";
        newBidderName.value="select";
    }
    
});

//reset player bid values
resetBtn.addEventListener("click",()=>{
  if(confirm("Are you sure you want to reset?")){
    bidValue.innerHTML="0000";
    bidderName.innerHTML="Unsold";
    newBidValue.value="";
    newBidderName.value="select";
  }
});

//Submit the data i.e delete from sheet 1 and add to sheet 2 with bid values
submitBtn.addEventListener("click",()=>{
  //let choice = prompt("Are you sure you want to submit?");
  if(confirm("Are you sure you want to submit?")==true){
    handleSubmit();
  }
  
});


//Uploaded Excel data to JSon data 
/*
//html
/*
<body class="w3-light-grey">

  <div class="conatiner mt-5">
    <div class="row">
        <div class="col-md-3"></div>
        <div class="col-md-3">
            <input class="form-control" type="file" id="input" accept=".xls,.xlsx"  >
        </div>
        <div class="col-md-2">
            <button class="btn btn-primary" id="button">Convert</button>
        </div>
<div class="col-md-12">
<pre id="jsondata"></pre>
</div>
    </div>
</div>
</body>



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
*/

//Function to Add data of sold player to new sheet
const data={
    "Name":"",
    "Dept":"",
    "Year":"",
    "Team":"",
    "Points":""
}
const addData=()=>{
    // adding sold player data to new sheet
    fetch("https://sheet.best/api/sheets/4466ce3f-5b1b-4202-9eef-3d2c53f0b7cb", {
      method: "POST",
      mode: "cors",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    })
    .then((r) => r.json())
    .then((data) => {
    // The response comes here
    console.log(data);
      console.log("Added data to https://sheet.best/api/sheets/4466ce3f-5b1b-4202-9eef-3d2c53f0b7cb" );
    })
    .catch((error) => {
    // Errors are reported there
      console.log(error);
    });
}

  //Function to delete row from sheet
  const deleteRow=()=>{
    fetch(`https://sheet.best/api/sheets/49f53ffd-474d-4f7b-9538-06519c0175f2/${sNo}`, {  //change last didgit to manipulate the row you want to delete
        method: "DELETE",
      })
        .then((response) => response.json())
        .then((data) => {
          console.log(data);
          console.log("Deleted from https://sheet.best/api/sheets/0f7a6adf-3eab-4c4f-bf25-9fd9d7adabd0");
        })
        .catch((error) => {
          console.error(error);
        });
  }

/*
const handleSubmit = async (e) => {
    addData();

    //e.preventDefault();
    try {
      const res = await fetch(
        "https://sheet.best/api/sheets/b874102e-68f4-4005-9ef6-e9bbb10b316a",
        {
          method: "POST",
          mode: "cors",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(data),
        }
      );
      if (res.ok) {
          console.log("done");
        history.replace("/");
      }
    } catch (error) {
        console.log("HIHIHIIII");
      console.log(error);
    }
  };*/

  //Function to submit final data
  const handleSubmit = async (e) => {
      data.Name=currentPlayerName;
      data.Dept=currentPlayerDept;
      data.Year=currentPlayerYear;

    if(bidValue.innerText==="0000")
    {
      data.Team="UNSOLD";
      data.Points="UNSOLD";
      addData();
      deleteRow();
      console.log("Unsold");
    }
    else{
      data.Team=bidderName.innerText;
      data.Points=bidValue.innerText;
      addData();
      deleteRow();
    }
  }


  





