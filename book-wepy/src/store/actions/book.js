import { GET_BOOK_DETAIL } from '../types/index'
import { createAction } from 'redux-actions'
import request from '@/utils/request'

export const getBookDetail = createAction(GET_BOOK_DETAIL, async (data) => {
  let res
  try {
    res = await request({
      url: '/api/book/detail',
      data: {
        sort: data.sort || 1,
        id: data.id
      }
    })
  } catch (error) {
    console.error(error)
    return {}
  }
  if (!res || !res.success) {
    console.log('fetch Book failed. msg:', res)
    return {}
  }
  return res.data
})