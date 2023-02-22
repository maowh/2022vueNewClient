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
          <el-input @click="personnelDialogClick" v-model="detailData.name">
            <template #suffix
              ><el-icon style="margin-right: 10px"><Search /></el-icon
            ></template>
          </el-input>
        </el-form-item>
        <el-form-item :label="$t('msg.cost.year')" prop="year">
          <el-date-picker
            v-model="detailData.year"
            clear-icon="CircleClose"
            @change="pickerSelect($event)"
            type="year"
          />
        </el-form-item>
        <el-form-item :label="$t('msg.cost.SystemName')" prop="SystemName">
          <el-input @click="systemDialogClick" v-model="detailData.SystemName">
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
import { ref, reactive, watch } from 'vue'
import { costCreate, costEdit, costDisplay, costAllSelect } from '@/api/cost'
import { ElMessage, FormInstance } from 'element-plus'
import { useI18n } from 'vue-i18n'
import { validatetext } from '@/utils/validate'
import { useRoute, useRouter } from 'vue-router'
import PersonnelloadDialog from './personnelloadDialog.vue'
import dayjs from 'dayjs'

const formSize = ref('default')
const ruleFormRef = ref(FormInstance)
const route = useRoute()
const router = useRouter()

const rules = reactive({
  SystemName: [{ validator: validatetext, trigger: 'blur' }]
})

// 确定按钮点击事件
const i18n = useI18n()
const title = ref()
const costInformationId = route.params.id

// 数据相关
// 校验新增和编辑人员是否满足条件
// const personnelData = ref()
// const getPersonnelData = async () => {
//   personnelData.value = await costAllSelect({
//     table:'personnelload',
//     data:
//   })
// }

const detailData = ref({})
const getCostDisplay = async () => {
  detailData.value = await costDisplay({
    table: 'personnelload',
    id: route.params.id
  })
  detailData.value = detailData.value[0]
  detailData.value.year = dayjs().format('YYYY')
  console.log(detailData.value.year)
}

if (costInformationId) {
  title.value = i18n.t('msg.cost.edit')
  getCostDisplay()
} else {
  title.value = i18n.t('msg.cost.add')
}

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
  if (route.params.id) {
    delete detailData.value.SystemName
    delete detailData.value.name

    // 校验新增和编辑人员是否满足条件
    const dataSelect = await costAllSelect({
      table: 'personnelload',
      data: detailData
    })
    console.log(
      'edit',
      Number(dataSelect) + Number(detailData.value.load),
      Number(dataSelect) + Number(detailData.value.load) > 1
    )
    if (Number(dataSelect) + Number(detailData.value.load) > 1) {
      ElMessage.warning('人员同一年度负荷系数不能大于1')
      closed(ruleFormRef)
    } else {
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
  } else {
    console.log('create', detailData.value)
    delete detailData.value.id
    delete detailData.value.SystemName
    delete detailData.value.name
    // 校验新增和编辑人员是否满足条件
    const dataSelect = await costAllSelect({
      table: 'personnelload',
      data: detailData
    })
    if (Number(dataSelect) + Number(detailData.value.load) > 1) {
      ElMessage.warning('人员同一年度负荷系数不能大于1')
      closed(ruleFormRef)
    } else {
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
        // 数据更新成功
        closed(ruleFormRef)
      }
    }
  }
}

const closed = (ruleFormRef) => {
  if (!ruleFormRef) return
  ruleFormRef.resetFields()
  router.push('/outsourcing/personnelload')
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
  detailData.value.year = dayjs(val).format('YYYY')
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
