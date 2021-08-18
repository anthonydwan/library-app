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
    summary = "none",
    review = "none",
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

function addSubmitFunction(submit, mode = "addBook", id=null) {
    if (mode === "addBook") {
        submit.addEventListener('click', function () {
            const newBook = addBookToLibrary()
            createBookinUI(newBook)
            submit.parentNode.removeChild(submit)
        })
    } else if (mode === "editBook"){
        submit.addEventListener('click', function () {
            editBookInLib(id)
            submit.parentNode.removeChild(submit)
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
    ModalValueReset()
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
    bookRead.id = `book${i}ReadButton`
    bookNotRead.id = `book${i}NotReadButton`
    bookRead.classList.add("bookRead", "readButton")
    bookNotRead.classList.add("bookNotRead", "readButton")
    buttonDiv.classList.add("buttonDiv")
    bookRead.textContent = "Read"
    bookNotRead.textContent = "Not Read"

    insertInfo(bookName, author, pages, 
        genre, summary, review, 
        rating, bookRead, bookNotRead, 
        bookObject)

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
    remove.addEventListener('click', removeBook)
    return newBook
};

function insertInfo(
    bookName, author, pages, 
    genre, summary, review, 
    rating, bookRead, bookNotRead, 
    bookObject) {
    bookName.textContent = bookObject.title
    author.textContent = `by ${bookObject.author}`
    pages.textContent = `Pages: appox. ${bookObject.pages}p`
    genre.textContent = `Genre: ${bookObject.genre}`
    summary.textContent = `Summary: ${bookObject.summary}`
    review.textContent = `Review: ${bookObject.genre}`
    rating.textContent = `Rating: ${bookObject.rating} Stars`
    if (bookObject.read === "1") {
        bookRead.classList.add("readButtonActive")
    } else {
        bookNotRead.classList.add("readButtonActive")
    }
}

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
            id = fillEditModal(e)
            addSubmitFunction(submit,"editBook",id)
        }
        modalBox.insertBefore(submit, cancel)
        modalBox.classList.add("active")
        overlay.classList.add("active")
    }
};

function closeModal(e) {
    const submit = document.querySelector("#submit")
    submit.parentNode.removeChild(submit)
    modalBox.classList.remove("active")
    overlay.classList.remove("active")
    ModalValueReset();
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
            const bookObject = myLibrary[i]
            addTitle.value = bookObject.title
            addAuthor.value = bookObject.author
            addPages.value = bookObject.pages
            addGenre.value = bookObject.genre
            addReview.value = bookObject.review
            addSummary.value = bookObject.summary
            addRating.value = bookObject.rating
            if (bookObject.read === "1") {
                document.querySelector("#readYes").checked = true
            } else {
                document.querySelector("#readNo").checked = true
            }
            break;
        }
    }
    return id 
}

function ModalValueReset(){
    addTitle.value = null
    addAuthor.value = null
    addPages.value = null
    addGenre.value = null
    addReview.value = null
    addSummary.value = null
    addRating.value = null
    document.querySelector("#readYes").checked = false
    document.querySelector("#readNo").checked = false
}


function editBookInLib(id){
    for (let i = 0; i < myLibrary.length; i++) {
        if (myLibrary[i].bookId === parseInt(id.slice(4))) {
            const bookObject = myLibrary[i]
            bookObject.title = addTitle.value
            bookObject.author = addAuthor.value
            bookObject.pages = addPages.value
            bookObject.genre = addGenre.value
            bookObject.review = addReview.value
            bookObject.summary = addSummary.value
            bookObject.rating = addRating.value
            if (document.querySelector("#readYes").checked = true) {
                bookObject.read = "1"
            } else {
                bookObject.read = "0"
            }
            modalBox.classList.remove("active")
            overlay.classList.remove("active")
            editBookInUI(bookObject, id)
            saveLibraryLocal()
            break;
        }
    }
}

function editBookInUI(bookObject, id){
    const editBook = document.querySelector(`#${id}`)
    const bookName = editBook.childNodes[0].childNodes[0]
    const author = editBook.childNodes[0].childNodes[1]
    const pages = editBook.childNodes[1].childNodes[0]
    const genre = editBook.childNodes[1].childNodes[1]
    const summary = editBook.childNodes[1].childNodes[2]
    const review = editBook.childNodes[1].childNodes[3]
    const rating = editBook.childNodes[1].childNodes[4]
    const bookRead = document.querySelector(`#${id}ReadButton`)
    const bookNotRead = document.querySelector(`#${id}NotReadButton`)
    insertInfo(    
        bookName, author, pages, 
        genre, summary, review, 
        rating, bookRead, bookNotRead, 
        bookObject)
}

function insertInfo(
    bookName, author, pages, 
    genre, summary, review, 
    rating, bookRead, bookNotRead, 
    bookObject) {
    bookName.textContent = bookObject.title
    author.textContent = `by ${bookObject.author}`
    pages.textContent = `Pages: appox. ${bookObject.pages}p`
    genre.textContent = `Genre: ${bookObject.genre}`
    summary.textContent = `Summary: ${bookObject.summary}`
    review.textContent = `Review: ${bookObject.genre}`
    rating.textContent = `Rating: ${bookObject.rating} Stars`
    if (bookObject.read === "1") {
        bookRead.classList.add("readButtonActive")
        bookNotRead.classList.remove("readButtonActive")
    } else {
        bookRead.classList.remove("readButtonActive")
        bookNotRead.classList.add("readButtonActive")
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
cancel.addEventListener('click', closeModal)

const newBook = document.createElement("div")
const bookDiv = document.querySelectorAll(".bookDiv")

if ('saved' in localStorage) {
    myLibrary = JSON.parse(localStorage.getItem('saved'))
    for (let i = 0; i < myLibrary.length; i++) {
        createBookinUI(myLibrary[i])
    }
}

