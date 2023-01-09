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
        <el-row>
          <el-col :span="12" :offset="0">
            <el-form-item
              :label="$t('msg.cost.customerName')"
              prop="customerName"
            >
              <el-input
                @click="customerDialogClick"
                v-model="detailData.customerName"
              >
                <template #suffix
                  ><el-icon style="margin-right: 10px"><Search /></el-icon
                ></template>
              </el-input> </el-form-item
          ></el-col>
          <el-col :span="12" :offset="0">
            <el-form-item :label="$t('msg.cost.SystemName')" prop="SystemName">
              <el-input
                disabled
                v-model="detailData.SystemName"
              /> </el-form-item
          ></el-col>
        </el-row>
        <el-row>
          <el-col :span="12" :offset="0">
            <el-form-item :label="$t('msg.cost.SystemName')" prop="SystemName">
              <el-input
                disabled
                v-model="detailData.SystemName"
              /> </el-form-item
          ></el-col>
          <el-col :span="12" :offset="0">
            <el-form-item :label="$t('msg.cost.SystemName')" prop="SystemName">
              <el-input
                disabled
                v-model="detailData.SystemName"
              /> </el-form-item
          ></el-col>
        </el-row>
        <el-row>
          <el-col :span="12" :offset="0">
            <el-form-item :label="$t('msg.cost.SystemName')" prop="SystemName">
              <el-input
                disabled
                v-model="detailData.SystemName"
              /> </el-form-item
          ></el-col>
          <el-col :span="12" :offset="0">
            <el-form-item :label="$t('msg.cost.SystemName')" prop="SystemName">
              <el-input
                disabled
                v-model="detailData.SystemName"
              /> </el-form-item
          ></el-col>
        </el-row>
        <el-row>
          <el-col :span="12" :offset="0">
            <el-form-item :label="$t('msg.cost.SystemName')" prop="SystemName">
              <el-date-picker
                v-model="value2"
                type="month"
                placeholder="Pick a month"
              /> </el-form-item
          ></el-col>
          <el-col :span="12" :offset="0">
            <el-form-item :label="$t('msg.cost.id')" prop="id">
              <el-input disabled v-model="detailData.id" /> </el-form-item
          ></el-col>
        </el-row>
        <el-row>
          <el-col :span="8" :offset="0">
            <el-form-item :label="$t('msg.cost.SystemName')" prop="SystemName">
              <el-input
                disabled
                v-model="detailData.SystemName"
              /> </el-form-item
          ></el-col>
          <el-col :span="8" :offset="0">
            <el-form-item :label="$t('msg.cost.SystemName')" prop="SystemName">
              <el-input
                disabled
                v-model="detailData.SystemName"
              /> </el-form-item
          ></el-col>
          <el-col :span="8" :offset="0">
            <el-form-item :label="$t('msg.cost.SystemName')" prop="SystemName">
              <el-input
                disabled
                v-model="detailData.SystemName"
              /> </el-form-item
          ></el-col>
        </el-row>
        <el-row>
          <el-col :span="24" :offset="0">
            <div style="margin-bottom: 10px">
              <el-button @click="confirmAdd" :disabled="addIs">新增</el-button>
            </div>
            <el-table :data="tableData" border>
              <el-table-column
                label="单位名称"
                align="center"
                show-overflow-tooltip
              >
                <template #default="{ row }">
                  <template v-if="row.edit">
                    <el-input v-model="row.name" />
                  </template>
                  <span @dblclick="row.edit = !row.edit" v-else>{{
                    row.name
                  }}</span>
                </template>
              </el-table-column>
              <el-table-column
                label="用途"
                prop="use"
                align="center"
                :show-overflow-tooltip="true"
              ></el-table-column>
              <el-table-column
                label="安装设备"
                prop="equipment"
                align="center"
                :show-overflow-tooltip="true"
              ></el-table-column>
              <el-table-column label="操作" prop="desc" align="center">
                <template #default="{ row, $index }">
                  <el-button
                    v-if="row.edit"
                    icon="el-icon-menu"
                    size="small"
                    type="success"
                    @click="confirmEdit(row, $index + 1)"
                  >
                    保存
                  </el-button>
                  <el-button
                    v-else
                    icon="el-icon-edit"
                    size="small"
                    type="primary"
                    @click="row.edit = !row.edit"
                  >
                    编辑
                  </el-button>
                  <el-button
                    type="danger"
                    size="small"
                    icon="el-icon-delete"
                    :disabled="row.edit"
                    @click="confirmDel(row)"
                    >删除</el-button
                  >
                </template>
              </el-table-column>
            </el-table>
          </el-col>
        </el-row>
        <el-form-item :label="$t('msg.cost.id')" prop="id">
          <el-input disabled v-model="detailData.id" />
        </el-form-item>
        <el-form-item :label="$t('msg.cost.SystemName')" prop="SystemName">
          <el-input v-model="detailData.SystemName" />
        </el-form-item>
        <el-form-item :label="$t('msg.cost.customerName')" prop="customerName">
          <el-input
            @click="customerDialogClick"
            v-model="detailData.customerName"
          >
            <template #suffix
              ><el-icon style="margin-right: 10px"><Search /></el-icon
            ></template>
          </el-input>
        </el-form-item>
        <el-form-item
          :label="$t('msg.cost.domainManagerName')"
          prop="domainManagerName"
        >
          <el-input
            @click="domainManagerDialogClick"
            v-model="detailData.domainManagerName"
          >
            <template #suffix
              ><el-icon style="margin-right: 10px"><Search /></el-icon
            ></template>
          </el-input>
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

      <outsourcingDialog
        v-model="systemInformationVisible"
        :tableName="tableName"
        :id="selectId"
        @costSelect="getCostSelect"
      >
      </outsourcingDialog>
    </div>
    <!-- </el-card> -->
  </div>
  <!-- </el-dialog> -->
</template>

<script setup>
import { ref, reactive, watch } from 'vue'
import { costCreate, costEdit, costDisplay } from '@/api/cost'
import { ElMessage, FormInstance } from 'element-plus'
import { useI18n } from 'vue-i18n'
import { validatetext } from '@/utils/validate'
import { useRoute, useRouter } from 'vue-router'
import outsourcingDialog from './outsourcingDialog.vue'

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
const detailData = ref({})
const getCostDisplay = async () => {
  detailData.value = await costDisplay({
    table: 'systeminformation',
    id: route.params.id
  })
}

// const tableData = ref([])
const tableData = ref([
  {
    name: '单位名称单位名称',
    use: '饭店',
    equipment: '煤气表,热水器'
  },
  {
    name: '单位名称单位名称',
    use: '饭店',
    equipment: '煤气表,热水器'
  }
])
const addIs = ref(false)
const confirmEdit = (row, index) => {
  console.log(index)
  row.edit = false
  addIs.value = false
  row.originalTitle = row.title
}

const confirmAdd = () => {
  const row = {
    name: '',
    use: '',
    equipment: ''
  }
  tableData.value.push(row)
  row.edit = true
  addIs.value = true
}

const confirmDel = (row) => {
  row.edit = false
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
    console.log('edit', detailData.value)
    delete detailData.value.customerName
    delete detailData.value.domainManagerName
    // detailData.value.SystemName = detailData.value.SystemName
    // detailData.value.id = route.params.id
    const dataUpdate = await costEdit({
      table: 'systeminformation',
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
  } else {
    console.log('create', detailData.value)
    delete detailData.value.customerName
    delete detailData.value.domainManagerName
    const dataCreate = await costCreate({
      table: 'systeminformation',
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

const closed = (ruleFormRef) => {
  if (!ruleFormRef) return
  ruleFormRef.resetFields()
  router.push('/outsourcing/manage')
}

// 关闭
const onCancel = (ruleFormRef) => {
  closed(ruleFormRef)
}

// 弹出窗口
const systemInformationVisible = ref(false)
const tableName = ref('')

const customerDialogClick = () => {
  systemInformationVisible.value = true
  tableName.value = 'customerinformation'
  selectId.value = route.params.id
}

const domainManagerDialogClick = () => {
  systemInformationVisible.value = true
  tableName.value = 'domaininformation'
  selectId.value = route.params.id
}

const selectId = ref('')
// 关闭dialog时重置selectUserId
watch(systemInformationVisible, (val) => {
  if (!val) selectId.value = ''
})

const getCostSelect = (item) => {
  if (item) {
    if (item.domainManager) {
      detailData.value.domainManagerId = item.id
      detailData.value.domainManagerName = item.domainManager
      console.log('domainManager', detailData.value, item)
    } else {
      detailData.value.customerId = item.id
      detailData.value.customerName = item.customer
      console.log('customer', detailData.value, item)
    }
  }
}
// getCostSelect()
</script>

<style lang="scss" scoped>
.print-box {
  margin-bottom: 20px;
  text-align: right;
}
.user-info-box {
  width: 1000px;
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
.tb-edit .el-input {
  display: none;
}
.tb-edit .current-row .el-input {
  display: block;
}
.tb-edit .current-row .el-input + span {
  display: none;
}
</style>
