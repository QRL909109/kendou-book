import { combineReducers } from 'redux'
import book from './book'
import chapter from './chapter'
import setting from './setting'

export default combineReducers({
  book,
  chapter,
  setting
})