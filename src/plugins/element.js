// eslint-disable-next-line import/no-duplicates
import ElementPlus, { ElTable } from 'element-plus'

// eslint-disable-next-line import/no-duplicates
// import ElementPlus from 'element-plus'
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
ElTable.TableColumn.props.showOverflowTooltip = {
  type: Boolean,
  default: true
}
// ElForm.props.labelPosition = {
//   type: String,
//   default: 'top'
// }
// ElForm.props.scrollToError = {
//   type: Boolean,
//   default: true
// }
// ElTable.TableColumn.props.renderHeader = {
//   type: Function,
//   default: ({ column }) => {
//     var l = column.label.length
//     var f = 12
//     column.minWidth = f * (l + 2) // 加上一个文字长度
//     return (
//       'div', { class: 'table-head', style: { width: '100%' } }, [column.label]
//     )
//   }
// }

ElTable.TableColumn.props.renderHeader = {
  type: Function,
  default: ({ column }) => {
    var width = 0
    // 新建一个 span
    var span = document.createElement('span')
    // 设置表头名称
    span.innerText = column.label
    // 设置表头class
    span.className = 'getTextWidth'
    // 临时插入 document
    document.querySelector('body').appendChild(span)
    // 获取span标签的宽度
    width = document.querySelector('.getTextWidth').offsetWidth
    // 重点：获取span最小宽度,设置当前列,注意这里加了20,字段较多时还是有挤压,且渲染后的div内左右padding都是10,所以+20.如果有排序按钮要记得再加上24,排序按钮的宽度是24(可能还有边距/边框等值，需要根据实际情况加上)
    column.minWidth = width + 50
    // 移除 document 中临时的 span
    document.querySelector('.getTextWidth').remove()
    return (
      'span', { class: 'table-head', style: { width: '100%' } }, [column.label]
    )
  }
}

export default (app) => {
  // app.use(ElementPlus, { locale })
  app.use(ElementPlus, {
    // 调整element组件的全局大小，官网有说明
    size: 'small',
    locale: store.getters.language === 'en' ? en : zhCn
  })
}
