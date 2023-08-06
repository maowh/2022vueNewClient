<template>
  <div class="user-info-container">
    <div class="user-info-box" id="userInfoBox">
      <!-- 标题 -->
      <h2 class="title">{{ title }}</h2>

      <el-form
        ref="ruleFormRef"
        :model="detailData"
        :rules="rules"
        label-width="120px"
        class="demo-ruleForm"
        :size="formSize"
        status-icon
      >
        <el-form-item :label="$t('msg.cost.id')" prop="id">
          <el-input disabled v-model="detailData.id" />
        </el-form-item>
        <el-form-item :label="$t('msg.cost.name')" prop="name">
          <el-input
            @click="personnelDialogClick"
            v-model="detailData.name"
            readonly
          >
            <template #suffix
              ><el-icon style="margin-right: 10px"><Search /></el-icon
            ></template>
          </el-input>
        </el-form-item>
        <!-- <el-form-item :label="$t('msg.cost.year')" prop="year">
          <el-date-picker
            v-model="detailData.year"
            clear-icon="CircleClose"
            @change="pickerSelect($event)"
            type="year"
          />
        </el-form-item> -->
        <el-form-item :label="$t('msg.cost.monthBetween')">
          <!-- <el-date-picker
            clear-icon="CircleClose"
            v-model="yearMonth"
            type="month"
            @change="pickerSelect($event)"
            placeholder="请选择年份月度"
          /> -->
          <el-date-picker
            v-model="monthValue"
            type="monthrange"
            start-placeholder="开始月份"
            end-placeholder="截止月份"
            @change="pickerSelect($event)"
          />
        </el-form-item>
        <el-form-item :label="$t('msg.cost.SystemName')" prop="SystemName">
          <el-input
            @click="systemDialogClick"
            v-model="detailData.SystemName"
            readonly
          >
            <template #suffix
              ><el-icon style="margin-right: 10px"><Search /></el-icon
            ></template>
          </el-input>
        </el-form-item>
        <el-form-item :label="$t('msg.cost.load')" prop="load">
          <el-input v-model="detailData.load" />
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="onConfirm(ruleFormRef)">{{
            $t('msg.universal.confirm')
          }}</el-button>
          <el-button @click="onCancel(ruleFormRef)">{{
            $t('msg.universal.cancel')
          }}</el-button>
        </el-form-item>
      </el-form>

      <PersonnelloadDialog
        v-model="systemInformationVisible"
        :tableName="tableName"
        :id="selectId"
        @costSelect="getCostSelect"
      >
      </PersonnelloadDialog>
    </div>
    <!-- </el-card> -->
  </div>
  <!-- </el-dialog> -->
</template>

<script setup>
import { ref, reactive, watch, onActivated } from 'vue'
import {
  costCreate,
  costEdit,
  costDisplay,
  // costAllSelect,
  costListDisplay
} from '@/api/cost'
import { ElMessage, FormInstance } from 'element-plus'
import { useI18n } from 'vue-i18n'
import { validatetext } from '@/utils/validate'
import { getMonthBetween } from '@/utils/monthbetween'
import { useRoute, useRouter } from 'vue-router'
import PersonnelloadDialog from './personnelloadDialog.vue'
import dayjs from 'dayjs'
import store from '@/store'

const formSize = ref('default')
const ruleFormRef = ref(FormInstance)
const route = useRoute()
const router = useRouter()

const rules = reactive({
  SystemName: [{ validator: validatetext, trigger: 'blur' }],
  name: [{ validator: validatetext, trigger: 'blur' }],
  monthValue: [{ validator: validatetext, trigger: 'blur' }],
  load: [{ validator: validatetext, trigger: 'blur' }]
})

// 确定按钮点击事件
const i18n = useI18n()
const title = ref()
const costInformationId = route.params.id

// 日期
// const yearMonth = ref('')
// 区间月度选择
const monthValue = ref('')
// 获取所有数据
const personnelloadAll = ref('')
// 判断人员负荷累计值
const personnelTotal = ref(false)
// 判断系统负荷累计值
const systemTotal = ref(false)
// 维护分解的全部年月值
const yearMonth = ref([])
// 弹出报错提示
const messageTotal = ref([])
// 计算系统累加值
const loadPersonnel = ref(0)
const loadSystem = ref(0)

const detailData = ref({})
const getCostDisplay = async () => {
  detailData.value = await costDisplay({
    table: 'personnelload',
    id: route.params.id
  })
  detailData.value = detailData.value[0]
  // yearMonth.value = dayjs()
  //   .set('year', detailData.value.year)
  //   .set('month', detailData.value.month - 1)
  monthValue.value = [
    new Date(detailData.value.startYearMonth),
    new Date(detailData.value.endYearMonth)
  ]
  console.log(detailData.value, 'monthValue', monthValue.value)
}

onActivated(() => {
  if (costInformationId) {
    title.value = i18n.t('msg.cost.edit')
    getCostDisplay()
  } else {
    title.value = i18n.t('msg.cost.add')
  }
})

// 判断是否满足条件，将数据库全部记录取过来判断
// 获取数据的方法
// const getListData = async () => {
//   const result = await costListDisplay({
//     table: 'personnelload'
//   })
//   personnelloadAll.value = result.lists
// }
// 人员合计值是否大于1
// 系统合计值是否大于1

// 分解数据判断合计值是否超过
// const accumulateValue = async () => {
//   await costListDisplay({
//     table: 'personnelload'
//   }).then((result) => {
//     personnelloadAll.value = result.lists
//     console.log('personnelloadAll', personnelloadAll.value)
//     const yearMonthList = ref([])
//     personnelloadAll.value.forEach((item) => {
//       // 判断是修改还是新增
//       if (detailData.value.id) {
//         // 判断人员的合计值不能大于1
//         if (
//           item.id !== detailData.value.id &&
//           item.personnelId === detailData.value.personnelId
//         ) {
//           console.log(item.yearMonth)
//           yearMonthList.value = item.yearMonth.split(',')
//           console.log(yearMonthList.value, yearMonth.value)
//           yearMonthList.value.forEach((yearMonthListItem) => {
//             yearMonth.value.forEach((detailDataItem) => {
//               // console.log(
//               //   'detailDataItem',
//               //   detailDataItem,
//               //   'yearMonthListItem',
//               //   yearMonthListItem
//               // )
//               // console.log(detailDataItem === yearMonthListItem)
//               // console.log(detailData.value.load, item.load)
//               if (detailDataItem === yearMonthListItem) {
//                 console.log(Number(detailData.value.load), item.load)
//                 if (Number(detailData.value.load) + Number(item.load) > 1) {
//                   personnelTotal.value = true
//                   console.log(
//                     personnelTotal.value,
//                     item.personnelId,
//                     detailDataItem,
//                     '合计大于1'
//                   )
//                 }
//               }
//             })
//           })
//         }
//         // 判断系统的合计值不能大于1
//         if (
//           item.id !== detailData.value.id &&
//           item.systemId === detailData.value.systemId
//         ) {
//           console.log(item.yearMonth)
//           yearMonthList.value = item.yearMonth.split(',')
//           yearMonthList.value.map((yearMonthListItem) => {
//             yearMonth.value.forEach((detailDataItem) => {
//               if (detailDataItem === yearMonthListItem) {
//                 if (detailData.value.load + item.load > 1) {
//                   systemTotal.value = true
//                   console.log(item.personnelId, detailDataItem, '合计大于1')
//                 }
//               }
//             })
//           })
//         }
//       } else {
//         // 判断人员的合计值不能大于1
//         if (item.personnelId === detailData.value.personnelId) {
//           console.log(item.yearMonth)
//           yearMonthList.value = item.yearMonth.split(',')
//           yearMonthList.value.map((yearMonthListItem) => {
//             yearMonth.value.forEach((detailDataItem) => {
//               if (detailDataItem === yearMonthListItem) {
//                 if (detailData.value.load + item.load > 1) {
//                   console.log(item.personnelId, detailDataItem, '合计大于1')
//                   personnelTotal.value = true
//                 }
//               }
//             })
//           })
//         }
//         // 判断系统的合计值不能大于1
//         if (item.systemId === detailData.value.systemId) {
//           console.log(item.yearMonth)
//           yearMonthList.value = item.yearMonth.split(',')
//           yearMonthList.value.map((yearMonthListItem) => {
//             yearMonth.value.forEach((detailDataItem) => {
//               if (detailDataItem === yearMonthListItem) {
//                 if (detailData.value.load + item.load > 1) {
//                   console.log(item.personnelId, detailDataItem, '合计大于1')
//                   systemTotal.value = true
//                 }
//               }
//             })
//           })
//         }
//       }
//     })
//   })
// }

// 确定按钮点击事件
const validate = ref(false)
const onConfirm = async (ruleFormRef) => {
  ruleFormRef.validate((valid) => {
    if (valid) {
      validate.value = true
    } else {
      validate.value = false
    }
  })

  let value = false
  console.log(detailData.value)
  Object.values(detailData.value).forEach((item) => {
    console.log(item)
    if (typeof item === 'undefined') {
      return
    }
    if (item === '') {
      value = true
    }
    // if (typeof item === 'undefined' || item === '') {
    //   console.log('null')
    //   value = true
    // }
  })

  if (Object.keys(detailData.value).length < 7 || value) {
    validate.value = false
  } else {
    validate.value = true
  }

  // 清空，否则会重复
  yearMonth.value = []
  getMonthBetween(
    dayjs(monthValue.value[0]).format('YYYY-MM'),
    dayjs(monthValue.value[1]).format('YYYY-MM')
  ).map((item) => {
    yearMonth.value.push(item)
  })

  // 编辑
  if (route.params.id && validate.value) {
    // 校验新增和编辑人员是否满足条件
    // accumulateValue()

    // const dataSelect = ref(0)
    // await costAllSelect({
    //   table: 'personnelload',
    //   data: detailData
    // }).then((item) => {
    //   dataSelect.value = item[0].total
    // })
    // console.log(dataSelect.value)
    // if (Number(dataSelect.value) + Number(detailData.value.load) > 1) {
    //   ElMessage.warning('人员同一年月负荷系数不能大于1')
    //   closed(ruleFormRef)
    await costListDisplay({
      table: 'personnelload'
    }).then((result) => {
      personnelloadAll.value = result.lists
      console.log('personnelloadAll', personnelloadAll.value)
      const yearMonthList = ref([])

      // 新规则，计算累加
      yearMonth.value.forEach((detailDataItem) => {
        loadPersonnel.value = 0
        loadSystem.value = 0
        personnelloadAll.value.forEach((personnelloadAllItem) => {
          if (detailData.value.id) {
            // 判断人员的合计值不能大于1
            if (
              personnelloadAllItem.id !== detailData.value.id &&
              personnelloadAllItem.personnelId === detailData.value.personnelId
            ) {
              yearMonthList.value = personnelloadAllItem.yearMonth.split(',')
              yearMonthList.value.forEach((yearMonthListItem) => {
                if (yearMonthListItem === detailDataItem) {
                  loadPersonnel.value += Number(personnelloadAllItem.load)
                }
              })
            }
            if (
              personnelloadAllItem.id !== detailData.value.id &&
              personnelloadAllItem.systemId === detailData.value.systemId
            ) {
              yearMonthList.value = personnelloadAllItem.yearMonth.split(',')
              yearMonthList.value.forEach((yearMonthListItem) => {
                if (yearMonthListItem === detailDataItem) {
                  loadSystem.value += Number(personnelloadAllItem.load)
                }
              })
            }
          } else {
            if (
              personnelloadAllItem.personnelId === detailData.value.personnelId
            ) {
              yearMonthList.value = personnelloadAllItem.yearMonth.split(',')
              yearMonthList.value.forEach((yearMonthListItem) => {
                if (yearMonthListItem === detailDataItem) {
                  loadPersonnel.value += Number(personnelloadAllItem.load)
                }
              })
            }
            if (personnelloadAllItem.systemId === detailData.value.systemId) {
              yearMonthList.value = personnelloadAllItem.yearMonth.split(',')
              yearMonthList.value.forEach((yearMonthListItem) => {
                if (yearMonthListItem === detailDataItem) {
                  loadSystem.value += Number(personnelloadAllItem.load)
                }
              })
            }
          }
        })
        console.log(
          Number(detailData.value.load),
          loadPersonnel.value,
          loadSystem.value,
          Number(detailData.value.load) + loadPersonnel.value,
          Number(detailData.value.load) + loadSystem.value
        )
        if (Number(detailData.value.load) + loadPersonnel.value > 1) {
          personnelTotal.value = true
          messageTotal.value.push(
            '用户ID:',
            detailData.value.personnelId,
            '年度月份:',
            detailDataItem,
            '维护负荷系数',
            detailData.value.load,
            '人员存在负荷系数',
            loadPersonnel.value,
            '合计负荷大于1'
          )
        } else if (Number(detailData.value.load) + loadSystem.value > 1) {
          personnelTotal.value = true
          messageTotal.value.push(
            '用户ID:',
            detailData.value.personnelId,
            '年度月份:',
            detailDataItem,
            '维护负荷系数',
            detailData.value.load,
            '系统存在负荷系数',
            loadSystem.value,
            '合计负荷大于1'
          )
        }
      })

      // personnelloadAll.value.forEach((item) => {
      //   // 判断是修改还是新增
      //   if (detailData.value.id) {
      //     // 判断人员的合计值不能大于1
      //     if (
      //       item.id !== detailData.value.id &&
      //       item.personnelId === detailData.value.personnelId
      //     ) {
      //       console.log(item.yearMonth)
      //       yearMonthList.value = item.yearMonth.split(',')
      //       console.log(yearMonthList.value, yearMonth.value)
      //       yearMonthList.value.forEach((yearMonthListItem) => {
      //         yearMonth.value.forEach((detailDataItem) => {
      //           if (detailDataItem === yearMonthListItem) {
      //             console.log(Number(detailData.value.load), item.load)
      //             if (Number(detailData.value.load) + Number(item.load) > 1) {
      //               personnelTotal.value = true
      //               messageTotal.value.push(
      //                 '用户名:',
      //                 item.name,
      //                 '年度月份:',
      //                 detailDataItem,
      //                 '维护负荷系数',
      //                 detailData.value.load,
      //                 '系统存在负荷系数',
      //                 item.load,
      //                 '合计负荷大于1'
      //               )
      //             }
      //           }
      //         })
      //       })
      //     }
      //     // 判断系统的合计值不能大于1
      //     if (
      //       item.id !== detailData.value.id &&
      //       item.systemId === detailData.value.systemId
      //     ) {
      //       console.log(item.yearMonth)
      //       yearMonthList.value = item.yearMonth.split(',')
      //       yearMonthList.value.map((yearMonthListItem) => {
      //         yearMonth.value.forEach((detailDataItem) => {
      //           if (detailDataItem === yearMonthListItem) {
      //             if (Number(detailData.value.load) + Number(item.load) > 1) {
      //               systemTotal.value = true
      //               messageTotal.value.push(
      //                 '系统名称:',
      //                 item.SystemName,
      //                 '年度月份:',
      //                 detailDataItem,
      //                 '维护负荷系数',
      //                 detailData.value.load,
      //                 '系统存在负荷系数',
      //                 item.load,
      //                 '合计负荷大于1'
      //               )
      //             }
      //           }
      //         })
      //       })
      //     }
      //   } else {
      //     // 判断人员的合计值不能大于1
      //     if (item.personnelId === detailData.value.personnelId) {
      //       console.log(item.yearMonth)
      //       yearMonthList.value = item.yearMonth.split(',')
      //       yearMonthList.value.map((yearMonthListItem) => {
      //         yearMonth.value.forEach((detailDataItem) => {
      //           if (detailDataItem === yearMonthListItem) {
      //             if (Number(detailData.value.load) + Number(item.load) > 1) {
      //               personnelTotal.value = true
      //               messageTotal.value.push(
      //                 '用户名:',
      //                 item.name,
      //                 '年度月份:',
      //                 detailDataItem,
      //                 '维护负荷系数',
      //                 detailData.value.load,
      //                 '系统存在负荷系数',
      //                 item.load,
      //                 '合计负荷大于1'
      //               )
      //             }
      //           }
      //         })
      //       })
      //     }
      //     // 判断系统的合计值不能大于1
      //     if (item.systemId === detailData.value.systemId) {
      //       console.log(item.yearMonth)
      //       yearMonthList.value = item.yearMonth.split(',')
      //       yearMonthList.value.map((yearMonthListItem) => {
      //         yearMonth.value.forEach((detailDataItem) => {
      //           if (detailDataItem === yearMonthListItem) {
      //             if (Number(detailData.value.load) + Number(item.load) > 1) {
      //               systemTotal.value = true
      //               messageTotal.value.push(
      //                 '系统名称:',
      //                 item.SystemName,
      //                 '年度月份:',
      //                 detailDataItem,
      //                 '维护负荷系数',
      //                 detailData.value.load,
      //                 '系统存在负荷系数',
      //                 item.load,
      //                 '合计负荷大于1'
      //               )
      //             }
      //           }
      //         })
      //       })
      //     }
      //   }
      // })
    })

    if (personnelTotal.value === true || systemTotal.value === true) {
      ElMessage.warning(messageTotal.value.toString())
      console.log(messageTotal.value)
      closed(ruleFormRef)
    } else {
      delete detailData.value.SystemName
      delete detailData.value.name
      detailData.value.updateUser = store.getters.userInfo.username
      detailData.value.updateTime = dayjs().format('YYYY-MM-DD HH:mm:ss')
      const dataUpdate = await costEdit({
        table: 'personnelload',
        data: detailData
      })
      if (dataUpdate === '更新数据成功') {
        ElMessage.success(i18n.t('msg.cost.updateSuccess'))
        // 数据更新成功
        closed(ruleFormRef)
      } else if (dataUpdate === '数据已存在不能重复') {
        ElMessage.warning(i18n.t('msg.cost.existsSuccess'))
        // 数据更新成功
        closed(ruleFormRef)
      }
    }
    // 新增
  } else if (validate.value) {
    console.log('create', detailData.value)

    // 校验新增和编辑人员是否满足条件
    // const dataSelect = ref(0)
    // await costAllSelect({
    //   table: 'personnelload',
    //   data: detailData
    // }).then((item) => {
    //   dataSelect.value = item[0].total
    // })
    // console.log(dataSelect.value)
    // if (Number(dataSelect.value) + Number(detailData.value.load) > 1) {
    //   ElMessage.warning('人员同一年月负荷系数不能大于1')
    //   closed(ruleFormRef)
    // 校验新增和编辑人员是否满足条件
    await costListDisplay({
      table: 'personnelload'
    }).then((result) => {
      personnelloadAll.value = result.lists
      console.log('personnelloadAll', personnelloadAll.value)
      const yearMonthList = ref([])

      // 新规则，计算累加
      yearMonth.value.forEach((detailDataItem) => {
        loadPersonnel.value = 0
        loadSystem.value = 0
        personnelloadAll.value.forEach((personnelloadAllItem) => {
          if (detailData.value.id) {
            // 判断人员的合计值不能大于1
            if (
              personnelloadAllItem.id !== detailData.value.id &&
              personnelloadAllItem.personnelId === detailData.value.personnelId
            ) {
              yearMonthList.value = personnelloadAllItem.yearMonth.split(',')
              yearMonthList.value.forEach((yearMonthListItem) => {
                if (yearMonthListItem === detailDataItem) {
                  loadPersonnel.value += Number(personnelloadAllItem.load)
                }
              })
            }
            if (
              personnelloadAllItem.id !== detailData.value.id &&
              personnelloadAllItem.systemId === detailData.value.systemId
            ) {
              yearMonthList.value = personnelloadAllItem.yearMonth.split(',')
              yearMonthList.value.forEach((yearMonthListItem) => {
                if (yearMonthListItem === detailDataItem) {
                  loadSystem.value += Number(personnelloadAllItem.load)
                }
              })
            }
          } else {
            if (
              personnelloadAllItem.personnelId === detailData.value.personnelId
            ) {
              yearMonthList.value = personnelloadAllItem.yearMonth.split(',')
              yearMonthList.value.forEach((yearMonthListItem) => {
                if (yearMonthListItem === detailDataItem) {
                  loadPersonnel.value += Number(personnelloadAllItem.load)
                }
              })
            }
            if (personnelloadAllItem.systemId === detailData.value.systemId) {
              yearMonthList.value = personnelloadAllItem.yearMonth.split(',')
              console.log(personnelloadAllItem.id, yearMonthList.value)
              yearMonthList.value.forEach((yearMonthListItem) => {
                if (yearMonthListItem === detailDataItem) {
                  loadSystem.value += Number(personnelloadAllItem.load)
                  console.log(
                    personnelloadAllItem.systemId,
                    detailData.value.systemId,
                    yearMonthListItem,
                    detailDataItem,
                    loadSystem.value
                  )
                }
              })
            }
          }
        })
        console.log(
          Number(detailData.value.load),
          loadPersonnel.value,
          loadSystem.value
        )
        if (Number(detailData.value.load) + loadPersonnel.value > 1) {
          personnelTotal.value = true
          messageTotal.value.push(
            '用户ID:',
            detailData.value.personnelId,
            '年度月份:',
            detailDataItem,
            '维护负荷系数',
            detailData.value.load,
            '人员存在负荷系数',
            loadPersonnel.value,
            '合计负荷大于1'
          )
        } else if (Number(detailData.value.load) + loadSystem.value > 1) {
          personnelTotal.value = true
          messageTotal.value.push(
            '用户ID:',
            detailData.value.personnelId,
            '年度月份:',
            detailDataItem,
            '维护负荷系数',
            detailData.value.load,
            '系统存在负荷系数',
            loadSystem.value,
            '合计负荷大于1'
          )
        }
      })
      // personnelloadAll.value.forEach((item) => {
      //   // 判断是修改还是新增
      //   if (detailData.value.id) {
      //     // 判断人员的合计值不能大于1
      //     if (
      //       item.id !== detailData.value.id &&
      //       item.personnelId === detailData.value.personnelId
      //     ) {
      //       console.log(item.yearMonth)
      //       yearMonthList.value = item.yearMonth.split(',')
      //       console.log(yearMonthList.value, yearMonth.value)
      //       yearMonthList.value.forEach((yearMonthListItem) => {
      //         yearMonth.value.forEach((detailDataItem) => {
      //           // console.log(
      //           //   'detailDataItem',
      //           //   detailDataItem,
      //           //   'yearMonthListItem',
      //           //   yearMonthListItem
      //           // )
      //           // console.log(detailDataItem === yearMonthListItem)
      //           // console.log(detailData.value.load, item.load)
      //           if (detailDataItem === yearMonthListItem) {
      //             console.log(Number(detailData.value.load), item.load)
      //             if (Number(detailData.value.load) + Number(item.load) > 1) {
      //               personnelTotal.value = true
      //               console.log(
      //                 personnelTotal.value,
      //                 item.personnelId,
      //                 detailDataItem,
      //                 '合计大于1'
      //               )
      //             }
      //           }
      //         })
      //       })
      //     }
      //     // 判断系统的合计值不能大于1
      //     if (
      //       item.id !== detailData.value.id &&
      //       item.systemId === detailData.value.systemId
      //     ) {
      //       console.log(item.yearMonth)
      //       yearMonthList.value = item.yearMonth.split(',')
      //       yearMonthList.value.map((yearMonthListItem) => {
      //         yearMonth.value.forEach((detailDataItem) => {
      //           if (detailDataItem === yearMonthListItem) {
      //             if (detailData.value.load + item.load > 1) {
      //               systemTotal.value = true
      //               console.log(item.personnelId, detailDataItem, '合计大于1')
      //             }
      //           }
      //         })
      //       })
      //     }
      //   } else {
      //     // 判断人员的合计值不能大于1
      //     if (item.personnelId === detailData.value.personnelId) {
      //       console.log(item.yearMonth)
      //       yearMonthList.value = item.yearMonth.split(',')
      //       yearMonthList.value.map((yearMonthListItem) => {
      //         yearMonth.value.forEach((detailDataItem) => {
      //           if (detailDataItem === yearMonthListItem) {
      //             if (detailData.value.load + item.load > 1) {
      //               console.log(item.personnelId, detailDataItem, '合计大于1')
      //               personnelTotal.value = true
      //             }
      //           }
      //         })
      //       })
      //     }
      //     // 判断系统的合计值不能大于1
      //     if (item.systemId === detailData.value.systemId) {
      //       console.log(item.yearMonth)
      //       yearMonthList.value = item.yearMonth.split(',')
      //       yearMonthList.value.map((yearMonthListItem) => {
      //         yearMonth.value.forEach((detailDataItem) => {
      //           if (detailDataItem === yearMonthListItem) {
      //             if (detailData.value.load + item.load > 1) {
      //               console.log(item.personnelId, detailDataItem, '合计大于1')
      //               systemTotal.value = true
      //             }
      //           }
      //         })
      //       })
      //     }
      //   }
      // })
    })
    if (personnelTotal.value === true || systemTotal.value === true) {
      ElMessage.warning(messageTotal.value.toString())
      console.log(messageTotal.value)
      closed(ruleFormRef)
    } else {
      delete detailData.value.id
      delete detailData.value.SystemName
      delete detailData.value.name
      detailData.value.createUser = store.getters.userInfo.username
      detailData.value.createTime = dayjs().format('YYYY-MM-DD HH:mm:ss')
      const dataCreate = await costCreate({
        table: 'personnelload',
        data: detailData
      })
      if (dataCreate === '新增数据成功') {
        ElMessage.success(i18n.t('msg.cost.addSuccess'))
        // 数据更新成功
        closed(ruleFormRef)
      } else if (dataCreate === '数据已存在不能重复') {
        ElMessage.warning(i18n.t('msg.cost.existsSuccess'))
        // 数据已存在不能重复
        closed(ruleFormRef)
      }
    }
  }
}

const closed = (ruleFormRef) => {
  if (!ruleFormRef) return
  ruleFormRef.resetFields()
  monthValue.value = ''
  messageTotal.value = []
  personnelTotal.value = false
  // 判断系统负荷累计值
  systemTotal.value = false
  // 维护分解的全部年月值
  yearMonth.value = []
  detailData.value = {}
  router.push('/personnelManage/personnelload')
}

// 关闭
const onCancel = (ruleFormRef) => {
  closed(ruleFormRef)
}

// 弹出窗口
const systemInformationVisible = ref(false)
const tableName = ref('')

const personnelDialogClick = () => {
  systemInformationVisible.value = true
  tableName.value = 'personnel'
  selectId.value = route.params.id
}
const systemDialogClick = () => {
  systemInformationVisible.value = true
  tableName.value = 'systeminformation'
  selectId.value = route.params.id
}

const selectId = ref('')
// 关闭dialog时重置selectUserId
watch(systemInformationVisible, (val) => {
  if (!val) selectId.value = ''
})

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

const pickerSelect = (val) => {
  // 已成功的算出区间月份
  console.log(dayjs(monthValue.value[0]).format('YYYY-MM'))
  console.log(dayjs(monthValue.value[1]).format('YYYY-MM'))
  console.log(
    getMonthBetween(
      dayjs(monthValue.value[0]).format('YYYY-MM'),
      dayjs(monthValue.value[1]).format('YYYY-MM')
    )
  )
  const year = []
  const month = []

  getMonthBetween(
    dayjs(monthValue.value[0]).format('YYYY-MM'),
    dayjs(monthValue.value[1]).format('YYYY-MM')
  ).map((item) => {
    year.push(item.split('-')[0])
    month.push(item.split('-')[1])
    yearMonth.value.push(item)
  })
  detailData.value.year = year
  detailData.value.month = month
  detailData.value.yearMonth = yearMonth.value
  detailData.value.startYearMonth = dayjs(monthValue.value[0]).format('YYYY-MM')
  detailData.value.endYearMonth = dayjs(monthValue.value[1]).format('YYYY-MM')
  console.log(detailData.value)
  // detailData.value.year = dayjs(val).format('YYYY')
  // detailData.value.month = dayjs(val).format('MM')
}
// getCostSelect()
</script>

<style lang="scss" scoped>
.print-box {
  margin-bottom: 20px;
  text-align: right;
}
.user-info-box {
  width: 500px;
  margin: 0 auto;
  .title {
    text-align: center;
    margin-bottom: 18px;
    margin-top: 30px;
  }
  .header {
    display: flex;
    ::v-deep .el-descriptions {
      flex-grow: 1;
    }

    .avatar {
      width: 187px;
      box-sizing: border-box;
      padding: 30px 20px;
      border: 1px solid #ebeef5;
      border-left: none;
    }
    .remark {
      margin-right: 12px;
    }
  }
  .body {
    ul {
      list-style: none;
      li {
        span {
          margin-right: 62px;
        }
      }
    }
  }
  .foot {
    margin-top: 42px;
    text-align: right;
    .edit {
      float: right;
    }
  }
}
</style>
