<template>
  <router-view />
</template>

<script setup>
// export default {
//   name: 'App'
// }
import { useStore } from 'vuex'
import { generateNewStyle, writeNewStyle } from '@/utils/theme'
// import { watchSwitchLang } from '@/utils/i18n'

// 全局关闭ESC

const store = useStore()
generateNewStyle(store.getters.mainColor).then((newStyle) => {
  writeNewStyle(newStyle)
})
// watchSwitchLang(() => {
//   if (store.getters.token) {
//     store.dispatch('user/getUserInfo')
//   }
// })
</script>

<style lang="scss" scoped>
:deep(.el-table .cell) {
  text-align: center !important;
  // white-space: nowrap;
}
:deep(.el-table tr th) {
  background-color: #d3d2d2;
  color: black;
}

// :deep(.el-table) {
//   width: 100%;
// }
// :deep(.el-table__header-wrapper table, .el-table__body-wrapper table) {
//   width: 100% !important;
// }
// :deep(.el-table__header, .el-table__body, .el-table__footer) {
//   table-layout: auto;
// }
// :deep(.el-table) {
//   table-layout: auto;
// }
// :deep(.el-table__header) {
//   table-layout: auto;
// }

// //设置超出不折行
// .tableAuto.el-table .cell {
//   white-space: nowrap;
// }
// :deep(.el-table thead tr th:first-child, tbody tr td:first-child) {
//   width: 8em;
//   min-width: 8em;
//   max-width: 8em;
//   word-break: break-all;
// }
</style>
