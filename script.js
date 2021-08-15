function Book(title, author, pages, read){
    this.title = title
    this.author = author
    this.pages = pages
    this.read = read
};

Book.prototype.info = function(){
    start = `${this.title} by ${this.author}, ${this.pages} pages, `
    if(this.read){
        infoStr = start + "read already"
    } else {
        infoStr = start + "not read yet"
    }
    return infoStr
}


hobbit = new Book("the Hobbit","Tolkein", "350", true)
console.log(hobbit.info())