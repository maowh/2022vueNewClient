import { createI18n } from 'vue-i18n'
import zhLocale from './lang/zh'
import enLocale from './lang/en'
import store from '@/store'

const messages = {
  en: {
    msg: {
      ...enLocale
    }
  },
  zh: {
    msg: {
      ...zhLocale
    }
  }
}
// const locale = 'zh'
function getLanguage() {
  return store && store.getters && store.getters.language
}

const i18n = createI18n({
  // 使用Composition API 模式，则需要将其设置为false
  legacy: false,
  // 全局注入$t函数
  globalInjection: true,
  locale: getLanguage(),
  // locale,
  messages
})

export default i18n
