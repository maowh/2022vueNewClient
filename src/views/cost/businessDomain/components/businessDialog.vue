<template>
  <el-dialog
    :title="title"
    :model-value="modelValue"
    :before-close="handleClose"
  >
    <el-form
      ref="ruleFormRef"
      :model="detailData"
      :rules="rules"
      label-width="120px"
      class="demo-ruleForm"
      :size="formSize"
      status-icon
    >
      <el-form-item
        :label="$t('msg.cost.businessDomainName')"
        prop="businessName"
      >
        <el-col :span="20">
          <el-input style="width: 100%" v-model="detailData.businessName" />
        </el-col>
      </el-form-item>
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
import {
  defineProps,
  defineEmits,
  ref,
  watch,
  reactive
  // onActivated
} from 'vue'
import { costDetail, costCreate, costEdit } from '@/api/cost'
import { ElMessage, FormInstance } from 'element-plus'
import { useI18n } from 'vue-i18n'
import { validatetext } from '@/utils/validate'
// import { userName, currentTime } from '@/utils/userTime.js'
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

const rules = reactive({
  businessName: [{ validator: validatetext, trigger: 'blur' }]
})

// 确定按钮点击事件
const i18n = useI18n()
const title = ref()
title.value = i18n.t('msg.cost.add')

// 当前用户角色
const detailData = ref({})
// 获取当前用户角色
const getCostDetail = async () => {
  const res = await costDetail({
    table: 'businessdomain',
    id: props.id
  })
  detailData.value = res
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
  console.log(ruleFormRef)
  ruleFormRef.validate((valid) => {
    console.log(valid)
    if (valid) {
      validate.value = true
    } else {
      validate.value = false
    }
  })
  if (props.id && validate.value) {
    detailData.value.updateUser = store.getters.userInfo.username
    detailData.value.updateTime = dayjs().format('YYYY-MM-DD HH:mm:ss')
    const dataUpdate = await costEdit({
      table: 'businessdomain',
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
    detailData.value.createUser = store.getters.userInfo.username
    detailData.value.createTime = dayjs().format('YYYY-MM-DD HH:mm:ss')
    if (detailData.value.businessName !== null) {
      const dataCreate = await costCreate({
        table: 'businessdomain',
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
}
// 关闭
const closed = (ruleFormRef) => {
  if (!ruleFormRef) return
  ruleFormRef.resetFields()
  emits('update:modelValue', false)
}

const handleClose = () => {
  // if (!ruleFormRef) return
  // ruleFormRef.resetFields()
  emits('update:modelValue', false)
}
</script>

<style lang="scss" scoped></style>
