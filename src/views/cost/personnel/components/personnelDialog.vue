<template>
  <el-dialog :title="title" :model-value="modelValue">
    <el-form
      ref="ruleFormRef"
      :model="detailData"
      :rules="rules"
      label-width="120px"
      class="demo-ruleForm"
      :size="formSize"
      status-icon
    >
      <el-row>
        <el-col :span="12"
          ><el-form-item :label="$t('msg.cost.name')" prop="name">
            <el-input v-model="detailData.name" /> </el-form-item
        ></el-col>
      </el-row>
      <el-row>
        <el-col :span="12">
          <el-form-item :label="$t('msg.cost.business')" prop="business">
            <el-select
              v-model="detailData.business"
              class="m-2"
              placeholder="请选择"
            >
              <el-option
                v-for="item in ListBusiness"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              />
            </el-select> </el-form-item
        ></el-col>
      </el-row>
      <el-row>
        <el-col :span="12">
          <el-form-item :label="$t('msg.cost.attribute')" prop="attribute">
            <el-select
              v-model="detailData.attribute"
              class="m-2"
              placeholder="请选择"
            >
              <el-option
                v-for="item in ListAttribute"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              />
            </el-select> </el-form-item
        ></el-col>
      </el-row>

      <el-form-item>
        <el-button type="primary" @click="onConfirm(ruleFormRef)">{{
          $t('msg.universal.confirm')
        }}</el-button>
        <el-button @click="closed(ruleFormRef)">{{
          $t('msg.universal.cancel')
        }}</el-button>
      </el-form-item>
    </el-form>
  </el-dialog>
</template>

<script setup>
import { defineProps, defineEmits, ref, watch, reactive } from 'vue'
import { costDetail, costCreate, costEdit, costList } from '@/api/cost'
import { ElMessage, FormInstance } from 'element-plus'
import { useI18n } from 'vue-i18n'
import { validatetext } from '@/utils/validate'
// import { ListBusiness } from '@/utils/business'
import store from '@/store'
import dayjs from 'dayjs'

const props = defineProps({
  modelValue: {
    type: Boolean,
    required: true
  },
  id: {
    type: String
  }
})

const formSize = ref('default')
const ruleFormRef = ref(FormInstance)
// const business = ref('')

// const validatetext = (rule, value, callback) => {
//   if (!value && value === '') {
//     callback(new Error('请输入内容'))
//   } else if (value.length > 25) {
//     callback(new Error('输入内容需要小于25个字符'))
//   } else {
//     callback()
//   }
// }

const rules = reactive({
  name: [{ validator: validatetext, trigger: 'blur' }],
  business: [{ validator: validatetext, trigger: 'blur' }]
})

// 确定按钮点击事件
const i18n = useI18n()
const title = ref()
title.value = i18n.t('msg.cost.add')

// 获取属性信息
const ListAttribute = ref([
  { value: '正式', label: '正式' },
  { value: '外包', label: '外包' }
])

// 获取类别信息
const ListBusiness = ref([])
const getListBusiness = async () => {
  const result = await costList({
    table: 'businessdomain',
    page: 1,
    size: 100
  })
  result.list.forEach((item) => {
    ListBusiness.value.push({
      value: item.businessName,
      label: item.businessName
    })
  })
}
getListBusiness()

// 当前用户角色
const detailData = ref({})
// 获取当前用户
const getCostDetail = async () => {
  const res = await costDetail({
    table: 'personnel',
    id: props.id
  })
  console.log(res)
  detailData.value = res
  // business.value = detailData.value.business
}
// 从父组件传值，当父组件传过来的userId不为空时候就获取数据库中该用户的角色
watch(
  () => props.id,
  (val) => {
    if (val) {
      title.value = i18n.t('msg.cost.edit')
      getCostDetail()
    } else {
      title.value = i18n.t('msg.cost.add')
      detailData.value = {}
    }
  }
)

const emits = defineEmits(['update:modelValue', 'updateRole'])
// 确定按钮点击事件
const validate = ref(false)
const onConfirm = async (ruleFormRef) => {
  ruleFormRef.validate((valid) => {
    console.log(valid)
    if (valid) {
      validate.value = true
    } else {
      validate.value = false
    }
  })
  // detailData.value.business = ''
  console.log(detailData.value, Object.keys(detailData.value).length)
  if (Object.keys(detailData.value).length < 2) {
    validate.value = false
  } else {
    validate.value = true
  }

  console.log(props.id, validate.value)
  if (props.id && validate.value) {
    // detailData.value.business = business.value
    detailData.value.updateUser = store.getters.userInfo.username
    detailData.value.updateTime = dayjs().format('YYYY-MM-DD HH:mm:ss')
    const dataUpdate = await costEdit({
      table: 'personnel',
      data: detailData
    })
    if (dataUpdate === '更新数据成功') {
      ElMessage.success(i18n.t('msg.cost.updateSuccess'))
      // 数据更新成功
      emits('updateList')
      closed(ruleFormRef)
    } else if (dataUpdate === '数据已存在不能重复') {
      ElMessage.warning(i18n.t('msg.cost.existsSuccess'))
      // 数据更新成功
      emits('updateList')
      closed(ruleFormRef)
    }
  } else if (validate.value) {
    // detailData.value.business = business.value
    detailData.value.createUser = store.getters.userInfo.username
    detailData.value.createTime = dayjs().format('YYYY-MM-DD HH:mm:ss')
    const dataCreate = await costCreate({
      table: 'personnel',
      data: detailData
    })
    if (dataCreate) {
      ElMessage.success(i18n.t('msg.cost.addSuccess'))
      // 数据更新成功
      emits('updateList')
      closed(ruleFormRef)
    } else if (dataCreate === '数据已存在不能重复') {
      ElMessage.warning(i18n.t('msg.cost.existsSuccess'))
      // 数据更新成功
      emits('updateList')
      closed(ruleFormRef)
    }
  }
}

// 关闭
const closed = (ruleFormRef) => {
  if (!ruleFormRef) return
  ruleFormRef.resetFields()
  emits('update:modelValue', false)
  detailData.value = {}
}
</script>

<style lang="scss" scoped></style>
