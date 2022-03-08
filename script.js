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
const leftColumn=document.getElementById("left-column");
const rightColumn=document.getElementById("right-column");
const soldDiv=document.getElementById("sold-div");
const footer=document.getElementById("footer");
const soldDetail=document.getElementById("sold-detail");
const gotoNextBidBtn= document.getElementById("goto-next-bid");

const teamNames=["RR","CSK","KKR","DC","RCB","SRH"];
const maxPoint=1700; //maximum bid value

//fetching data from sheet1
let playerJsonData;
let sNo;
const getData = async () => {   // input sheet: https://docs.google.com/spreadsheets/d/1YbGjVNyBVm14jz-FsrWaziq7EuRvUoX8a8PFuGkaLJo/edit?usp=sharing
    try { 
      const res = await fetch( //sheet link (from sheet.best)
        "https://sheet.best/api/sheets/4af5b600-38ab-40df-8f16-0e1a652b3f86"
      );
      playerJsonData = await res.json();
      console.log(playerJsonData); // player data
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

function displayNextPlayer(){
  if(confirm("Start Bidding ?")==true){
    startBtn.innerText=`Next Player`;
    bidValue.innerHTML="0000";
    bidderName.innerHTML="Unsold";
    newBidValue.value="";
    newBidderName.value="select";
    playerImage.src="default-image.png";
    randomPlayer(); 
  }
}

//Selecting random player from the list
startBtn.addEventListener("click",displayNextPlayer);


//Updating player bid values
let bidderIndex;
bidButton.addEventListener("click",()=>{
    const val=newBidValue.value;
    const currIdx=parseInt(newBidderName.value);
    const bidder=teamNames[currIdx];
    //const bidder=newBidderName.value;
    

    if(val==''){
        alert('Bid Value Field Empty!')
    }
    else if(bidder=='select'){
        alert('Select the Bidder!')
    }
    else if(parseInt(val)<parseInt(bidValue.innerText)){
      alert("Current bid value less than previous bid!");
    }
    else if(parseInt(teamPointsJson[currIdx].total)+parseInt(val) > maxPoint){
      alert("Not enough point!")
    }
    else{
        bidderIndex=parseInt(newBidderName.value);
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
      console.log("Added data to https://docs.google.com/spreadsheets/d/1TiyZuo8o12M2LU35P9ZzO2-LWx5C91PJ_LMdch_N8EA/edit#gid=1278357720" );
    })
    .catch((error) => {
    // Errors are reported there
      console.log(error);
    });
}

  //Function to delete row from sheet
  const deleteRow=()=>{  //input sheet: https://docs.google.com/spreadsheets/d/1YbGjVNyBVm14jz-FsrWaziq7EuRvUoX8a8PFuGkaLJo/edit?usp=sharing
    fetch(`https://sheet.best/api/sheets/4af5b600-38ab-40df-8f16-0e1a652b3f86/${sNo}`, {  //change last didgit to manipulate the row you want to delete
        method: "DELETE",
      })
        .then((response) => response.json())
        .then((data) => {
          console.log(data);
          console.log("Deleted from https://docs.google.com/spreadsheets/d/1YbGjVNyBVm14jz-FsrWaziq7EuRvUoX8a8PFuGkaLJo/edit?usp=sharing");
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
    if(currentPlayerName==""){
      alert("Bidding is not started yet");
    }
    else{

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
      //addData();  uncomment it
      //deleteRow(); uncomment it
      const newPoints=parseInt(data.Points)+parseInt(teamPointArr[bidderIndex]);
      updateTeamPointSheet(data.Team,newPoints);          //update points sheet
    }

    leftColumn.style.display="none";
    rightColumn.style.display="none";

    soldDiv.style.display="block";
    footer.classList.add("footer-align");

    if(bidValue.innerText=="0000"){
      soldDetail.innerHTML=`${currentPlayerName} unsold`;
    }
    else{
      soldDetail.innerHTML=`${currentPlayerName} sold to ${bidderName.innerText} for ${bidValue.innerText} points`;
    }
    }

  }

  gotoNextBidBtn.addEventListener("click",()=>{
    leftColumn.style.display="block";
    rightColumn.style.display="block";

    soldDiv.style.display="none";
    footer.classList.remove("footer-align");
    displayNextPlayer();
  });

  /* 
    0 = rr
    1 = csk
    2 = kkr
    3 = dc
    4 = rcb
    5 = srh
  */


  //fetching points from point sheet
let teamPointsJson;
let teamPointArr=[];
const getCurrentPoints = async () => {
    try {
      const res = await fetch( //sheet link (from sheet.best)   // team point sheet: https://sheet.best/api/sheets/1d7eb585-89cf-4925-b18a-2681b62e70d1
        "https://sheet.best/api/sheets/1d7eb585-89cf-4925-b18a-2681b62e70d1"
      );
      teamPointsJson = await res.json();
      console.log(teamPointsJson); // player data
      console.log("size:"+teamPointsJson.length);

      teamPointArr.push(teamPointsJson[0].total);
      teamPointArr.push(teamPointsJson[1].total);
      teamPointArr.push(teamPointsJson[2].total);
      teamPointArr.push(teamPointsJson[3].total);
      teamPointArr.push(teamPointsJson[4].total);
      teamPointArr.push(teamPointsJson[5].total);

      console.log(teamPointArr);
      //setData(Object.keys(data).map((key) => data[key]));
    } catch (error) {
      console.log(error);
    }
  };
  getCurrentPoints();


  const updateTeamPointSheet=(teamName,newPoint)=>{
    fetch(
      `https://sheet.best/api/sheets/1d7eb585-89cf-4925-b18a-2681b62e70d1/team/*${teamName}*`,
      {
        method: "PATCH",
        mode: "cors",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          total: `${newPoint}`,
        }),
      }
    )
      .then((r) => r.json())
      .then(console.log)
      .catch(console.error);
}

  





