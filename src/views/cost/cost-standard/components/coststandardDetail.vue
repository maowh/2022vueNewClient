<template>
  <div class="user-info-container">
    <div class="user-info-box" id="userInfoBox">
      <!-- 标题 -->
      <h2 class="title">{{ $t('msg.route.coefficientInformationInfo') }}</h2>

      <div class="header">
        <!-- 头部渲染表格 -->
        <el-descriptions :column="2" border>
          <el-descriptions-item :label="$t('msg.cost.customerName')">{{
            detailData.customer
          }}</el-descriptions-item>
          <el-descriptions-item :label="$t('msg.cost.year')">{{
            detailData.year
          }}</el-descriptions-item>
          <el-descriptions-item :label="$t('msg.cost.softwareEngineer')">{{
            detailData.softwareEngineer
          }}</el-descriptions-item>
          <el-descriptions-item
            :label="$t('msg.cost.seniorSoftwareEngineer')"
            >{{ detailData.seniorSoftwareEngineer }}</el-descriptions-item
          >
          <el-descriptions-item :label="$t('msg.cost.systemEngineer')">{{
            detailData.systemEngineer
          }}</el-descriptions-item>
          <el-descriptions-item :label="$t('msg.cost.seniorSystemEngineer')">{{
            detailData.seniorSystemEngineer
          }}</el-descriptions-item>
          <el-descriptions-item :label="$t('msg.cost.dbaEngineer')">{{
            detailData.dbaEngineer
          }}</el-descriptions-item>
          <el-descriptions-item :label="$t('msg.cost.seniorDbaEngineer')">{{
            detailData.seniorDbaEngineer
          }}</el-descriptions-item>
          <el-descriptions-item :label="$t('msg.cost.seniorSap')">{{
            detailData.seniorSap
          }}</el-descriptions-item>
          <el-descriptions-item :label="$t('msg.cost.intermediateSap')">{{
            detailData.intermediateSap
          }}</el-descriptions-item>
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
    table: 'coststandard',
    id: route.params.id
  })
  detailData.value = detailData.value[0]
}
getCostDisplay()

const onBackClick = () => {
  router.push('/basics/coststandard')
}
const onEditClick = () => {
  router.push(`/basics/coststandardEdit/${route.params.id}`)
  // router.push(`/basics/coefficientInformationCreateEdit/${route.params.id}`)
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
