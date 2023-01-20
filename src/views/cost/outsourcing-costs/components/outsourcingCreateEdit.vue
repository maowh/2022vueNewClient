<template>
  <div class="user-info-container">
    <div class="user-info-box" id="userInfoBox">
      <!-- 标题 -->
      <h2 class="title">{{ title }}</h2>
      <el-form
        ref="ruleFormRef"
        :model="detailData"
        :rules="rules"
        label-width="70px"
        class="demo-ruleForm"
        :size="formSize"
        status-icon
      >
        <el-row :gutter="20">
          <el-col :span="12" :offset="0">
            <el-form-item :label="$t('msg.cost.SystemName')" prop="SystemName">
              <el-input
                @click="systemDialogClick"
                v-model="detailData.SystemName"
              >
                <template #suffix
                  ><el-icon style="margin-right: 10px"><Search /></el-icon
                ></template>
              </el-input> </el-form-item
          ></el-col>
          <el-col :span="12" :offset="0">
            <el-form-item
              :label="$t('msg.cost.customerName')"
              prop="customerName"
            >
              <el-input
                disabled
                v-model="detailData.customerName"
              /> </el-form-item
          ></el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="12" :offset="0">
            <el-form-item
              :label="$t('msg.cost.businessDivision')"
              prop="businessDivision"
            >
              <el-input
                disabled
                v-model="detailData.businessDivision"
              /> </el-form-item
          ></el-col>
          <el-col :span="12" :offset="0">
            <el-form-item
              :label="$t('msg.cost.businessLines')"
              prop="businessLines"
            >
              <el-input
                disabled
                v-model="detailData.businessLines"
              /> </el-form-item
          ></el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="12" :offset="0">
            <el-form-item :label="$t('msg.cost.domain')" prop="domain">
              <el-input disabled v-model="detailData.domain" /> </el-form-item
          ></el-col>
          <el-col :span="12" :offset="0">
            <el-form-item
              :label="$t('msg.cost.domainManager')"
              prop="domainManager"
            >
              <el-input
                disabled
                v-model="detailData.domainManager"
              /> </el-form-item
          ></el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="12" :offset="0">
            <el-form-item :label="$t('msg.cost.month')">
              <el-date-picker
                clear-icon="CircleClose"
                v-model="yearMonth"
                type="month"
                @change="pickerSelect($event)"
                placeholder="请选择年份月度"
              /> </el-form-item
          ></el-col>
          <el-col :span="12" :offset="0">
            <el-form-item :label="$t('msg.cost.id')" prop="id">
              <el-input disabled v-model="detailData.id" /> </el-form-item
          ></el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="8" :offset="0">
            <el-form-item
              :label="$t('msg.cost.reportedAmount')"
              prop="reportedAmount"
            >
              <el-input
                disabled
                v-model="detailData.reportedAmount"
              /> </el-form-item
          ></el-col>
          <el-col :span="8" :offset="0">
            <el-form-item
              :label="$t('msg.cost.contractAmount')"
              prop="contractAmount"
            >
              <el-input
                disabled
                v-model="detailData.contractAmount"
              /> </el-form-item
          ></el-col>
          <el-col :span="8" :offset="0">
            <el-form-item :label="$t('msg.cost.taxAmount')" prop="taxAmount">
              <el-input
                disabled
                v-model="detailData.taxAmount"
              /> </el-form-item
          ></el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="24" :offset="0">
            <el-table :data="moneyData" border>
              <el-table-column label="系统工程师" align="center">
                <template #default="{ row }">
                  <template v-if="row.edit">
                    <el-input v-model="row.systemEngineer" />
                  </template>
                  <span @dblclick="row.edit = !row.edit" v-else>{{
                    row.systemEngineer
                  }}</span>
                </template>
              </el-table-column>
              <el-table-column label="高级系统工程师" align="center">
                <template #default="{ row }">
                  <template v-if="row.edit">
                    <el-input v-model="row.seniorSystemEngineer" />
                  </template>
                  <span @dblclick="row.edit = !row.edit" v-else>{{
                    row.seniorSystemEngineer
                  }}</span>
                </template>
              </el-table-column>
              <el-table-column label="软件工程师" align="center">
                <template #default="{ row }">
                  <template v-if="row.edit">
                    <el-input v-model="row.softwareEngineer" />
                  </template>
                  <span @dblclick="row.edit = !row.edit" v-else>{{
                    row.softwareEngineer
                  }}</span>
                </template></el-table-column
              >
              <el-table-column label="高级软件工程师" align="center">
                <template #default="{ row }">
                  <template v-if="row.edit">
                    <el-input v-model="row.seniorSoftwareEngineer" />
                  </template>
                  <span @dblclick="row.edit = !row.edit" v-else>{{
                    row.seniorSoftwareEngineer
                  }}</span>
                </template></el-table-column
              >
              <el-table-column label="中级SAP" align="center">
                <template #default="{ row }">
                  <template v-if="row.edit">
                    <el-input v-model="row.intermediateSap" />
                  </template>
                  <span @dblclick="row.edit = !row.edit" v-else>{{
                    row.intermediateSap
                  }}</span>
                </template></el-table-column
              >
              <el-table-column label="高级SAP" align="center">
                <template #default="{ row }">
                  <template v-if="row.edit">
                    <el-input v-model="row.seniorSap" />
                  </template>
                  <span @dblclick="row.edit = !row.edit" v-else>{{
                    row.seniorSap
                  }}</span>
                </template></el-table-column
              >
              <el-table-column label="DBA" align="center">
                <template #default="{ row }">
                  <template v-if="row.edit">
                    <el-input v-model="row.dbaEngineer" />
                  </template>
                  <span @dblclick="row.edit = !row.edit" v-else>{{
                    row.dbaEngineer
                  }}</span>
                </template></el-table-column
              >
              <el-table-column label="高级DBA" align="center">
                <template #default="{ row }">
                  <template v-if="row.edit">
                    <el-input v-model="row.seniorDbaEngineer" />
                  </template>
                  <span @dblclick="row.edit = !row.edit" v-else>{{
                    row.seniorDbaEngineer
                  }}</span>
                </template></el-table-column
              >
              <el-table-column
                width="150px"
                label="操作"
                prop="desc"
                align="center"
              >
                <template #default="{ row, $index }">
                  <el-button
                    v-if="row.edit"
                    size="small"
                    type="success"
                    @click="confirmEdit(row, $index + 1)"
                  >
                    保存
                  </el-button>
                  <el-button
                    v-else
                    size="small"
                    type="primary"
                    @click="row.edit = !row.edit"
                  >
                    编辑
                  </el-button>
                  <el-button
                    type="danger"
                    size="small"
                    :disabled="row.edit"
                    @click="confirmDel(row)"
                    >删除</el-button
                  >
                </template>
              </el-table-column>
            </el-table>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="18" :offset="0">
            <el-descriptions direction="vertical" :column="4" border>
              <el-descriptions-item :label="$t('msg.cost.classificationName')">
                <div v-if="moneyData[0]">
                  {{ moneyData[0].classification }}
                </div>
              </el-descriptions-item>
              <el-descriptions-item :label="$t('msg.cost.totalAmount')">
                <div v-if="moneyData[0]">
                  {{ moneyData[0].totalAmount }}
                </div>
              </el-descriptions-item>
              <el-descriptions-item :label="$t('msg.cost.totalManpower')">
                <div v-if="moneyData[0]">
                  {{ moneyData[0].totalManpower }}
                </div>
              </el-descriptions-item>
            </el-descriptions></el-col
          >
          <el-col :span="6" :offset="0" class="addcost">
            <div class="grid-content ep-bg-purple-light">
              <el-button
                @click="confirmAdd"
                icon="el-icon-plus"
                type="success"
                :disabled="addIs"
                >新增费用信息</el-button
              >
            </div></el-col
          >
        </el-row>

        <el-form-item label-width="0" style="margin-top: 10px">
          <!-- <el-button type="primary" @click="onConfirm(ruleFormRef)">{{
            $t('msg.universal.confirm')
          }}</el-button>
          <el-button @click="onCancel(ruleFormRef)">{{
            $t('msg.universal.cancel')
          }}</el-button> -->
          <el-button @click="onCancel()" type="info">{{
            $t('msg.article.back')
          }}</el-button>
        </el-form-item>
      </el-form>

      <outsourcingDialog
        v-model="systemInformationVisible"
        :id="selectId"
        @costSelect="getCostSelect"
      >
      </outsourcingDialog>
    </div>
    <!-- </el-card> -->
  </div>
  <!-- </el-dialog> -->
</template>

<script setup>
import { ref, reactive, watch } from 'vue'
import {
  // costCreate,
  costSingleEdit,
  costDisplay,
  costCreateSingle,
  costDetail,
  costDel
} from '@/api/cost'
import { ElMessage, ElMessageBox, FormInstance } from 'element-plus'
import { useI18n } from 'vue-i18n'
import { validatetext } from '@/utils/validate'
import { useRoute, useRouter } from 'vue-router'
import outsourcingDialog from './outsourcingDialog.vue'
import dayjs from 'dayjs'

const formSize = ref('default')
const ruleFormRef = ref(FormInstance)
const route = useRoute()
const router = useRouter()

const rules = reactive({
  SystemName: [{ validator: validatetext, trigger: 'blur' }]
})

// 确定按钮点击事件
const i18n = useI18n()
const title = ref()
// const costInformationId = route.params.id

// 获取数据
const detailData = ref({})
const getCostDisplay = async (id) => {
  detailData.value = await costDisplay({
    table: 'outsourcingcosts',
    id: id
  })
  detailData.value = detailData.value[0]
  yearMonth.value = dayjs()
    .set('year', detailData.value.year)
    .set('month', detailData.value.month - 1)
}

const moneyData = ref([])
const getCostMoneyList = async (id) => {
  moneyData.value = await costDisplay({
    table: 'outsourcingcostsmoney',
    id: id
  })
  console.log(moneyData.value)
  // moneyData.value = moneyData.value[0]
  // console.log(moneyData.value)
  // console.log(moneyData.value[0].classification)
}

// 判断是否可以编辑数据
const addIs = ref(false)

// 判断是新增还是编辑
const isEditCreatId = ref('')
const costNew = ref('')
if (route.params.id) {
  title.value = i18n.t('msg.cost.edit')
  isEditCreatId.value = route.params.id
  getCostDisplay(isEditCreatId.value)
  getCostMoneyList(isEditCreatId.value)
} else {
  title.value = i18n.t('msg.cost.add')
  addIs.value = true
  if (costNew.value.insertId) {
    isEditCreatId.value = costNew.value.insertId
  }

  // costInitCreate()
}

// 日期
const yearMonth = ref('')
// 从弹出窗口获取的数据
const updateDetail = {
  id: isEditCreatId.value,
  systemId: 0,
  year: '',
  month: '',
  reportedAmount: 0,
  contractAmount: 0,
  taxAmount: 0
}

const CostStandard = ref('')
const getCostStandard = async () => {
  CostStandard.value = await costDetail({
    table: 'coststandard',
    id: 1
  })
  console.log(CostStandard.value)
}
// 更新工程师费用标准后渲染费用数据
const updateDisplay = async (row) => {
  if (Object.keys(moneyData.value).length === 0) {
    updateDetail.reportedAmount = 0
    updateDetail.contractAmount = 0
    updateDetail.taxAmount = 0
  } else {
    updateDetail.reportedAmount = row.totalAmount
    updateDetail.contractAmount = row.totalAmount * 0.9
    updateDetail.taxAmount = row.totalAmount * 0.8
  }
  console.log(updateDetail.reportedAmount)
  delete updateDetail.systemId
  // updateDetail.reportedAmount = row.totalAmount

  delete updateDetail.year
  delete updateDetail.month
  await costSingleEdit({
    table: 'outsourcingcosts',
    data: updateDetail
  })

  ElMessage.success('已更新数据成功')
  getCostDisplay(isEditCreatId.value)
}
getCostStandard()

const confirmEdit = async (row, index) => {
  // console.log(dayjs(yearMonth.value).format('YYYY'))
  // console.log(dayjs(yearMonth.value).format('MM'))
  row.edit = false

  row.originalTitle = row.title
  row.totalAmount = 0
  row.totalManpower = 0
  row.totalAmount =
    row.systemEngineer * CostStandard.value.systemEngineer +
    row.seniorSap * CostStandard.value.seniorSap +
    row.seniorSoftwareEngineer * CostStandard.value.seniorSoftwareEngineer +
    row.dbaEngineer * CostStandard.value.dbaEngineer +
    row.seniorSystemEngineer * CostStandard.value.seniorSystemEngineer +
    row.intermediateSap * CostStandard.value.intermediateSap +
    row.seniorDbaEngineer * CostStandard.value.seniorDbaEngineer +
    row.softwareEngineer * CostStandard.value.softwareEngineer
  row.totalManpower =
    Number(row.systemEngineer) +
    Number(row.seniorSap) +
    Number(row.seniorSoftwareEngineer) +
    Number(row.dbaEngineer) +
    Number(row.seniorSystemEngineer) +
    Number(row.intermediateSap) +
    Number(row.seniorDbaEngineer) +
    Number(row.softwareEngineer)
  delete row.edit
  // const test = ref(true)
  if (addIs.value !== true) {
    delete row.outsourcingCostsId
    // const moneyDataObj = { ...moneyData }
    const moneyDataUpdate = await costSingleEdit({
      table: 'outsourcingcostsmoney',
      data: row
    })
    console.log(moneyDataUpdate)
    // ElMessage.success(moneyDataUpdate)
  } else {
    row.classification = '运维'
    delete row.id
    const moneyDataAdd = await costCreateSingle({
      table: 'outsourcingcostsmoney',
      data: row
    })
    console.log(moneyDataAdd)
    // ElMessage.success(moneyDataAdd)
  }
  updateDisplay(row)
  getCostMoneyList(isEditCreatId.value)
  addIs.value = false
}

const confirmAdd = async () => {
  const row = {
    totalManpower: 0,
    systemEngineer: 0,
    seniorSap: 0,
    seniorSoftwareEngineer: 0,
    dbaEngineer: 0,
    seniorSystemEngineer: 0,
    intermediateSap: 0,
    seniorDbaEngineer: 0,
    softwareEngineer: 0,
    outsourcingCostsId: isEditCreatId.value
  }
  moneyData.value.push(row)
  row.edit = true
  addIs.value = true
  // delete row.outsourcingCostsId
  // const moneyDataObj = { ...moneyData }
}
// id
const confirmDel = (row) => {
  ElMessageBox.confirm(
    i18n.t('msg.cost.dialogTitle1') + row.id + i18n.t('msg.cost.dialogTitle2'),
    { type: 'warning' }
  )
    .then(async () => {
      await costDel({ table: 'outsourcingcostsmoney', id: row.id })
      ElMessage.success(i18n.t('msg.excel.removeSuccess'))
      // 重新渲染数据
      getCostMoneyList(isEditCreatId.value)
        .then(() => updateDisplay(row))
        .catch((error) => error)
    })
    .catch((error) => error)
  // tableData.value = tableData.value.filter((item) => item !== row)
}

// 确定按钮点击事件
// const validate = ref(false)
// const onConfirm = async (ruleFormRef) => {
//   ruleFormRef.validate((valid) => {
//     if (valid) {
//       validate.value = true
//     } else {
//       validate.value = false
//     }
//   })
//   if (route.params.id) {
//     console.log('edit', detailData.value)
//     delete detailData.value.customerName
//     delete detailData.value.domainManagerName
//     // detailData.value.SystemName = detailData.value.SystemName
//     // detailData.value.id = route.params.id
//     const dataUpdate = await costSingleEdit({
//       table: 'systeminformation',
//       data: detailData
//     })
//     if (dataUpdate === '更新数据成功') {
//       ElMessage.success(i18n.t('msg.cost.updateSuccess'))
//       // 数据更新成功
//       closed(ruleFormRef)
//     } else if (dataUpdate === '数据已存在不能重复') {
//       ElMessage.warning(i18n.t('msg.cost.existsSuccess'))
//       // 数据更新成功
//       closed(ruleFormRef)
//     }
//   } else {
//     console.log('create', detailData.value)
//     delete detailData.value.customerName
//     delete detailData.value.domainManagerName
//     const dataCreate = await costCreate({
//       table: 'systeminformation',
//       data: detailData
//     })
//     if (dataCreate === '新增数据成功') {
//       ElMessage.success(i18n.t('msg.cost.addSuccess'))
//       // 数据更新成功
//       closed(ruleFormRef)
//     } else if (dataCreate === '数据已存在不能重复') {
//       ElMessage.warning(i18n.t('msg.cost.existsSuccess'))
//       // 数据更新成功
//       closed(ruleFormRef)
//     }
//   }
// }

// const closed = (ruleFormRef) => {
//   if (!ruleFormRef) return
//   ruleFormRef.resetFields()
//   router.push('/outsourcing/manage')
// }

// 关闭
const onCancel = () => {
  // closed(ruleFormRef)
  router.push('/outsourcing/manage')
}

// 弹出窗口
const systemInformationVisible = ref(false)
// const tableName = ref('')

const systemDialogClick = () => {
  systemInformationVisible.value = true
  // tableName.value = 'customerinformation'
  // selectId.value = route.params.id
}

// const domainManagerDialogClick = () => {
//   systemInformationVisible.value = true
//   tableName.value = 'domaininformation'
//   selectId.value = route.params.id
// }

const selectId = ref('')
// 关闭dialog时重置selectUserId
watch(systemInformationVisible, (val) => {
  if (!val) selectId.value = ''
})

// const detailDataUpdate = ref('')

const getCostSelect = async (item) => {
  if (item) {
    if (!route.params.id && !detailData.value.id) {
      updateDetail.systemId = item.id
      delete updateDetail.id
      updateDetail.year = dayjs().format('YYYY')
      updateDetail.month = dayjs().format('MM')
      delete updateDetail.reportedAmount
      delete updateDetail.contractAmount
      delete updateDetail.taxAmount
      costNew.value = await costCreateSingle({
        table: 'outsourcingcosts',
        data: updateDetail
      })
      addIs.value = false
      isEditCreatId.value = costNew.value.insertId
      // console.log(costNew.value)
      // getCostDisplay(costNew.value.insertId)
      // detailData.value = dayjs().format('YYYY')
      // detailData.value = dayjs().format('MM')
    } else {
      updateDetail.systemId = item.id
      delete updateDetail.year
      delete updateDetail.month
      delete updateDetail.reportedAmount
      delete updateDetail.contractAmount
      delete updateDetail.taxAmount

      await costSingleEdit({
        table: 'outsourcingcosts',
        data: updateDetail
      })
    }
    console.log(isEditCreatId.value)
    getCostDisplay(isEditCreatId.value)
  }
}
// 日期选择框选中事件
const pickerSelect = async (val) => {
  console.log(val)
  if (!route.params.id && !detailData.value.id) {
    ElMessage.warning('请选择系统名称')
  } else {
    updateDetail.year = dayjs(val).format('YYYY')
    updateDetail.month = dayjs(val).format('MM')
    delete updateDetail.systemId
    delete updateDetail.reportedAmount
    delete updateDetail.contractAmount
    delete updateDetail.taxAmount
    updateDetail.id = isEditCreatId.value
    await costSingleEdit({
      table: 'outsourcingcosts',
      data: updateDetail
    })
    ElMessage.success('已选择数据成功')

    getCostDisplay(isEditCreatId.value)
  }
}
// getCostSelect()
</script>

<style lang="scss" scoped>
.user-info-box {
  width: 1000px;
  margin: 0 auto;
  .title {
    text-align: center;
    margin-bottom: 10px;
    margin-top: 10px;
  }
  .addcost {
    display: flex;
    justify-content: center;
    align-items: center;
  }
}
</style>
