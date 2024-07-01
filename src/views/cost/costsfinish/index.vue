<template>
  <div class="article-ranking-container">
    <el-card class="header">
      <div class="dynamic-box">
        <!-- <span style="margin-left: 5px">客户：</span>
        <el-input
          v-model="inputCustomer"
          style="width: 200px; margin-left: 5px"
          class="w-50 m-2"
          placeholder="请输入客户查询"
        />
        <span style="margin-left: 5px">月度：</span>
        <el-date-picker
          v-model="yearMonth"
          type="monthrange"
          style="width: 200px; margin-left: 5px"
          start-placeholder="开始月份"
          end-placeholder="截止月份"
          @change="pickerSelect($event)"
        /> -->
        <div>
          <span style="margin-left: 5px">执行率预警百分比选项：</span>
          <el-select v-model="inputBusiness" class="m-2" placeholder="请选择">
            <el-option
              v-for="item in ListBusiness"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
          <span style="margin-left: 5px">执行率预警值：</span>
          <el-input-number v-model="num" :step="5" />
        </div>
        <!-- <span style="margin-left: 5px">系统名称：</span>
        <el-input
          v-model="inputName"
          style="width: 200px; margin-left: 5px"
          class="w-50 m-2"
          placeholder="请输入姓名查询"
        /> -->
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
      <el-table :data="QuarterAllP" border style="width: 100%">
        <!-- <el-table-column prop="id" :label="$t('msg.cost.id')"></el-table-column> -->
        <el-table-column
          prop="customer"
          :label="$t('msg.cost.customerName')"
        ></el-table-column>
        <el-table-column
          prop="year"
          :label="$t('msg.cost.year')"
        ></el-table-column>
        <el-table-column
          prop="quarter"
          :label="$t('msg.cost.quarter')"
        ></el-table-column>
        <el-table-column
          prop="business"
          :label="$t('msg.cost.business')"
        ></el-table-column>
        <el-table-column
          prop="SystemName"
          :label="$t('msg.cost.SystemName')"
        ></el-table-column>
        <el-table-column
          prop="reportedAmountPlan"
          :label="$t('msg.cost.reportedAmountPlan')"
        ></el-table-column>
        <el-table-column
          prop="reportedAmount"
          :label="$t('msg.cost.reportedAmountReality')"
        ></el-table-column>
        <el-table-column
          prop="reportedAmountPercentage"
          :label="$t('msg.cost.reportedAmountPercentage')"
        ></el-table-column>
        <el-table-column
          prop="operationAmountPlan"
          :label="$t('msg.cost.operationAmountPlan')"
        ></el-table-column>
        <el-table-column
          prop="operationAmount"
          :label="$t('msg.cost.operationAmountReality')"
        ></el-table-column>
        <el-table-column
          prop="operationAmountPercentage"
          :label="$t('msg.cost.operationAmountPercentage')"
        ></el-table-column>
        <el-table-column
          prop="developAmountPlan"
          :label="$t('msg.cost.developAmountPlan')"
        ></el-table-column>
        <el-table-column
          prop="developAmount"
          :label="$t('msg.cost.developAmountReality')"
        ></el-table-column>
        <el-table-column
          prop="developAmountPercentage"
          :label="$t('msg.cost.developAmountPercentage')"
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
import { ref } from 'vue'
import { costListDisplay } from '@/api/cost'
// import { useRouter, useRoute } from 'vue-router'
import { USER_RELATIONS } from './components/Export2ExcelConstants'
// import { ListBusiness } from '@/utils/business'
import { getPaging } from '@/utils/personnelload.js'
import { ElMessage } from 'element-plus'
// import dayjs from 'dayjs'
// import { useI18n } from 'vue-i18n'

// const router = useRouter()
// const route = useRoute()
// const i18n = useI18n()
// 数据相关
// const tableData = ref([])
// 临时数据
// const tableDataTmp = ref([])
// tableDatas获取所有的记录用于统计
// const tableDatas = ref([])
// const standardValue = ref([])
const total = ref(0)
const page = ref(1)
const size = ref(10)

// 日期区间选择
const yearMonth = ref('')
const inputCustomer = ref('')
const inputBusiness = ref('')
const inputName = ref('')

// 定义月度实际和月度累计实际
const monthReportedAmount = ref([])
// const monthOperationAmount = ref([])
// const monthDevelopAmount = ref([])
// 定义季度实际
// const quarterReportedAmount = ref([])
// const quarterOperationAmount = ref([])
// const quarterDevelopAmount = ref([])
const quarterTotal = ref([])
// 获取季度实际金额
const quarterAll = ref([])
const QuarterAllP = ref([])
// 定义计划
const costsPlan = ref([])
// 定义
// const costsReality = ref([])
// const costsPlanOperationQuarter = ref([])
// const costsPlanDevelopQuarter = ref([])
// 预警初始值
const num = ref(80)

// 获取业务域信息
const ListBusiness = ref([
  { value: '总额', label: '总额' },
  { value: '本领域', label: '本领域' },
  { value: '外部门', label: '外部门' }
])
// const getListBusiness = async () => {
//   const result = await costList({
//     table: 'businessdomain',
//     page: 1,
//     size: 100
//   })
//   result.list.forEach((item) => {
//     ListBusiness.value.push({
//       value: item.businessName,
//       label: item.businessName
//     })
//   })
// }
// getListBusiness()

// 将实际金额月度转换为季度
const aggregateByQuarter = (data) => {
  const result = {}

  data.forEach((record) => {
    const quarter = Math.ceil(Number(record.month) / 3) // 计算季度
    const key = `${record.SystemName}_${record.year}_${quarter}` // 创建系统名和季度组合的唯一键
    // 如果结果对象中还没有这个季度的记录，初始化它
    if (!result[key]) {
      result[key] = {
        // systemname: record.systemname,
        // quarter: quarter,
        // reportedAmount: 0 // 初始化累加值
        SystemName: record.SystemName,
        business: record.business,
        contractAmount: 0,
        customer: record.customer,
        month: record.month,
        year: record.year,
        developAmount: 0,
        id: record.id,
        quarter: quarter,
        reportedAmount: 0,
        operationAmount: 0,
        systemId: record.systemId,
        taxAmount: 0,
        reportedAmountPlan: 0,
        operationAmountPlan: 0,
        developAmountPlan: 0,
        reportedAmountPercentage: 0,
        operationAmountPercentage: 0,
        developAmountPercentage: 0
      }
    }

    // 累加value
    // result[key].reportedAmount = 0
    result[key].reportedAmount += record.reportedAmount
    result[key].operationAmount += record.operationAmount
    result[key].developAmount += record.developAmount
    result[key].contractAmount += record.contractAmount
    result[key].taxAmount += record.taxAmount
  })

  // 将结果转换为期望的数组格式
  return Object.values(result)
}

// 获取月度实际费用
const getCostsReality = async () => {
  monthReportedAmount.value = []
  quarterTotal.value = []
  await costListDisplay({
    table: 'outsourcingcosts'
  }).then((items) => {
    // 将月度费用转换为季度费用
    quarterAll.value = aggregateByQuarter(items.lists)
    // for (let index = 0; index < 12; index++) {
    //   monthReportedAmount.value.splice(index, 0, 0)
    //   monthOperationAmount.value.splice(index, 0, 0)
    //   monthDevelopAmount.value.splice(index, 0, 0)
    // }

    // const testItem = ref([])
    // items.lists.map((item) => {
    //   if (
    //     item.year === startYear.value &&
    //     betweenMonth.value.indexOf(item.month) >= 0
    //   ) {
    //     testItem.value.push(item)
    //   }
    // })
    // console.log(testItem.value)
    // costsReality.value = testItem.value.reduce((total, cur, index) => {
    //   var hasValue = total.findIndex((current) => {
    //     return current.SystemName === cur.SystemName
    //   })
    //   hasValue === -1 && total.push(cur)
    //   hasValue !== -1 &&
    //     (total[hasValue].reportedAmount =
    //       total[hasValue].reportedAmount + cur.reportedAmount)
    //   return total
    // }, [])
    // console.log(costsReality.value)
    // // 以下没有使用
    // convertMonthQuarter(monthReportedAmount.value, 'Reported')
    // convertMonthQuarter(monthOperationAmount.value, 'Operation')
    // convertMonthQuarter(monthDevelopAmount.value, 'Develop')
    // console.log(
    //   '分季度合计费用',
    //   quarterReportedAmount.value,
    //   '分季度本领域费用',
    //   quarterOperationAmount.value,
    //   '分季度外部门费用',
    //   quarterDevelopAmount.value
    // )
  })
}
// 获取年度计划费用、月度计划费用
const getCostsPlan = async () => {
  await costListDisplay({
    table: 'outsourcingcostsplan',
    page: page.value,
    size: size.value
  }).then((items) => {
    costsPlan.value = []
    if (items.lists.length !== 0) {
      items.lists.map((item) => {
        quarterAll.value.forEach((item1) => {
          if (item1.systemId === item.systemId && item1.year === item.year) {
            item1.reportedAmountPlan = Math.round(item.reportedAmount / 4)
            item1.operationAmountPlan = Math.round(item.operationAmount / 4)
            item1.developAmountPlan = Math.round(item.developAmount / 4)
            item1.reportedAmountPercentage =
              Math.round(
                (item1.reportedAmount / item1.reportedAmountPlan) * 10000
              ) /
                100 +
              '%'
            item1.operationAmountPercentage =
              Math.round(
                (item1.operationAmount / item1.operationAmountPlan) * 10000
              ) /
                100 +
              '%'
            item1.developAmountPercentage =
              Math.round(
                (item1.developAmount / item1.developAmountPlan) * 10000
              ) /
                100 +
              '%'
          }
        })

        // if (item.year === startYear.value) {
        //   item.reportedAmount = Math.round(
        //     ((item.reportedAmount / 4) * betweenQuarter.value * 100) / 100
        //   )
        //   item.operationAmount = Math.round(
        //     ((item.operationAmount / 4) * betweenQuarter.value * 100) / 100
        //   )
        //   item.developAmount = Math.round(
        //     ((item.developAmount / 4) * betweenQuarter.value * 100) / 100
        //   )
        //   costsPlan.value.push(item)
        // }
      })
    }
    total.value = quarterAll.value.length
    QuarterAllP.value = getPaging(quarterAll.value, page.value, size.value)
  })
}

// 将月度费用转换成季度费用
// const convertMonthQuarter = (amount, selectItem) => {
//   let value = 0
//   for (let index = 0; index < amount.length; index++) {
//     value += amount[index]
//     if (index === 2) {
//       if (selectItem === 'Reported') {
//         quarterReportedAmount.value.push(value)
//         value = 0
//       } else if (selectItem === 'Operation') {
//         quarterOperationAmount.value.push(value)
//         value = 0
//       } else if (selectItem === 'Develop') {
//         quarterDevelopAmount.value.push(value)
//         value = 0
//       }
//     } else if (index === 5) {
//       if (selectItem === 'Reported') {
//         quarterReportedAmount.value.push(value)
//         value = 0
//       } else if (selectItem === 'Operation') {
//         quarterOperationAmount.value.push(value)
//         value = 0
//       } else if (selectItem === 'Develop') {
//         quarterDevelopAmount.value.push(value)
//         value = 0
//       }
//     } else if (index === 8) {
//       if (selectItem === 'Reported') {
//         quarterReportedAmount.value.push(value)
//         value = 0
//       } else if (selectItem === 'Operation') {
//         quarterOperationAmount.value.push(value)
//         value = 0
//       } else if (selectItem === 'Develop') {
//         quarterDevelopAmount.value.push(value)
//         value = 0
//       }
//     } else if (index === 11) {
//       if (selectItem === 'Reported') {
//         quarterReportedAmount.value.push(value)
//         value = 0
//       } else if (selectItem === 'Operation') {
//         quarterOperationAmount.value.push(value)
//         value = 0
//       } else if (selectItem === 'Develop') {
//         quarterDevelopAmount.value.push(value)
//         value = 0
//       }
//     }
//   }
// }
// 获取数据，测试用---
getCostsReality().then(() => {
  getCostsPlan()
})

// 获取月度区间
// 获取起始年份和截止年份（判断是否同一年份，并且获取年份数据）、起始月份（计算起始季度和截止季度）
// const startYear = ref('')
// const startMonth = ref('')
// const endYear = ref('')
// const endMonth = ref('')
// const quarterStart = ref(0)
// const quarterEnd = ref(0)
// const betweenMonth = ref([])
// const betweenQuarter = ref(0)
// const pickerSelect = () => {
//   startYear.value = dayjs(yearMonth.value[0]).format('YYYY')
//   startMonth.value = dayjs(yearMonth.value[0]).format('MM')
//   endYear.value = dayjs(yearMonth.value[1]).format('YYYY')
//   endMonth.value = dayjs(yearMonth.value[1]).format('MM')
//   console.log(
//     '开始年份',
//     dayjs('2000-01-01').format('YYYY'),
//     '结束年份',
//     dayjs().format('YYYY'),
//     '开始月份',
//     dayjs('2000-01-01').format('MM'),
//     '结束月份',
//     dayjs().format('MM')
//   )
//   quarterStart.value = Math.ceil(startMonth.value / 3)
//   quarterEnd.value = Math.ceil(endMonth.value / 3)
//   if (quarterEnd.value - quarterStart.value === 0) {
//     betweenQuarter.value = 1
//   } else if (quarterEnd.value - quarterStart.value === 1) {
//     betweenQuarter.value = 2
//   } else if (quarterEnd.value - quarterStart.value === 2) {
//     betweenQuarter.value = 3
//   } else if (quarterEnd.value - quarterStart.value === 3) {
//     betweenQuarter.value = 4
//   }
//   // 根据季度来判断所选季度所有月份
//   for (let index = 1; index < 13; index++) {
//     if (
//       index >= (quarterStart.value - 1) * 3 + 1 &&
//       index <= quarterEnd.value * 3
//     ) {
//       if (index < 10) {
//         betweenMonth.value.push('0' + index.toString())
//       } else {
//         betweenMonth.value.push(index.toString())
//       }
//     }
//   }
//   console.log(betweenMonth.value)
//   if (startYear.value !== endYear.value) {
//     ElMessage.error('只能选择同一年度')
//     yearMonth.value = ''
//   } else {
//     getCostsPlan()
//     getCostsReality()
//   }
// }

// // 根据系统名称累加
// tablePersonloadReport.value = test.value.reduce((total, cur, index) => {
//   var hasValue = total.findIndex((current) => {
//     return current.name === cur.name
//   })
//   hasValue === -1 && total.push(cur)
//   hasValue !== -1 &&
//     (total[hasValue].operationAmount =
//       total[hasValue].operationAmount + cur.operationAmount)
//   return total
// }, [])

// 分页相关，size改变触发
const handleSizeChange = (currentSize) => {
  size.value = currentSize
  console.log('size改变：', quarterAll.value, page, size)
  QuarterAllP.value = getPaging(quarterAll.value, page.value, size.value)
}

// 页码改变触发
const handleCurrentChange = (currentPage) => {
  page.value = currentPage
  console.log('页码改变：', quarterAll.value, page, size)
  QuarterAllP.value = getPaging(quarterAll.value, page.value, size.value)
}

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
  const allUser = QuarterAllP.value
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

// const onSearch = async () => {
//   tableDataTmp.value = []
//   tableData.value = []
//   // tableData.value = []
//   console.log(costsPlan.value, costsReality.value)
//   costsReality.value.map((item) => {
//     costsPlan.value.forEach((itemPlan) => {
//       console.log(
//         itemPlan.systemId,
//         item.systemId,
//         itemPlan.systemId === item.systemId
//       )
//       if (itemPlan.systemId === item.systemId) {
//         tableDataTmp.value.push({
//           customer: item.customer,
//           quarterStart: startYear.value + '年' + quarterStart.value + '季度',
//           quarterEnd: endYear.value + '年' + quarterEnd.value + '季度',
//           business: item.business,
//           SystemName: item.SystemName,
//           reportedAmount: item.reportedAmount,
//           operationAmount: item.operationAmount,
//           developAmount: item.developAmount,
//           reportedAmountPlan: itemPlan.reportedAmount,
//           operationAmountPlan: itemPlan.operationAmount,
//           developAmountPlan: itemPlan.developAmount,
//           reportedAmountPercentage:
//             Math.round(
//               (item.reportedAmount / itemPlan.reportedAmount) * 10000
//             ) /
//               100 +
//             '%',
//           operationAmountPercentage:
//             Math.round(
//               (item.operationAmount / itemPlan.operationAmount) * 10000
//             ) /
//               100 +
//             '%',
//           developAmountPercentage:
//             Math.round((item.developAmount / itemPlan.developAmount) * 10000) /
//               100 +
//             '%'
//         })
//       }
//     })
//   })

//   // tableData.value = JSON.parse(JSON.stringify(tableDataTmp.value))
//   if (yearMonth.value === null || yearMonth.value === '') {
//     ElMessage.warning('起始截止月份为必填项，请选择！')
//   } else {
//     console.log(tableDataTmp.value)
//     tableDataTmp.value.forEach((item) => {
//       if (
//         item.customer.indexOf(inputCustomer.value) !== -1 &&
//         item.business.indexOf(inputBusiness.value) !== -1 &&
//         item.SystemName.indexOf(inputName.value) !== -1
//       ) {
//         console.log(item)
//         tableData.value.push(item)
//       }
//     })
//   }
//   total.value = tableData.value.length
//   // getPaging(tableData.value, page, size)
// }

const onSearch = () => {
  console.log('onsearch全部前:', quarterAll.value)
  console.log('选择框内容：', inputBusiness.value === '')
  if (inputBusiness.value !== '') {
    const reportedAmountPercentage = ref(0)
    const operationAmountPercentage = ref(0)
    const developAmountPercentage = ref(0)
    QuarterAllP.value = quarterAll.value.filter((item) => {
      console.log(
        '类型：',
        typeof item.reportedAmountPercentage,
        item.reportedAmountPercentage
      )
      if (
        inputBusiness.value === '总额' &&
        typeof item.reportedAmountPercentage === 'string'
      ) {
        console.log('总额：', item.reportedAmountPercentage.split('%')[0])
        reportedAmountPercentage.value = Number(
          item.reportedAmountPercentage.split('%')[0]
        ).toFixed(2)
        return reportedAmountPercentage.value < num.value
      } else if (
        inputBusiness.value === '本领域' &&
        typeof item.operationAmountPercentage === 'string'
      ) {
        operationAmountPercentage.value = Number(
          item.operationAmountPercentage.split('%')[0]
        ).toFixed(2)
        return operationAmountPercentage.value < num.value
      } else if (
        inputBusiness.value === '外部门' &&
        typeof item.developAmountPercentage === 'string'
      ) {
        developAmountPercentage.value = Number(
          item.developAmountPercentage.split('%')[0]
        ).toFixed(2)
        return developAmountPercentage.value < num.value
      }
    })
    total.value = QuarterAllP.value.length
    getPaging(QuarterAllP.value, page.value, size.value)
  } else {
    ElMessage.warning('执行率预警百分比选项不能为空！')
  }
  console.log('onsearch全部后:', QuarterAllP.value)
}

// 重置
const onRefresh = () => {
  yearMonth.value = ''
  inputCustomer.value = ''
  inputBusiness.value = ''
  num.value = 80
  inputName.value = ''
  // tableData.value = []
  // total.value = tableData.value.length
  getCostsReality().then(() => {
    getCostsPlan()
  })
  getPaging(QuarterAllP.value, page.value, size.value)
  console.log('重置：:', QuarterAllP.value)
  // getListData()
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
