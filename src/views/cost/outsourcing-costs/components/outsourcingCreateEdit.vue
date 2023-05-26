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
              :label="$t('msg.cost.operationManager')"
              prop="operationManagerName"
            >
              <el-input
                disabled
                v-model="detailData.operationManagerName"
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
              <el-table-column
                :label="$t('msg.cost.classificationName')"
                align="center"
              >
                <template #default="{ row }">
                  <template v-if="row.edit">
                    <el-select v-model="row.classification" class="m-2">
                      <el-option
                        v-for="item in options"
                        :key="item.label"
                        :label="item.label"
                        :value="item.label"
                      />
                    </el-select>
                    <!-- <el-input v-model="row.classification" /> -->
                  </template>
                  <span @dblclick="row.edit = !row.edit" v-else>{{
                    row.classification
                  }}</span>
                </template>
              </el-table-column>
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
                    @click="confirmEdit(row, $index)"
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
            <el-descriptions direction="vertical" :column="3" border>
              <!-- <el-descriptions-item :label="$t('msg.cost.classificationName')">
                <div v-if="moneyData[0]">
                  {{ moneyData[0].classification }}
                </div>
              </el-descriptions-item> -->
              <el-descriptions-item :label="$t('msg.cost.totalAmount')">
                <div v-if="totalAmount">
                  {{ totalAmount }}
                </div>
              </el-descriptions-item>
              <el-descriptions-item :label="$t('msg.cost.totalManpower')">
                <div v-if="totalManpower">
                  {{ totalManpower }}
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
          <el-button type="info" @click="onCancel()">{{
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
import { ref, reactive, watch, onActivated } from 'vue'
import {
  // costCreate,
  costSingleEdit,
  costDisplay,
  costCreateSingle,
  // costDetail,
  costDel
} from '@/api/cost'
import { ElMessage, ElMessageBox, FormInstance } from 'element-plus'
import { useI18n } from 'vue-i18n'
import { validatetext } from '@/utils/validate'
import { useRoute, useRouter } from 'vue-router'
import outsourcingDialog from './outsourcingDialog.vue'
import dayjs from 'dayjs'
import store from '@/store'

const formSize = ref('default')
const ruleFormRef = ref(FormInstance)
const route = useRoute()
const router = useRouter()

const rules = reactive({
  SystemName: [{ validator: validatetext, trigger: 'blur' }]
})

// const value = ref('')
// 确定费用选择项目
const options = [
  {
    // value: '运维',
    label: '运维'
  },
  {
    // value: '开发',
    label: '开发'
  }
]
// 确定按钮点击事件
const i18n = useI18n()
const title = ref()
// const costInformationId = route.params.id

// 定义费用明细是否
const isAddMoney = ref(false)
// 判断合计人力和合计金额
const tmpTotalAmount = ref(0)
const tmpTotalManpower = ref(0)
// 统计合计人力和合计金额
const totalAmount = ref(0)
const totalManpower = ref(0)
// 分别统计运维和研发金额
const operationAmount = ref(0)
const developAmount = ref(0)

// 获取数据
const detailData = ref({})
const getCostDisplay = async (id) => {
  await costDisplay({
    table: 'outsourcingcosts',
    id: id
  }).then((res) => {
    detailData.value = res[0]
    getCostStandard()
    getCostCoefficient()
  })
  // detailData.value = detailData.value[0]
  yearMonth.value = dayjs()
    .set('year', detailData.value.year)
    .set('month', detailData.value.month - 1)
}

// 定义费用变量
const moneyData = ref([])
const getCostMoneyList = async (id) => {
  moneyData.value = await costDisplay({
    table: 'outsourcingcostsmoney',
    id: id
  })
  totalAmount.value = 0
  totalManpower.value = 0
  moneyData.value.forEach((item) => {
    totalAmount.value += item.totalAmount
    totalManpower.value += item.totalManpower
  })
  console.log(moneyData.value)
}

// 判断是否可以编辑数据
const addIs = ref(false)

// 判断是新增还是编辑
const isEditCreatId = ref('')
const costNew = ref('')
const costEdit = ref('')
onActivated(() => {
  // 监听当前路由
  if (route.params.id) {
    console.log(route.params.id)
    title.value = i18n.t('msg.cost.edit')
    isEditCreatId.value = route.params.id
    getCostDisplay(isEditCreatId.value)
    getCostMoneyList(isEditCreatId.value)
    console.log(moneyData.value)
  } else {
    title.value = i18n.t('msg.cost.add')
    addIs.value = true
    console.log(addIs.value)
    if (costNew.value.insertId) {
      isEditCreatId.value = costNew.value.insertId
    }
  }
})

watch(
  () => moneyData.value,
  (value) => {
    // if (moneyData.value) {
    console.log(value.length)
    if (value.length > 1) {
      addIs.value = true
    } else {
      addIs.value = false
    }

    // }
  },
  { immediate: true }
)
//   },
//   { immediate: true }
// )

// 日期
const yearMonth = ref('')
// 从弹出窗口获取的数据
const updateDetail = {
  id: isEditCreatId.value,
  systemId: 0,
  year: '',
  month: '',
  reportedAmount: 0,
  operationAmount: 0,
  developAmount: 0,
  contractAmount: 0,
  taxAmount: 0,
  updateUser: '',
  updateTime: '',
  createUser: '',
  createTime: ''
}

// 根据客户和年份获取费用标准信息
const CostStandard = ref()
const getCostStandard = async () => {
  // console.log(detailData.value)
  // if (Object.keys(detailData.value).length !== 0) {
  CostStandard.value = await costDisplay({
    table: 'coststandard',
    id: {
      customerId: detailData.value.customerId,
      year: detailData.value.year
    }
  })
  CostStandard.value = CostStandard.value[0]
  console.log(CostStandard.value)
  // }
}
// getCostStandard()

// 根据客户和年份获取系数信息
const costCoefficient = ref()
const getCostCoefficient = async () => {
  // if (Object.keys(detailData.value).length !== 0) {
  costCoefficient.value = await costDisplay({
    table: 'coefficientinformation',
    id: {
      customerId: detailData.value.customerId,
      year: detailData.value.year
    }
  })
  costCoefficient.value = costCoefficient.value[0]
  console.log(costCoefficient.value)
  // }
}
// getCostCoefficient()

// 更新工程师费用标准后渲染费用数据
// const updateDisplay = async (totalAmount) => {
const updateDisplay = async () => {
  // 初始化合计金额数据
  totalAmount.value = 0
  operationAmount.value = 0
  developAmount.value = 0
  console.log(moneyData.value)
  if (Object.keys(moneyData.value).length === 0) {
    updateDetail.reportedAmount = 0
    updateDetail.operationAmount = 0
    updateDetail.developAmount = 0
    updateDetail.contractAmount = 0
    updateDetail.taxAmount = 0
  } else {
    moneyData.value.forEach((item) => {
      if (item.classification === '运维') {
        operationAmount.value = item.totalAmount
      } else if (item.classification === '开发') {
        developAmount.value = item.totalAmount
      }
      totalAmount.value += item.totalAmount
    })
    updateDetail.reportedAmount = totalAmount.value
    updateDetail.operationAmount = operationAmount.value
    updateDetail.developAmount = developAmount.value
    updateDetail.contractAmount =
      totalAmount.value * costCoefficient.value.contractPrice
    updateDetail.taxAmount =
      totalAmount.value * costCoefficient.value.taxIncluded
  }
  delete updateDetail.systemId
  // updateDetail.reportedAmount = row.totalAmount
  delete updateDetail.year
  delete updateDetail.month
  updateDetail.updateUser = store.getters.userInfo.username
  updateDetail.updateTime = dayjs().format('YYYY-MM-DD HH:mm:ss')
  console.log(updateDetail)
  await costSingleEdit({
    table: 'outsourcingcosts',
    data: updateDetail
  })

  ElMessage.success('已更新数据成功')
  getCostDisplay(isEditCreatId.value)
}

const confirmEdit = async (row, index) => {
  // getCostStandard()
  // getCostCoefficient()
  if (
    CostStandard.value === undefined ||
    costCoefficient.value === undefined ||
    Object.keys(CostStandard.value).length === 0 ||
    Object.keys(costCoefficient.value).length === 0
  ) {
    ElMessage.error('客户年度费用标准未维护或客户年度费用系数未维护！')
    getCostMoneyList(isEditCreatId.value)
    isAddMoney.value = false
    if (moneyData.value.length > 1) {
      addIs.value = true
    }
  } else {
    row.edit = false

    row.originalTitle = row.title
    row.totalAmount = 0
    row.totalManpower = 0
    delete row.edit
    updateDetail.id = isEditCreatId.value

    totalAmount.value = 0

    console.log(moneyData.value)
    // for (let index = 0; index < moneyData.value.length; index++) {
    // const element = moneyData.value[index]
    row.totalAmount =
      moneyData.value[index].systemEngineer *
        CostStandard.value.systemEngineer +
      moneyData.value[index].seniorSap * CostStandard.value.seniorSap +
      moneyData.value[index].seniorSoftwareEngineer *
        CostStandard.value.seniorSoftwareEngineer +
      moneyData.value[index].dbaEngineer * CostStandard.value.dbaEngineer +
      moneyData.value[index].seniorSystemEngineer *
        CostStandard.value.seniorSystemEngineer +
      moneyData.value[index].intermediateSap *
        CostStandard.value.intermediateSap +
      moneyData.value[index].seniorDbaEngineer *
        CostStandard.value.seniorDbaEngineer +
      moneyData.value[index].softwareEngineer *
        CostStandard.value.softwareEngineer
    row.totalManpower =
      Number(moneyData.value[index].systemEngineer) +
      Number(moneyData.value[index].seniorSap) +
      Number(moneyData.value[index].seniorSoftwareEngineer) +
      Number(moneyData.value[index].dbaEngineer) +
      Number(moneyData.value[index].seniorSystemEngineer) +
      Number(moneyData.value[index].intermediateSap) +
      Number(moneyData.value[index].seniorDbaEngineer) +
      Number(moneyData.value[index].softwareEngineer)
    console.log(row.totalAmount, row.totalManpower)
    // }

    // tmp判断是否包含2个相同的分类
    const tmp = ref(0)
    moneyData.value.map((item) => {
      if (item.classification === row.classification) {
        tmp.value = tmp.value + 1
      }
    })
    console.log(tmp.value)
    // rowCount.value = moneyData.value
    // 编辑
    console.log(moneyData.value)
    if (
      !isAddMoney.value &&
      row.classification !== undefined &&
      tmp.value < 2
    ) {
      delete row.outsourcingCostsPlanId
      row.updateUser = store.getters.userInfo.username
      row.updateTime = dayjs().format('YYYY-MM-DD HH:mm:ss')
      console.log(row)
      const moneyDataUpdate = await costSingleEdit({
        table: 'outsourcingcostsmoney',
        data: row
      })
      console.log(moneyDataUpdate)

      // moneyData.value.forEach((item) => {
      //   totalAmount.value += item.totalAmount
      // })
      // updateDisplay(totalAmount.value)
      updateDisplay()
      // 新增
    } else if (
      isAddMoney.value &&
      row.classification !== undefined &&
      tmp.value < 2
    ) {
      delete row.id
      console.log(row)
      // rowCount.value.push(row)
      row.createUser = store.getters.userInfo.username
      row.createTime = dayjs().format('YYYY-MM-DD HH:mm:ss')
      const moneyDataAdd = await costCreateSingle({
        table: 'outsourcingcostsmoney',
        data: row
      })
      console.log(moneyDataAdd)
      // moneyData.value.forEach((item) => {
      //   totalAmount.value += item.totalAmount
      // })
      // updateDisplay(totalAmount.value)
      updateDisplay()
      // ElMessage.success(moneyDataAdd)
    } else {
      ElMessage.error('系统分类不能为空并且不能重复')
    }
    console.log(row)
    getCostMoneyList(isEditCreatId.value)
    isAddMoney.value = false
    if (moneyData.value.length > 1) {
      addIs.value = true
    }
  }
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
    outsourcingCostsId: isEditCreatId.value,
    updateUser: '',
    updateTime: '',
    createUser: '',
    createTime: ''
  }
  moneyData.value.push(row)
  row.edit = true
  addIs.value = true
  isAddMoney.value = true
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
        .then(() => {
          if (moneyData.value.length > 0) {
            for (let index = 0; index < moneyData.value.length; index++) {
              // const element = moneyData.value[index]
              row.totalAmount =
                moneyData.value[index].systemEngineer *
                  CostStandard.value.systemEngineer +
                moneyData.value[index].seniorSap *
                  CostStandard.value.seniorSap +
                moneyData.value[index].seniorSoftwareEngineer *
                  CostStandard.value.seniorSoftwareEngineer +
                moneyData.value[index].dbaEngineer *
                  CostStandard.value.dbaEngineer +
                moneyData.value[index].seniorSystemEngineer *
                  CostStandard.value.seniorSystemEngineer +
                moneyData.value[index].intermediateSap *
                  CostStandard.value.intermediateSap +
                moneyData.value[index].seniorDbaEngineer *
                  CostStandard.value.seniorDbaEngineer +
                moneyData.value[index].softwareEngineer *
                  CostStandard.value.softwareEngineer
              if (index === 0) {
                tmpTotalAmount.value = row.totalAmount
              } else {
                row.totalAmount = tmpTotalAmount.value + row.totalAmount
              }
              row.totalManpower =
                Number(moneyData.value[index].systemEngineer) +
                Number(moneyData.value[index].seniorSap) +
                Number(moneyData.value[index].seniorSoftwareEngineer) +
                Number(moneyData.value[index].dbaEngineer) +
                Number(moneyData.value[index].seniorSystemEngineer) +
                Number(moneyData.value[index].intermediateSap) +
                Number(moneyData.value[index].seniorDbaEngineer) +
                Number(moneyData.value[index].softwareEngineer)
              if (index === 0) {
                tmpTotalManpower.value = row.totalManpower
              } else {
                row.totalManpower = tmpTotalManpower.value + row.totalManpower
              }
              console.log(row.totalAmount, row.totalManpower)
            }
            totalAmount.value = row.totalAmount
            totalManpower.value = row.totalManpower
          } else {
            totalAmount.value = 0
            totalManpower.value = 0
          }
          // totalAmount.value = 0
          // moneyData.value.forEach((item) => {
          //   totalAmount.value += item.totalAmount
          // })
          // updateDisplay(totalAmount.value)
          updateDisplay()
        })
        .catch((error) => error)
    })
    .catch((error) => error)
}

// 关闭
const onCancel = () => {
  // closed(ruleFormRef)
  detailData.value = {}
  router.push('/outsourcing/manage')
}

// 弹出窗口
const systemInformationVisible = ref(false)

const systemDialogClick = () => {
  systemInformationVisible.value = true
}

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
      detailData.value.SystemName = item.SystemName
      console.log('新增')
    } else {
      updateDetail.systemId = item.id
      detailData.value.SystemName = item.SystemName
      console.log(yearMonth.value)
      // delete updateDetail.year
      // delete updateDetail.month
      updateDetail.year = dayjs(yearMonth.value).format('YYYY')
      updateDetail.month = dayjs(yearMonth.value).format('MM')
      delete updateDetail.reportedAmount
      delete updateDetail.contractAmount
      delete updateDetail.taxAmount

      costEdit.value = await costSingleEdit({
        table: 'outsourcingcosts',
        data: updateDetail
      })
      if (costEdit.value !== '数据已存在不能重复') {
        ElMessage.success('已修改数据成功')
        getCostDisplay(isEditCreatId.value)
      } else {
        ElMessage.error(costEdit.value)
        // getCostDisplay(isEditCreatId.value)
      }
    }
    // console.log(isEditCreatId.value)
  }
}
// 日期选择框选中事件
const pickerSelect = async (val) => {
  console.log(val)
  if (!route.params.id && !detailData.value.id) {
    if (updateDetail.systemId) {
      delete updateDetail.id
      updateDetail.year = dayjs(val).format('YYYY')
      updateDetail.month = dayjs(val).format('MM')
      updateDetail.createUser = store.getters.userInfo.username
      updateDetail.createTime = dayjs().format('YYYY-MM-DD HH:mm:ss')
      delete updateDetail.reportedAmount
      delete updateDetail.operationAmount
      delete updateDetail.developAmount
      delete updateDetail.contractAmount
      delete updateDetail.taxAmount
      console.log(updateDetail.year, updateDetail.month)
      costNew.value = await costCreateSingle({
        table: 'outsourcingcosts',
        data: updateDetail
      })
      console.log(costNew.value)
      if (costNew.value !== '数据已存在不能重复') {
        addIs.value = false
        isEditCreatId.value = costNew.value.insertId
        console.log(costNew.value, isEditCreatId.value)
        getCostDisplay(isEditCreatId.value)
      } else {
        ElMessage.error(costNew.value)
      }
    } else {
      ElMessage.warning('请先选择系统名称')
      yearMonth.value = ''
    }
  } else {
    updateDetail.year = dayjs(val).format('YYYY')
    updateDetail.month = dayjs(val).format('MM')
    updateDetail.systemId = detailData.value.systemId
    delete updateDetail.reportedAmount
    delete updateDetail.contractAmount
    delete updateDetail.taxAmount
    updateDetail.id = isEditCreatId.value
    console.log(updateDetail)
    updateDetail.updateUser = store.getters.userInfo.username
    updateDetail.updateTime = dayjs().format('YYYY-MM-DD HH:mm:ss')
    costEdit.value = await costSingleEdit({
      table: 'outsourcingcosts',
      data: updateDetail
    })
    if (costEdit.value !== '数据已存在不能重复') {
      ElMessage.success('已修改数据成功')
      getCostDisplay(isEditCreatId.value)
    } else {
      ElMessage.error(costEdit.value)
    }
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
