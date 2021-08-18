let myLibrary = [];


const bookForm = document.forms.bookForm
const addBookButton = document.querySelector("#addBookButton")
const modalBox = document.querySelector(".modalBox")
const overlay = document.querySelector("#overlay")
const cancel = document.querySelector("#cancel")
const container = document.querySelector("#container")
const addTitle = document.querySelector("#title")
const addAuthor = document.querySelector("#author")
const addPages = document.querySelector("#pages")
const addGenre = document.querySelector("#genre")
const addReview = document.querySelector("#review")
const addSummary = document.querySelector("#summary")
const addRating = document.querySelector("#rating")

if ('uniqueNum' in localStorage) {
    var uniqueNum = JSON.parse(localStorage.getItem('uniqueNum'))
} else {
    var uniqueNum = 0
};

function Book(
    title = "unknown",
    author = "unknown",
    pages = 0,
    genre = "unknown",
    summary = "unknown",
    review = "unknown",
    rating = 0,
    read = false) {
    this.bookId = uniqueNum
    this.title = title
    this.author = author
    this.pages = pages
    this.genre = genre
    this.summary = summary
    this.review = review
    this.rating = rating
    this.read = read
    uniqueNum++
};

Book.prototype.info = function () {
    start = `${this.title} by ${this.author}, ${this.pages} pages,`
    if (this.read) {
        infoStr = start + "read already"
    } else {
        infoStr = start + "not read yet"
    };
    return infoStr
};


function createSubmitButton() {
    const submit = document.createElement("button")
    submit.id = "submit"
    submit.textContent = "submit"
    return submit
}

function addSubmitFunction(submit, mode = "addBook") {
    if (mode === "addBook") {
        submit.addEventListener('click', function () {
            const newBook = addBookToLibrary()
            createBookinUI(newBook)
            submit.parentNode.removeChild(submit)
        })
    } else if (mode === "editBook"){
        submit.addEventListener('click', function () {
        })
    }
}

function addBookToLibrary() {
    const addRead = document.querySelector("input[name='read']:checked").value
    const addBook = new Book(
        addTitle.value, addAuthor.value, addPages.value,
        addGenre.value, addReview.value, addSummary.value,
        addRating.value, addRead)
    myLibrary.push(addBook)
    modalBox.classList.remove("active")
    overlay.classList.remove("active")
    saveLibraryLocal()
    saveUniqueNum()
    return addBook
};

function createBookinUI(bookObject) {
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
    const i = bookObject.bookId
    const hiddenInfo = document.createElement("div")
    newBook.id = `book${i}`
    newBookNameTag.classList.add("bookNameTag")
    newBook.classList.add("bookDiv")
    bookName.classList.add("bookName")
    hiddenInfo.classList.add("hiddenInfo")
    bookName.textContent = bookObject.title
    author.textContent = `by ${bookObject.author}`
    pages.textContent = `Pages: appox. ${bookObject.pages}p`
    genre.textContent = `Genre: ${bookObject.genre}`
    summary.textContent = `Summary: ${bookObject.summary}`
    review.textContent = `Review: ${bookObject.genre}`
    rating.textContent = `Rating: ${bookObject.rating} Stars`
    bookRead.id = `book${i}ReadButton`
    bookNotRead.id = `book${i}NotReadButton`
    bookRead.classList.add("bookRead", "readButton")
    bookNotRead.classList.add("bookNotRead", "readButton")
    buttonDiv.classList.add("buttonDiv")
    bookRead.textContent = "Read"
    bookNotRead.textContent = "Not Read"
    if (bookObject.read === "1") {
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
    const hiddenList = [
        pages, genre, summary,
        review, rating, buttonDiv,
        edit, remove]
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
    bookRead.addEventListener("click", changeHaveRead(mode = "haveRead"))
    bookNotRead.addEventListener("click", changeHaveRead(mode = "haveNotRead"))
    edit.addEventListener('click', openModal(mode = "editBook"))
    edit.addEventListener('click', fillEditModal)
    remove.addEventListener('click', removeBook)
    return newBook
};

function openbookTag() {
    this.childNodes[1].classList.add("active");
};

function closebookTag() {
    this.childNodes[1].classList.remove("active");
};

function openModal(mode = "addBook") {
    return function (e) {
        const submit = createSubmitButton()
        if (mode === "addBook"){
            addSubmitFunction(submit, mode="addBook")
        }  else if (mode === "editBook") {
            fillEditModal(e)
            addSubmitFunction(submit, mode="editBook")
        }
        modalBox.insertBefore(submit, cancel)
        modalBox.classList.add("active")
        overlay.classList.add("active")
    }
};

function closeModal(e) {
    if (e.target == overlay || e.target == cancel) {
        const submit = document.querySelector("#submit")
        submit.parentNode.removeChild(submit)
        modalBox.classList.remove("active")
        overlay.classList.remove("active")
    };
};

function changeHaveRead(mode = "haveRead") {
    return function (e) {
        const id = e.target.parentNode.parentNode.parentNode.id
        for (let i = 0; i < myLibrary.length; i++) {
            if (myLibrary[i].bookId === parseInt(id.slice(4))) {
                if (mode === "haveRead") {
                    myLibrary[i].read = "1"
                } else {
                    myLibrary[i].read = "0"
                }
                checkReadButton(i, myLibrary[i].bookId)
                saveLibraryLocal()
                break;
            };
        };
    };
};

function fillEditModal(e) {
    const id = e.target.parentNode.parentNode.id
    for (let i = 0; i < myLibrary.length; i++) {
        if (myLibrary[i].bookId === parseInt(id.slice(4))) {
            addTitle.value = myLibrary[i].title
            addAuthor.value = myLibrary[i].author
            addPages.value = myLibrary[i].pages
            addGenre.value = myLibrary[i].genre
            addReview.value = myLibrary[i].review
            addSummary.value = myLibrary[i].summary
            addRating.value = myLibrary[i].rating
            if (myLibrary[i].read === "1") {
                document.querySelector("#readYes").checked = true
            } else {
                document.querySelector("#readNo").checked = true
            }
        }
    }
}

function removeBook() {
    const id = this.parentNode.parentNode.id
    for (let i = 0; i < myLibrary.length; i++) {
        if (myLibrary[i].bookId === parseInt(id.slice(4))) {
            myLibrary.splice(i, 1)
            break;
        };
    };
    const remove = document.querySelector(`#${id}`)
    remove.parentNode.removeChild(remove)
    saveLibraryLocal()
};

function checkReadButton(i, bookId) {
    const read = document.querySelector(`#book${bookId}ReadButton`)
    const notRead = document.querySelector(`#book${bookId}NotReadButton`)
    if (myLibrary[i].read === "1") {
        read.classList.add("readButtonActive")
        notRead.classList.remove("readButtonActive")
    } else {
        read.classList.remove("readButtonActive")
        notRead.classList.add("readButtonActive")
    };
};

function saveUniqueNum() {
    localStorage.setItem('uniqueNum', JSON.stringify(uniqueNum))
};

function saveLibraryLocal() {
    localStorage.setItem('saved', JSON.stringify(myLibrary))
};

addBookButton.addEventListener('click', openModal(mode = "addBook"))
overlay.addEventListener('click', closeModal)

const newBook = document.createElement("div")
const bookDiv = document.querySelectorAll(".bookDiv")

if ('saved' in localStorage) {
    myLibrary = JSON.parse(localStorage.getItem('saved'))
    for (let i = 0; i < myLibrary.length; i++) {
        createBookinUI(myLibrary[i])
    }
}

