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

class Book{
    constructor( title = "unknown",
                author = "unknown",
                pages = 0,
                genre = "unknown",
                summary = "none",
                review = "abc",
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
    }
};

const systemModule = (() =>{

})();

const displayModule = (() => {
    titleError = document.querySelector("#titleError")
    authorError = document.querySelector("#authorError")
    genreError = document.querySelector("#genreError")


    const validChecker = (addField, errorField) =>{
        return function(event){
            if (addField.validity.valid){
                errorField.textContent = '';
                errorField.className = 'error';
            } else{
                showError(addField, errorField);
            }
        }
    }

    const submitCheck = (addField, errorField) =>{
        if (!addField.validity.valid){
            showError(addField, errorField);
            return true;
        } else{
            return false;
        }

    }

    addTitle.addEventListener('input', validChecker(addTitle, titleError))
    addAuthor.addEventListener('input', validChecker(addAuthor, authorError))
    addGenre.addEventListener('input', validChecker(addGenre, genreError))




    const showError = (addField, errorField) =>{
        if(addField.validity.valueMissing){
            errorField.textContent = "You must enter value"
        }
        errorField.className = 'error active'
    }

    return{
        showError,
        submitCheck
    }
})();

function createSubmitButton() {
    const submit = document.createElement("button")
    submit.id = "submit"
    submit.textContent = "submit"
    return submit
}

function addSubmitFunction(submit, mode = "addBook", id=null) {
    if (mode === "addBook") {
        submit.addEventListener('click', function () {
            if (
                displayModule.submitCheck(addTitle, titleError) ||
                displayModule.submitCheck(addAuthor, authorError) ||
                displayModule.submitCheck(addGenre, genreError)
                ){

            } else{
                const newBook = addBookToLibrary()
                createBookinUI(newBook)
                submit.parentNode.removeChild(submit)
            }
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
        addGenre.value, addSummary.value, addReview.value,
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
    const template = document.querySelector("#bookUItemplate")
    const node = template.content.cloneNode(true)
    const newBook = node.querySelector(".bookDiv")
    const bookName = node.querySelector(".bookName")
    const author = node.querySelector(".bookAuthor")
    const pages = node.querySelector(".bookPages")
    const genre = node.querySelector(".bookGenre")
    const summary = node.querySelector(".bookSummary")
    const review = node.querySelector(".bookReview")
    const rating = node.querySelector(".bookRating")
    const bookRead = node.querySelector(".bookRead")
    const bookNotRead = node.querySelector(".bookNotRead")
    const edit = node.querySelector(".edit")
    const remove = node.querySelector(".remove")

    const i = bookObject.bookId
    newBook.id = `book${i}`
    bookRead.id = `book${i}ReadButton`
    bookNotRead.id = `book${i}NotReadButton`

    insertInfo(bookName, author, pages, 
        genre, summary, review, 
        rating, bookRead, bookNotRead, 
        bookObject)

    container.appendChild(newBook)
    newBook.addEventListener("mouseover", openbookTag)
    newBook.addEventListener("mouseleave", closebookTag)
    bookRead.addEventListener("click", changeHaveRead(mode = "haveRead"))
    bookNotRead.addEventListener("click", changeHaveRead(mode = "haveNotRead"))
    edit.addEventListener('click', openModal(mode = "editBook"))
    remove.addEventListener('click', removeBook)
    return newBook
};

function openbookTag() {
    const hiddenInfo = this.querySelector(".hiddenInfo")
    hiddenInfo.classList.add("active");
};

function closebookTag() {
    const hiddenInfo = this.querySelector(".hiddenInfo")
    hiddenInfo.classList.remove("active");
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
    document.querySelector("#readYes").checked = true
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
    console.log(editBook)
    const bookName = editBook.querySelector(".bookName")
    const author = editBook.querySelector(".bookAuthor")
    const pages = editBook.querySelector(".bookPages")
    const genre = editBook.querySelector(".bookGenre")
    const summary = editBook.querySelector(".bookSummary")
    const review = editBook.querySelector(".bookReview")
    const rating = editBook.querySelector(".bookRating")
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
    review.textContent = `Review: ${bookObject.review}`
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

