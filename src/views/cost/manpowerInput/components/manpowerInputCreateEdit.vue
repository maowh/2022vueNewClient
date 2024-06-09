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
        <el-form-item :label="$t('msg.cost.id')" prop="id">
          <el-input disabled v-model="detailData.id" />
        </el-form-item>
        <el-form-item :label="$t('msg.cost.projectName')" prop="projectName">
          <el-input
            @click="customerDialogClick"
            v-model="detailData.projectName"
            readonly
          >
            <template #suffix
              ><el-icon style="margin-right: 10px"><Search /></el-icon
            ></template>
          </el-input>
        </el-form-item>
        <el-form-item :label="$t('msg.cost.year')" prop="year">
          <el-date-picker
            v-model="detailData.year"
            clear-icon="CircleClose"
            type="year"
            disabled="true"
          />
        </el-form-item>
        <el-form-item :label="$t('msg.cost.category')" prop="category">
          <el-select
            v-model="detailData.category"
            class="m-2"
            placeholder="请选择"
          >
            <el-option
              v-for="item in ListBusiness"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
        </el-form-item>
        <el-form-item
          :label="$t('msg.cost.RegularEmployees')"
          prop="RegularEmployees"
        >
          <el-input v-model="detailData.RegularEmployees" />
        </el-form-item>
        <el-form-item
          :label="$t('msg.cost.OutsourcedEmployees')"
          prop="OutsourcedEmployees"
        >
          <el-input v-model="detailData.OutsourcedEmployees" />
        </el-form-item>

        <el-form-item>
          <el-button type="primary" @click="onConfirm(ruleFormRef)">{{
            $t('msg.universal.confirm')
          }}</el-button>
          <el-button @click="onCancel(ruleFormRef)">{{
            $t('msg.universal.cancel')
          }}</el-button>
        </el-form-item>
      </el-form>

      <ManpowerInputDialog
        v-model="systemInformationVisible"
        :tableName="tableName"
        :id="selectId"
        @costSelect="getCostSelect"
      >
      </ManpowerInputDialog>
    </div>
    <!-- </el-card> -->
  </div>
  <!-- </el-dialog> -->
</template>

<script setup>
import { ref, reactive, watch, onActivated } from 'vue'
import { costCreate, costEdit, costDisplay, costList } from '@/api/cost'
import { ElMessage, FormInstance } from 'element-plus'
import { useI18n } from 'vue-i18n'
import { validatetext } from '@/utils/validate'
import { useRoute, useRouter } from 'vue-router'
import ManpowerInputDialog from './manpowerInputDialog.vue'
import dayjs from 'dayjs'
import store from '@/store'

const formSize = ref('default')
const ruleFormRef = ref(FormInstance)
const route = useRoute()
const router = useRouter()

const rules = reactive({
  taxIncluded: [{ validator: validatetext, trigger: 'blur' }],
  contractPrice: [{ validator: validatetext, trigger: 'blur' }],
  projectName: [{ validator: validatetext, trigger: 'blur' }],
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
    table: 'manpowerinput',
    id: route.params.id
  })
  detailData.value = detailData.value[0]
  // detailData.value.year = dayjs().set('year', detailData.value.year)
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
    delete detailData.value.projectName
    detailData.value.year = dayjs(detailData.value.year).format('YYYY')
    // delete detailData.value.year
    detailData.value.updateUser = store.getters.userInfo.username
    detailData.value.updateTime = dayjs().format('YYYY-MM-DD HH:mm:ss')
    console.log('edit', detailData.value)
    const dataUpdate = await costEdit({
      table: 'manpowerinput',
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
    delete detailData.value.projectName
    detailData.value.year = dayjs(detailData.value.year).format('YYYY')
    // delete detailData.value.year
    // delete detailData.value.domainManagerName
    detailData.value.createUser = store.getters.userInfo.username
    detailData.value.createTime = dayjs().format('YYYY-MM-DD HH:mm:ss')
    const dataCreate = await costCreate({
      table: 'manpowerinput',
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
  router.push('/outsourcing/manpowerInput')
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
  tableName.value = 'project'
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
    detailData.value.projectId = item.id
    detailData.value.projectName = item.projectName
    detailData.value.year = item.year
    console.log('customer', detailData.value, item)
    // }
  }
}

// const pickerSelect = (val) => {
//   detailData.value.year = dayjs(val).format('YYYY')
// }
// getCostSelect()
</script>

<style lang="scss" scoped>
.print-box {
  margin-bottom: 20px;
  text-align: right;
}
.user-info-box {
  width: 500px;
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
