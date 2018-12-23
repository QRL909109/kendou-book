import { CHANGE_CHAPTER_STORE } from '../types/index'
import { createAction } from 'redux-actions'
import { setStorageSync } from '@/utils/storage'

export const changeChapterStore = createAction(CHANGE_CHAPTER_STORE, async (data) => {
  let { bookId, chapterId, sort } = data
  try {
    setStorageSync(bookId, {
      chapterId,
      sort
    })
  } catch (error) {
    console.error(error)
    return {}
  }
  return data
})