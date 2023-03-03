<template>
  <div class="article-ranking-container">
    <el-card class="header">
      <el-table :data="tableData" border style="width: 100%">
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
        <!-- <el-table-column
          v-for="(itemmonth, index) in tableData"
          :key="index"
          :label="itemmonth.month"
        > -->
        <el-table-column
          v-for="item in listDisplay"
          :key="item.id"
          :label="item.label"
          :prop="item.prop"
        >
        </el-table-column>
        <el-table-column prop="year" label="年份"></el-table-column>
        <el-table-column prop="month" label="月份"></el-table-column>
        <el-table-column prop="totalAmount" label="月合计"></el-table-column>
        <!-- </el-table-column> -->
      </el-table>
    </el-card>
  </div>
</template>

<script setup>
import { ref, onActivated, watch } from 'vue'
import { costListDisplay, costList } from '@/api/cost'
import { useRouter, useRoute } from 'vue-router'
// import { useI18n } from 'vue-i18n'

const router = useRouter()
const route = useRoute()
// const i18n = useI18n()
// 数据相关
const tableData = ref([])
const tableStandardData = ref([])
const standardArrange = ref([])
// const standardValue = ref([])
// const total = ref(0)
const page = ref(1)
const size = ref(100)

const listDisplay = [
  { prop: 'systemEngineer', label: '系统工程师' },
  { prop: 'seniorSystemEngineer', label: '高级系统工程师' },
  { prop: 'softwareEngineer', label: '软件工程师' },
  { prop: 'seniorSoftwareEngineer', label: '高级软件工程师' },
  { prop: 'intermediateSap', label: '中级SAP' },
  { prop: 'seniorSap', label: '高级SAP' },
  { prop: 'dbaEngineer', label: 'DBA' },
  { prop: 'seniorDbaEngineer', label: '高级DBA' }
]
// 获取数据的方法
const getListData = async () => {
  const result = await costListDisplay({
    table: 'costsreport',
    page: page.value,
    size: size.value
  })
  console.log(result)
  tableData.value = result.list
  // tableData.value.map((item) => {})
  // total.value = result.total
}

getListData()

// const getTestList = [
//   {
//     SystemName: 'SCM生产管理系统',
//     businessDivision: '云服务BU',
//     businessLines: '华中云服务部',
//     customer: '东风商用车有限公司',
//     domain: '十堰应用系统运维服务领域',
//     domainManager: '刘文刚',
//     id: 37,
//     children: [
//       {
//         intermediateSap: 0,
//         month: '12',
//         reportedAmount: 11600,
//         contractAmount: 10440,
//         dbaEngineer: 1,
//         seniorDbaEngineer: 2,
//         seniorSap: 3,
//         seniorSoftwareEngineer: 0,
//         seniorSystemEngineer: 1,
//         softwareEngineer: 0,
//         systemEngineer: 0,
//         taxAmount: 9280,
//         year: '2022'
//       },
//       {
//         intermediateSap: 0,
//         month: '10',
//         dbaEngineer: 1,
//         reportedAmount: 9700,
//         seniorDbaEngineer: 2,
//         seniorSap: 1,
//         contractAmount: 10440,
//         seniorSoftwareEngineer: 0,
//         seniorSystemEngineer: 1,
//         softwareEngineer: 0,
//         systemEngineer: 0,
//         taxAmount: 9280,
//         year: '2022'
//       }
//     ]
//   }
// ]

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
watch(
  () => router.currentRoute.value,
  (newValue) => {
    console.log('newValue', newValue)
    console.log('routePath', route.path)
    // location.reload()
    // getListData()
  },
  { immediate: true }
)
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
