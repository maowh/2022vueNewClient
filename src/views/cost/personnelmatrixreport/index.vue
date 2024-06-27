<template>
  <div class="article-ranking-container">
    <el-card class="header">
      <div class="dynamic-box">
        <div>
          <span style="margin-left: 5px">年度：</span>
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
      <el-table :data="tablePersonloadReport" border style="width: 100%">
        <el-table-column
          v-for="column in columList"
          :key="column.prop"
          :prop="column.prop"
          :label="column.label"
        ></el-table-column>
        <!-- <el-table-column
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
        ></el-table-column> -->
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
import { columList } from './components/Export2ExcelConstants'
import { costAllSelect } from '@/api/cost'
import { ElMessage } from 'element-plus'
// import { monthNumber } from '@/utils/monthbetween'
// import { ListBusiness } from '@/utils/business'
import { getPersonnelmatrixAll, getPaging } from '@/utils/personnelload.js'
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
const yearValue = ref('')
// const yearMonth = ref('')
// const inputCustomer = ref('')
// const inputBusiness = ref('')
// const inputName = ref('')

// 月份区间
// const betweenMonth = ref([])
// 负荷总值
// const loadAll = ref(0)

// 获取项目信息
const ListProjects = ref([])
const getProjects = async (yearObj) => {
  const result = await costAllSelect({
    table: 'project',
    data: yearObj
  })
  ListProjects.value = result
}
// 将表转换为列
const testTmp = ref([])
// 获取单个数据
const obj = ref({})

// 判断是否有重复列名
const isColum = ref(false)

const yearObj = ref({})
const getData = () => {
  // 设置报表显示的年份
  if (yearValue.value === null || yearValue.value === '') {
    yearValue.value = dayjs().format('YYYY')
  } else {
    yearValue.value = dayjs(yearValue.value).format('YYYY')
  }
  yearObj.value.yearValue = yearValue.value
  console.log('yearValue.value:', yearObj.value)
  getProjects(yearObj).then(() => {
    getPersonnelmatrixAll(yearObj).then((item) => {
      // 数组深拷贝slice()和concat()这两个方法，仅适用于对不包含引用对象的一维数组的深拷贝
      // 由于数组内部属性值为引用对象，因此使用slice和concat对对象数组的拷贝，整个拷贝还是浅拷贝，拷贝之后数组各个值的指针还是指向相同的存储地址
      tablePersonloadReportTemp.value = item
      testTmp.value = []
      const isAdd = ref(true)

      Object.keys(item[0]).forEach((key) => {
        obj.value[key] = ''
      })
      item.forEach((value) => {
        obj.value = {}
        isAdd.value = true
        testTmp.value.forEach((test) => {
          if (
            value.name === test.name &&
            value.projectName &&
            typeof value.projectName === 'string'
          ) {
            // 计算项目系数
            test[value.projectName] = Number(value.worktotal).toFixed(2)
            test.worktotal = Number(
              Number(test.worktotal) + Number(value.worktotal)
            ).toFixed(2)
            isAdd.value = false
          }
        })
        if (isAdd.value) {
          obj.value.name = value.name
          obj.value.year = value.year
          obj.value.business = value.business
          obj.value.attribute = value.attribute
          obj.value.station = value.station
          obj.value.Officelocation = value.Officelocation
          obj.value.Domainsplit = value.Domainsplit
          obj.value.customer = value.customer
          obj.value.region = value.region
          ListProjects.value.forEach((item1) => {
            // if (item1.year === '2023') {
            obj.value[item1.projectName] = 0
            if (value.projectName === item1.projectName) {
              obj.value[item1.projectName] = Number(value.worktotal).toFixed(2)
              obj.value.worktotal = Number(value.worktotal).toFixed(2)
            }
            // }
          })
          testTmp.value.push(obj.value)
        }
      })

      tablePersonloadReport.value = []
      tablePersonloadReport.value = JSON.parse(JSON.stringify(testTmp.value))
      console.log('tablePersonloadReport.value', tablePersonloadReport.value)
      total.value = tablePersonloadReport.value.length
      Object.keys(tablePersonloadReport.value[0]).forEach((item) => {
        columList.find((item1) => {
          if (item1.prop === item) {
            isColum.value = true
          }
        })
        if (!isColum.value) {
          columList.push({ prop: item, label: item })
        }
        isColum.value = false
      })
      columList.forEach((item) => {
        exportCulumns.value[item.label] = item.prop
        // exportCulumns.value.push(item.prop, item.label)
      })
      console.log('exportCulumns:', exportCulumns.value)
    })
  })
}
getData()

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
// const test = ref([])
const onSearch = () => {
  // tablePersonloadReport.value = tablePersonloadReportTemp.value
  // 深拷贝

  tablePersonloadReport.value = []
  if (yearValue.value === null || yearValue.value === '') {
    ElMessage.warning('年份必须选择，请选择！')
  } else {
    getData()
    // tablePersonloadReport.value = JSON.parse(
    //   JSON.stringify(tablePersonloadReportTemp.value)
    // )
    // test.value = []
    // console.log(tablePersonloadReport.value)
    // tablePersonloadReport.value.forEach((item) => {
    //   if (
    //     betweenMonth.value.includes(item.yearMonth) &&
    //     item.name.indexOf(inputName.value) !== -1 &&
    //     item.customer.indexOf(inputCustomer.value) !== -1 &&
    //     item.business.indexOf(inputBusiness.value) !== -1
    //   ) {
    //     item.startMonth = betweenMonth.value[0]
    //     item.endMonth = betweenMonth.value.slice(-1)
    //     item.monthAverage = Math.round(
    //       (Number(
    //         item.operationAmount /
    //           (monthNumber(item.startMonth, item.endMonth[0]) + 1)
    //       ) *
    //         100) /
    //         100
    //     )
    //     console.log(
    //       item.operationAmount,
    //       monthNumber(item.startMonth, item.endMonth[0]) + 1,
    //       item.operationAmount /
    //         (monthNumber(item.startMonth, item.endMonth[0]) + 1)
    //     )
    //     test.value.push(item)
    //   }
    // })
    // test.value.forEach((item) => {
    //   loadAll.value += item.load
    //   console.log(loadAll.value)
    // })
    // 根据姓名累加
    // tablePersonloadReport.value = test.value.reduce((total, cur, index) => {
    //   var hasValue = total.findIndex((current) => {
    //     return current.name === cur.name
    //   })
    //   hasValue === -1 && total.push(cur)
    //   hasValue !== -1 &&
    //     (total[hasValue].operationAmount =
    //       total[hasValue].operationAmount + cur.operationAmount) &&
    //     (total[hasValue].monthAverage =
    //       total[hasValue].monthAverage + cur.monthAverage)
    //   return total
    // }, [])
    // 累加计算月人均产值
    // console.log(tablePersonloadReport.value)
  }
  total.value = tablePersonloadReport.value.length
  getPaging(tablePersonloadReport.value, page, size)
}

// 重置
const onRefresh = () => {
  // yearMonth.value = ''
  yearValue.value = ''
  // inputCustomer.value = ''
  // inputBusiness.value = ''
  // inputName.value = ''
  // console.log(tablePersonloadReportTemp.value)
  // tablePersonloadReport.value = []
  getData()
  total.value = tablePersonloadReport.value.length
  getPaging(tablePersonloadReport.value, page, size)
  // tablePersonloadReport.value = tablePersonloadReportTemp.value
}

// 数据表合计
// const getSummaries = (value) => {
//   // const data = tableDatas.value
//   const { columns } = value
//   let data = []
//   // const { columns, data } = value
//   // console.log(tableDatas.value)
//   if (tablePersonloadReport.value.length !== 0) {
//     data = tablePersonloadReport.value
//   }
//   console.log(columns, tablePersonloadReport.value)
//   const sums = []
//   columns.forEach((column, index) => {
//     if (index === 0) {
//       sums[index] = '平均产值'
//       return
//     } else if (index === 4 || index === 4) {
//       sums[index] = ''
//       return
//     }
//     const values = data.map((item) => Number(item[column.property]))
//     if (!values.every((value) => Number.isNaN(value))) {
//       sums[index] =
//         `${values.reduce((prev, curr) => {
//           const value = Number(curr)
//           if (!Number.isNaN(value)) {
//             return prev + curr
//           } else {
//             return prev
//           }
//           // 这里计算有问题
//         }, 0)}` / total.value
//     } else {
//       sums[index] = ''
//     }
//   })
//   return sums
// }
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

// 导出字段
const exportCulumns = ref({})
// 导出按钮点击事件
const loading = ref(false)
const onToExcelClick = async () => {
  loading.value = true
  const allData = await tablePersonloadReport.value
  // 导入工具包
  const excel = await import('@/utils/Export2Excel')

  const data = formatJson(exportCulumns.value, allData)
  excel.export_json_to_excel({
    // excel 表头
    header: Object.keys(exportCulumns.value),
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
      justify-content: space-between;
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
