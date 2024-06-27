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
            <el-form-item
              :label="$t('msg.cost.projectName')"
              prop="projectName"
            >
              <el-input v-model="detailData.projectName" /> </el-form-item
          ></el-col>
          <el-col :span="12" :offset="0">
            <el-form-item :label="$t('msg.cost.year')" prop="year">
              <el-date-picker
                clear-icon="CircleClose"
                v-model="detailData.year"
                type="year"
                placeholder="请选择年份"
              />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="12" :offset="0">
            <el-form-item
              :label="$t('msg.cost.customerName')"
              prop="customerName"
            >
              <!-- readonly只能选择不能输入 -->
              <el-input
                readonly
                @click="customerDialogClick"
                v-model="detailData.customerName"
              >
                <template #suffix
                  ><el-icon style="margin-right: 10px"><Search /></el-icon
                ></template>
              </el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12" :offset="0">
            <el-form-item
              :label="$t('msg.cost.operationManager')"
              prop="operationManagerName"
            >
              <el-input
                readonly
                @click="operationManagerDialogClick"
                v-model="detailData.operationManagerName"
              >
                <template #suffix
                  ><el-icon style="margin-right: 10px"><Search /></el-icon
                ></template>
              </el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-form-item style="margin-top: 30px">
          <el-button type="primary" @click="confirmAdd(ruleFormRef)"
            >保存&并维护系统信息</el-button
          >
          <el-button @click="onCancel(ruleFormRef)">{{
            $t('msg.article.back')
          }}</el-button>
        </el-form-item>
        <el-row :gutter="20">
          <el-col v-if="isShow" :span="24" :offset="0">
            <el-table
              ref="multipleTableRef"
              :data="ListInformation"
              @selection-change="handleSelectionChange"
            >
              <el-table-column type="selection" width="50" />
              <el-table-column property="SystemName" label="系统名称" />
              <el-table-column property="business" label="类别" />
            </el-table>
          </el-col>
          <el-col v-else></el-col>
        </el-row>
      </el-form>

      <ProjectDialog
        v-model="systemInformationVisible"
        :tableName="tableName"
        :id="selectId"
        @costSelect="getCostSelect"
      >
      </ProjectDialog>
    </div>
    <!-- </el-card> -->
  </div>
  <!-- </el-dialog> -->
</template>

<script setup>
import { ref, reactive, watch, onActivated } from 'vue'
import {
  costCreate,
  costEdit,
  costDisplay,
  costList,
  costDel
} from '@/api/cost'
import { userImport } from '@/api/sys'
import { ElMessage, FormInstance } from 'element-plus'
import { useI18n } from 'vue-i18n'
import { validatetext } from '@/utils/validate'
import { useRoute, useRouter } from 'vue-router'
import ProjectDialog from './projectDialog.vue'
import dayjs from 'dayjs'
import store from '@/store'

const formSize = ref('default')
const ruleFormRef = ref(FormInstance)
const route = useRoute()
const router = useRouter()

const rules = reactive({
  SystemName: [{ validator: validatetext, trigger: 'blur' }],
  customerName: [{ validator: validatetext, trigger: 'blur' }],
  domainManagerName: [{ validator: validatetext, trigger: 'blur' }]
})

// 确定按钮点击事件
const i18n = useI18n()
const title = ref()
const costInformationId = route.params.id
// 数据相关
const detailData = ref({})

// 定义存储项目和系统信息对应的数据
const multipleSelection = ref([])
// 获取系统信息列表
const ListInformation = ref([])
const getListInformation = async () => {
  console.log('customerId', detailData.value.customerId)
  const result = await costDisplay({
    table: 'systeminformationC',
    id: detailData.value.customerId
  })
  ListInformation.value = []
  console.log('result', result)
  result.forEach((item) => {
    ListInformation.value.push({
      systemId: item.id,
      SystemName: item.SystemName,
      business: item.business
    })
  })
}

// 选择系统和项目关联后自动更新数据表
const projectId = ref()
const projectSystem = async () => {
  const result = await costDel({
    table: 'projectsystem',
    id: projectId.value
  })
  if (result === null) {
    userImport({
      table: 'projectsystem',
      data: multipleSelection.value
    })
  }
}

// 获取项目id对应的系统信息
// const projectSystemList = ref([])
const isSystem = ref(true)
const getProjectSystem = async () => {
  const result = await costList({
    table: 'projectsystem',
    id: projectId.value
  })
  return result
}
const handleSelectionChange = (val) => {
  // 清空选择框
  multipleSelection.value = []
  if (costInformationId) {
    projectId.value = costInformationId
  } else {
    projectId.value = insertId.value
  }
  const valSave = JSON.parse(JSON.stringify(val))
  valSave.forEach((item) => {
    item.projectId = projectId.value
    delete item.SystemName
    delete item.business
    item.year = detailData.value.year
    item.createUser = store.getters.userInfo.username
    item.createTime = dayjs().format('YYYY-MM-DD HH:mm:ss')
    multipleSelection.value.push(item)
  })
  console.log('multipleSelection', multipleSelection.value)
  getProjectSystem().then((result) => {
    result.lists.forEach((item) => {
      multipleSelection.value.forEach((mul) => {
        if (item.systemId === mul.systemId && item.year === mul.year) {
          isSystem.value = false
          ElMessage({
            message: item.year + '年度系统已被项目选择，不能再次选择！',
            type: 'warning'
          })
        }
      })
    })
    console.log(
      'isSystem',
      isSystem.value,
      'result',
      result.lists,
      'projectSystemList',
      multipleSelection.value
    )
  })

  if (isSystem.value) {
    projectSystem()
  }
  console.log(multipleSelection.value)
  console.log('列表数据：', ListInformation.value)
}

const getCostDisplay = async () => {
  console.log('id', route.params.id)
  detailData.value = await costDisplay({
    table: 'project',
    id: route.params.id
  })

  detailData.value = detailData.value[0]
  // console.log(detailData.value, business.value)
}

onActivated(() => {
  if (costInformationId) {
    title.value = i18n.t('msg.cost.edit')
    getCostDisplay()
  } else {
    title.value = i18n.t('msg.cost.add')
  }
})

// 项目添加系统信息
const validate = ref(false)
// 判断是否系统列表选择是否显示
const isShow = ref(false)
// 记录新增的项目id
const insertId = ref()
const customerName = ref('')
const operationManagerName = ref('')
const confirmAdd = async (ruleFormRef) => {
  // 显示项目客户对应的系统信息
  getListInformation()
  customerName.value = detailData.value.customerName
  operationManagerName.value = detailData.value.operationManagerName
  ruleFormRef.validate((valid) => {
    if (valid) {
      validate.value = true
    } else {
      validate.value = false
    }
  })
  if (Object.keys(detailData.value).length < 5) {
    validate.value = false
  } else {
    validate.value = true
  }
  if (route.params.id && validate.value) {
    detailData.value.year = dayjs(detailData.value.year).format('YYYY')
    delete detailData.value.customerName
    delete detailData.value.operationManagerName
    delete detailData.value.developManagerId
    delete detailData.value.developManagerName
    console.log('edit', detailData.value)
    detailData.value.updateUser = store.getters.userInfo.username
    detailData.value.updateTime = dayjs().format('YYYY-MM-DD HH:mm:ss')
    console.log(detailData.value)
    const dataUpdate = await costEdit({
      table: 'project',
      data: detailData
    })
    if (dataUpdate === '更新数据成功') {
      // ElMessage.success(i18n.t('msg.cost.updateSuccess'))
      isShow.value = true
      detailData.value.customerName = customerName.value
      detailData.value.operationManagerName = operationManagerName.value
      // 数据更新成功
      // closed(ruleFormRef)
    } else if (dataUpdate === '数据已存在不能重复') {
      ElMessage.warning(i18n.t('msg.cost.existsSuccess'))
      detailData.value.customerName = customerName.value
      detailData.value.operationManagerName = operationManagerName.value
      // 数据更新成功
      // closed(ruleFormRef)
    }
  } else if (validate.value) {
    console.log('create', detailData.value)
    detailData.value.year = dayjs(detailData.value.year).format('YYYY')
    delete detailData.value.customerName
    delete detailData.value.developManagerId
    delete detailData.value.operationManagerName
    delete detailData.value.developManagerName
    detailData.value.createUser = store.getters.userInfo.username
    detailData.value.createTime = dayjs().format('YYYY-MM-DD HH:mm:ss')
    console.log(detailData.value)
    const dataCreate = await costCreate({
      table: 'project',
      data: detailData
    })
    if (dataCreate) {
      insertId.value = dataCreate.insertId
      // ElMessage.success(i18n.t('msg.cost.addSuccess'))
      isShow.value = true
      detailData.value.customerName = customerName.value
      detailData.value.operationManagerName = operationManagerName.value
      // 数据更新成功
      // closed(ruleFormRef)
    } else if (dataCreate === '数据已存在不能重复') {
      ElMessage.warning(i18n.t('msg.cost.existsSuccess'))
      detailData.value.customerName = customerName.value
      detailData.value.operationManagerName = operationManagerName.value
      // 数据更新成功
      // closed(ruleFormRef)
    }
  }
}

const closed = (ruleFormRef) => {
  if (!ruleFormRef) return
  insertId.value = ''
  isShow.value = false
  multipleSelection.value = []
  ruleFormRef.resetFields()
  router.push('/basics/projectInfomation')
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

// 将系统id传到弹出窗口
const selectId = ref('')
// 判断是运维还是研发经理
const isOperationDevelop = ref('')
const operationManagerDialogClick = () => {
  systemInformationVisible.value = true
  tableName.value = 'domaininformation'
  selectId.value = route.params.id
  isOperationDevelop.value = 'operation'
}

// 关闭dialog时重置selectUserId
watch(systemInformationVisible, (val) => {
  if (!val) selectId.value = ''
})

const getCostSelect = (item) => {
  if (item) {
    if (item.domainManager) {
      if (isOperationDevelop.value === 'operation') {
        detailData.value.operationManagerId = item.id
        detailData.value.operationManagerName = item.domainManager
      } else if (isOperationDevelop.value === 'develop') {
        detailData.value.developManagerId = item.id
        detailData.value.developManagerName = item.domainManager
      }
    } else {
      detailData.value.customerId = item.id
      detailData.value.customerName = item.customer
    }
  }
}
// getCostSelect()
</script>

<style lang="scss" scoped>
.print-box {
  margin-bottom: 20px;
  text-align: right;
}
.user-info-box {
  // width: 500px;
  margin: 0 20px;
  .title {
    text-align: center;
    margin-bottom: 18px;
    margin-top: 30px;
  }
  .header {
    display: flex;
    // ::v-deep .el-descriptions {
    //   flex-grow: 1;
    // }

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
// .el-table--small .el-table__cell {
//   padding: 2px 0;
// }
</style>
