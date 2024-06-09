<template>
  <div class="article-ranking-container">
    <el-card class="header">
      <div class="dynamic-box">
        <div>
          <span style="margin-left: 5px">年份：</span>
          <el-date-picker
            clear-icon="CircleClose"
            v-model="yearValue"
            style="width: 200px; margin-left: 5px"
            type="year"
            placeholder="请选择年份"
          />
        </div>
        <div>
          <el-button type="primary" style="margin-left: 5px" @click="onSearch"
            ><el-icon><Search /></el-icon> 查询</el-button
          >
          <el-button type="primary" style="margin-left: 5px" @click="onRefresh"
            ><el-icon><RefreshRight /></el-icon> 重置</el-button
          >
          <el-button
            type="primary"
            style="margin-left: 5px"
            @click="onToExcelClick"
            ><el-icon><Download /></el-icon> 导出</el-button
          >
        </div>
      </div>
      <el-table :data="projectReportVal" border style="width: 100%">
        <!-- <el-table-column prop="id" :label="$t('msg.cost.id')"></el-table-column> -->
        <el-table-column
          prop="domain"
          :label="$t('msg.cost.domain')"
        ></el-table-column>
        <el-table-column
          prop="customer"
          :label="$t('msg.cost.customerName')"
        ></el-table-column>
        <el-table-column
          prop="projectName"
          :label="$t('msg.cost.projectName')"
        ></el-table-column>
        <el-table-column
          prop="business"
          :label="$t('msg.cost.categoryName')"
        ></el-table-column>
        <el-table-column
          width="80"
          prop="incomeAmount"
          :label="$t('msg.cost.incomeAmount')"
        ></el-table-column>
        <el-table-column
          width="100"
          prop="splitAmount"
          :label="$t('msg.cost.splitAmount')"
        ></el-table-column>
        <el-table-column
          width="80"
          prop="RegularEmployees"
          :label="$t('msg.cost.RegularEmployees')"
        ></el-table-column>
        <el-table-column
          width="80"
          prop="OutsourcedEmployees"
          :label="$t('msg.cost.OutsourcedEmployees')"
        ></el-table-column>
        <el-table-column
          width="80"
          prop="PurchaseAmount"
          :label="$t('msg.cost.PurchaseAmount')"
        ></el-table-column>
        <el-table-column
          width="80"
          prop="NonPurchaseAmount"
          :label="$t('msg.cost.NonPurchaseAmount')"
        ></el-table-column>
        <el-table-column
          width="80"
          prop="outsourcingAmountToal"
          :label="$t('msg.cost.TotalPurchaseAmount')"
        ></el-table-column>
        <el-table-column
          width="80"
          prop="manpowerInputAvg"
          :label="$t('msg.cost.capitaIncome')"
        ></el-table-column>
        <el-table-column
          width="80"
          prop="year"
          :label="$t('msg.cost.year')"
        ></el-table-column>
      </el-table>
      <el-pagination
        class="pagination"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="page"
        :page-sizes="[2, 5, 10, 50, 100]"
        :page-size="size"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
      >
      </el-pagination>
    </el-card>
  </div>
</template>

<script setup>
import { ref, onActivated, watch } from 'vue'
// import { renderHeader } from '@/prototype'
import { costListDisplay, costList, costAllSelectPage } from '@/api/cost'
// import { useRouter, useRoute } from 'vue-router'
import {
  USER_RELATIONS
  // ListDisplay,
} from './components/Export2ExcelConstants'
import { ElMessage } from 'element-plus'
import dayjs from 'dayjs'
// import { useI18n } from 'vue-i18n'

// const router = useRouter()
// const route = useRoute()
// const i18n = useI18n()
// 数据相关
const yearValue = ref('')
// const tableData = ref([])
// tableDatas获取所有的记录用于统计
// const tableDatas = ref([])
// const tableStandardData = ref([])
// const standardArrange = ref([])
// const standardValue = ref([])
const total = ref(0)
const page = ref(1)
const size = ref(10)
// 判断是否查询
const isSearch = ref(false)

// 测试日期选择
// const monthValue = ref('')

// const labelHsead = ({ column, $index }) => {
//   console.log(column)
//   var l = column.label.length
//   var f = 12
//   column.minWidth = f * (l + 2) // 加上一个文字长度
//   return (
//     'div', { class: 'table-head', style: { width: '100%' } }, [column.label]
//   )
// }

// 定义从数据库获取的数据源
// 人力投入金额
const manpowerInput = ref([])
// 外采金额
const outsourcingAmount = ref([])
// 项目收入金额
const IncomeAmount = ref([])

// 报表数据
const projectReportVal = ref([])
// 定义临时数据
const tempData = (val1, val2, val3) => {
  projectReportVal.value = val1.reduce((acc, cur) => {
    const existing = acc.find((item) => item.business === cur.business)
    if (existing) {
      existing.incomeAmount += cur.incomeAmount
      existing.splitAmount += cur.splitAmount
    } else {
      acc.push(cur)
    }
    return acc
  }, [])
  projectReportVal.value.forEach((item) => {
    val2.forEach((item2) => {
      if (
        item.id === item2.projectId &&
        item.business === item2.category &&
        item.year === item2.year
      ) {
        item.PurchaseAmount = item2.PurchaseAmount
        item.NonPurchaseAmount = item2.NonPurchaseAmount
      }
    })
    val3.forEach((item3) => {
      if (
        item.id === item3.projectId &&
        item.business === item3.category &&
        item.year === item3.year
      ) {
        item.RegularEmployees = item3.RegularEmployees
        item.OutsourcedEmployees = item3.OutsourcedEmployees
      }
    })
    item.outsourcingAmountToal = item.PurchaseAmount + item.NonPurchaseAmount
    item.manpowerInputAvg = Number(
      (item.incomeAmount / (item.RegularEmployees + item.OutsourcedEmployees)) *
        12
    ).toFixed(2)
  })
}

// 定义监听
watch(
  [IncomeAmount, manpowerInput, outsourcingAmount],
  (newCount, oldCount) => {
    tempData(IncomeAmount.value, outsourcingAmount.value, manpowerInput.value)
    console.log('projectReportVal', projectReportVal.value)
    total.value = projectReportVal.value.length
  },
  { immediate: true }
)

// 获取初始数据的方法
const getListData = async () => {
  const result = await costListDisplay({
    table: 'projectcostsAll',
    page: page.value,
    size: size.value
  })
  console.log(result)
  IncomeAmount.value = result.lists
  // tableDatas.value = result.lists
  // tableData.value = result.list
  // total.value = result.total
}
getListData()

const getManpowerInput = async () => {
  const result = await costList({
    table: 'manpowerinput',
    page: page.value,
    size: size.value
  })
  manpowerInput.value = result.lists
  console.log('manpowerInput', manpowerInput.value)
}
getManpowerInput()
const getOutsourcingAmount = async () => {
  const result = await costList({
    table: 'outsourcingAmount',
    page: page.value,
    size: size.value
  })
  outsourcingAmount.value = result.lists
  console.log('outsourcingAmount222', outsourcingAmount.value)
}
getOutsourcingAmount()

// 获取查询数据的方法
const getSearchListData = async () => {
  await costAllSelectPage({
    table: 'projectcostsSearch',
    data: selectData,
    page: page.value,
    size: size.value
  }).then((result) => {
    IncomeAmount.value = result.lists
    // tableDatas.value = result.lists
    // tableData.value = result.list
    // total.value = result.total
  })
}

// 分页相关，size改变触发
const handleSizeChange = (currentSize) => {
  size.value = currentSize
  // if (isSearch.value) {
  //   getSearchListData()
  // } else {
  //   getListData()
  // }
  if (page.value === '') {
    projectReportVal.value = projectReportVal.value.splice(0, size.value)
  } else {
    projectReportVal.value = projectReportVal.value.splice(
      (page.value - 1) * size.value,
      size.value
    )
  }
}

// 页码改变触发
const handleCurrentChange = (currentPage) => {
  page.value = currentPage
  // if (isSearch.value) {
  //   getSearchListData()
  // } else {
  //   getListData()
  // }
  if (page.value === '') {
    projectReportVal.value = projectReportVal.value.splice(0, size.value)
  } else {
    projectReportVal.value = projectReportVal.value.splice(
      (page.value - 1) * size.value,
      size.value
    )
  }
}

// 数据表合计
// const getSummaries = (value) => {
//   // const data = tableDatas.value
//   const { columns } = value
//   let data = []
//   // const { columns, data } = value
//   // console.log(tableDatas.value)
//   if (tableDatas.value.length !== 0) {
//     data = tableDatas.value
//   }
//   console.log(columns, tableDatas.value)
//   const sums = []
//   columns.forEach((column, index) => {
//     if (index === 0) {
//       sums[index] = '合计'
//       return
//     } else if (index === 16 || index === 17) {
//       sums[index] = ''
//       return
//     }
//     const values = data.map((item) => Number(item[column.property]))
//     if (!values.every((value) => Number.isNaN(value))) {
//       sums[index] = `${values.reduce((prev, curr) => {
//         const value = Number(curr)
//         if (!Number.isNaN(value)) {
//           return prev + curr
//         } else {
//           return prev
//         }
//       }, 0)}`
//     } else {
//       sums[index] = ''
//     }
//   })
//   return sums
// }
// }

// 获取数据的方法
// const getListStandardData = async () => {
//   const result = await costList({
//     table: 'coststandard',
//     page: page.value,
//     size: size.value
//   })
//   tableStandardData.value = result.list
//   delete result.list[0].id
//   standardArrange.value = Object.keys(tableStandardData.value[0])
//   console.log(tableStandardData.value[0])
// }
// getListStandardData()

onActivated(getListData)

// 监听当前路由
// watch(
//   () => router.currentRoute.value,
//   (newValue) => {
//     console.log('newValue', newValue)
//     console.log('routePath', route.path)
//     // location.reload()
//     // getListData()
//   },
//   { immediate: true }
// )

// 将数组转换为二维数组
const formatJson = (headers, rows) => {
  // 首先遍历数组
  return rows.map((item) => {
    return Object.keys(headers).map((key) => {
      // 角色特殊处理
      if (headers[key] === 'title') {
        const roles = item[headers[key]]
        return JSON.stringify(roles)
        // return JSON.stringify(roles.map((role) => role.title))
      }
      // if (headers[key] === 'openTime') {
      //   return dateFilter(item[headers[key]])
      // }
      return item[headers[key]]
    })
  })
}

// 导出按钮点击事件
const loading = ref(false)
const onToExcelClick = async () => {
  loading.value = true
  const allUser = await projectReportVal.value
  // 导入工具包
  const excel = await import('@/utils/Export2Excel')
  const data = formatJson(USER_RELATIONS, allUser)
  excel.export_json_to_excel({
    // excel 表头
    header: Object.keys(USER_RELATIONS),
    // excel 数据（二维数组结构）
    data,
    // 文件名称
    filename: excelName.value || exportDefaultName,
    // 是否自动列宽
    autoWidth: true,
    // 文件类型
    bookType: 'xlsx'
  })
  ElMessage.success('已导出报表数据')
  // closed()
}

const selectData = ref({})
const onSearch = async () => {
  if (yearValue.value === '') {
    ElMessage.warning('请选择查询年份！')
  } else {
    selectData.value = dayjs(yearValue.value).format('YYYY')
    getSearchListData()
    console.log('data', selectData, typeof selectData.value)
    console.log(dayjs(yearValue.value[0]), yearValue.value)
  }
  isSearch.value = true
}

// 重置
const onRefresh = () => {
  yearValue.value = ''
  getListData()
  isSearch.value = false
}

// const i18n = useI18n()
const exportDefaultName = '报表数据导出'
const excelName = ref('')
excelName.value = '报表数据导出'
</script>

<style lang="scss" scoped>
.article-ranking-container {
  .header {
    margin-bottom: 20px;
    .dynamic-box {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 10px;
      .title {
        margin-right: 20px;
        font-size: 14px;
        font-weight: bold;
      }
    }
  }

  ::v-deep .el-table__row {
    cursor: pointer;
  }

  .pagination {
    margin-top: 20px;
    text-align: center;
  }
}
</style>
