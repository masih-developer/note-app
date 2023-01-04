const $ = document;
const notesWrapper = $.querySelector(".wrapper");
const addNoteBtn = $.querySelector(".add-box");
const popupTitle = $.querySelector("header p");
const popupBox = $.querySelector(".popup-box");
const popupCloseBtn = $.querySelector(".content header i");
const popupInput = $.querySelector(".title input");
const popupDescription = $.querySelector(".description textarea");
const popupSubmitBtn = $.querySelector("form button");

const months = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
];

const days = ["Sunday", "Monday", "Tudsday", "Wednesday", "Thursday", "Friday", "Saturday"];

let isUpdateModal = false;
let notes = [];
let indexOfEditNote = null;
let noteFragment = $.createDocumentFragment();

function openModal() {
    if (isUpdateModal) {
        popupTitle.innerHTML = "Update main note";
        popupSubmitBtn.innerHTML = "Update Note";
    } else {
        popupTitle.innerHTML = "Add new note";
        popupSubmitBtn.innerHTML = "Add Note";
    }

    popupBox.classList.add("show");
    popupInput.focus();

    window.addEventListener("click", (e) => {
        if (e.target.classList.contains("popup-box")) {
            closeModal();
        }
    });
}

function closeModal() {
    popupBox.classList.remove("show");
    clearInputs();
}

function generateDate() {
    let now = new Date();
    let year = now.getFullYear();
    let month = now.getMonth();
    let dayOfMonth = now.getDate();
    let dayOfWeek = now.getDay();
    return `${months[month]} ${dayOfMonth}, ${year} (${days[dayOfWeek]})`;
}

function openNoteSettings(elem) {
    $.querySelectorAll(".settings").forEach((item) => item.classList.remove("show"));
    elem.parentElement.classList.add("show");
}

function editNoteHandler(elem, index, title, desc) {
    console.log(elem, index, title, desc);
    popupInput.value = title;
    popupDescription.value = desc;
    isUpdateModal = true;
    openModal();
    indexOfEditNote = index;
    elem.parentElement.parentElement.classList.remove("show");
}

function deleteNoteHandler(elem, index) {
    let ask = window.confirm("Are you sure about deleting this Note?");
    if (ask) {
        notes.splice(index, 1);
        generateNotes();
        seveInLocalStorage();
    }
    elem.parentElement.parentElement.classList.remove("show");
}

function generateNotes() {
    notesWrapper.querySelectorAll(".note").forEach((item) => item.remove());
    let newNote = null;
    notes.forEach((item, index) => {
        newNote = $.createElement("li");
        newNote.classList.add("note");
        newNote.innerHTML = `
            <div class="details">
                <p>${item.title}</p>
                <span>${item.description}</span>
            </div>
            <div class="bottom-content">
                <span>${item.date}</span>
                <div class="settings">
                    <i class="uil uil-ellipsis-h" onclick="openNoteSettings(this)"></i>
                    <ul class="menu">
                        <li class="edit-note-btn" onclick="editNoteHandler(this, ${index},'${item.title}','${item.description}')">
                            <i class="uil uil-pen"></i>
                            Edit
                        </li>
                        <li class="delete-note-btn" onclick="deleteNoteHandler(this, ${index})">
                            <i class="uil uil-trash"></i>
                            Delete
                        </li>
                    </ul>
                </div>
            </div>

        `;
        noteFragment.appendChild(newNote);
    });
    notesWrapper.appendChild(noteFragment);
}

function seveInLocalStorage() {
    localStorage.setItem("notes", JSON.stringify(notes));
}

function clearInputs() {
    popupInput.value = "";
    popupDescription.value = "";
}

function checkValidNote() {
    let inputValue = popupInput.value.trim();
    let descriptionValue = popupDescription.value.trim();

    if (inputValue && descriptionValue) {
        let newNote = {
            title: inputValue,
            description: descriptionValue,
            date: generateDate(),
        };

        if (isUpdateModal) {
            notes.splice(indexOfEditNote, 1, newNote);
        } else {
            notes.push(newNote);
        }

        generateNotes();
        seveInLocalStorage();
        closeModal();
        clearInputs();
    } else {
        alert("invalid inputs!");
    }
}

addNoteBtn.addEventListener("click", () => {
    isUpdateModal = false;
    openModal();
});

popupCloseBtn.addEventListener("click", closeModal);

popupSubmitBtn.addEventListener("click", (e) => {
    e.preventDefault();
    checkValidNote();
});

window.addEventListener("load", () => {
    let getDatas = JSON.parse(localStorage.getItem("notes"));
    if (getDatas && getDatas.length !== 0) {
        notes = getDatas;
        generateNotes();
    }
});
