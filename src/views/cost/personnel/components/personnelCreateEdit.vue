<template>
  <div class="user-info-container">
    <div class="user-info-box" id="userInfoBox">
      <!-- 标题 -->
      <h2 class="title">{{ title }}</h2>

      <el-form
        ref="ruleFormRef"
        :model="detailData"
        :rules="rules"
        label-width="70px"
        :size="formSize"
        status-icon
      >
        <el-row :gutter="20">
          <el-col :span="12" :offset="0">
            <el-form-item :label="$t('msg.cost.id')" prop="id">
              <el-input style="width: 150px" disabled v-model="detailData.id" />
            </el-form-item>
          </el-col>
          <el-col :span="12" :offset="0">
            <el-form-item :label="$t('msg.cost.name')" prop="name">
              <el-input
                style="width: 150px"
                v-model="detailData.name"
              /> </el-form-item
          ></el-col>
        </el-row>

        <el-row :gutter="20">
          <el-col :span="12" :offset="0">
            <el-form-item :label="$t('msg.cost.attribute')" prop="attribute">
              <el-select v-model="attribute" class="m-2" placeholder="请选择">
                <el-option
                  v-for="item in ListAttribute"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12" :offset="0">
            <el-form-item :label="$t('msg.cost.station')" prop="station">
              <el-select v-model="station" class="m-2" placeholder="请选择">
                <el-option
                  v-for="item in ListStation"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                />
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="12" :offset="0">
            <el-form-item :label="$t('msg.cost.business')" prop="business">
              <el-select v-model="business" class="m-2" placeholder="请选择">
                <el-option
                  v-for="item in ListBusiness"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12" :offset="0">
            <el-form-item
              :label="$t('msg.cost.officelocation')"
              prop="officelocation"
            >
              <el-select
                v-model="officelocation"
                class="m-2"
                placeholder="请选择"
              >
                <el-option
                  v-for="item in ListOfficelocation"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                />
              </el-select> </el-form-item
          ></el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="12" :offset="0">
            <el-form-item
              :label="$t('msg.cost.domainsplit')"
              prop="domainsplit"
            >
              <el-select v-model="domainsplit" class="m-2" placeholder="请选择">
                <el-option
                  v-for="item in ListDomainsplit"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12" :offset="0">
            <el-form-item :label="$t('msg.cost.domain')" prop="domain">
              <el-input
                style="width: 300px"
                readonly
                @click="operationManagerDialogClick"
                v-model="detailData.domain"
              >
                <template #suffix
                  ><el-icon style="margin-right: 10px"><Search /></el-icon
                ></template>
              </el-input> </el-form-item
          ></el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="12" :offset="0">
            <el-form-item :label="$t('msg.cost.customerName')" prop="customer">
              <!-- readonly只能选择不能输入 -->
              <el-input
                style="width: 300px"
                readonly
                @click="customerDialogClick"
                v-model="detailData.customer"
              >
                <template #suffix
                  ><el-icon style="margin-right: 10px"><Search /></el-icon
                ></template>
              </el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12" :offset="0">
            <el-form-item :label="$t('msg.cost.region')" prop="region">
              <el-select v-model="region" class="m-2" placeholder="请选择">
                <el-option
                  v-for="item in ListRegion"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                />
              </el-select> </el-form-item
          ></el-col>
        </el-row>

        <!-- <el-form-item
          :label="$t('msg.cost.developManager')"
          prop="developManagerName"
        >
          <el-input
            readonly
            @click="developManagerDialogClick"
            v-model="detailData.developManagerName"
          >
            <template #suffix
              ><el-icon style="margin-right: 10px"><Search /></el-icon
            ></template>
          </el-input>
        </el-form-item> -->
        <el-form-item>
          <el-button type="primary" @click="onConfirm(ruleFormRef)">{{
            $t('msg.universal.confirm')
          }}</el-button>
          <el-button @click="onCancel(ruleFormRef)">{{
            $t('msg.universal.cancel')
          }}</el-button>
        </el-form-item>
      </el-form>

      <PersonnelDialog
        v-model="systemInformationVisible"
        :tableName="tableName"
        :id="selectId"
        @costSelect="getCostSelect"
      >
      </PersonnelDialog>
    </div>
    <!-- </el-card> -->
  </div>
  <!-- </el-dialog> -->
</template>

<script setup>
import { ref, reactive, watch, onActivated } from 'vue'
import { costCreate, costEdit, costDisplay, costList } from '@/api/cost'
import { ElMessage, FormInstance } from 'element-plus'
import { useI18n } from 'vue-i18n'
import { validatetext } from '@/utils/validate'
import { useRoute, useRouter } from 'vue-router'
import PersonnelDialog from './personnelDialog.vue'
// import { ListBusiness } from '@/utils/business'
import dayjs from 'dayjs'
import store from '@/store'

const formSize = ref('default')
const ruleFormRef = ref(FormInstance)
const route = useRoute()
const router = useRouter()
const business = ref('')
const attribute = ref('')
const station = ref('')
const officelocation = ref('')
const domainsplit = ref('')
const region = ref('')

const rules = reactive({
  name: [{ validator: validatetext, trigger: 'blur' }],
  business: [{ validator: validatetext, trigger: 'blur' }],
  customer: [{ validator: validatetext, trigger: 'blur' }],
  domain: [{ validator: validatetext, trigger: 'blur' }],
  attribute: [{ validator: validatetext, trigger: 'blur' }],
  station: [{ validator: validatetext, trigger: 'blur' }],
  officelocation: [{ validator: validatetext, trigger: 'blur' }],
  domainsplit: [{ validator: validatetext, trigger: 'blur' }],
  region: [{ validator: validatetext, trigger: 'blur' }]
})

// 确定按钮点击事件
const i18n = useI18n()
const title = ref()
const costInformationId = route.params.id

// 获取业务域信息
const ListBusiness = ref([])
const getListBusiness = async () => {
  const result = await costList({
    table: 'businessdomain',
    page: 1,
    size: 100
  })
  result.list.forEach((item) => {
    ListBusiness.value.push({
      value: item.businessName,
      label: item.businessName
    })
  })
}
getListBusiness()

// 人员类别
const ListAttribute = ref([
  { value: '正式', label: '正式' },
  { value: '外包', label: '外包' }
])

// 获取ilink岗位信息
const ListStation = ref([
  { value: 'BA', label: 'BA' },
  { value: '技术支持工程师', label: '技术支持工程师' },
  { value: '领域经理', label: '领域经理' },
  { value: '助理经理', label: '助理经理' },
  { value: '软件工程师', label: '软件工程师' },
  { value: '系统工程师', label: '系统工程师' },
  { value: '网络工程师', label: '网络工程师' },
  { value: '桌面服务工程师', label: '桌面服务工程师' },
  { value: '硬件维修工程师', label: '硬件维修工程师' },
  { value: '运行维护工程师', label: '运行维护工程师' },
  { value: 'IDC值班工程师', label: 'IDC值班工程师' }
])
// 获取办公地点信息
const ListOfficelocation = ref([
  { value: '技术中心', label: '技术中心' },
  { value: '越野车', label: '越野车' },
  { value: '销售部', label: '销售部' },
  { value: '装备', label: '装备' },
  { value: '商用车机关', label: '商用车机关' },
  { value: '车辆工厂', label: '车辆工厂' },
  { value: '车身厂', label: '车身厂' },
  { value: '武汉研发', label: '武汉研发' },
  { value: '龙擎动力', label: '龙擎动力' },
  { value: '锻造公司', label: '锻造公司' },
  { value: 'Smart', label: 'Smart' },
  { value: '零部件', label: '零部件' },
  { value: '武汉模冲', label: '武汉模冲' },
  { value: 'ZD30', label: 'ZD30' }
])

// 领域拆分
const ListDomainsplit = ref([
  { value: '十堰应用系统', label: '十堰应用系统' },
  { value: '十堰基础架构', label: '十堰基础架构' },
  { value: '华中桌面', label: '华中桌面' },
  { value: '外包', label: '外包' }
])

// 地区
const ListRegion = ref([
  { value: '十堰', label: '十堰' },
  { value: '武汉', label: '武汉' }
])

// 数据相关
const detailData = ref({})
const getCostDisplay = async () => {
  detailData.value = await costDisplay({
    table: 'personnel',
    id: route.params.id
  })
  detailData.value = detailData.value[0]
  business.value = detailData.value.business
  attribute.value = detailData.value.attribute
  officelocation.value = detailData.value.officelocation
  domainsplit.value = detailData.value.domainsplit
  region.value = detailData.value.region
  station.value = detailData.value.station
  // console.log(detailData.value, business.value)
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
  if (Object.keys(detailData.value).length < 5) {
    validate.value = false
  } else {
    validate.value = true
  }
  if (route.params.id && validate.value) {
    delete detailData.value.customer
    delete detailData.value.domain
    delete detailData.value.domainManager
    // delete detailData.value.developManagerName
    // detailData.value.SystemName = detailData.value.SystemName
    // detailData.value.id = route.params.id
    console.log('edit', detailData.value)
    detailData.value.business = business.value
    detailData.value.attribute = attribute.value
    detailData.value.officelocation = officelocation.value
    detailData.value.domainsplit = domainsplit.value
    detailData.value.region = region.value
    detailData.value.station = station.value
    detailData.value.updateUser = store.getters.userInfo.username
    detailData.value.updateTime = dayjs().format('YYYY-MM-DD HH:mm:ss')
    const dataUpdate = await costEdit({
      table: 'personnel',
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
  } else if (validate.value) {
    console.log('create', detailData.value)
    delete detailData.value.customer
    delete detailData.value.domain
    delete detailData.value.domainManager
    // delete detailData.value.developManagerName
    detailData.value.business = business.value
    detailData.value.attribute = attribute.value
    detailData.value.officelocation = officelocation.value
    detailData.value.domainsplit = domainsplit.value
    detailData.value.region = region.value
    detailData.value.station = station.value
    detailData.value.createUser = store.getters.userInfo.username
    detailData.value.createTime = dayjs().format('YYYY-MM-DD HH:mm:ss')
    const dataCreate = await costCreate({
      table: 'personnel',
      data: detailData
    })
    if (dataCreate) {
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
  router.push('/personnelManage/personnel')
  business.value = ''
  attribute.value = ''
  officelocation.value = ''
  domainsplit.value = ''
  region.value = ''
  station.value = ''
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

// 将系统id传到弹出窗口
const selectId = ref('')
// 判断是运维还是研发经理
const isOperationDevelop = ref('')
const operationManagerDialogClick = () => {
  systemInformationVisible.value = true
  tableName.value = 'domaininformation'
  selectId.value = route.params.id
  isOperationDevelop.value = 'operation'
}
// const developManagerDialogClick = () => {
//   systemInformationVisible.value = true
//   tableName.value = 'domaininformation'
//   selectId.value = route.params.id
//   isOperationDevelop.value = 'develop'
// }

// 关闭dialog时重置selectUserId
watch(systemInformationVisible, (val) => {
  if (!val) selectId.value = ''
})

const getCostSelect = (item) => {
  if (item) {
    if (item.domainManager) {
      if (isOperationDevelop.value === 'operation') {
        detailData.value.domainId = item.id
        detailData.value.domain = item.domain
      } else if (isOperationDevelop.value === 'develop') {
        detailData.value.developManagerId = item.id
        detailData.value.developManagerName = item.domainManager
      }
    } else {
      detailData.value.customerId = item.id
      detailData.value.customer = item.customer
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
  width: 1024px;
  margin: auto 50px;
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
