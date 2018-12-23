import { handleActions } from 'redux-actions'
import { CHANGE_SETTING } from '../types/index'

let defaultState = {
  fontSize: 12,
  backGround: {
    value: 1,
    background: '#fff', // 白
    color: '#5C5F73', // 白
  }
}

export default handleActions({
  [CHANGE_SETTING] (state, action) {
    return {
      ...state,
      ...action.payload
    }
  }
}, defaultState)