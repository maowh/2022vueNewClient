<template>
  <div class="article-ranking-container">
    <el-card class="header">
      <div class="dynamic-box">
        <span style="margin-left: 5px">客户：</span>
        <el-input
          v-model="inputCustomer"
          style="width: 200px; margin-left: 5px"
          class="w-50 m-2"
          placeholder="请输入客户查询"
        />
        <span style="margin-left: 5px">月度：</span>
        <!-- <el-date-picker
          clear-icon="CircleClose"
          v-model="yearValue"
          style="width: 200px; margin-left: 5px"
          type="year"
          placeholder="请选择年份"
        /> -->
        <el-date-picker
          v-model="yearMonth"
          type="monthrange"
          style="width: 200px; margin-left: 5px"
          start-placeholder="开始月份"
          end-placeholder="截止月份"
          @change="pickerSelect($event)"
        />
        <span style="margin-left: 5px">业务域：</span>
        <el-select v-model="inputBusiness" class="m-2" placeholder="请选择">
          <el-option
            v-for="item in ListBusiness"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          />
        </el-select>
        <span style="margin-left: 5px">姓名：</span>
        <el-input
          v-model="inputName"
          style="width: 200px; margin-left: 5px"
          class="w-50 m-2"
          placeholder="请输入姓名查询"
        />
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
      <el-table
        :data="tablePersonloadReport"
        border
        style="width: 100%"
        :summary-method="getSummaries"
        show-summary
      >
        <el-table-column
          prop="name"
          :label="$t('msg.cost.name')"
        ></el-table-column>
        <el-table-column
          prop="business"
          :label="$t('msg.cost.business')"
        ></el-table-column>
        <el-table-column
          prop="startMonth"
          :label="$t('msg.cost.startYearMonth')"
        ></el-table-column>
        <el-table-column
          prop="endMonth"
          :label="$t('msg.cost.endYearMonth')"
        ></el-table-column>
        <el-table-column
          prop="operationAmount"
          :label="$t('msg.cost.loadAmount')"
        ></el-table-column>
        <el-table-column
          prop="monthAverage"
          :label="$t('msg.cost.monthAverage')"
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
// import { costListDisplay } from '@/api/cost'
import { USER_RELATIONS } from './components/Export2ExcelConstants'
import { costList } from '@/api/cost'
import { ElMessage } from 'element-plus'
import { getMonthBetween, monthNumber } from '@/utils/monthbetween'
// import { ListBusiness } from '@/utils/business'
import { getPersonnelLoadList, getPaging } from '@/utils/personnelload.js'
import dayjs from 'dayjs'

// 最终报表结果数据
const tablePersonloadReport = ref([])
const tablePersonloadReportTemp = ref([])
// 计算分页数据
// const totalAll = ref(0)
const total = ref(0)

const page = ref(1)
const size = ref(10)
// 根据月度区间获取年月
const yearMonth = ref('')
const inputCustomer = ref('')
const inputBusiness = ref('')
const inputName = ref('')

// 月份区间
const betweenMonth = ref([])
// 负荷总值
const loadAll = ref(0)

// 获取业务域信息
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

getPersonnelLoadList().then((item) => {
  // 数组深拷贝slice()和concat()这两个方法，仅适用于对不包含引用对象的一维数组的深拷贝
  // 由于数组内部属性值为引用对象，因此使用slice和concat对对象数组的拷贝，整个拷贝还是浅拷贝，拷贝之后数组各个值的指针还是指向相同的存储地址
  // tablePersonloadReport.value = item
  tablePersonloadReportTemp.value = item
  console.log(item, 'tmp:', tablePersonloadReportTemp.value)
  // total.value = JSON.parse(
  //   JSON.stringify(toRaw(tablePersonloadReportTemp.value)).length
  // )
})

const pickerSelect = (val) => {
  betweenMonth.value = []
  console.log(
    dayjs(yearMonth.value[0]).format('YYYY-MM'),
    dayjs(yearMonth.value[1]).format('YYYY-MM')
  )
  if (yearMonth.value !== null) {
    getMonthBetween(
      dayjs(yearMonth.value[0]).format('YYYY-MM'),
      dayjs(yearMonth.value[1]).format('YYYY-MM')
    ).map((item) => {
      console.log(item)
      betweenMonth.value.push(item)
    })
    console.log(betweenMonth.value)
  }
}

// getPersonnelLoadList().then((item) => {
//   tablePersonloadReportTemp.value = item
//   total.value = JSON.parse(
//     JSON.stringify(toRaw(tablePersonloadReportTemp.value)).length
//   )
//   // tablePersonloadReport.value = item
//   // 传入参数：数据、当前页数、每页显示数据数量
//   // setTimeout(() => {
//   // total.value = tablePersonloadReportTemp.value.length
//   console.log(total.value, toRaw(tablePersonloadReportTemp.value))
//   if (toRaw(tablePersonloadReportTemp.value).length > 0) {
//     console.log('1')
//   }
//   tablePersonloadReport.value = getPaging(
//     toRaw(tablePersonloadReportTemp.value),
//     page.value,
//     size.value
//   )
//   // }, 300)
// })
// tablePersonloadReport.value = await getPersonnelLoadList()

// 分页临时数据
// const tablePersonloadReportTmp = ref([])

// 获取所有费用信息
// const getAllListCosts = async () => {
//   const result = await costListDisplay({
//     table: 'outsourcingcosts'
//     // page: page.value,
//     // size: size.value
//   })
//   tableCostsTmp.value = result.lists
//   // tableData.value = result.list
//   totalAll.value = result.total
//   // tableData.value.map((item) => {})

//   tableCostsTmp.value.forEach((tableCostsItemTmp) => {
//     tableCosts.value.push({
//       systemId: tableCostsItemTmp.systemId,
//       SystemName: tableCostsItemTmp.SystemName,
//       customer: tableCostsItemTmp.customer,
//       operationAmount: tableCostsItemTmp.operationAmount,
//       year: tableCostsItemTmp.year,
//       month: tableCostsItemTmp.month,
//       yearMonth: tableCostsItemTmp.year + '-' + tableCostsItemTmp.month
//     })
//   })
//   console.log(
//     'tableCosts',
//     tableCosts.value,
//     'tableCostsTmp',
//     tableCostsTmp.value
//   )
// }

// 获取所有人均负荷信息
// 循环判断变量
// const load = ref(0)
// const loadId = ref([])
// const loadIs = ref(false)
// const arrId = ref(0)
// 将所有人相同年月的负荷累加
// const getAllListpersonload = async () => {
//   const result = await costListDisplay({
//     table: 'personnelload'
//     // page: page.value,
//     // size: size.value
//   })
//   tablePersonload.value = result.lists
//   totalAll.value = result.total
//   arrId.value = 0
//   // 根据人均负荷信息分解计算出对应的费用信息
//   tablePersonload.value.forEach((tablePersonloadItem) => {
//     yearMonthList.value = tablePersonloadItem.yearMonth.split(',')
//     yearMonthList.value.forEach((yearMonthListItem) => {
//       tablePersonloadAllTmp.value.push({
//         id: ++arrId.value,
//         name: tablePersonloadItem.name,
//         personnelId: tablePersonloadItem.personnelId,
//         systemId: tablePersonloadItem.systemId,
//         load: tablePersonloadItem.load,
//         yearMonth: yearMonthListItem
//       })
//     })
//   })
//   for (let index = 0; index < tablePersonloadAllTmp.value.length; index++) {
//     loadIs.value = false
//     loadId.value.forEach((loadId) => {
//       if (loadId === tablePersonloadAllTmp.value[index].id) {
//         loadIs.value = true
//       }
//     })
//     if (loadIs.value) {
//       console.log(loadIs.value)
//       continue
//     }
//     load.value = Number(tablePersonloadAllTmp.value[index].load)
//     tablePersonloadAllTmp.value.forEach((iteminner) => {
//       console.log(
//         tablePersonloadAllTmp.value[index].id,
//         iteminner.id,
//         tablePersonloadAllTmp.value[index].id !== iteminner.id,
//         tablePersonloadAllTmp.value[index].personnelId ===
//           iteminner.personnelId,
//         tablePersonloadAllTmp.value[index].systemId === iteminner.systemId,
//         tablePersonloadAllTmp.value[index].yearMonth === iteminner.yearMonth
//       )
//       if (
//         tablePersonloadAllTmp.value[index].id !== iteminner.id &&
//         tablePersonloadAllTmp.value[index].personnelId ===
//           iteminner.personnelId &&
//         tablePersonloadAllTmp.value[index].systemId === iteminner.systemId &&
//         tablePersonloadAllTmp.value[index].yearMonth === iteminner.yearMonth
//       ) {
//         load.value += Number(iteminner.load)
//         loadId.value.push(iteminner.id)
//       }
//     })
//     tablePersonloadAll.value.push({
//       id: tablePersonloadAllTmp.value[index].id,
//       personnelId: tablePersonloadAllTmp.value[index].personnelId,
//       name: tablePersonloadAllTmp.value[index].name,
//       systemId: tablePersonloadAllTmp.value[index].systemId,
//       load: load.value,
//       yearMonth: tablePersonloadAllTmp.value[index].yearMonth
//     })
//   }
// }

// 计算人员负荷数据
// const getPersonnelLoadList = async () => {
//   await getAllListpersonload().then((item) => {
//     getAllListCosts().then((item) => {
//       tablePersonloadAll.value.forEach((tablePersonloadAllItem) => {
//         tableCosts.value.forEach((tableCostsItem) => {
//           if (
//             tablePersonloadAllItem.systemId === tableCostsItem.systemId &&
//             tablePersonloadAllItem.yearMonth === tableCostsItem.yearMonth
//           ) {
//             tablePersonloadReportTemp.value.push({
//               personnelId: tablePersonloadAllItem.personnelId,
//               name: tablePersonloadAllItem.name,
//               load: tablePersonloadAllItem.load,
//               yearMonth: tablePersonloadAllItem.yearMonth,
//               SystemName: tableCostsItem.SystemName,
//               customer: tableCostsItem.customer,
//               operationAmount: Number(
//                 Number(tableCostsItem.operationAmount) *
//                   Number(tablePersonloadAllItem.load)
//               ).toFixed(0),
//               year: tableCostsItem.year,
//               month: tableCostsItem.month
//             })
//           }
//         })
//       })
//       tablePersonloadReport.value = tablePersonloadReportTemp.value.slice()
//     })
//   })
// }
// getPersonnelLoadList()

// const getPaging = (val) => {
//   if (val) {
//     total.value = val.length
//     // 计算总的页数
//     if (page.value === 1) {
//       tablePersonloadReport.value = val.splice(0, size.value)
//     } else {
//       tablePersonloadReport.value = val.splice(
//         (page.value - 1) * size.value,
//         size.value
//       )
//     }
//   }
// }

// watch(tablePersonloadReportTemp.value, (val) => {
//   getPaging(tablePersonloadReport.value)
// })

// 数据相关
// const inputSearch = ref('')

// 分页相关，size改变触发
const handleSizeChange = (currentSize) => {
  size.value = currentSize
  getPaging(tablePersonloadReport.value, page, size)
}

// 页码改变触发
const handleCurrentChange = (currentPage) => {
  page.value = currentPage
  getPaging(tablePersonloadReport.value, page, size)
}

// 计算表达式的值，将string转换成object
const test = ref([])
const onSearch = () => {
  // tablePersonloadReport.value = tablePersonloadReportTemp.value
  // 深拷贝
  tablePersonloadReport.value = []
  if (yearMonth.value === null || yearMonth.value === '') {
    ElMessage.warning('起始截止月份为必填项，请选择！')
  } else {
    tablePersonloadReport.value = JSON.parse(
      JSON.stringify(tablePersonloadReportTemp.value)
    )
    test.value = []
    console.log(tablePersonloadReport.value)
    tablePersonloadReport.value.forEach((item) => {
      if (
        betweenMonth.value.includes(item.yearMonth) &&
        item.name.indexOf(inputName.value) !== -1 &&
        item.customer.indexOf(inputCustomer.value) !== -1 &&
        item.business.indexOf(inputBusiness.value) !== -1
      ) {
        item.startMonth = betweenMonth.value[0]
        item.endMonth = betweenMonth.value.slice(-1)
        item.monthAverage = Math.round(
          (Number(
            item.operationAmount /
              (monthNumber(item.startMonth, item.endMonth[0]) + 1)
          ) *
            100) /
            100
        )
        console.log(
          item.operationAmount,
          monthNumber(item.startMonth, item.endMonth[0]) + 1,
          item.operationAmount /
            (monthNumber(item.startMonth, item.endMonth[0]) + 1)
        )
        test.value.push(item)
      }
    })
    test.value.forEach((item) => {
      loadAll.value += item.load
      console.log(loadAll.value)
    })
    // 根据姓名累加
    tablePersonloadReport.value = test.value.reduce((total, cur, index) => {
      var hasValue = total.findIndex((current) => {
        return current.name === cur.name
      })
      hasValue === -1 && total.push(cur)
      hasValue !== -1 &&
        (total[hasValue].operationAmount =
          total[hasValue].operationAmount + cur.operationAmount) &&
        (total[hasValue].monthAverage =
          total[hasValue].monthAverage + cur.monthAverage)
      return total
    }, [])
    // 累加计算月人均产值
    console.log(tablePersonloadReport.value)
  }
  total.value = tablePersonloadReport.value.length
  getPaging(tablePersonloadReport.value, page, size)
}

// 重置
const onRefresh = () => {
  yearMonth.value = ''
  inputCustomer.value = ''
  inputBusiness.value = ''
  inputName.value = ''
  console.log(tablePersonloadReportTemp.value)
  tablePersonloadReport.value = []
  total.value = tablePersonloadReport.value.length
  getPaging(tablePersonloadReport.value, page, size)
  // tablePersonloadReport.value = tablePersonloadReportTemp.value
}

// 数据表合计
const getSummaries = (value) => {
  // const data = tableDatas.value
  const { columns } = value
  let data = []
  // const { columns, data } = value
  // console.log(tableDatas.value)
  if (tablePersonloadReport.value.length !== 0) {
    data = tablePersonloadReport.value
  }
  console.log(columns, tablePersonloadReport.value)
  const sums = []
  columns.forEach((column, index) => {
    if (index === 0) {
      sums[index] = '平均产值'
      return
    } else if (index === 4 || index === 4) {
      sums[index] = ''
      return
    }
    const values = data.map((item) => Number(item[column.property]))
    if (!values.every((value) => Number.isNaN(value))) {
      sums[index] =
        `${values.reduce((prev, curr) => {
          const value = Number(curr)
          if (!Number.isNaN(value)) {
            return prev + curr
          } else {
            return prev
          }
          // 这里计算有问题
        }, 0)}` / total.value
    } else {
      sums[index] = ''
    }
  })
  return sums
}
// }

// 将数组转换为二维数组
const formatJson = (headers, rows) => {
  // 首先遍历数组
  return rows.map((item) => {
    return Object.keys(headers).map((key) => {
      // 角色特殊处理
      if (headers[key] === 'title') {
        const roles = item[headers[key]]
        return JSON.stringify(roles)
      }
      return item[headers[key]]
    })
  })
}

// 导出按钮点击事件
const loading = ref(false)
const onToExcelClick = async () => {
  loading.value = true
  const allData = await tablePersonloadReport.value
  // 导入工具包
  const excel = await import('@/utils/Export2Excel')
  const data = formatJson(USER_RELATIONS, allData)
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
