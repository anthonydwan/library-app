
let myLibrary = [];

const submit = document.querySelector("#submit")
const bookForm = document.forms.bookForm
const addBookButton = document.querySelector("#addBookButton")
const modalBox = document.querySelector(".modalBox")
const overlay = document.querySelector("#overlay")
const cancel = document.querySelector("#cancel")
const container = document.querySelector("#container")


function Book(
    title = "unknown",
    author = "unknown",
    pages = 0,
    genre = "unknown",
    summary = "unknown",
    review = "unknown",
    rating = 0,
    read = false) {
    this.title = title
    this.author = author
    this.pages = pages
    this.genre = genre
    this.summary = summary
    this.review = review
    this.rating = rating
    this.read = read
};

Book.prototype.info = function () {
    start = `${this.title} by ${this.author}, ${this.pages} pages,`
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
    const addGenre = document.querySelector("#genre").value
    const addReview = document.querySelector("#review").value
    const addSummary = document.querySelector("#summary").value
    const addRating = document.querySelector("#rating").value
    const addRead = document.querySelector("input[name='read']:checked").value
    const addBook = new Book(
        addTitle, addAuthor, addPages,
        addGenre, addReview, addSummary,
        addRating, addRead)
    myLibrary.push(addBook)
    modalBox.classList.remove("active")
    overlay.classList.remove("active")
    saveLibraryLocal()
    return
}

function createBookInLib() {
    createBookObject(myLibrary.length - 1)
}

function createBookObject(i) {
    const newBook = document.createElement("div")
    const newBookNameTag = document.createElement("div")
    const bookName = document.createElement("p")
    const author = document.createElement("p")
    const pages = document.createElement("p")
    const genre = document.createElement("p")
    const review = document.createElement("p")
    const summary = document.createElement("p")
    const rating = document.createElement("p")
    const buttonDiv = document.createElement("div")
    const bookRead = document.createElement("button")
    const bookNotRead = document.createElement("button")
    const edit = document.createElement("button")
    const remove = document.createElement("button")

    const hiddenInfo = document.createElement("div")
    newBook.id = `book${i}`
    newBookNameTag.classList.add("bookNameTag")
    newBook.classList.add("bookDiv")
    bookName.classList.add("bookName")
    hiddenInfo.classList.add("hiddenInfo")
    bookName.textContent = myLibrary[i].title
    author.textContent = `by ${myLibrary[i].author}`
    pages.textContent = `Pages: appox. ${myLibrary[i].pages}p`
    genre.textContent = `Genre: ${myLibrary[i].genre}`
    summary.textContent = `Summary: ${myLibrary[i].summary}`
    review.textContent = `Review: ${myLibrary[i].genre}`
    rating.textContent = `Rating: ${myLibrary[i].rating} Stars`
    bookRead.id = `book${i}ReadButton`
    bookNotRead.id = `book${i}NotReadButton`
    bookRead.classList.add("bookRead", "readButton")
    bookNotRead.classList.add("bookNotRead", "readButton")
    buttonDiv.classList.add("buttonDiv")
    bookRead.textContent = "Read"
    bookNotRead.textContent = "Not Read"
    if (myLibrary[i].read === "1") {
        bookRead.classList.add("readButtonActive")
    } else {
        bookNotRead.classList.add("readButtonActive")
    }

    edit.classList.add("editRemove")
    edit.textContent = "Edit"

    remove.classList.add("editRemove")
    remove.textContent = "Remove"
    buttonDiv.appendChild(bookRead)
    buttonDiv.appendChild(bookNotRead)
    const hiddenList = [pages, genre, summary, review, rating, buttonDiv, edit, remove]
    newBookNameTag.appendChild(bookName)
    newBookNameTag.appendChild(author)
    for (item of hiddenList) {
        hiddenInfo.append(item)
    }
    newBook.appendChild(newBookNameTag)
    newBook.appendChild(hiddenInfo)
    container.appendChild(newBook)

    newBook.addEventListener("mouseover", openbookTag)
    newBook.addEventListener("mouseleave", closebookTag)
    bookRead.addEventListener("click", changeHaveRead(mode="haveRead"))
    bookNotRead.addEventListener("click",changeHaveRead(mode="haveNotRead"))
    return newBook
}

function openBookModalBox() {
    modalBox.classList.add("active")
    overlay.classList.add("active")
}

function closeModalBoxOutside(e) {
    if (e.target == overlay || e.target == cancel) {
        modalBox.classList.remove("active")
        overlay.classList.remove("active")
    };
};

function changeHaveRead(mode="haveRead"){
    return function(e){
        console.log(e.target)
        const id = e.target.parentNode.parentNode.parentNode.id
        const bookIndex = parseInt(id.slice(4))
        if (mode === "haveRead"){
            myLibrary[bookIndex].read = "1"
        } else{
            myLibrary[bookIndex].read = "0"
        }
        checkReadButton(bookIndex)
        saveLibraryLocal()
    }
}

function checkReadButton(i) {
    const read = document.querySelector(`#book${i}ReadButton`)
    const notRead = document.querySelector(`#book${i}NotReadButton`)
    if (myLibrary[i].read === "1") {
        read.classList.add("readButtonActive")
        notRead.classList.remove("readButtonActive")
    } else {
        read.classList.remove("readButtonActive")
        notRead.classList.add("readButtonActive")
    }
}

function saveLibraryLocal() {
    localStorage.setItem('saved', JSON.stringify(myLibrary))
}

function openbookTag() {
    this.childNodes[1].classList.add("active");
}

function closebookTag() {
    this.childNodes[1].classList.remove("active");
}

submit.addEventListener('click', function () {
    addBookToLibrary()
    createBookInLib()
})

addBookButton.addEventListener('click', openBookModalBox)
overlay.addEventListener('click', closeModalBoxOutside)

const newBook = document.createElement("div")
const bookDiv = document.querySelectorAll(".bookDiv")

if ('saved' in localStorage) {
    myLibrary = JSON.parse(localStorage.getItem('saved'))
    for (let i = 0; i < myLibrary.length; i++) {
        createBookObject(i)
    }
}

