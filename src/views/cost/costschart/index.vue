<template>
  <div class="dynamic-box">
    <el-row :gutter="2" align="middle">
      <el-col :span="3" style="text-align: right; padding-right: 5px">
        <span>请选择系统</span></el-col
      >

      <el-col :span="6">
        <el-input
          @click="systemDialogClick"
          v-model="detailData.SystemName"
          readonly
        >
          <template #suffix
            ><el-icon style="margin-right: 10px"><Search /></el-icon
          ></template> </el-input
      ></el-col>
      <el-col :span="3" style="text-align: right; padding-right: 5px"
        ><span>请选择年份</span></el-col
      >
      <el-col :span="6">
        <el-date-picker
          clear-icon="CircleClose"
          v-model="yearMonth"
          type="year"
          @change="pickerSelect($event)"
          placeholder="请选择年份"
      /></el-col>
      <el-col :span="3">
        <el-button type="primary" style="margin-left: 5px" @click="onCostsChart"
          ><el-icon><Search /></el-icon> 显示报表</el-button
        ></el-col
      >
    </el-row>
  </div>

  <div style="padding: 10px">
    <div id="chart" style="width: 1000px; height: 600px"></div>
  </div>
  <CostschartDialog
    v-model="systemInformationVisible"
    :tableName="tableName"
    :id="selectId"
    @costSelect="getCostSelect"
  >
  </CostschartDialog>
</template>

<script setup>
import { onMounted, onUnmounted, getCurrentInstance, ref } from 'vue'
import { resize } from '@/utils/echarts'
import CostschartDialog from './components/costschartDialog.vue'
import dayjs from 'dayjs'
import { ElMessage } from 'element-plus'
import { costAllSelect } from '@/api/cost'

const { proxy } = getCurrentInstance()

const yearMonth = ref('')
const detailData = ref({})
const systemInformationVisible = ref(false)
const tableName = ref('')

const getCostSelect = (item) => {
  if (item) {
    if (item.SystemName) {
      detailData.value.systemId = item.id
      detailData.value.SystemName = item.SystemName
      console.log('domainManager', detailData.value, item)
    } else {
      detailData.value.personnelId = item.id
      detailData.value.name = item.name
      console.log('customer', detailData.value, item)
    }
  }
}

const systemDialogClick = () => {
  systemInformationVisible.value = true
  tableName.value = 'systeminformation'
  yearMonth.value = ''
  // detailData.value = {}
  // costsPlan.value = 0
  // selectId.value = route.params.id
  // 定义月度实际和月度累计实际
  monthReportedAmount.value = []
  monthOperationAmount.value = []
  monthDevelopAmount.value = []
  // 定义季度实际
  quarterReportedAmount.value = []
  quarterOperationAmount.value = []
  quarterDevelopAmount.value = []
  quarterTotal.value = []
  // 定义计划
  costsPlan.value = 0
  costsPlanQuarter.value = []
  costsPlanOperationQuarter.value = []
  costsPlanDevelopQuarter.value = []
}

const pickerSelect = async (val) => {
  if (
    typeof detailData.value.SystemName === 'undefined' ||
    detailData.value.SystemName === ''
  ) {
    ElMessage.warning('请先选择系统名称！')
    yearMonth.value = ''
  } else {
    detailData.value.year = dayjs(val).format('YYYY')
    getCostsReality()
    getCostsPlan()
  }
}

const onCostsChart = async () => {
  console.log(
    'year' + detailData.value.year + '系统名称' + detailData.value.SystemName
  )

  if (
    typeof detailData.value.SystemName === 'undefined' ||
    detailData.value.SystemName === '' ||
    typeof detailData.value.year === 'undefined' ||
    detailData.value.year === 'Invalid Date'
  ) {
    ElMessage.warning('请先选择系统名称和年度！')
  } else {
    // getCostsReality()
    // getCostsPlan()
    console.log(typeof detailData.value.SystemName)
    if (
      monthReportedAmount.value.length !== 0 &&
      quarterTotal.value.length !== 0 &&
      costsPlan.value !== 0
    ) {
      console.log(
        monthReportedAmount.value,
        quarterTotal.value.length,
        costsPlan.value
      )
      init(chart)
      show(chart)
      resize(chart)
    }
  }
}
// 定义月度实际和月度累计实际
const monthReportedAmount = ref([])
const monthOperationAmount = ref([])
const monthDevelopAmount = ref([])
// 定义季度实际
const quarterReportedAmount = ref([])
const quarterOperationAmount = ref([])
const quarterDevelopAmount = ref([])
const quarterTotal = ref([])
// 定义计划
const costsPlan = ref(0)
const costsPlanQuarter = ref([])
const costsPlanOperationQuarter = ref([])
const costsPlanDevelopQuarter = ref([])

// 获取月度实际费用
const getCostsReality = async () => {
  monthReportedAmount.value = []
  quarterTotal.value = []
  await costAllSelect({
    table: 'outsourcingcosts',
    data: detailData
  }).then((items) => {
    for (let index = 0; index < 12; index++) {
      monthReportedAmount.value.splice(index, 0, 0)
      monthOperationAmount.value.splice(index, 0, 0)
      monthDevelopAmount.value.splice(index, 0, 0)
    }
    items.map((item) => {
      for (let index = 0; index < 12; index++) {
        if (Number(item.month) - 1 === index) {
          monthReportedAmount.value.splice(index, 1, item.reportedAmount)
          monthOperationAmount.value.splice(index, 1, item.operationAmount)
          monthDevelopAmount.value.splice(index, 1, item.developAmount)
        }
      }
    })

    convertMonthQuarter(monthReportedAmount.value, 'Reported')
    convertMonthQuarter(monthOperationAmount.value, 'Operation')
    convertMonthQuarter(monthDevelopAmount.value, 'Develop')

    // 统计合计费用
    let sum = 0
    for (let i = 0; i < quarterReportedAmount.value.length; i++) {
      sum += quarterReportedAmount.value[i]
      quarterTotal.value.splice(i, 0, sum)
    }
  })
}
// 获取年度计划费用、月度计划费用
const getCostsPlan = async () => {
  await costAllSelect({
    table: 'outsourcingcostsplan',
    data: detailData
  }).then((item) => {
    if (item.length !== 0) {
      costsPlan.value = item[0].reportedAmount
      for (let index = 0; index < 4; index++) {
        costsPlanQuarter.value.push(
          Number(item[0].reportedAmount / 4).toFixed(0)
        )
        costsPlanOperationQuarter.value.push(
          Number(item[0].operationAmount / 4).toFixed(0)
        )
        costsPlanDevelopQuarter.value.push(
          Number(item[0].developAmount / 4).toFixed(0)
        )
      }
    }
  })
}

// 将月度费用转换成季度费用
const convertMonthQuarter = (amount, selectItem) => {
  let value = 0
  for (let index = 0; index < amount.length; index++) {
    value += amount[index]
    if (index === 2) {
      if (selectItem === 'Reported') {
        quarterReportedAmount.value.push(value)
        value = 0
      } else if (selectItem === 'Operation') {
        quarterOperationAmount.value.push(value)
        value = 0
      } else if (selectItem === 'Develop') {
        quarterDevelopAmount.value.push(value)
        value = 0
      }
    } else if (index === 5) {
      if (selectItem === 'Reported') {
        quarterReportedAmount.value.push(value)
        value = 0
      } else if (selectItem === 'Operation') {
        quarterOperationAmount.value.push(value)
        value = 0
      } else if (selectItem === 'Develop') {
        quarterDevelopAmount.value.push(value)
        value = 0
      }
    } else if (index === 8) {
      if (selectItem === 'Reported') {
        quarterReportedAmount.value.push(value)
        value = 0
      } else if (selectItem === 'Operation') {
        quarterOperationAmount.value.push(value)
        value = 0
      } else if (selectItem === 'Develop') {
        quarterDevelopAmount.value.push(value)
        value = 0
      }
    } else if (index === 11) {
      if (selectItem === 'Reported') {
        quarterReportedAmount.value.push(value)
        value = 0
      } else if (selectItem === 'Operation') {
        quarterOperationAmount.value.push(value)
        value = 0
      } else if (selectItem === 'Develop') {
        quarterDevelopAmount.value.push(value)
        value = 0
      }
    }
  }
}

// 初始化图表
let chart
onMounted(() => {
  chart = proxy.$echarts.init(document.getElementById('chart'), 'walden')
})

onUnmounted(() => {
  clearInterval(interval)
})

const option = {
  title: {
    text:
      // `${detailData.value.SystemName}` +
      // `${dayjs(detailData.value.year).format('YYYY')}` +
      '实际和计划分析图',
    left: 'center'
  },
  tooltip: {
    trigger: 'axis',
    axisPointer: {
      type: 'cross',
      crossStyle: {
        color: '#999'
      }
    }
  },
  toolbox: {
    feature: {
      // dataView: { show: true, readOnly: false },
      // magicType: { show: true, type: ['line', 'bar'] },
      // restore: { show: true },
      // saveAsImage: { show: true }
    }
  },
  // 报表头部显示
  legend: {
    data: [
      '季度计划总费用',
      '季度实际总费用',
      '季度计划运维费用',
      '季度实际运维费用',
      '季度计划研发费用',
      '季度实际研发费用',
      '季度实际累计总费用'
    ],
    top: 'bottom'
    // data: ['Evaporation', 'Precipitation', 'Temperature']
  },
  // 报表横向底部坐标值显示
  xAxis: [
    {
      type: 'category',
      data: ['1季度', '2季度', '3季度', '4季度'],
      // data: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
      axisPointer: {
        type: 'shadow'
      }
    }
  ],
  // Y轴数据显示
  yAxis: [
    {
      type: 'value',
      name: '年度计划费用',
      position: 'left',
      min: 0,
      // 最大值显示，包括间隔
      max: costsPlan.value,
      interval: 10000,
      axisLabel: {
        formatter: '{value} 元'
      }
    },
    {
      type: 'value',
      name: '年度计划费用',
      position: 'left',
      min: 0,
      max: costsPlan.value,
      interval: 10000,
      axisLabel: {
        formatter: '{value} 元'
      }
    }
  ],
  series: [
    {
      name: '季度计划总费用',
      type: 'bar',
      tooltip: {
        valueFormatter: function (value) {
          return value + ' 元'
        }
      },
      // 柱状图数值显示
      // data: [2.0, 4.9, 7.0, 3.2, 5.6, 6.7, 5.6, 2.2, 3.6, 2.0, 6.4, 3.3]
      data: costsPlanQuarter.value
    },
    {
      name: '季度实际总费用',
      type: 'bar',
      tooltip: {
        valueFormatter: function (value) {
          return value + ' 元'
        }
      },
      // 柱状图数值显示
      // data: [2.0, 4.9, 7.0, 3.2, 5.6, 6.7, 5.6, 2.2, 3.6, 2.0, 6.4, 3.3]
      data: quarterReportedAmount.value
    },
    {
      name: '季度计划运维费用',
      type: 'bar',
      tooltip: {
        valueFormatter: function (value) {
          return value + ' 元'
        }
      },
      // 柱状图数值显示
      // data: [2.0, 4.9, 7.0, 3.2, 5.6, 6.7, 5.6, 2.2, 3.6, 2.0, 6.4, 3.3]
      data: costsPlanOperationQuarter.value
    },
    {
      name: '季度实际运维费用',
      type: 'bar',
      tooltip: {
        valueFormatter: function (value) {
          return value + ' 元'
        }
      },
      // 柱状图数值显示
      // data: [2.0, 4.9, 7.0, 3.2, 5.6, 6.7, 5.6, 2.2, 3.6, 2.0, 6.4, 3.3]
      data: quarterOperationAmount.value
    },
    {
      name: '季度计划研发费用',
      type: 'bar',
      tooltip: {
        valueFormatter: function (value) {
          return value + ' 元'
        }
      },
      // 柱状图数值显示
      // data: [2.0, 4.9, 7.0, 3.2, 5.6, 6.7, 5.6, 2.2, 3.6, 2.0, 6.4, 3.3]
      data: costsPlanDevelopQuarter.value
    },
    {
      name: '季度实际研发费用',
      type: 'bar',
      tooltip: {
        valueFormatter: function (value) {
          return value + ' 元'
        }
      },
      // 柱状图数值显示
      // data: [2.0, 4.9, 7.0, 3.2, 5.6, 6.7, 5.6, 2.2, 3.6, 2.0, 6.4, 3.3]
      data: quarterDevelopAmount.value
    },

    {
      name: '季度实际累计总费用',
      type: 'line',
      yAxisIndex: 1,
      tooltip: {
        valueFormatter: function (value) {
          return value + ' 元'
        }
      },
      // 折线图数值显示
      // data: [
      //   2.0, 6.9, 13.9, 17.1, 20.3, 26.3, 29.3, 33.4, 35.0, 36.5, 38.0, 39.2
      // ]
      data: quarterTotal.value
    }
  ]
}

let interval = 0

const show = (chart) => {
  interval = setInterval(() => {
    chart.setOption({
      yAxis: [
        {
          name: '年度计划费用',
          max: costsPlan.value
        },
        {
          name: '年度计划费用',
          max: costsPlan.value
        }
      ],
      series: [
        {
          name: '季度计划总费用',
          data: costsPlanQuarter.value
        },
        {
          name: '季度实际总费用',
          data: quarterReportedAmount.value
        },
        {
          name: '季度计划运维费用',
          data: costsPlanOperationQuarter.value
        },
        {
          name: '季度实际运维费用',
          data: quarterOperationAmount.value
        },
        {
          name: '季度计划研发费用',
          data: costsPlanDevelopQuarter.value
        },
        {
          name: '季度实际研发费用',
          data: quarterDevelopAmount.value
        },
        {
          name: '季度实际累计总费用',
          data: quarterTotal.value
        }
      ]
    })
  }, 200)
}

const init = (chart) => {
  chart.setOption(option)
}

// init(chart)
// show(chart)
// resize(chart)
</script>

<style lang="scss" scoped>
.dynamic-box {
  // display: flex;
  // flex-wrap: wrap;
  // flex-direction: row;
  // align-self: center;
  // // align-items: flex-start;
  // align-items: center;
  margin-bottom: 10px;
}
</style>
