<template>
  <div class="user-info-container">
    <div class="user-info-box" id="userInfoBox">
      <!-- 标题 -->
      <h2 class="title">{{ title }}</h2>

      <el-form
        ref="ruleFormRef"
        :model="detailData"
        :rules="rules"
        label-width="120px"
        class="demo-ruleForm"
        :size="formSize"
        status-icon
      >
        <el-row :gutter="20">
          <el-col :span="12" :offset="0">
            <el-form-item :label="$t('msg.cost.customerName')" prop="customer">
              <el-input
                readonly
                @click="customerDialogClick"
                v-model="detailData.customer"
              >
                <template #suffix
                  ><el-icon style="margin-right: 10px"><Search /></el-icon
                ></template>
              </el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12" :offset="0">
            <el-form-item :label="$t('msg.cost.year')" prop="year">
              <el-date-picker
                v-model="detailData.year"
                clear-icon="CircleClose"
                @change="pickerSelect($event)"
                type="year"
              />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="12" :offset="0">
            <el-form-item
              :label="$t('msg.cost.softwareEngineer')"
              prop="softwareEngineer"
            >
              <el-input v-model="detailData.softwareEngineer" />
            </el-form-item>
          </el-col>
          <el-col :span="12" :offset="0">
            <el-form-item
              :label="$t('msg.cost.seniorSoftwareEngineer')"
              prop="seniorSoftwareEngineer"
            >
              <el-input v-model="detailData.seniorSoftwareEngineer" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="12" :offset="0">
            <el-form-item
              :label="$t('msg.cost.systemEngineer')"
              prop="systemEngineer"
            >
              <el-input v-model="detailData.systemEngineer" />
            </el-form-item>
          </el-col>
          <el-col :span="12" :offset="0">
            <el-form-item
              :label="$t('msg.cost.seniorSystemEngineer')"
              prop="seniorSystemEngineer"
            >
              <el-input v-model="detailData.seniorSystemEngineer" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="12" :offset="0">
            <el-form-item
              :label="$t('msg.cost.dbaEngineer')"
              prop="dbaEngineer"
            >
              <el-input v-model="detailData.dbaEngineer" />
            </el-form-item>
          </el-col>
          <el-col :span="12" :offset="0">
            <el-form-item
              :label="$t('msg.cost.seniorDbaEngineer')"
              prop="seniorDbaEngineer"
            >
              <el-input v-model="detailData.seniorDbaEngineer" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="12" :offset="0">
            <el-form-item :label="$t('msg.cost.seniorSap')" prop="seniorSap">
              <el-input v-model="detailData.seniorSap" />
            </el-form-item>
          </el-col>
          <el-col :span="12" :offset="0">
            <el-form-item
              :label="$t('msg.cost.intermediateSap')"
              prop="intermediateSap"
            >
              <el-input v-model="detailData.intermediateSap" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-form-item>
          <el-button type="primary" @click="onConfirm(ruleFormRef)">{{
            $t('msg.universal.confirm')
          }}</el-button>
          <el-button @click="onCancel(ruleFormRef)">{{
            $t('msg.universal.cancel')
          }}</el-button>
        </el-form-item>
      </el-form>

      <CoststandardDialog
        v-model="systemInformationVisible"
        :tableName="tableName"
        :id="selectId"
        @costSelect="getCostSelect"
      >
      </CoststandardDialog>
    </div>
    <!-- </el-card> -->
  </div>
  <!-- </el-dialog> -->
</template>

<script setup>
import { ref, reactive, watch, onActivated } from 'vue'
import { costCreate, costEdit, costDisplay } from '@/api/cost'
import { ElMessage, FormInstance } from 'element-plus'
import { useI18n } from 'vue-i18n'
import { validatetext } from '@/utils/validate'
import { useRoute, useRouter } from 'vue-router'
import CoststandardDialog from './coststandardDialog.vue'
import dayjs from 'dayjs'
import store from '@/store'

const formSize = ref('default')
const ruleFormRef = ref(FormInstance)
const route = useRoute()
const router = useRouter()

const rules = reactive({
  systemEngineer: [{ validator: validatetext, trigger: 'blur' }],
  seniorSystemEngineer: [{ validator: validatetext, trigger: 'blur' }],
  dbaEngineer: [{ validator: validatetext, trigger: 'blur' }],
  seniorDbaEngineer: [{ validator: validatetext, trigger: 'blur' }],
  softwareEngineer: [{ validator: validatetext, trigger: 'blur' }],
  seniorSoftwareEngineer: [{ validator: validatetext, trigger: 'blur' }],
  intermediateSap: [{ validator: validatetext, trigger: 'blur' }],
  seniorSap: [{ validator: validatetext, trigger: 'blur' }],
  customer: [{ validator: validatetext, trigger: 'blur' }],
  year: [{ validator: validatetext, trigger: 'blur' }]
})

// 确定按钮点击事件
const i18n = useI18n()
const title = ref()
const costInformationId = route.params.id

// 数据相关
const detailData = ref({})
const getCostDisplay = async () => {
  detailData.value = await costDisplay({
    table: 'coststandard',
    id: route.params.id
  })
  detailData.value = detailData.value[0]
  detailData.value.year = dayjs().format('YYYY')
  console.log(detailData.value.year)
}
onActivated(() => {
  if (costInformationId) {
    title.value = i18n.t('msg.cost.edit')
    getCostDisplay()
  } else {
    title.value = i18n.t('msg.cost.add')
  }
})

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
  console.log(Object.keys(detailData.value).length)
  if (Object.keys(detailData.value).length < 5) {
    validate.value = false
  } else {
    validate.value = true
  }
  console.log(validate.value, detailData.value)
  if (route.params.id && validate.value) {
    delete detailData.value.customer
    console.log('edit', detailData.value)
    detailData.value.updateUser = store.getters.userInfo.username
    detailData.value.updateTime = dayjs().format('YYYY-MM-DD HH:mm:ss')
    const dataUpdate = await costEdit({
      table: 'coststandard',
      data: detailData
    })
    if (dataUpdate === '更新数据成功') {
      ElMessage.success(i18n.t('msg.cost.updateSuccess'))
      // 数据更新成功
      closed(ruleFormRef)
    } else if (dataUpdate === '数据已存在不能重复') {
      ElMessage.warning(i18n.t('msg.cost.existsSuccess'))
      // 数据更新成功
      closed(ruleFormRef)
    }
  } else if (validate.value) {
    console.log('create', detailData.value)
    delete detailData.value.customer
    detailData.value.createUser = store.getters.userInfo.username
    detailData.value.createTime = dayjs().format('YYYY-MM-DD HH:mm:ss')
    // delete detailData.value.domainManagerName
    const dataCreate = await costCreate({
      table: 'coststandard',
      data: detailData
    })
    if (dataCreate) {
      ElMessage.success(i18n.t('msg.cost.addSuccess'))
      // 数据更新成功
      closed(ruleFormRef)
    } else if (dataCreate === '数据已存在不能重复') {
      ElMessage.warning(i18n.t('msg.cost.existsSuccess'))
      // 数据更新成功
      closed(ruleFormRef)
    }
  }
}

const closed = (ruleFormRef) => {
  if (!ruleFormRef) return
  ruleFormRef.resetFields()
  router.push('/basics/coststandard')
}

// 关闭
const onCancel = (ruleFormRef) => {
  closed(ruleFormRef)
}

// 弹出窗口
const systemInformationVisible = ref(false)
const tableName = ref('')

const customerDialogClick = () => {
  systemInformationVisible.value = true
  tableName.value = 'customerinformation'
  selectId.value = route.params.id
}

const selectId = ref('')
// 关闭dialog时重置selectUserId
watch(systemInformationVisible, (val) => {
  if (!val) selectId.value = ''
})

const getCostSelect = (item) => {
  if (item) {
    // if (item.domainManager) {
    //   detailData.value.domainManagerId = item.id
    //   detailData.value.domainManagerName = item.domainManager
    //   console.log('domainManager', detailData.value, item)
    // } else {
    detailData.value.customerId = item.id
    detailData.value.customer = item.customer
    console.log('customer', detailData.value, item)
    // }
  }
}

const pickerSelect = (val) => {
  detailData.value.year = dayjs(val).format('YYYY')
}
// getCostSelect()
</script>

<style lang="scss" scoped>
.print-box {
  margin-bottom: 20px;
  text-align: right;
}
.user-info-box {
  width: 1000px;
  margin: 0 auto;
  .title {
    text-align: center;
    margin-bottom: 18px;
    margin-top: 30px;
  }
  .header {
    display: flex;
    ::v-deep .el-descriptions {
      flex-grow: 1;
    }

    .avatar {
      width: 187px;
      box-sizing: border-box;
      padding: 30px 20px;
      border: 1px solid #ebeef5;
      border-left: none;
    }
    .remark {
      margin-right: 12px;
    }
  }
  .body {
    ul {
      list-style: none;
      li {
        span {
          margin-right: 62px;
        }
      }
    }
  }
  .foot {
    margin-top: 42px;
    text-align: right;
    .edit {
      float: right;
    }
  }
}
</style>
