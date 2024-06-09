<template>
  <div class="user-info-container">
    <div class="user-info-box" id="userInfoBox">
      <!-- 标题 -->
      <h2 class="title">{{ title }}</h2>
      <el-form
        ref="ruleFormRef"
        :model="detailData"
        :rules="rules"
        label-width="auto"
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
              <el-input
                readonly
                @click="systemDialogClick"
                v-model="detailData.projectName"
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
              :label="$t('msg.cost.businessLines')"
              prop="businessLines"
            >
              <el-input
                disabled
                v-model="detailData.businessLines"
              /> </el-form-item
          ></el-col>
          <el-col :span="12" :offset="0">
            <el-form-item :label="$t('msg.cost.domain')" prop="domain">
              <el-input disabled v-model="detailData.domain" /> </el-form-item
          ></el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="12" :offset="0">
            <el-form-item :label="$t('msg.cost.year')">
              <el-date-picker
                clear-icon="CircleClose"
                v-model="detailData.year"
                type="year"
                placeholder="请选择年份"
              /> </el-form-item
          ></el-col>
          <el-col :span="12" :offset="0">
            <el-form-item :label="$t('msg.cost.categoryName')">
              <el-select
                v-model="detailData.categoryName"
                class="m-2"
                placeholder="请选择"
              >
                <el-option
                  v-for="item in ListCategoryName"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                /> </el-select></el-form-item
          ></el-col>
        </el-row>
        <el-row :gutter="20"> </el-row>
        <el-row :gutter="20">
          <el-col :span="12" :offset="0">
            <el-form-item
              :label="$t('msg.cost.incomeAmount')"
              prop="incomeAmount"
            >
              <el-input v-model="detailData.incomeAmount" /> </el-form-item
          ></el-col>
          <el-col :span="12" :offset="0">
            <el-form-item
              :label="$t('msg.cost.splitAmount')"
              prop="splitAmount"
            >
              <el-input v-model="detailData.splitAmount" /> </el-form-item
          ></el-col>
        </el-row>

        <el-row :gutter="20">
          <el-col :span="12" :offset="0">
            <el-form-item
              :label="$t('msg.cost.RegularEmployees')"
              prop="RegularEmployees"
            >
              <el-input v-model="detailData.RegularEmployees" /> </el-form-item
          ></el-col>
          <el-col :span="12" :offset="0">
            <el-form-item
              :label="$t('msg.cost.OutsourcedEmployees')"
              prop="OutsourcedEmployees"
            >
              <el-input
                v-model="detailData.OutsourcedEmployees"
              /> </el-form-item
          ></el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="12" :offset="0">
            <el-form-item
              :label="$t('msg.cost.PurchaseAmount')"
              prop="PurchaseAmount"
            >
              <el-input v-model="detailData.PurchaseAmount" /> </el-form-item
          ></el-col>
          <el-col :span="12" :offset="0">
            <el-form-item
              :label="$t('msg.cost.NonPurchaseAmount')"
              prop="NonPurchaseAmount"
            >
              <el-input v-model="detailData.NonPurchaseAmount" /> </el-form-item
          ></el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="16" :offset="0">
            <el-descriptions direction="vertical" :column="3" border>
              <el-descriptions-item :label="$t('msg.cost.TotalPurchaseAmount')">
                <div v-if="detailData.TotalPurchaseAmount">
                  {{ detailData.TotalPurchaseAmount }}
                </div>
                <!-- 添加空格占位符 -->
                <div v-else>&nbsp;</div>
              </el-descriptions-item>
              <el-descriptions-item :label="$t('msg.cost.capitaIncome')">
                <div v-if="detailData.capitaIncome">
                  {{ detailData.capitaIncome }}
                </div>
                <div v-else>&nbsp;</div>
              </el-descriptions-item>
            </el-descriptions>
          </el-col>
          <el-col :span="8" :offset="0" class="addcost">
            <div class="grid-content ep-bg-purple-light">
              <el-button
                @click="confirmCount"
                icon="el-icon-edit"
                type="success"
                >计算金额&收入</el-button
              >
            </div></el-col
          >
        </el-row>
        <el-form-item label-width="0" style="margin-top: 10px">
          <el-button type="primary" @click="onConfirm(ruleFormRef)">{{
            $t('msg.universal.confirm')
          }}</el-button>
          <el-button type="info" @click="onCancel()">{{
            $t('msg.article.back')
          }}</el-button>
        </el-form-item>
      </el-form>

      <ProjectcostsDialog
        v-model="systemInformationVisible"
        :id="selectId"
        @costSelect="getCostSelect"
      >
      </ProjectcostsDialog>
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
  costList
  // costDetail,
} from '@/api/cost'
import { ElMessage, FormInstance } from 'element-plus'
import { useI18n } from 'vue-i18n'
import { validatetext } from '@/utils/validate'
import { useRoute, useRouter } from 'vue-router'
import ProjectcostsDialog from './projectcostsDialog.vue'
import dayjs from 'dayjs'

const formSize = ref('default')
const ruleFormRef = ref(FormInstance)
const route = useRoute()
const router = useRouter()

const rules = reactive({
  projectName: [{ validator: validatetext, trigger: 'blur' }]
})

// const value = ref('')
// 确定按钮点击事件
const i18n = useI18n()
const title = ref()

// const totalManpower = ref(0)

// 定义初始化类别名称为空
// const categoryName = ref('')

// 获取数据
const detailData = ref({})
const getCostDisplay = async (id) => {
  await costDisplay({
    table: 'projectcosts',
    id: id
  }).then((res) => {
    detailData.value = res[0]
  })
  yearMonth.value = dayjs().set('year', detailData.value.year)
}

// 获取类别信息
const ListCategoryName = ref([])
const getListCategory = async () => {
  const result = await costList({
    table: 'businessdomain',
    page: 1,
    size: 100
  })
  result.list.forEach((item) => {
    ListCategoryName.value.push({
      value: item.businessName,
      label: item.businessName
    })
  })
}
getListCategory()

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
  } else {
    title.value = i18n.t('msg.cost.add')
    if (costNew.value.insertId) {
      isEditCreatId.value = costNew.value.insertId
    }
    detailData.value.incomeAmount = 0
    detailData.value.splitAmount = 0
    detailData.value.RegularEmployees = 0
    detailData.value.OutsourcedEmployees = 0
    detailData.value.PurchaseAmount = 0
    detailData.value.NonPurchaseAmount = 0
    detailData.value.TotalPurchaseAmount = 0
    detailData.value.capitaIncome = 0
  }
})

// 日期
const yearMonth = ref('')

// 关闭
const onCancel = () => {
  // closed(ruleFormRef)
  detailData.value = {}
  yearMonth.value = ''
  router.push('/outsourcing/projectcosts')
}

// 弹出窗口
const systemInformationVisible = ref(false)
// const tableName = ref('')

const systemDialogClick = () => {
  systemInformationVisible.value = true
  // tableName.value = 'customerinformation'
  // selectId.value = route.params.id
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
      detailData.value.projectId = item.id
      detailData.value.projectName = item.projectName
      detailData.value.customerName = item.customerName
      detailData.value.businessLines = item.businessLines
      detailData.value.domain = item.domain
    } else {
      detailData.value.projectId = item.id
      detailData.value.projectName = item.projectName
      detailData.value.customerName = item.customerName
      detailData.value.businessLines = item.businessLines
      detailData.value.domain = item.domain
      console.log(yearMonth.value)
      // delete updateDetail.year
      // delete updateDetail.month
      // updateDetail.year = dayjs(yearMonth.value).format('YYYY')
      // costEdit.value = await costSingleEdit({
      //   table: 'projectcosts',
      //   data: updateDetail
      // })
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
// 统计合计金额和人均金额
const confirmCount = () => {
  detailData.value.TotalPurchaseAmount =
    Number(detailData.value.PurchaseAmount) +
    Number(detailData.value.NonPurchaseAmount)
  detailData.value.capitaIncome =
    (Number(detailData.value.incomeAmount) /
      (Number(detailData.value.RegularEmployees) +
        Number(detailData.value.OutsourcedEmployees))) *
    12
}
// 日期选择框选中事件
const onConfirm = async () => {
  console.log(yearMonth.value.year)
  detailData.value.year = dayjs(yearMonth.value.year).format('YYYY')
  delete detailData.value.projectName
  delete detailData.value.customerName
  delete detailData.value.businessLines
  delete detailData.value.domain
  delete detailData.value.customerId
  delete detailData.value.businessDivision
  delete detailData.value.operationManagerName
  delete detailData.value.developManagerName
  console.log(detailData.value)
  if (!route.params.id && !detailData.value.id) {
    if (
      detailData.value.projectId &&
      detailData.value.categoryName &&
      detailData.value.year
    ) {
      // detailData.value.year = dayjs(detailData.value.year).format('YYYY')
      costNew.value = await costCreateSingle({
        table: 'projectcosts',
        data: detailData.value
      })
      console.log(costNew.value)
      if (costNew.value !== '数据已存在不能重复') {
        ElMessage.success('已新增数据成功')
        detailData.value = {}
        yearMonth.value = ''
        router.push('/outsourcing/projectcosts')
        // isEditCreatId.value = costNew.value.insertId
      } else {
        ElMessage.error(costNew.value)
      }
    } else {
      console.log(detailData.value)
      ElMessage.warning('项目名称、年度、类别必须填写！')
      // yearMonth.value = ''
    }
  } else {
    // detailData.value.year = dayjs(detailData.value.year).format('YYYY')
    costEdit.value = await costSingleEdit({
      table: 'projectcosts',
      data: detailData.value
    })
    if (costEdit.value !== '数据已存在不能重复') {
      ElMessage.success('已修改数据成功')
      detailData.value = {}
      yearMonth.value = ''
      router.push('/outsourcing/projectcosts')
    } else {
      ElMessage.error(costEdit.value)
    }
  }
}
// getCostSelect()
</script>

<style lang="scss" scoped>
.user-info-box {
  // width: 1000px;
  margin: 0 50px;
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
