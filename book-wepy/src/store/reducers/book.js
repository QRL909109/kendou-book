import { handleActions } from 'redux-actions'
import { GET_BOOK_DETAIL } from '../types/index'

let defaultState = {
  info: '',
  list: []
}

export default handleActions({
  [GET_BOOK_DETAIL] (state, action) {
    return {
      ...state,
      ...action.payload
    }
  }
}, defaultState)