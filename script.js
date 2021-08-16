let myLibrary = [];
const submit = document.querySelector("#submit")
const bookForm = document.forms.bookForm
const addBookButton = document.querySelector("#addBookButton")
const modalBox = document.querySelector("#modalBox")
const overlay = document.querySelector("#overlay")
const cancel = document.querySelector("#cancel")

function Book(
    title = "unknown",
    author = "unknown",
    pages = 0,
    genre = "unknown",
    read = false) {
    this.title = title
    this.author = author
    this.pages = pages
    this.genre = genre
    this.read = read
};

Book.prototype.info = function () {
    start = `${this.title} by ${this.author}, ${this.pages} pages, `
    if (this.read) {
        infoStr = start + "read already"
    } else {
        infoStr = start + "not read yet"
    }
    return infoStr
}

function addBookToLibrary() {
    const addTitle = document.querySelector("#title").value
    const addAuthor = document.querySelector("#author").value
    const addPages = document.querySelector("#pages").value
    const addRead = document.querySelector("input[name='read']:checked").value
    const addBook = new Book(addTitle, addAuthor, addPages, addRead)
    myLibrary.push(addBook)
    modalBox.classList.remove("active")
    return
}

function openAddBookModalBox() {
    modalBox.classList.add("active")
    overlay.classList.add("active")

}

function closeModalBoxOutside(e) {
    console.log(e.target)
    if (e.target == overlay || e.target == cancel) {
        modalBox.classList.remove("active");
        overlay.classList.remove("active");
    }

}

submit.addEventListener('click', addBookToLibrary)
addBookButton.addEventListener('click', openAddBookModalBox)
window.addEventListener('click', closeModalBoxOutside)




