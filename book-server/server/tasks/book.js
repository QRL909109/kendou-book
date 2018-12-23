const cp = require("child_process");
const { resolve } = require("path");
const mongoose = require("mongoose");

exports.taskBook = async bookId => {
  const Book = mongoose.model("Book");
  console.log('拿到bookId', bookId);

  const script = resolve(__dirname, "../crawler/book.js");
  const child = cp.fork(script, []);
  let invoked = false;

  child.on("error", err => {
    if (invoked) return;

    invoked = true;

    console.log("task book error:", err);
  });

  child.on("exit", code => {
    if (invoked) return;

    invoked = true;
    let err = code === 0 ? null : new Error("exit code " + code);

    console.log("task book exit:", err);
  });

  child.on("message", async data => {
    let book = await Book.findOne({
      bookId: data.bookId
    });

    let saveBook = new Book(data);

    if (book) {
      if (book.chapterNum != saveBook.chapterNum) {
        Book.updateOne(
          { bookId: data.bookId },
          { chapterNum: data.chapterNum }
        );
      }
    } else {
      await saveBook.save();
    }
  });

  child.send({
    bookId
  });
};
