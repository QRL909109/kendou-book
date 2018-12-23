const Koa = require('koa')
const { resolve } = require('path')
const { connect, initSchemas } = require('./database/init')
const R = require('ramda')
const MIDDLEWARES = ['common', 'router']
const { taskRunning } = require('./tasks/running')

const useMiddlewares = (app) => {
  R.map(
    R.compose(
      R.forEachObjIndexed(
        initWith => initWith(app)
      ),
      require,
      name => resolve(__dirname, `./middlewares/${name}`)
    )
  )(MIDDLEWARES)
}

;(async () => {
  // 连接数据库

  await connect()
  // 初始化schema
  initSchemas()

  try {
    taskRunning()
  } catch (error) {
    console.error('task-error', error)
  }

  const app = new Koa()
  await useMiddlewares(app)
  app.listen(4455, () => {
    console.log('http://localhost:4455')
  })
})()