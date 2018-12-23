const { controller, get, post } = require('../lib/decorator')
const {
  getAllBook, // 拿到所有的书本
  getBookInChapter, // 拿到书的所有章节
  getDetailChapter, // 拿到具体章节的内容
  fetchBook, // 开始跑书
  getPrevChapter,
  getNextChapter,
} = require('../service/book')

@controller('/api/book')
export class bookController {
  @post('/all')
  async getAllBook (ctx, next) {
    let { id, page } = ctx.request.body.data
    const books = await getAllBook(id, page)
    ctx.body = {
      success: true,
      data: books
    }
  }

  @post('/detail')
  async getBookInChapter (ctx, next) {
    const list = await getBookInChapter(ctx.request.body.data)

    ctx.body = {
      success: true,
      data: list
    }
  }

  @post('/chapter')
  async getDetailChapter (ctx, next) {
    const { chapterId, bookId } = ctx.request.body.data
    const list = await getDetailChapter({ 
      chapterId, 
      bookId 
    })

    ctx.body = {
      success: true,
      data: list
    }
  }

  @post('/prev')
  async getPrevChapter (ctx, next) {
    const { chapterId, bookId } = ctx.request.body.data
    const data = await getPrevChapter({ 
      chapterId, 
      bookId 
    })

    ctx.body = {
      success: true,
      data
    }
  }

  @post('/next')
  async getNextChapter (ctx, next) {
    const { chapterId, bookId } = ctx.request.body.data
    const data = await getNextChapter({ 
      chapterId, 
      bookId 
    })

    ctx.body = {
      success: true,
      data
    }
  }
  
  @post('/find')
  async fetchBook (ctx, next) {
    const { id } = ctx.request.body.data
    const data = await fetchBook(id)
    ctx.body = {
      success: true,
      data
    }
  }
}