let myLibrary = [];
const submit = document.querySelector("#submit")
const bookForm = document.forms.bookForm
const addBookButton = document.querySelector("#addBookButton")
const modalBox = document.querySelector(".modalBox")
const overlay = document.querySelector("#overlay")
const cancel = document.querySelector("#cancel")
const bookColors = ["blue", "green", "orange", "red"]
const container = document.querySelector("#container")

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
    overlay.classList.remove("active")
    return
}

function createBookInLib() {
    const newBook = createBookObject(myLibrary.length - 1)
    const bookTag = createBookTag(myLibrary.length - 1)
    newBook.appendChild(bookTag)
}

function createBookObject(i) {
    const newBook = document.createElement("div")
    const bookImg = document.createElement("img")
    const bookName = document.createElement("p")
    newBook.id = `bookObject${i}`
    newBook.classList.add("bookDiv")
    bookImg.classList.add("book")
    bookName.classList.add("bookName")
    const color = bookColors[Math.round(Math.random() * 3)]
    bookImg.src = `images/${color}book.png`
    bookName.textContent = myLibrary[i].title
    newBook.appendChild(bookImg)
    newBook.appendChild(bookName)
    container.appendChild(newBook)
    newBook.addEventListener("click", openbookTag)
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



function openbookTag() {
    overlay.classList.add("active")
    this.childNodes[2].classList.add("active")
}

function createBookTag(i) {
    bookTag = document.createElement("div")
    bookTitle = document.createElement("p")
    bookAuthor = document.createElement("p")
    bookPages = document.createElement("p")
    bookRead = document.createElement("p")
    bookTag.classList.add("bookTag")
    bookTitle.textContent = myLibrary[i].title
    bookAuthor.textContent = myLibrary[i].author
    bookPages.textContent = `${myLibrary[i].pages} Pages`
    if (myLibrary[i].read) {
        bookRead.textContent = "Read"
    } else {
        bookRead.textContent = "Not Read"
    }
    bookTag.appendChild(bookTitle)
    bookTag.appendChild(bookAuthor)
    bookTag.appendChild(bookPages)
    bookTag.appendChild(bookRead)
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




