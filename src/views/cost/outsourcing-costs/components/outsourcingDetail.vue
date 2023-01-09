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
          <el-descriptions-item :label="$t('msg.cost.month')">{{
            detailData.month
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
          <el-descriptions-item :label="$t('msg.cost.domainManager')">{{
            detailData.domainManager
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
        <el-descriptions direction="vertical" :column="3" border>
          <el-descriptions-item :label="$t('msg.cost.classificationName')">
            {{ detailData.classificationName }}
          </el-descriptions-item>
          <el-descriptions-item :label="$t('msg.cost.totalAmount')">
            {{ detailData.totalAmount }}
          </el-descriptions-item>
          <el-descriptions-item :label="$t('msg.cost.totalManpower')">
            {{ detailData.totalManpower }}
          </el-descriptions-item>
        </el-descriptions>
      </div>
      <div class="body">
        <!-- 内容渲染表格 -->
        <el-descriptions direction="vertical" :column="8" border>
          <el-descriptions-item :label="$t('msg.cost.systemEngineer')">
            {{ detailData.systemEngineer }}
          </el-descriptions-item>
          <el-descriptions-item :label="$t('msg.cost.seniorSystemEngineer')">
            {{ detailData.seniorSystemEngineer }}
          </el-descriptions-item>
          <el-descriptions-item :label="$t('msg.cost.softwareEngineer')">
            {{ detailData.softwareEngineer }}
          </el-descriptions-item>
          <el-descriptions-item :label="$t('msg.cost.seniorSoftwareEngineer')">
            {{ detailData.seniorSoftwareEngineer }}
          </el-descriptions-item>
          <el-descriptions-item :label="$t('msg.cost.intermediateSap')">
            {{ detailData.intermediateSap }}
          </el-descriptions-item>
          <el-descriptions-item :label="$t('msg.cost.seniorSap')">
            {{ detailData.seniorSap }}
          </el-descriptions-item>
          <el-descriptions-item :label="$t('msg.cost.dbaEngineer')">
            {{ detailData.dbaEngineer }}
          </el-descriptions-item>
          <el-descriptions-item :label="$t('msg.cost.seniorDbaEngineer')">
            {{ detailData.seniorDbaEngineer }}
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
    table: 'outsourcingcosts',
    id: route.params.id
  })
  console.log(detailData.value)
}
getCostDisplay()

const onBackClick = () => {
  router.push('/outsourcing/manage')
}
const onEditClick = () => {
  router.push(`/outsourcing/outsourcingEdit/${route.params.id}`)
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
    margin-top: 42px;
    text-align: right;
    .edit {
      float: right;
      margin-right: 20px;
    }
  }
}
</style>
