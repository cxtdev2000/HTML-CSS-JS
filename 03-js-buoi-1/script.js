const numberButtons = document.getElementsByClassName("maytinh-number");

const allButtons = document.getElementsByClassName("maytinh-num");

const maytinhResultButton = document.getElementById("maytinh-result-button");

//
const maytinhAlterNum1 = document.getElementById("maytinh-alter-num-1");
const maytinhAlterNum2 = document.getElementById("maytinh-alter-num-2");
//
const mayTinhXoa = document.getElementById("maytinh-delete");
const mayTinhAc = document.getElementById("maytinh-ac");
const mayTinhPercent = document.getElementById("maytinh-percent");
//
const maytinhOperator = document.getElementsByClassName("maytinh-operator");

const maytinhInput = document.getElementById("maytinh-input");

let disableOperator = false;

// Sự kiện click vào các nút số
for(let i = 0; i < numberButtons.length; i++){
    const phimSo = numberButtons[i];

    phimSo.onclick = () => {
        const number = parseInt(phimSo.innerHTML);
        maytinhInput.value += number;  
        disableOperator = false;
    }
}
// Sự kiện click vào các nút nhân chia cộng trừ
for(let i = 0; i < maytinhOperator.length; i++){
    const phimOperator = maytinhOperator[i];

    phimOperator.onclick = () => {
        if(disableOperator === false){
            const operator = phimOperator.dataset.operatorName;
            console.log(operator);
            maytinhInput.value += operator;
            disableOperator = true
        }
    }
}

maytinhAlterNum1.onclick = () => {
    const number = maytinhAlterNum1.innerHTML;
    maytinhInput.value += number;

}

maytinhAlterNum2.onclick = () => {
    const number = maytinhAlterNum2.innerHTML;
    maytinhInput.value += number;

}

mayTinhXoa.onclick = () => {
    maytinhInput.value = maytinhInput.value.slice(0, -1);
    disableOperator = false;
    const kyTuCuoiCung = maytinhInput.value[maytinhInput.value.length - 1]
    if(kyTuCuoiCung === "x" || kyTuCuoiCung === "÷" || kyTuCuoiCung === "+" || kyTuCuoiCung === "-"){
        disableOperator = true;
    }
}

mayTinhAc.onclick = () => {
    maytinhInput.value = "";
    disableOperator = false;
}


maytinhResultButton.onclick = () => {
    const maytinhInputValue = maytinhInput.value;
    console.log(maytinhInputValue);
    const result = eval(maytinhInputValue);
    console.log(result);

    maytinhInput.value = result;
}
