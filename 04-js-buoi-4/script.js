const addButton = document.getElementById("add-button");
const addForm = document.getElementById("add-form");

const addInput = document.getElementById("add-input");
const addSubmit = document.getElementById("add-submit");
const addCancel = document.getElementById("add-cancel");

const todoList = document.getElementById("todo-list");

let soLuongTodo = 0;

let coDangHienThiForm = false;

let danhSachTodo = [];

const applyFeatureToAllCheckboxTodo = () => {
  const checkboxTodo = document.getElementsByClassName("checkbox-todo");
  for(let i = 0; i < checkboxTodo.length; i++){
    checkboxTodo[i].onchange = () => {
      const value = checkboxTodo[i].checked;
      const index = parseInt(checkboxTodo[i].dataset.index);


      console.log("Bạn đang checkbox todo thứ " + index + " với giá trị " + value);


      let toDoCanUpdate = {};

      for(let j = 0; j < danhSachTodo.length; j++){
        const todo = danhSachTodo[j];
        console.log(todo.id, index+1);
        if(todo.id == index+1){
          toDoCanUpdate = todo;
          break;
        }
      }
      console.log(toDoCanUpdate);
      toDoCanUpdate.completed = value;
      capNhatDanhSachTodo();
    }
  }
}

const capNhatDanhSachTodo = () => {
  console.log(danhSachTodo);
  danhSachTodo_duocLuuTrongBoNho = JSON.stringify(danhSachTodo);
  localStorage.setItem("danhSachTodo", danhSachTodo_duocLuuTrongBoNho);
}

const themToDo = (todoJson) => {
  danhSachTodo.push(todoJson);
  capNhatDanhSachTodo();
}

const themToDoVaoHTML = (order, title, completed) => {
  let completed_html = "";
  if(completed){
    completed_html = "checked";
  } else {
    completed_html = "";
  }
  const HTML_ROW = `<tr>
                        <td>
                            <div class="h-[40px] border border-[black] pt-2 px-4 flex items-center">${order}</div>
                        </td>
                        <td>
                            <div class="h-[40px] border border-[black] pt-2 px-4 flex items-center">${title}</div>
                        </td>
                        <td>
                            <div class="h-[40px] border border-[black] pt-2 px-4 flex items-center">
                                <input class="checkbox-todo" data-index="${order-1}" class="w-[20px] h-[20px]" type="checkbox" ${completed_html} />
                            </div>
                        </td>
                        <td>
                            <div class="h-[40px] flex gap-2 items-center">
                                <button id="edit-button" data-index="${order-1}"
                                    class="cursor-pointer border border-[black] pt-2 px-4 flex items-center bg-[#82ccfd] hover:bg-[#76afff]">Edit</button>
                                <button id="delete-button" data-index="${order-1}"
                                    class="cursor-pointer border border-[black] pt-2 px-4 flex items-center bg-[#ff6060] hover:bg-[#ff4444] text-white">Delete</button>
                            </div>
                        </td>
                    </tr>`
  //cộng HTML vào HTML của phần tử todo list
  todoList.innerHTML += HTML_ROW;

  applyFeatureToAllCheckboxTodo();
}

const dongBoDanhSachTodo = () => {
  const danhSachTodo_duocLuuTrongBoNho = localStorage.getItem("danhSachTodo");

  danhSachTodo = JSON.parse(danhSachTodo_duocLuuTrongBoNho);

  if(!danhSachTodo) danhSachTodo = [];

  console.log(danhSachTodo);

  if(Array.isArray(danhSachTodo) && danhSachTodo.length > 0){
    for(let i = 0; i < danhSachTodo.length; i++){
      const todo = danhSachTodo[i];
      themToDoVaoHTML(todo.id, todo.title, todo.completed);
    }
    soLuongTodo = danhSachTodo.length;
  }
}

addButton.onclick = () => {
    if(coDangHienThiForm === false){
        addForm.style.display = "block";
        coDangHienThiForm = true;
    } else {
        addForm.style.display = "none";
        coDangHienThiForm = false;
    }
}



addSubmit.onclick = () => {
  const todoInput = addInput.value;
  if(!todoInput || todoInput.trim() === ""){
    alert("Bạn chưa nhập nội dung, hãy kiểm tra lại");
    return;
  }
  themToDoVaoHTML(soLuongTodo+1, todoInput, false);

  soLuongTodo++;
  addInput.value = "";

  themToDo({
    id: soLuongTodo,
    title: todoInput,
    completed: false,
  })
}

// document.addEventListener("change", ".checkbox-todo", (event) => {
//   const value = event.target.checked;
//   console.log(value);
// })

// gọi hàm để lấy danh sách todo từ local storage
dongBoDanhSachTodo();



