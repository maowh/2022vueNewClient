import store from '@/store'
import dayjs from 'dayjs'

export const userName = store.getters.userInfo.username

export const currentTime = dayjs().format('YYYY-MM-DD HH:mm:ss')
