<template>
  <div class="article-ranking-container">
    <el-card class="header">
      <div class="dynamic-box">
        <span style="margin-left: 5px">月度：</span>
        <el-date-picker
          v-model="monthValue"
          type="monthrange"
          style="width: 200px; margin-left: 5px"
          start-placeholder="开始月份"
          end-placeholder="截止月份"
        />
        <span style="margin-left: 5px">运维&开发：</span>
        <el-select
          v-model="lcategoryValue"
          style="width: 170px; margin-left: 5px"
          class="m-2"
          placeholder="请选择运维&开发"
        >
          <el-option
            v-for="item in lcategorySelect"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          />
        </el-select>
        <span style="margin-left: 5px">自定义分类查询：</span>
        <el-select
          v-model="selectType"
          style="width: 130px; margin-left: 5px"
          class="m-2"
          placeholder="请选择分类"
        >
          <el-option
            v-for="item in listSelect"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          />
        </el-select>
        <el-input
          v-model="inputSearch"
          style="width: 200px; margin-left: 5px"
          class="w-50 m-2"
          placeholder="请输入分类查询内容"
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
      <el-table :data="tablePersonloadReport" border style="width: 100%">
        <!-- <el-table-column prop="id" :label="$t('msg.cost.id')"></el-table-column> -->
        <el-table-column
          prop="name"
          :label="$t('msg.cost.name')"
        ></el-table-column>
        <el-table-column
          prop="SystemName"
          :label="$t('msg.cost.SystemName')"
        ></el-table-column>
        <el-table-column
          prop="customer"
          :label="$t('msg.cost.customerName')"
        ></el-table-column>
        <el-table-column
          prop="year"
          :label="$t('msg.cost.year')"
        ></el-table-column>
        <el-table-column
          prop="month"
          :label="$t('msg.cost.month')"
        ></el-table-column>
        <el-table-column
          prop="load"
          :label="$t('msg.cost.load')"
        ></el-table-column>
        <el-table-column
          prop="operationAmount"
          :label="$t('msg.cost.loadAmount')"
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
import { ref, onActivated } from 'vue'
import { costListDisplay, costList, costAllSelectPage } from '@/api/cost'
// import { useRouter, useRoute } from 'vue-router'
import {
  USER_RELATIONS,
  // ListDisplay,
  lcategorySelect,
  listSelect
} from './components/Export2ExcelConstants'
import { ElMessage } from 'element-plus'
import dayjs from 'dayjs'
// import { useI18n } from 'vue-i18n'

// const router = useRouter()
// const route = useRoute()
// const i18n = useI18n()

const tableCosts = ref([])
const tablePersonload = ref([])
const tablePersonloadAll = ref([])
const tablePersonloadAllTmp = ref([])
const yearMonthList = ref([])
const tableCostsTmp = ref([])

// 最终报表结果数据
const tablePersonloadReport = ref([])

// 获取所有费用信息
const getAllListCosts = async () => {
  const result = await costListDisplay({
    table: 'outsourcingcosts'
    // page: page.value,
    // size: size.value
  })
  tableCostsTmp.value = result.lists
  // tableData.value = result.list
  total.value = result.total
  // tableData.value.map((item) => {})

  tableCostsTmp.value.forEach((tableCostsItemTmp) => {
    tableCosts.value.push({
      systemId: tableCostsItemTmp.systemId,
      SystemName: tableCostsItemTmp.SystemName,
      customer: tableCostsItemTmp.customer,
      operationAmount: tableCostsItemTmp.operationAmount,
      year: tableCostsItemTmp.year,
      month: tableCostsItemTmp.month,
      yearMonth: tableCostsItemTmp.year + '-' + tableCostsItemTmp.month
    })
  })
  console.log(
    'tableCosts',
    tableCosts.value,
    'tableCostsTmp',
    tableCostsTmp.value
  )
}

// 获取所有人均负荷信息
// 循环判断变量
const load = ref(0)
const loadId = ref([])
const loadIs = ref(false)
const arrId = ref(0)
const getAllListpersonload = async () => {
  const result = await costListDisplay({
    table: 'personnelload'
    // page: page.value,
    // size: size.value
  })
  tablePersonload.value = result.lists
  total.value = result.total
  arrId.value = 0
  // 根据人均负荷信息分解计算出对应的费用信息
  tablePersonload.value.forEach((tablePersonloadItem) => {
    yearMonthList.value = tablePersonloadItem.yearMonth.split(',')
    yearMonthList.value.forEach((yearMonthListItem) => {
      tablePersonloadAllTmp.value.push({
        id: ++arrId.value,
        name: tablePersonloadItem.name,
        personnelId: tablePersonloadItem.personnelId,
        systemId: tablePersonloadItem.systemId,
        load: tablePersonloadItem.load,
        yearMonth: yearMonthListItem
      })
    })
  })
  for (let index = 0; index < tablePersonloadAllTmp.value.length; index++) {
    loadIs.value = false
    loadId.value.forEach((loadId) => {
      if (loadId === tablePersonloadAllTmp.value[index].id) {
        loadIs.value = true
      }
    })
    if (loadIs.value) {
      console.log(loadIs.value)
      continue
    }
    load.value = Number(tablePersonloadAllTmp.value[index].load)
    tablePersonloadAllTmp.value.forEach((iteminner) => {
      console.log(
        tablePersonloadAllTmp.value[index].id,
        iteminner.id,
        tablePersonloadAllTmp.value[index].id !== iteminner.id,
        tablePersonloadAllTmp.value[index].personnelId ===
          iteminner.personnelId,
        tablePersonloadAllTmp.value[index].systemId === iteminner.systemId,
        tablePersonloadAllTmp.value[index].yearMonth === iteminner.yearMonth
      )
      if (
        tablePersonloadAllTmp.value[index].id !== iteminner.id &&
        tablePersonloadAllTmp.value[index].personnelId ===
          iteminner.personnelId &&
        tablePersonloadAllTmp.value[index].systemId === iteminner.systemId &&
        tablePersonloadAllTmp.value[index].yearMonth === iteminner.yearMonth
      ) {
        console.log('1')
        load.value += Number(iteminner.load)
        loadId.value.push(iteminner.id)
      }
    })
    tablePersonloadAll.value.push({
      id: tablePersonloadAllTmp.value[index].id,
      personnelId: tablePersonloadAllTmp.value[index].personnelId,
      name: tablePersonloadAllTmp.value[index].name,
      systemId: tablePersonloadAllTmp.value[index].systemId,
      load: load.value,
      yearMonth: tablePersonloadAllTmp.value[index].yearMonth
    })
  }
  // tablePersonloadAllTmp.value.forEach((itemout) => {

  // })
  console.log(
    'tablePersonloadAll',
    tablePersonloadAll.value,
    'tablePersonloadAllTmp',
    tablePersonloadAllTmp.value
  )
}
getAllListpersonload().then((item) => {
  getAllListCosts().then((item) => {
    tablePersonloadAll.value.forEach((tablePersonloadAllItem) => {
      tableCosts.value.forEach((tableCostsItem) => {
        console.log(
          tablePersonloadAllItem.systemId,
          tableCostsItem.systemId,
          tablePersonloadAllItem.yearMonth,
          tableCostsItem.yearMonth,
          tablePersonloadAllItem.systemId === tableCostsItem.systemId,
          tablePersonloadAllItem.yearMonth === tableCostsItem.yearMonth
        )
        if (
          tablePersonloadAllItem.systemId === tableCostsItem.systemId &&
          tablePersonloadAllItem.yearMonth === tableCostsItem.yearMonth
        ) {
          tablePersonloadReport.value.push({
            personnelId: tablePersonloadAllItem.personnelId,
            name: tablePersonloadAllItem.name,
            load: tablePersonloadAllItem.load,
            yearMonth: tablePersonloadAllItem.yearMonth,
            SystemName: tableCostsItem.SystemName,
            customer: tableCostsItem.customer,
            operationAmount: Number(
              Number(tableCostsItem.operationAmount) *
                Number(tablePersonloadAllItem.load)
            ).toFixed(0),
            year: tableCostsItem.year,
            month: tableCostsItem.month
          })
        }
      })
    })
  })
  console.log(tablePersonloadReport.value)
})

// 数据相关
const inputSearch = ref('')
const selectType = ref('')
const yearValue = ref('')
const lcategoryValue = ref('')
const tableData = ref([])
// tableDatas获取所有的记录用于统计
const tableDatas = ref([])
const tableStandardData = ref([])
const standardArrange = ref([])
// const standardValue = ref([])
const total = ref(0)
const page = ref(1)
const size = ref(5)
// 判断是否查询
const isSearch = ref(false)

// 测试日期选择
const monthValue = ref('')

// 获取初始数据的方法
const getListData = async () => {
  const result = await costListDisplay({
    table: 'costsreport',
    page: page.value,
    size: size.value
  })
  console.log(result)
  tableDatas.value = result.lists
  tableData.value = result.list
  total.value = result.total
  // tableData.value.map((item) => {})
}
getListData()

// 获取查询数据的方法
const getSearchListData = async () => {
  await costAllSelectPage({
    table: 'costsreportsearch',
    data: selectData,
    page: page.value,
    size: size.value
  }).then((result) => {
    tableDatas.value = result.lists
    tableData.value = result.list
    total.value = result.total
  })
}

// 分页相关，size改变触发
const handleSizeChange = (currentSize) => {
  size.value = currentSize
  if (isSearch.value) {
    getSearchListData()
  } else {
    getListData()
  }
}

// 页码改变触发
const handleCurrentChange = (currentPage) => {
  page.value = currentPage
  if (isSearch.value) {
    getSearchListData()
  } else {
    getListData()
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
const getListStandardData = async () => {
  const result = await costList({
    table: 'coststandard',
    page: page.value,
    size: size.value
  })
  tableStandardData.value = result.list
  delete result.list[0].id
  standardArrange.value = Object.keys(tableStandardData.value[0])
  console.log(tableStandardData.value[0])
}
getListStandardData()

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
  const allUser = await tableDatas.value
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

// 计算表达式的值，将string转换成object
const evil = (fn) => {
  var Fn = Function // 一个变量指向Function，防止有些前端编译工具报错
  return new Fn('return ' + fn)()
}
const selectData = ref({})
const onSearch = async () => {
  console.log(
    '原始：',
    monthValue,
    '解析值：',
    monthValue.value,
    // undefined
    // value1.value[0]
    dayjs(monthValue.value[0]).format('MM'),
    dayjs(monthValue.value[1]).format('YYYYMM')
  )
  if (
    lcategoryValue.value === '' &&
    // yearValue.value === '' &&
    monthValue.value === '' &&
    selectType.value === ''
  ) {
    ElMessage.warning('请选择查询项目！')
  } else if (selectType.value !== '' && inputSearch.value.trim() === '') {
    ElMessage.warning('请输入自定义查询内容！')
  } else if (selectType.value === '' && inputSearch.value.trim() !== '') {
    ElMessage.warning('请选择自定义查询项目！')
  } else if (selectType.value === '' && inputSearch.value.trim() === '') {
    const test = `{ 'classification':'${lcategoryValue.value}',
    'startmonth':'${dayjs(monthValue.value[0]).format('YYYYMM')}',
    'endmonth':'${dayjs(monthValue.value[1]).format('YYYYMM')}',
   }`
    selectData.value = evil(test)
    console.log(test, selectData.value)
    getSearchListData()
    console.log('data', selectData, typeof selectData.value)
  } else {
    const test = `{ ${selectType.value}:'${
      inputSearch.value
    }','classification':'${lcategoryValue.value}',
    'startmonth':'${dayjs(monthValue.value[0]).format('YYYYMM')}',
    'endmonth':'${dayjs(monthValue.value[1]).format('YYYYMM')}',
  }`
    selectData.value = evil(test)
    console.log(test, selectData.value)
    getSearchListData()
    console.log('data', selectData, typeof selectData.value)
  }
  isSearch.value = true
}

// 重置
const onRefresh = () => {
  inputSearch.value = ''
  selectType.value = ''
  yearValue.value = ''
  lcategoryValue.value = ''
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
