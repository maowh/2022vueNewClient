<template>
  <div class="user-info-container">
    <div class="user-info-box" id="userInfoBox">
      <!-- 标题 -->
      <h2 class="title">{{ $t('msg.route.outsourcingInfo') }}</h2>

      <div class="header">
        <!-- 头部渲染表格 -->
        <el-descriptions :column="2" border>
          <!-- <el-descriptions-item :label="$t('msg.cost.id')">{{
            detailData.id
          }}</el-descriptions-item> -->
          <el-descriptions-item :label="$t('msg.cost.SystemName')">{{
            detailData.SystemName
          }}</el-descriptions-item>
          <el-descriptions-item :label="$t('msg.cost.customerName')">{{
            detailData.customerName
          }}</el-descriptions-item>
          <el-descriptions-item :label="$t('msg.cost.year')">{{
            detailData.year
          }}</el-descriptions-item>
          <el-descriptions-item :label="$t('msg.cost.businessDivision')">{{
            detailData.businessDivision
          }}</el-descriptions-item>
          <el-descriptions-item :label="$t('msg.cost.businessLines')">{{
            detailData.businessLines
          }}</el-descriptions-item>
          <el-descriptions-item :label="$t('msg.cost.domain')">{{
            detailData.domain
          }}</el-descriptions-item>
          <el-descriptions-item :label="$t('msg.cost.operationManager')">{{
            detailData.operationManagerName
          }}</el-descriptions-item>
          <el-descriptions-item :label="$t('msg.cost.reportedAmount')">{{
            detailData.reportedAmount
          }}</el-descriptions-item>
          <el-descriptions-item :label="$t('msg.cost.contractAmount')">{{
            detailData.contractAmount
          }}</el-descriptions-item>
          <el-descriptions-item :label="$t('msg.cost.taxAmount')">{{
            detailData.taxAmount
          }}</el-descriptions-item>
        </el-descriptions>
      </div>

      <div class="body">
        <!-- 内容渲染表格 -->
        <el-descriptions
          direction="vertical"
          :column="9"
          border
          v-for="item in moneyData"
          :key="item.id"
        >
          <el-descriptions-item :label="$t('msg.cost.classificationName')">
            {{ item.classification }}
            <!-- </div> -->
          </el-descriptions-item>
          <el-descriptions-item :label="$t('msg.cost.systemEngineer')">
            {{ item.systemEngineer }}
          </el-descriptions-item>
          <el-descriptions-item :label="$t('msg.cost.seniorSystemEngineer')">
            {{ item.seniorSystemEngineer }}
          </el-descriptions-item>
          <el-descriptions-item :label="$t('msg.cost.softwareEngineer')">
            {{ item.softwareEngineer }}
          </el-descriptions-item>
          <el-descriptions-item :label="$t('msg.cost.seniorSoftwareEngineer')">
            {{ item.seniorSoftwareEngineer }}
          </el-descriptions-item>
          <el-descriptions-item :label="$t('msg.cost.intermediateSap')">
            {{ item.intermediateSap }}
          </el-descriptions-item>
          <el-descriptions-item :label="$t('msg.cost.seniorSap')">
            {{ item.seniorSap }}
          </el-descriptions-item>
          <el-descriptions-item :label="$t('msg.cost.dbaEngineer')">
            {{ item.dbaEngineer }}
          </el-descriptions-item>
          <el-descriptions-item :label="$t('msg.cost.seniorDbaEngineer')">
            {{ item.seniorDbaEngineer }}
          </el-descriptions-item>
        </el-descriptions>
      </div>
      <div class="body">
        <!-- 内容渲染表格 -->
        <el-descriptions direction="vertical" :column="3" border>
          <el-descriptions-item :label="$t('msg.cost.totalAmount')">
            {{ totalAmount }}
          </el-descriptions-item>
          <el-descriptions-item :label="$t('msg.cost.totalManpower')">
            {{ totalManpower }}
          </el-descriptions-item>
        </el-descriptions>
      </div>

      <!-- 尾部签名 -->
      <div class="foot">
        <el-button type="text" class="edit" @click="onBackClick">{{
          $t('msg.article.back')
        }}</el-button>
        <el-button type="text" class="edit" @click="onEditClick">{{
          $t('msg.article.edit')
        }}</el-button>
      </div>
    </div>
    <!-- </el-card> -->
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { costDisplay } from '@/api/cost'
import { useRoute, useRouter } from 'vue-router'

const route = useRoute()
const router = useRouter()
// 数据相关
const detailData = ref({})
const getCostDisplay = async () => {
  detailData.value = await costDisplay({
    table: 'outsourcingcostsplan',
    id: route.params.id
  })
  detailData.value = detailData.value[0]
  console.log(detailData.value)
}
getCostDisplay()

const totalAmount = ref(0)
const totalManpower = ref(0)
const moneyData = ref([])
const getCostMoneyList = async () => {
  await costDisplay({
    table: 'outsourcingcostsmoney',
    id: route.params.id
  }).then((item) => {
    moneyData.value = item
    if (item.length > 1) {
      totalAmount.value = item[0].totalAmount + item[1].totalAmount
      totalManpower.value = item[0].totalManpower + item[1].totalManpower
    } else {
      totalAmount.value = item[0].totalAmount
      totalManpower.value = item[0].totalManpower
    }
  })
}
getCostMoneyList()

const onBackClick = () => {
  router.push('/outsourcing/outsourcingplan')
}
const onEditClick = () => {
  router.push(`/outsourcing/outsourcingplanEdit/${route.params.id}`)
}
</script>

<style lang="scss" scoped>
.print-box {
  margin-bottom: 20px;
  text-align: right;
}
.user-info-box {
  width: 1024px;
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
    margin-top: 20px;
    text-align: right;
    .edit {
      float: right;
      margin-right: 20px;
    }
  }
}
</style>
