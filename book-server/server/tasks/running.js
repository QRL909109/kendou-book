const schedule = require('node-schedule')
const { resolve } = require('path')
const mongoose = require('mongoose')
const { taskBook } = require('./book')
const { taskChapter } = require('./chapter')
const { childProcessStore } = require('../lib/child_process_store')


exports.taskRunning = async () => {
  
  // 定义执行任务定时器
  let rule = new schedule.RecurrenceRule();

  rule.hour  = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24];
  rule.minute = 0
  // rule.second = [1, 21, 41];
  /**
   * SIGINT：程序终止信号，通常在用户按下CTRL+C时发出，用来通知前台进程终止进程
   * SIGTERM： terminate，程序结束信号，该信号可以被阻塞和处理，通常用来要求程序自己正常退出
   * SIGKILL：强制终止
   */
  let scheduleTask = schedule.scheduleJob(rule, () => {
    let childProcessed = childProcessStore.all()
    console.log("执行定时任务：" + new Date())
    Object.keys(childProcessed).forEach(item => {
      childProcessed[item].forEach(child => {
        child.kill('SIGINT') //SIGTERM
      })
    })
    childProcessStore.clear()
    handleTaskChapter()
  })
  
  // setTimeout(() => {
  //   scheduleTask.cancel()
  // }, 5000)
}

const handleTaskChapter = async () => {
  const Book = mongoose.model('Book')
  const Chapter = mongoose.model('Chapter')
  let allBook = await Book.find({})
  //将存储的书本都跑一遍，查看最新章节是否更新了
  allBook.forEach(async item => {
    // 激活爬数据 为下一次服务
    await taskBook(item.bookId)

    let count = await Chapter.find({
      bookId: item.bookId
    }).count()
    // 对比数据库里面的数据 与 新的总数对比
    if(item.chapterNum > count) {
      // 往后更新5章  防止有作者占坑的预告  
      taskChapter(item.bookId, count > 5 ? count - 5 : count)
      // taskChapter(item.bookId, count)
    }
    console.log('------------>', item.chapterNum, count)
  })
}