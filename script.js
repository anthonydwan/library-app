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
    return
}

function createBookInLib() {
    const newBook = createBookObject(myLibrary.length - 1)
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

    const hiddenInfo = document.createElement("div")
    newBook.id = `bookObject${i}`
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
    
    bookRead.classList.add("bookRead", "readButton")
    bookNotRead.classList.add("bookNotRead", "readButton")
    buttonDiv.classList.add("buttonDiv")
    bookRead.textContent = "Read"
    bookNotRead.textContent = "Not Read"
    if (myLibrary[i].read) {
        bookRead.classList.add("readButtonActive")
    } else {
        bookNotRead.classList.add("active")
    }

    buttonDiv.appendChild(bookRead)
    buttonDiv.appendChild(bookNotRead)
    const hiddenList = [pages, genre, summary, review, rating, buttonDiv]
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

function ifread(bookTag, i) {
    if (myLibrary[i].read) {
        bookTag.classList.add("read")
    }
}

function openbookTag() {
    this.childNodes[1].classList.add("active");
}

function closebookTag() {
    this.childNodes[1].classList.remove("active");
    const reflow = this.offsetHeight;
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

