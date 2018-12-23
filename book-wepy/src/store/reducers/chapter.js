import { handleActions } from 'redux-actions'
import { CHANGE_CHAPTER_STORE, CHANGE_CHAPTER_SORT } from '../types/index'

let defaultState = {
  chapterId: '',
  sort: 1,
  bookId: ''
}

export default handleActions({
  [CHANGE_CHAPTER_STORE] (state, action) {
    return {
      ...state,
      ...action.payload
    }
  }
}, defaultState)