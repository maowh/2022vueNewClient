import ElementPlus from 'element-plus'
// import 'element-plus/lib/theme-chalk/index.css'
import 'element-plus/dist/index.css'

// import locale from 'element-plus/lib/locale/lang/zh-cn'

import zhCn from 'element-plus/es/locale/lang/zh-cn'
import en from 'element-plus/lib/locale/lang/en'
// 非vue组件使用store的方法
import store from '@/store'

// 全局禁用点击空白和按ESC键关闭DIALOG
// ElementPlus.ElDialog.props.closeOnClickModal.default = false
// ElementPlus.ElDialog.props.closeOnPressEscape.default = false

export default (app) => {
  // app.use(ElementPlus, { locale })
  app.use(ElementPlus, {
    // 调整element组件的全局大小，官网有说明
    size: 'small',
    locale: store.getters.language === 'en' ? en : zhCn
  })
}
