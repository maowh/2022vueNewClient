import ElementPlus from 'element-plus'
// import 'element-plus/lib/theme-chalk/index.css'
import locale from 'element-plus/lib/locale/lang/zh-cn'
import 'element-plus/dist/index.css'
// import zhCn from 'element-plus/es/locale/lang/zh-cn'
// import en from 'element-plus/lib/locale/lang/en'

export default (app) => {
  app.use(ElementPlus, { locale })
}
