<template>
  <UploadExcel :onSuccess="onSuccess"></UploadExcel>
</template>

<script setup>
import {} from 'vue'
import UploadExcel from '@/components/UploadExcel'
import { USER_RELATIONS, formatData } from '@/utils/getHeaderRow'
import { ElMessage } from 'element-plus'
import { useRouter } from 'vue-router'
import { userImport } from '@/api/sys'
import { useI18n } from 'vue-i18n'
// import i18n from '@/i18n'

const router = useRouter()
const i18n = useI18n()
// 数据解析成功后的回调
const onSuccess = async ({ header, results }) => {
  const updateData = generateData(results)
  await userImport(updateData)
  ElMessage.success({
    message: results.length + i18n.t('msg.excel.importSuccess'),
    // message: results.length,
    type: 'success'
  })
  router.push('/user/manage')
  console.log(results)
}

// 筛选数据
const generateData = (results) => {
  const arr = []
  results.forEach((item) => {
    const userInfo = {}
    Object.keys(item).forEach((key) => {
      if (USER_RELATIONS[key] === 'openTime') {
        userInfo[USER_RELATIONS[key]] = formatData(item[key])
        return
      }
      userInfo[USER_RELATIONS[key]] = item[key]
    })
    arr.push(userInfo)
  })
  return arr
}
</script>

<style lang="scss" scoped></style>
