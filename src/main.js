import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import installElementPlus from './plugins/element'
import * as Icons from '@element-plus/icons-vue'
// 导入全局样式
import '@/styles/index.scss'
// 导入svgIcon
import installIcons from '@/icons'
// 导入路由守卫
import './permission'
// 导入国际化
import i18n from './i18n'
// filter
import installFilter from '@/filters'
// 导入打印指令
import installDirective from '@/directives'
// 引入图表
import * as echarts from 'echarts'

const app = createApp(App)

// vue3 给原型上挂载属性
app.config.globalProperties.$echarts = echarts

Object.keys(Icons).forEach((key) => {
  app.component(key, Icons[key])
})
installElementPlus(app)
installIcons(app)
installFilter(app)
installDirective(app)
app.use(store).use(router).use(i18n).mount('#app')
