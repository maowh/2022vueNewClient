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
          ><el-form-item
            :label="$t('msg.cost.systemEngineer')"
            prop="systemEngineer"
          >
            <el-input v-model="detailData.systemEngineer" /> </el-form-item
        ></el-col>
        <el-col :span="12"
          ><el-form-item
            :label="$t('msg.cost.seniorSystemEngineer')"
            prop="seniorSystemEngineer"
          >
            <el-input v-model="detailData.seniorSystemEngineer" /></el-form-item
        ></el-col>
      </el-row>
      <el-row>
        <el-col :span="12"
          ><el-form-item :label="$t('msg.cost.dbaEngineer')" prop="dbaEngineer">
            <el-input v-model="detailData.dbaEngineer" /> </el-form-item
        ></el-col>
        <el-col :span="12"
          ><el-form-item
            :label="$t('msg.cost.seniorDbaEngineer')"
            prop="seniorDbaEngineer"
          >
            <el-input v-model="detailData.seniorDbaEngineer" /></el-form-item
        ></el-col>
      </el-row>
      <el-row>
        <el-col :span="12"
          ><el-form-item
            :label="$t('msg.cost.softwareEngineer')"
            prop="softwareEngineer"
          >
            <el-input v-model="detailData.softwareEngineer" /> </el-form-item
        ></el-col>
        <el-col :span="12"
          ><el-form-item
            :label="$t('msg.cost.seniorSoftwareEngineer')"
            prop="seniorSoftwareEngineer"
          >
            <el-input
              v-model="detailData.seniorSoftwareEngineer" /></el-form-item
        ></el-col>
      </el-row>
      <el-row>
        <el-col :span="12"
          ><el-form-item
            :label="$t('msg.cost.intermediateSap')"
            prop="intermediateSap"
          >
            <el-input v-model="detailData.intermediateSap" /> </el-form-item
        ></el-col>
        <el-col :span="12"
          ><el-form-item :label="$t('msg.cost.seniorSap')" prop="seniorSap">
            <el-input v-model="detailData.seniorSap" /></el-form-item
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
import { costDetail, costCreate, costEdit } from '@/api/cost'
import { ElMessage, FormInstance } from 'element-plus'
import { useI18n } from 'vue-i18n'
import { validatetext } from '@/utils/validate'

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
  systemEngineer: [{ validator: validatetext, trigger: 'blur' }],
  seniorSystemEngineer: [{ validator: validatetext, trigger: 'blur' }],
  dbaEngineer: [{ validator: validatetext, trigger: 'blur' }],
  seniorDbaEngineer: [{ validator: validatetext, trigger: 'blur' }],
  softwareEngineer: [{ validator: validatetext, trigger: 'blur' }],
  seniorSoftwareEngineer: [{ validator: validatetext, trigger: 'blur' }],
  intermediateSap: [{ validator: validatetext, trigger: 'blur' }],
  seniorSap: [{ validator: validatetext, trigger: 'blur' }]
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
    table: 'coststandard',
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
  ruleFormRef.validate((valid) => {
    console.log(valid)
    if (valid) {
      validate.value = true
    } else {
      validate.value = false
    }
  })
  console.log(props.id, validate.value)
  if (props.id && validate.value) {
    console.log('修改')
    const dataUpdate = await costEdit({
      table: 'coststandard',
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
    console.log('新建')
    // if (detailData.value.customer !== null) {
    const dataCreate = await costCreate({
      table: 'coststandard',
      data: detailData
    })
    if (dataCreate === '新增数据成功') {
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
// }
// 关闭
const closed = (ruleFormRef) => {
  if (!ruleFormRef) return
  ruleFormRef.resetFields()
  emits('update:modelValue', false)
}
</script>

<style lang="scss" scoped></style>
