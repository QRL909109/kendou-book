import { CHANGE_SETTING } from '../types/index'
import { createAction } from 'redux-actions'
import { setStorageSync } from '@/utils/storage'

export const changeSetting = createAction(CHANGE_SETTING, async (data) => {
  let { fontSize, backGround } = data
  try {
    setStorageSync('setting', {
      fontSize,
      backGround
    })
  } catch (error) {
    console.error(error)
    return {}
  }
  return data
})