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

//
const maytinhRoundBrackets = document.getElementsByClassName(
  "maytinh-round-bracket"
);
const maytinhTrigonometry = document.getElementsByClassName(
  "maytinh-trigonometry"
);

//
const messageText = document.getElementById("message-text");

function xoaLoi() {
  messageText.innerText = "Không có lỗi";
  messageText.style.color = "white"; 
}

function hienThiLoi(noiDung) {
  messageText.innerText = noiDung;
  messageText.style.color = "#ff4444";

  setTimeout(() => {
    xoaLoi();
  }, 3000);
}

let disableOperator = false;
let disablePercent = true;

let result = 0;

// Sự kiện click vào các nút số
for (let i = 0; i < numberButtons.length; i++) {
  const phimSo = numberButtons[i];

  phimSo.onclick = () => {
    const number = parseInt(phimSo.innerHTML);
    maytinhInput.value += number;
    disableOperator = false;
    disablePercent = false;
  };
}
// Sự kiện click vào các nút nhân chia cộng trừ
for (let i = 0; i < maytinhOperator.length; i++) {
  const phimOperator = maytinhOperator[i];

  phimOperator.onclick = () => {
    if (disableOperator === false) {
      const operator = phimOperator.dataset.operatorName;
      console.log(operator);
      maytinhInput.value += operator;
      disableOperator = true;
    }
  };
}

maytinhAlterNum1.onclick = () => {
  const number = maytinhAlterNum1.innerHTML;
  maytinhInput.value += number;
};

maytinhAlterNum2.onclick = () => {
  const number = maytinhAlterNum2.innerHTML;
  maytinhInput.value += number;
};

mayTinhXoa.onclick = () => {
  maytinhInput.value = maytinhInput.value.slice(0, -1);
  disableOperator = false;
  const kyTuCuoiCung = maytinhInput.value[maytinhInput.value.length - 1];
  if (
    kyTuCuoiCung === "x" ||
    kyTuCuoiCung === "÷" ||
    kyTuCuoiCung === "+" ||
    kyTuCuoiCung === "-"
  ) {
    disableOperator = true;
  }
};

mayTinhAc.onclick = () => {
  maytinhInput.value = "";
  disableOperator = false;
  disablePercent = true;
};

// maytinhResultButton.onclick = () => {
//   const maytinhInputValue = maytinhInput.value;
//   console.log(maytinhInputValue);
//   result = eval(maytinhInputValue);
//   console.log(result);

//   maytinhInput.value = result;
// };

maytinhResultButton.onclick = () => {
  try {
    let maytinhInputValue = maytinhInput.value;

    maytinhInputValue = maytinhInputValue.replace(/%/g, "/100");
    maytinhInputValue = maytinhInputValue.replace(/sin/g, "Math.sin");
    maytinhInputValue = maytinhInputValue.replace(/cos/g, "Math.cos");
    maytinhInputValue = maytinhInputValue.replace(/tan/g, "Math.tan");

    result = eval(maytinhInputValue);
    console.log(result);
    maytinhInput.value = result;
  } catch (error) {
    hienThiLoi("Lỗi cú pháp!");
    console.log(error);
  }
};

maytinhAlterNum1.onclick = () => {
  if (result != 0) {
    maytinhInput.value *= -1;
  }
};

mayTinhPercent.onclick = () => {
  if (disablePercent === false) {
    maytinhInput.value += mayTinhPercent.innerHTML;
  }
  
};

for (let i = 0; i < maytinhRoundBrackets.length; i++) {
  maytinhRoundBrackets[i].onclick = () => {
    const ngoac = maytinhRoundBrackets[i].innerHTML;
    maytinhInput.value += ngoac;
    disableOperator = false;
    disablePercent = false;
  };
}

for (let i = 0; i < maytinhTrigonometry.length; i++) {
  maytinhTrigonometry[i].onclick = () => {
    const hamLuongGiac = maytinhTrigonometry[i].innerHTML;

    maytinhInput.value += hamLuongGiac + "(";
    disableOperator = false;
    disablePercent = true;
  };
}
