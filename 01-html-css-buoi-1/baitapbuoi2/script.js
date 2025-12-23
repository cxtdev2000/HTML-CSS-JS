console.log("Hello World");

const appButton = document.getElementsByClassName("apps-button");
const appButton1 = document.getElementById("apps-button-1");
const appButton2 = document.getElementById("apps-button-2");

// const appButton1 = appButton[0]; // camel case
// const app_button_1 = appButton[0]; // snake case
// const APP_BUTTON_1 = appButton[0]; // uppercase + snake case
// const APPBUTTON1 = appButton[0]; // uppercase

// const appButton2 = appButton[1];

let soLanClick = 0;

const clickVaoNut1 = () => {
    soLanClick++;
    if(soLanClick % 2 === 0){
        appButton2.style.display = "block";
    } else {
        appButton2.style.display = "none";
    }
}

appButton1.onclick = () => {
    clickVaoNut1();
}

const clockElement = document.getElementById("clock");
clockElement.style.color = "white";

setInterval(() => {
    const thoiGianHienTai = new Date();
    
    const thoiGianHienTaiString = `${thoiGianHienTai.getHours()}:${thoiGianHienTai.getMinutes()}:${thoiGianHienTai.getSeconds()}`
    
    clockElement.innerHTML = thoiGianHienTaiString;

    let gio = thoiGianHienTai.getHours();
    let phut = thoiGianHienTai.getMinutes();
    let giay = thoiGianHienTai.getSeconds();

    if(gio === 22 && phut === 53 && giay === 0){
        alert("Kết thúc thời gian");
    }
}, 1000);





