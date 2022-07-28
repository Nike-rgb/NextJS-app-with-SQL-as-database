//require("dotenv").config();
//const mysql = require("mysql2");
const { v4: uuidv4 } = require("uuid");

/*const pool = mysql.createPool({
  host: process.env.host,
  user: process.env.user,
  database: process.env.database_name,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});*/

async function query(query_str) {
  return pool.query(query_str);
}

export async function fetch_all_books() {
  const query_str = `
    select * from book_details_view;
  `;
  try {
    const books = await query(query_str);
    return books;
  } catch (err) {
    throw err;
  }
}

export async function fetch_book_by_isbn(book_isbn) {
  const query = `
    select * from book_details_view
    where isbn = ${book_isbn};
  `;
  try {
    const books = await query(query);
    return books;
  } catch (err) {
    throw err;
  }
}

export async function search_books(search_query) {
  const books = await fetch_all_books();
  query = search_query.split(",");
  const regexps = query.map((q) => new RegExp(q, "i"));
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

export async function createOrder(order_cart, customer_details) {
  const { full_name, phone_number, address } = customer_details;
  const customer_id = uuidv4();
  const order_id = uuidv4();
  const books = order_cart.books;
  //await query(`CALL create_new_customer(${customer_id}, ${full_name}, ${address}, ${phone_number})`);
  //await query(`CALL create_new_order(${order_id}, ${customer_id}, ${new Date().getTime()}, "in progress")`);
  const add_to_order_book_query = "INSERT into order_book values ";
  Object.values(books).forEach((order_book) => {
    add_to_order_book_query += `(${order_id}, ${order_book.book.isbn})`;
  });
  //await query(add_to_order_book_query);

  console.log(
    `CALL create_new_customer(${customer_id}, ${full_name}, ${address}, ${phone_number})`
  );
  console.log(
    `CALL create_new_order(${order_id}, ${customer_id}, ${new Date().getTime()}, "in progress")`
  );
  console.log(add_to_order_book_query);
}
