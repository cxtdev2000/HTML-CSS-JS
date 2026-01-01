const addButton = document.getElementById("add-button");
const addForm = document.getElementById("add-form");
const addInput = document.getElementById("add-input");
const addSubmit = document.getElementById("add-submit");
const addCancel = document.getElementById("add-cancel");
const addDate = document.getElementById("add-date");
const deleteButtons = document.getElementsByClassName("delete-button");
const editButtons = document.getElementsByClassName("edit-button");
const todoList = document.getElementById("todo-list");
const searchInput = document.getElementById("search-task");

let tuKhoaTimKiem = "";

let soLuongTodo = 0;

let coDangHienThiForm = false;

let danhSachTodo = [];

let trangThaiLoc = "all";

let currentPage = 1;

let idDangSua = null;

const limit = 5;
//////////////////////////

const applyFeatureToAllCheckboxTodo = () => {
  const checkboxTodo = document.getElementsByClassName("checkbox-todo");
  for (let i = 0; i < checkboxTodo.length; i++) {
    checkboxTodo[i].onchange = () => {
      const isChecked = checkboxTodo[i].checked;
      const index = parseInt(checkboxTodo[i].dataset.index);

      console.log(
        "Bạn đang checkbox todo thứ " + index + " với giá trị " + isChecked
      );

      let toDoCanUpdate = null;

      for (let j = 0; j < danhSachTodo.length; j++) {
        const todo = danhSachTodo[j];
        if (todo.id == index + 1) {
          toDoCanUpdate = todo;
          break;
        }
      }

      if (toDoCanUpdate) {
        if (isChecked) {
          toDoCanUpdate.completed = true;
          toDoCanUpdate.completedAt = new Date().toISOString();
        } else {
          toDoCanUpdate.completed = false;
          toDoCanUpdate.completedAt = null;
        }

        capNhatDanhSachTodo();

        dongBoDanhSachTodo();
      }
    };
  }
};

const capNhatDanhSachTodo = () => {
  console.log(danhSachTodo);
  danhSachTodo_duocLuuTrongBoNho = JSON.stringify(danhSachTodo);
  localStorage.setItem("danhSachTodo", danhSachTodo_duocLuuTrongBoNho);
};

const themToDo = (todoJson) => {
  danhSachTodo.push(todoJson);
  capNhatDanhSachTodo();
};

const themToDoVaoHTML = (order, title, statusText, completedAt) => {
  let isChecked = completedAt ? "checked" : "";

  const HTML_ROW = `<tr class ="table-fixed w-full even:bg-gray-100 hover:bg-gray-300 border-b border-gray-300">
                        <td>
                            <div class="py-3 px-2 text-center">${order}</div>
                        </td>
                        <td>
                            <div class="py-3 px-2 text-center">
                                <input class="checkbox-todo w-[25px] h-[25px] cursor-pointer accent-green-600" data-index="${
                                  order - 1
                                }" type="checkbox" ${isChecked} />
                            </div>
                        </td>
                        <td>
                            <div class=" block w-full truncate py-3 px-6 text-left w-[30%]">${title}</div>
                        </td>
                        <td>
                            <div class="py-3 px-6 text-left w-[80%]">${statusText}</div>
                        </td>
                        <td>
                            <div class="flex gap-4 py-3 px-6 text-center w-[20%]">
                                <button class="edit-button cursor-pointer rounded-md border border-[black] p-1 px-4 flex items-center bg-[white] hover:bg-gray-100" data-index="${
                                  order - 1
                                }">Edit</button>
                                <button class="delete-button cursor-pointer rounded-md border border-[black] p-1 px-2 flex items-center bg-[red] hover:bg-red-400 text-white" data-index="${
                                  order - 1
                                }">Delete</button>
                            </div>
                        </td>
                </tr>`;
  todoList.innerHTML += HTML_ROW;

  applyFeatureToAllCheckboxTodo();
};

const dongBoDanhSachTodo = () => {
  const danhSachTodo_duocLuuTrongBoNho = localStorage.getItem("danhSachTodo");
  danhSachTodo = JSON.parse(danhSachTodo_duocLuuTrongBoNho);
  if (!danhSachTodo) danhSachTodo = [];

  capNhatThongKe();
  todoList.innerHTML = "";

  let danhSachDaLoc = danhSachTodo.filter((todo) => {
    const now = new Date();
    let deadlineDate = null;
    if (todo.deadline) {
      deadlineDate = new Date(todo.deadline);
      deadlineDate.setHours(23, 59, 59, 999);
    }

    const isMatchSearch = todo.title.toLowerCase().includes(tuKhoaTimKiem);

    if (!isMatchSearch) return false;
    if (trangThaiLoc === "all") return true;
    if (trangThaiLoc === "active") return !todo.completed;
    if (trangThaiLoc === "completed") return todo.completed === true;
    if (trangThaiLoc === "notlate")
      return !todo.completed && deadlineDate && deadlineDate >= now;
    if (trangThaiLoc === "late")
      return !todo.completed && deadlineDate && deadlineDate < now;
    return true;
  });

  soLuongTodo =
    danhSachTodo.length > 0 ? Math.max(...danhSachTodo.map((t) => t.id)) : 0;

  const totalPages = Math.ceil(danhSachDaLoc.length / limit);
  if (currentPage > totalPages && totalPages > 0) currentPage = totalPages;
  if (danhSachDaLoc.length === 0) currentPage = 1;

  const danhSachHienThi = chiapage(currentPage, limit, danhSachDaLoc);
  for (let i = 0; i < danhSachHienThi.length; i++) {
    const todo = danhSachHienThi[i];
    const statusText = dueMakeFunction(todo.deadline, todo.completedAt);
    themToDoVaoHTML(todo.id, todo.title, statusText, todo.completedAt);
  }

  const soDongConThieu = limit - danhSachHienThi.length;
  if (soDongConThieu > 0) {
    for (let j = 0; j < soDongConThieu; j++) {
      const emptyRow = `
              <tr class="h-[58px] border-b border-gray-300 even:bg-gray-100">
                  <td>&nbsp;</td>
                  <td>&nbsp;</td>
                  <td>&nbsp;</td>
                  <td>&nbsp;</td>
                  <td>&nbsp;</td>
              </tr>`;
      todoList.innerHTML += emptyRow;
    }
  }

  renderPagination(danhSachDaLoc.length);
  updatePaginationInfo(danhSachDaLoc.length, danhSachHienThi.length);

  applyFeatureToAllCheckboxTodo();
  ganSuKienChoNut();
};

const dueMakeFunction = (deadline, completedAt) => {
  if (!deadline) return "Không có hạn";

  const deadlineDate = new Date(deadline);
  deadlineDate.setHours(23, 59, 59, 999);

  const now = new Date();

  if (completedAt) {
    const finishedDate = new Date(completedAt);
    const diffTime = finishedDate - deadlineDate;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays <= 0) {
      return `<span class="text-green-600 font-bold">Đã hoàn thành</span>`;
    } else {
      return `<span class="text-orange-500 font-bold">Hoàn thành, muộn ${diffDays} ngày</span>`;
    }
  } else {
    const diffTime = deadlineDate - now;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays >= 0) {
      return `<span class="text-blue-600 font-bold">Còn ${diffDays} ngày</span>`;
    } else {
      return `<span class="text-red-600 font-bold">Đã muộn ${Math.abs(
        diffDays
      )} ngày</span>`;
    }
  }
};

const toggleDropdown = () => {
  document.getElementById("myDropdown").classList.toggle("hidden");
};

window.onclick = function (event) {
  if (!event.target.closest(".dropdown")) {
    var dropdowns = document.getElementsByClassName("dropdown-content");
    for (var i = 0; i < dropdowns.length; i++) {
      var openDropdown = dropdowns[i];
      if (!openDropdown.classList.contains("hidden")) {
        openDropdown.classList.add("hidden");
      }
    }
  }
};

const thayDoiBoLoc = (loai) => {
  trangThaiLoc = loai;
  currentPage = 1;

  const btnText = document.querySelector("#filter-btn span");

  if (btnText) {
    if (loai === "all") btnText.innerText = "Tất cả";
    else if (loai === "active") btnText.innerText = "Đang thực hiện";
    else if (loai === "completed") btnText.innerText = "Đã hoàn thành";
    else if (loai === "notlate") btnText.innerText = "Chưa tới hạn";
    else if (loai === "late") btnText.innerText = "Quá hạn";
  }

  const dropdown = document.getElementById("myDropdown");
  if (dropdown) dropdown.classList.add("hidden");

  dongBoDanhSachTodo();
};

const chiapage = (page, limit, mangInput) => {
  const skip = (page - 1) * limit;
  const hienthi = skip + limit;

  return mangInput.slice(skip, hienthi);
};

const renderPagination = (totalItems) => {
  const paginationContainer = document.getElementById("pagination-container");
  paginationContainer.innerHTML = "";

  const totalPages = Math.ceil(totalItems / limit);

  if (totalPages <= 1) return;

  const prevBtn = document.createElement("button");
  prevBtn.innerHTML = `<svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"></path></svg>`;
  prevBtn.className = `px-3 py-2 border rounded-lg hover:bg-gray-100 ${
    currentPage === 1 ? "opacity-50 cursor-not-allowed" : ""
  }`;
  prevBtn.disabled = currentPage === 1;
  prevBtn.onclick = () => {
    if (currentPage > 1) {
      currentPage--;
      dongBoDanhSachTodo();
    }
  };
  paginationContainer.appendChild(prevBtn);

  let pages = [];

  if (totalPages <= 5) {
    for (let i = 1; i <= totalPages; i++) {
      pages.push(i);
    }
  } else {
    if (currentPage <= 3) {
      pages = [1, 2, 3, 4, "...", totalPages];
    } else if (currentPage >= totalPages - 2) {
      pages = [
        1,
        "...",
        totalPages - 3,
        totalPages - 2,
        totalPages - 1,
        totalPages,
      ];
    } else {
      pages = [
        1,
        "...",
        currentPage - 1,
        currentPage,
        currentPage + 1,
        "...",
        totalPages,
      ];
    }
  }

  pages.forEach((page) => {
    const button = document.createElement("button");
    if (page === "...") {
      button.innerText = "...";
      button.className = "px-3 py-1 text-gray-500 cursor-default";
      button.disabled = true;
    } else {
      button.innerText = page;
      if (page === currentPage) {
        button.className =
          "px-3 py-1 border border-blue-500 bg-blue-500 text-white rounded-md shadow-sm";
      } else {
        button.className =
          "px-3 py-1 border border-gray-300 bg-white text-gray-700 rounded-md hover:bg-gray-50";
      }
      button.onclick = () => {
        currentPage = page;
        dongBoDanhSachTodo();
      };
    }
    paginationContainer.appendChild(button);
  });

  const nextBtn = document.createElement("button");
  nextBtn.innerHTML = `<svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"></path></svg>`;
  nextBtn.className = `px-3 py-2 border rounded-lg hover:bg-gray-100 ${
    currentPage === totalPages ? "opacity-50 cursor-not-allowed" : ""
  }`;
  nextBtn.disabled = currentPage === totalPages;
  nextBtn.onclick = () => {
    if (currentPage < totalPages) {
      currentPage++;
      dongBoDanhSachTodo();
    }
  };
  paginationContainer.appendChild(nextBtn);
};

const updatePaginationInfo = (totalItems, currentItemsCount) => {
  const infoSpan = document.getElementById("pagination-info");

  if (totalItems === 0) {
    infoSpan.innerHTML = "No results found";
    return;
  }

  const start = (currentPage - 1) * limit + 1;
  const end = start + currentItemsCount - 1;

  infoSpan.innerHTML = `
        Showing <span class="font-semibold text-gray-900">${start}</span> 
        to <span class="font-semibold text-gray-900">${end}</span> 
        of <span class="font-semibold text-gray-900">${totalItems}</span> Tasks
    `;
};

const capNhatThongKe = () => {
  const total = danhSachTodo.length;

  const completed = danhSachTodo.filter((todo) => todo.completed).length;

  const inProgress = total - completed;

  const statTotalEl = document.getElementById("stat-total");
  const statProgressEl = document.getElementById("stat-inprogress");
  const statCompletedEl = document.getElementById("stat-completed");

  if (statTotalEl) statTotalEl.innerText = total;
  if (statProgressEl) statProgressEl.innerText = inProgress;
  if (statCompletedEl) statCompletedEl.innerText = completed;
};

const ganSuKienChoNut = () => {
  for (let btn of deleteButtons) {
    btn.onclick = function () {
      const index = parseInt(this.dataset.index);
      const idToDelete = index + 1;
      xoaTodo(idToDelete);
    };
  }

  for (let btn of editButtons) {
    btn.onclick = function () {
      const index = parseInt(this.dataset.index);
      const idToEdit = index + 1;
      chuanBiSuaTodo(idToEdit);
    };
  }
};

const xoaTodo = (id) => {
  if (confirm("Bạn có chắc chắn muốn xóa công việc này?")) {
    if (idDangSua) {
      document.getElementById("add-cancel").click();
    }
    danhSachTodo = danhSachTodo.filter((item) => item.id !== id);
    danhSachTodo.forEach((item, index) => {
      item.id = index + 1;
    });
    soLuongTodo = danhSachTodo.length;
    capNhatDanhSachTodo();
    dongBoDanhSachTodo();
  }
};

const chuanBiSuaTodo = (id) => {
  const todo = danhSachTodo.find((item) => item.id === id);
  if (todo) {
    addInput.value = todo.title;
    addDate.value = todo.deadline;

    idDangSua = id;

    addSubmit.innerText = "Lưu lại";
    addSubmit.classList.add("bg-orange-300", "hover:bg-orange-500");

    addForm.style.display = "block";
    coDangHienThiForm = true;
  }
};
////////////////////////////////////////////////////

addButton.onclick = () => {
  if (coDangHienThiForm === false) {
    addForm.style.display = "block";
    coDangHienThiForm = true;
  } else {
    addForm.style.display = "none";
    coDangHienThiForm = false;
  }
};

addSubmit.onclick = () => {
  const todoInput = addInput.value;
  const deadlineInput = addDate.value;

  if (!todoInput || todoInput.trim() === "") {
    alert("Bạn chưa nhập nội dung, hãy kiểm tra lại");
    return;
  }

  if (idDangSua) {
    const todo = danhSachTodo.find((item) => item.id === idDangSua);
    if (todo) {
      todo.title = todoInput;
      todo.deadline = deadlineInput;
    }

    idDangSua = null;
    addSubmit.innerText = "Add todo";
    addSubmit.classList.remove("bg-orange-300", "hover:bg-orange-500");

    capNhatDanhSachTodo();
    dongBoDanhSachTodo();

    addInput.value = "";
    if (addDate) addDate.value = "";
    addForm.style.display = "none";
    coDangHienThiForm = false;
    return;
  }

  const maxId =
    danhSachTodo.length > 0 ? Math.max(...danhSachTodo.map((t) => t.id)) : 0;
  soLuongTodo = maxId + 1;

  const newTodo = {
    id: soLuongTodo,
    title: todoInput,
    deadline: deadlineInput,
    completedAt: null,
    completed: false,
  };

  themToDo(newTodo);

  const totalPages = Math.ceil(danhSachTodo.length / limit);
  currentPage = totalPages;
  trangThaiLoc = "all";
  const btnText = document.querySelector("#filter-btn span");
  if (btnText) btnText.innerText = "Tất cả";

  dongBoDanhSachTodo();

  addInput.value = "";
  if (addDate) addDate.value = "";
};

addCancel.onclick = () => {
  addForm.style.display = "none";
  coDangHienThiForm = false;

  addInput.value = "";
  if (addDate) addDate.value = "";
  idDangSua = null;
  addSubmit.innerText = "Add todo";
  addSubmit.classList.remove("bg-orange-300", "hover:bg-orange-500");
};

searchInput.oninput = () => {
  tuKhoaTimKiem = searchInput.value.trim().toLowerCase();
  currentPage = 1;
  dongBoDanhSachTodo();
};

dongBoDanhSachTodo();
