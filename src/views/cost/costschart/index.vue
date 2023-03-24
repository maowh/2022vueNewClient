<template>
  <div class="dynamic-box">
    <el-row :gutter="2" align="middle">
      <el-col :span="3" style="text-align: right; padding-right: 5px">
        <span>请选择系统</span></el-col
      >

      <el-col :span="6">
        <el-input @click="systemDialogClick" v-model="detailData.SystemName">
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
    <div id="chart" style="width: 100%; height: 600px"></div>
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
  // selectId.value = route.params.id
}

const pickerSelect = (val) => {
  detailData.value.year = dayjs(val).format('YYYY')
}

const onCostsChart = async () => {
  console.log(
    'year',
    detailData.value.year,
    '系统名称',
    detailData.value.SystemName
  )

  if (
    typeof detailData.value.SystemName === 'undefined' ||
    detailData.value.SystemName === '' ||
    typeof detailData.value.year === 'undefined' ||
    detailData.value.year === 'Invalid Date'
  ) {
    ElMessage.warning('请先选择系统名称和年度！')
  } else {
    getCostsReality()
    getCostsPlan()

    if (
      monthReality.value.length !== 0 &&
      totalReality.value.length !== 0 &&
      costsPlan.value !== 0
    ) {
      console.log(
        'monthReality',
        monthReality.value,
        'totalReality',
        totalReality.value,
        'costsPlan',
        costsPlan.value
      )
      init(chart)
      show(chart)
      resize(chart)
    }
  }
}
// 定义月度实际和月度累计实际
const monthReality = ref([])
const totalReality = ref([])
const costsPlan = ref(0)
// 获取月度实际费用
const getCostsReality = async () => {
  await costAllSelect({
    table: 'outsourcingcosts',
    data: detailData
  }).then((item) => {
    monthReality.value = []
    totalReality.value = []
    for (let index = 0; index < item.length; index++) {
      monthReality.value.push(item[index].reportedAmount)
      if (index === 0) {
        totalReality.value.push(monthReality.value[index])
      } else {
        totalReality.value.push(
          monthReality.value[index] + monthReality.value[index - 1]
        )
      }
    }
  })
}
// 获取年度计划费用
const getCostsPlan = async () => {
  await costAllSelect({
    table: 'outsourcingcostsplan',
    data: detailData
  }).then((item) => {
    costsPlan.value = item[0].reportedAmount
  })
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
    text: 'SCM系统2023年实际和计划分析图',
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
    data: ['月度实际费用', '月度实际累计费用'],
    top: 'bottom'
    // data: ['Evaporation', 'Precipitation', 'Temperature']
  },
  // 报表横向底部坐标值显示
  xAxis: [
    {
      type: 'category',
      data: [
        '1月',
        '2月',
        '3月',
        '4月',
        '5月',
        '6月',
        '7月',
        '8月',
        '9月',
        '10月',
        '11月',
        '12月'
      ],
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
      interval: 5000,
      axisLabel: {
        formatter: '{value} 万'
      }
    },
    {
      type: 'value',
      name: '年度计划费用',
      position: 'left',
      min: 0,
      max: costsPlan.value,
      interval: 5000,
      axisLabel: {
        formatter: '{value} 万'
      }
    }
  ],
  series: [
    {
      name: '月度实际费用',
      type: 'bar',
      tooltip: {
        valueFormatter: function (value) {
          return value + ' 万'
        }
      },
      // 柱状图数值显示
      // data: [2.0, 4.9, 7.0, 3.2, 5.6, 6.7, 5.6, 2.2, 3.6, 2.0, 6.4, 3.3]
      data: monthReality.value
    },
    {
      name: '月度实际累计费用',
      type: 'line',
      yAxisIndex: 1,
      tooltip: {
        valueFormatter: function (value) {
          return value + ' 万'
        }
      },
      // 折线图数值显示
      // data: [
      //   2.0, 6.9, 13.9, 17.1, 20.3, 26.3, 29.3, 33.4, 35.0, 36.5, 38.0, 39.2
      // ]
      data: totalReality.value
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
          name: '月度实际费用',
          data: monthReality.value
        },
        {
          name: '月度实际累计费用',
          data: totalReality.value
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
