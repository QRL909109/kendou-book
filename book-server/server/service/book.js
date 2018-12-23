import { isNumber } from '../lib/common.js'
const mongoose = require('mongoose')
const Book = mongoose.model('Book')
const Chapter = mongoose.model('Chapter')
const { taskChapter } = require('../tasks/chapter')
const { taskBook } = require('../tasks/book')

const LIMIT = 30

function setPageNum(skip) {
  skip = skip - 1
  return skip && isNumber(+skip) ? +skip * LIMIT : 0
}

const filterPoint = {
  meta: 0,
  _id: 0
}
export const getAllBook = async (id, page = 1) => {
  let skip = setPageNum(page)
  let query = {}
  if (id) {
    query.bookId = id
  }
  const books = await Book.find(query, filterPoint).skip(skip || 0)
  return books
}

/**
 * 
 * @param {书本ID} id 
 * @param { limit = LIMIT(30) skip } query 
 */
export const getBookInChapter = async (query) => {
  let { page, sort, id } = query
  let skip = setPageNum(page)
  
  const chapters = await Chapter.find({
    bookId: id
  }, {
    title: 1,
    chapterId: 1,
    _id: 0
  }).skip(skip || 0).sort({chapterId: +sort || -1}) // .limit(LIMIT)

  const info = await Book.findOne({
    bookId: id
  })
  return {
    info,
    list: chapters
  }
}

export const getDetailChapter = async (data) => {
  const chapter = await Chapter.findOne({
    chapterId: data.chapterId,
    bookId: data.bookId
  }, {
    content: 1,
    title: 1,
    chapterId: 1
  })
  // console.log('getDetailChapter::', chapter)
  return chapter
}

export const getPrevChapter = async (data) => {
  const chapter = await Chapter.find({
    chapterId: {
      '$lt': data.chapterId
    },
    bookId: data.bookId
  }, {
    content: 1,
    title: 1,
    chapterId: 1
  }).limit(1).sort({chapterId: -1})
  return chapter
}

export const getNextChapter = async (data) => {

  const chapter = await Chapter.find({
    chapterId: {
      '$gt': data.chapterId
    },
    bookId: data.bookId
  }, {
    content: 1,
    title: 1,
    chapterId: 1
  }).limit(1)

  return chapter
}

export const fetchBook = async (id) => {
  const book = await Book.findOne({
    bookId: id
  })
  
  // 如果有这本书
  if (!book) {
    taskBook(id)
    taskChapter(id, 0)
    
    console.log('开始跑任务啦', id)
    return {
      isExit: false,
    }
  } else {
    return {
      isExit: true,
      bookId: id
    }
  }
}