<template>
  <div class="article-ranking-container">
    <el-card class="header">
      <div class="dynamic-box">
        <el-select v-model="selectType" class="m-2" placeholder="请选择">
          <el-option
            v-for="item in listSelect"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          />
        </el-select>
        <el-input
          v-model="inputSearch"
          style="width: 300px; margin-left: 5px"
          class="w-50 m-2"
          placeholder="请输入查询内容"
        />
        <el-button type="primary" style="margin-left: 5px" @click="onSearch"
          ><el-icon><Search /></el-icon> 查询</el-button
        >
        <el-button
          type="primary"
          style="margin-left: 5px"
          @click="onToExcelClick"
          ><el-icon><Download /></el-icon> 导出</el-button
        >
      </div>
      <el-table
        :data="tableData"
        border
        style="width: 100%"
        :summary-method="getSummaries"
        show-summary
      >
        <el-table-column prop="id" :label="$t('msg.cost.id')"></el-table-column>
        <el-table-column
          prop="customer"
          :label="$t('msg.cost.customerName')"
        ></el-table-column>
        <el-table-column
          prop="SystemName"
          :label="$t('msg.cost.SystemName')"
        ></el-table-column>
        <el-table-column
          prop="businessDivision"
          :label="$t('msg.cost.businessDivision')"
        ></el-table-column>
        <el-table-column
          prop="businessLines"
          :label="$t('msg.cost.businessLines')"
        ></el-table-column>
        <el-table-column
          prop="domain"
          :label="$t('msg.cost.domain')"
        ></el-table-column>
        <el-table-column
          prop="domainManager"
          :label="$t('msg.cost.domainManager')"
        ></el-table-column>
        <el-table-column
          v-for="item in ListDisplay"
          :key="item.id"
          :label="item.label"
          :prop="item.prop"
        >
        </el-table-column>
        <el-table-column prop="year" label="年份"></el-table-column>
        <el-table-column prop="month" label="月份"></el-table-column>
        <el-table-column prop="totalAmount" label="月合计"></el-table-column>
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
import { costListDisplay, costList, costAllSelect } from '@/api/cost'
// import { useRouter, useRoute } from 'vue-router'
import { USER_RELATIONS, ListDisplay } from './components/Export2ExcelConstants'
import { ElMessage } from 'element-plus'
// import { useI18n } from 'vue-i18n'

// const router = useRouter()
// const route = useRoute()
// const i18n = useI18n()
// 数据相关
const inputSearch = ref('')
const selectType = ref('')
const tableData = ref([])
const tableStandardData = ref([])
const standardArrange = ref([])
// const standardValue = ref([])
const total = ref(0)
const page = ref(1)
const size = ref(5)

const listSelect = [
  { value: 'customer', label: '客户名称' },
  { value: 'SystemName', label: '系统名称' },
  { value: 'domain', label: '领域' }
]

// const listDisplay = [
//   {
//     prop: 'systemEngineer',
//     label: '系统工程师'
//   },
//   {
//     prop: 'seniorSystemEngineer',
//     label: '高级系统工程师'
//   },
//   {
//     prop: 'softwareEngineer',
//     label: '软件工程师'
//   },
//   {
//     prop: 'seniorSoftwareEngineer',
//     label: '高级软件工程师'
//   },
//   {
//     prop: 'intermediateSap',
//     label: '中级SAP'
//   },
//   {
//     prop: 'dbaEngineer',
//     label: '高级SAP'
//   },
//   {
//     prop: 'dbaEngineer',
//     label: 'DBA'
//   },
//   {
//     prop: 'seniorDbaEngineer',
//     label: '高级DBA'
//   }
// ]

// 获取初始数据的方法
const getListData = async () => {
  const result = await costListDisplay({
    table: 'costsreport',
    page: page.value,
    size: size.value
  })
  console.log(result)
  tableData.value = result.list
  total.value = result.total
  // tableData.value.map((item) => {})
}
getListData()

// 获取查询数据的方法
const getSearchListData = async () => {
  await costAllSelect({
    table: 'costsreportsearch',
    data: selectData
  }).then((item) => {
    tableData.value = item
    console.log(tableData.value, item)
  })
}

// 分页相关，size改变触发
const handleSizeChange = (currentSize) => {
  size.value = currentSize
  getListData()
}

// 页码改变触发
const handleCurrentChange = (currentPage) => {
  page.value = currentPage
  getListData()
}

// 数据表合计
const getSummaries = (value) => {
  const { columns, data } = value
  const sums = []
  columns.forEach((column, index) => {
    if (index === 0) {
      sums[index] = '合计'
      return
    } else if (index === 15 || index === 16) {
      sums[index] = ''
      return
    }
    const values = data.map((item) => Number(item[column.property]))
    if (!values.every((value) => Number.isNaN(value))) {
      sums[index] = `${values.reduce((prev, curr) => {
        const value = Number(curr)
        if (!Number.isNaN(value)) {
          return prev + curr
        } else {
          return prev
        }
      }, 0)}`
    } else {
      sums[index] = ''
    }
  })

  return sums
}

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
  const allUser = await tableData.value
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
  if (selectType.value === '') {
    ElMessage.warning('请选择查询项目！')
  } else if (inputSearch.value.trim() === '') {
    ElMessage.warning('请输入查询内容！')
  } else {
    const test = `{ ${selectType.value}:'${inputSearch.value}' }`
    selectData.value = evil(test)
    getSearchListData()
    console.log('data', selectData, typeof selectData.value)
  }
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
