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
        <el-form-item :label="$t('msg.cost.year')" prop="year">
          <el-date-picker
            v-model="detailData.year"
            clear-icon="CircleClose"
            type="year"
            placeholder="请选择年份"
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

      <PersonnelmatrixDialog
        v-model="systemInformationVisible"
        :tableName="tableName"
        :id="selectId"
        @costSelect="getCostSelect"
      >
      </PersonnelmatrixDialog>
    </div>
    <!-- </el-card> -->
  </div>
  <!-- </el-dialog> -->
</template>

<script setup>
import { ref, reactive, watch, onActivated } from 'vue'
import { costCreate, costEdit, costDisplay } from '@/api/cost'
import { ElMessage, FormInstance } from 'element-plus'
import { useI18n } from 'vue-i18n'
import { validatetext } from '@/utils/validate'
import { useRoute, useRouter } from 'vue-router'
import PersonnelmatrixDialog from './personnelmatrixDialog.vue'
import dayjs from 'dayjs'
import store from '@/store'

const formSize = ref('default')
const ruleFormRef = ref(FormInstance)
const route = useRoute()
const router = useRouter()

const rules = reactive({
  SystemName: [{ validator: validatetext, trigger: 'blur' }],
  name: [{ validator: validatetext, trigger: 'blur' }],
  year: [{ validator: validatetext, trigger: 'blur' }],
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
// 判断人员负荷累计值
const personnelTotal = ref(false)
// 判断系统负荷累计值
const systemTotal = ref(false)
// 维护分解的全部年月值
const yearMonth = ref([])
// 弹出报错提示
const messageTotal = ref([])

const detailData = ref({})
const getCostDisplay = async () => {
  detailData.value = await costDisplay({
    table: 'personnelmatrix',
    id: route.params.id
  })
  detailData.value = detailData.value[0]
}

onActivated(() => {
  if (costInformationId) {
    title.value = i18n.t('msg.cost.edit')
    getCostDisplay()
  } else {
    title.value = i18n.t('msg.cost.add')
  }
})

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
  })

  if (Object.keys(detailData.value).length < 6 || value) {
    validate.value = false
  } else {
    validate.value = true
  }

  console.log('验证是否通过：', validate.value)
  // 编辑
  if (route.params.id && validate.value) {
    detailData.value.year = dayjs(detailData.value.year).format('YYYY')
    // 校验新增和编辑人员是否满足条件
    delete detailData.value.SystemName
    delete detailData.value.name
    detailData.value.updateUser = store.getters.userInfo.username
    detailData.value.updateTime = dayjs().format('YYYY-MM-DD HH:mm:ss')
    const dataUpdate = await costEdit({
      table: 'personnelmatrix',
      data: detailData
    })
    console.log('修改记录：', dataUpdate)
    if (dataUpdate === '更新数据成功') {
      ElMessage.success(i18n.t('msg.cost.updateSuccess'))
      // 数据更新成功
      closed(ruleFormRef)
    } else if (dataUpdate === '数据已存在不能重复') {
      ElMessage.warning('同一年度人员工作系数和不能大于1')
      // 数据更新成功
      closed(ruleFormRef)
    }
  } else if (validate.value) {
    // 新增
    detailData.value.year = dayjs(detailData.value.year).format('YYYY')
    // 校验新增和编辑人员是否满足条件
    delete detailData.value.id
    delete detailData.value.SystemName
    delete detailData.value.name
    detailData.value.createUser = store.getters.userInfo.username
    detailData.value.createTime = dayjs().format('YYYY-MM-DD HH:mm:ss')
    console.log('新增数据', detailData.value)
    const dataCreate = await costCreate({
      table: 'personnelmatrix',
      data: detailData
    })

    if (dataCreate) {
      ElMessage.success(i18n.t('msg.cost.addSuccess'))
      // 数据更新成功
      closed(ruleFormRef)
    } else if (dataCreate === '数据已存在不能重复') {
      ElMessage.warning('同一年度人员工作系数和不能大于1')
      // 数据已存在不能重复
      closed(ruleFormRef)
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
  router.push('/personnelManage/personnelmatrix')
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

// const pickerSelect = (val) => {
//   // 已成功的算出区间月份
//   console.log('选择年份：', detailData.value.year)
//   detailData.value.year = dayjs(detailData.value.year).format('YYYY')
// }
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
