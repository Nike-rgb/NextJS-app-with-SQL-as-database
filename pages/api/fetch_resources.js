import book_db from "../../db/books.json";
const books = book_db.map((book) => {
  const isbn = "" + book.isbn;
  let correct_isbn = isbn;
  if (isbn.length < 10) {
    for (let i = 0; i < 10 - isbn.length; i++) {
      correct_isbn = "0" + correct_isbn;
    }
  }
  if (isbn.length > 10 && isbn.length < 13) {
    for (let i = 0; i < 10 - isbn.length; i++) {
      correct_isbn = "0" + correct_isbn;
    }
  }
  book.isbn = correct_isbn;
  return book;
});

export async function fetchBestSellers(req, res) {
  return books.filter((book) => book.rating > 4);
}

export async function fetchAllBooks(req, res) {
  return books;
}

export async function fetchBooksRefined(searchFrom, query) {
  query = query.split(",");
  const regexps = query.map((q) => new RegExp(q, "i"));
  switch (searchFrom) {
    case "all": {
      return books.filter((book) => {
        let match = false;
        for (let i = 0; i < regexps.length; i++) {
          if (regexps[i].test(book.title) || regexps[i].test(book.authors)) {
            match = true;
            break;
          }
        }
        return match;
      });
    }
    case "author": {
      return books.filter((book) => book.author == query);
    }
  }
}

export async function fetchBookById(isbn) {
  return books.find((book) => book.isbn == isbn) ?? {};
}
