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
    rating = 0,
    read = false) {
    this.title = title
    this.author = author
    this.pages = pages
    this.genre = genre
    this.summary = summary
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
    const addRead = document.querySelector("input[name='read']:checked").value
    const addBook = new Book(addTitle, addAuthor, addPages, addGenre, addRead)
    myLibrary.push(addBook)
    modalBox.classList.remove("active")
    overlay.classList.remove("active")
    return
}

function createBookInLib() {
    const newBook = createBookObject(myLibrary.length - 1)
    const bookTag = createBookTag(myLibrary.length - 1)
    newBook.appendChild(bookTag)
    ifread(bookTag, myLibrary.length - 1)
}

function createBookObject(i) {
    const newBook = document.createElement("div")
    const bookImg = document.createElement("img")
    const bookName = document.createElement("p")
    newBook.id = `bookObject${i}`
    newBook.classList.add("bookDiv")
    bookName.classList.add("bookName")
    bookName.textContent = myLibrary[i].title
    newBook.appendChild(bookImg)
    newBook.appendChild(bookName)
    container.appendChild(newBook)
    newBook.addEventListener("mouseover", openbookTag)
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
        const bookTags = document.querySelectorAll(".bookTag")
        if (typeof bookTags !== "undefined") {
            for (bookTag of bookTags) {
                bookTag.classList.remove("active");
            };
        };
    };
};

function ifread(bookTag, i) {
    if (myLibrary[i].read) {
        bookTag.classList.add("read")
    }
}

function openbookTag() {
    this.childNodes[3].classList.add("active");
}

function closebookTag(){
    this.childNodes[3].classList.remove("active");
    const reflow = this.offsetHeight;
}

function createBookTag(i) {
    bookTag = document.createElement("div")
    bookTitle = document.createElement("p")
    bookAuthor = document.createElement("p")
    bookGenre = document.createElement("p")
    bookPages = document.createElement("p")
    bookRead = document.createElement("button")
    bookRead.id = "bookRead"
    bookRead.textContent = "Read"
    bookNotRead = document.createElement("button")
    bookNotRead.id = "bookNotRead"
    bookNotRead.textContent = "Not Read"
    bookTag.classList.add("bookTag")
    bookTitle.classList.add("bookTitle")
    bookAuthor.classList.add("bookAuthor")
    bookTitle.textContent = myLibrary[i].title
    bookAuthor.textContent = `by ${myLibrary[i].author}`
    bookGenre.textContent = `Genre: ${myLibrary[i].genre}`
    bookPages.textContent = `${myLibrary[i].pages} Pages`
    if (myLibrary[i].read) {
        bookRead.classList.add("active")
    } else {
        bookRead.classList.add("active")
    }
    const content = [bookTitle, bookAuthor, bookGenre, bookPages, bookRead, bookNotRead]
    for (item of content) {
        bookTag.appendChild(item)
    }
    return bookTag
}

submit.addEventListener('click', function () {
    addBookToLibrary()
    createBookInLib()
})

addBookButton.addEventListener('click', openBookModalBox)
overlay.addEventListener('click', closeModalBoxOutside)

const newBook = document.createElement("div")
const bookDiv = document.querySelectorAll(".bookDiv")


document.querySelector("#bookObject1").addEventListener("mouseover", openbookTag)
document.querySelector("#bookObject1").addEventListener("mouseleave", closebookTag)

