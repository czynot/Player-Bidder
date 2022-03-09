'use strict'

const username=document.getElementById("username");
const password=document.getElementById("password");
const loginBtn=document.getElementById("login-btn");
const goBtn=document.getElementById("go-btn");



loginBtn.addEventListener("click",()=>{
    console.log(username.value +" , "+ password.value);
    if(username.value == "mcl0987@gmail.com" && password.value=="1234"){  //Mcl@psps2022
        goBtn.style.display="block";
        return false;
    }
    else{
        
        alert("Wrong credentials");
    }
});
