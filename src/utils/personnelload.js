import { ref } from 'vue'
import { costListDisplay, costAllSelect } from '@/api/cost'

const tableCosts = ref([])
const tablePersonload = ref([])
const tablePersonloadAll = ref([])
const tablePersonloadAllTmp = ref([])
const yearMonthList = ref([])
const tableCostsTmp = ref([])

// 最终报表结果数据
const tablePersonloadReportTemp = ref([])
// 计算分页数据
const totalAll = ref(0)
// const total = ref(0)
// const page = ref(1)
// const size = ref(10)

// 获取所有人员的矩阵系数信息
const personnelmatrixAll = ref([])
export const getPersonnelmatrixAll = async (yearObj) => {
  await costAllSelect({
    table: 'personnelmatrixAll',
    data: yearObj
  }).then((result) => {
    personnelmatrixAll.value = result
  })
  return personnelmatrixAll.value
}

// 获取所有项目的系数信息
const projectmatrixAll = ref([])
export const getProjectmatrixAll = async (yearObj) => {
  await costAllSelect({
    table: 'projectmatrixAll',
    data: yearObj
  }).then((result) => {
    projectmatrixAll.value = result
  })
  return projectmatrixAll.value
}

// 获取项目费用信息
const projectcostsAll = ref([])
export const getProjectcostsAll = async (yearObj) => {
  await costAllSelect({
    table: 'projectcostsAll',
    data: yearObj
  }).then((result) => {
    projectcostsAll.value = result
  })
  return projectcostsAll.value
}

// 获取所有费用信息
const getAllListCosts = async () => {
  const result = await costListDisplay({
    table: 'outsourcingcosts'
    // page: page.value,
    // size: size.value
  })
  tableCostsTmp.value = result.lists
  totalAll.value = result.total
  tableCosts.value = []
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
}

// 获取所有人均负荷信息
// 循环判断变量
const load = ref(0)
const loadId = ref([])
const loadIs = ref(false)
const arrId = ref(0)
// 将所有人相同年月的负荷累加
const getAllListpersonload = async () => {
  const result = await costListDisplay({
    table: 'personnelload'
  })
  tablePersonload.value = result.lists
  totalAll.value = result.total
  arrId.value = 0
  tablePersonloadAllTmp.value = []
  tablePersonloadAll.value = []
  // 根据人均负荷信息分解计算出对应的费用信息
  tablePersonload.value.forEach((tablePersonloadItem) => {
    yearMonthList.value = tablePersonloadItem.yearMonth.split(',')
    yearMonthList.value.forEach((yearMonthListItem) => {
      tablePersonloadAllTmp.value.push({
        id: ++arrId.value,
        name: tablePersonloadItem.name,
        business: tablePersonloadItem.business,
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
      continue
    }
    load.value = Number(tablePersonloadAllTmp.value[index].load)
    tablePersonloadAllTmp.value.forEach((iteminner) => {
      if (
        tablePersonloadAllTmp.value[index].id !== iteminner.id &&
        tablePersonloadAllTmp.value[index].personnelId ===
          iteminner.personnelId &&
        tablePersonloadAllTmp.value[index].systemId === iteminner.systemId &&
        tablePersonloadAllTmp.value[index].yearMonth === iteminner.yearMonth
      ) {
        load.value += Number(iteminner.load)
        loadId.value.push(iteminner.id)
      }
    })
    tablePersonloadAll.value.push({
      id: tablePersonloadAllTmp.value[index].id,
      personnelId: tablePersonloadAllTmp.value[index].personnelId,
      name: tablePersonloadAllTmp.value[index].name,
      business: tablePersonloadAllTmp.value[index].business,
      systemId: tablePersonloadAllTmp.value[index].systemId,
      load: load.value,
      yearMonth: tablePersonloadAllTmp.value[index].yearMonth
    })
  }
}

// 计算人员负荷数据
export const getPersonnelLoadList = async () => {
  tablePersonloadReportTemp.value = []
  await getAllListpersonload().then(() => {
    getAllListCosts().then(() => {
      console.log(
        'tablePersonloadAll:',
        tablePersonloadAll.value,
        'tableCosts:',
        tableCosts.value
      )
      tablePersonloadAll.value.forEach((tablePersonloadAllItem) => {
        tableCosts.value.forEach((tableCostsItem) => {
          console.log(
            tablePersonloadAllItem.systemId,
            tableCostsItem.systemId,
            tablePersonloadAllItem.yearMonth,
            tableCostsItem.yearMonth
          )
          if (
            tablePersonloadAllItem.systemId === tableCostsItem.systemId &&
            tablePersonloadAllItem.yearMonth === tableCostsItem.yearMonth
          ) {
            tablePersonloadReportTemp.value.push({
              personnelId: tablePersonloadAllItem.personnelId,
              name: tablePersonloadAllItem.name,
              business: tablePersonloadAllItem.business,
              load: tablePersonloadAllItem.load,
              yearMonth: tablePersonloadAllItem.yearMonth,
              SystemName: tableCostsItem.SystemName,
              customer: tableCostsItem.customer,
              operationAmount: Math.round(
                (Number(tableCostsItem.operationAmount) *
                  Number(tablePersonloadAllItem.load) *
                  100) /
                  100
              ),
              // operationAmount: tableCostsItem.operationAmount,
              year: tableCostsItem.year,
              month: tableCostsItem.month
            })
          }
        })
      })
    })
  })
  console.log(tablePersonloadReportTemp.value)
  return tablePersonloadReportTemp.value
}
// getPersonnelLoadList()

export const getPaging = (val, page, size) => {
  if (val) {
    var a = JSON.stringify(val)
    var b = JSON.parse(a)
    if (page === 1) {
      // 获取Proxy原始数据
      // console.log('第1页显示分页数据：', val, page, size, val.splice(0, size))

      // console.log(b, b.splice(0, size))
      // console.log(val)
      return b.splice(0, size)
      // return val
    } else {
      console.log('后续页面显示分页数据：', b, 'page:', page, 'size:', size)
      // console.log(val.splice((page - 1) * size, size))
      return b.splice((page - 1) * size, size)
      // return val
      // return data.value
    }
  }
}
