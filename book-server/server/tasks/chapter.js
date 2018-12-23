
const cp = require('child_process')
const { resolve } = require('path')
const mongoose = require('mongoose')
const { childProcessStore } = require('../lib/child_process_store')

/**
 * 
 * @param {书本ID} bookId 
 * @param {从哪里开始查找} startNum 
 */
exports.taskChapter = async(bookId, startNum = 0) => {
  
  const Chapter = mongoose.model('Chapter')
  
  const script = resolve(__dirname, '../crawler/chapter.js')
  const child = cp.fork(script, [])
  let invoked = false


  child.on('error', err => {
    if (invoked) return

    invoked = true

    console.log('task chapter error:', err)
  })

  child.on('exit', (code, signal) => {
    if(invoked) return

    let err = null
    
    invoked = true
    
    if(code === 0 ) {
      err = null
    } else if (!signal){
      new Error('exit signal ' + signal)
    } else {
      new Error('exit code ' + code)
    }

    console.log('task chapter exit::', err)
  })

  child.on('message', async data => {
    console.log('开始爬取章节：', data.title)
    // 先找一下是否有数据了
    let chapterData = await Chapter.findOne({
      chapterId: data.chapterId
    })

    // 需要将拿到的章节与存储的章节做对比  防止作者占坑
    if (!chapterData) {
      chapterData = new Chapter(data)
      await chapterData.save()
      return
    } 
    // 进行字数对比 相差50字符
    if ((data.content.length - 50 >= 0) && (data.content.length - 50 > chapterData.content.length)) {
      
      Chapter.updateOne (
        { chapterId: +data.chapterId },
        { content : data.content }
      );

    }
  })
  
  child.send({
    bookId,
    startNum
  })
  // 存储所有章节的爬取  用于跑进程删除子进程
  childProcessStore.set('chapter', child)
}
 