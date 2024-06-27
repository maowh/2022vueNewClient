<template>
  <div class="user-info-container">
    <div class="user-info-box" id="userInfoBox">
      <!-- 标题 -->
      <h2 class="title">{{ $t('msg.route.personnelDetail') }}</h2>

      <div class="header">
        <!-- 头部渲染表格 -->
        <el-descriptions :column="1" border>
          <el-descriptions-item :label="$t('msg.cost.id')">{{
            detailData.id
          }}</el-descriptions-item>
          <el-descriptions-item :label="$t('msg.cost.name')">{{
            detailData.name
          }}</el-descriptions-item>
          <el-descriptions-item :label="$t('msg.cost.attribute')">{{
            detailData.attribute
          }}</el-descriptions-item>
          <el-descriptions-item :label="$t('msg.cost.station')">{{
            detailData.station
          }}</el-descriptions-item>
          <el-descriptions-item :label="$t('msg.cost.business')">{{
            detailData.business
          }}</el-descriptions-item>
          <el-descriptions-item :label="$t('msg.cost.officelocation')">{{
            detailData.officelocation
          }}</el-descriptions-item>
          <el-descriptions-item :label="$t('msg.cost.domainsplit')">{{
            detailData.domainsplit
          }}</el-descriptions-item>
          <el-descriptions-item :label="$t('msg.cost.domain')">{{
            detailData.domain
          }}</el-descriptions-item>
          <el-descriptions-item :label="$t('msg.cost.customerName')">{{
            detailData.customer
          }}</el-descriptions-item>
          <el-descriptions-item :label="$t('msg.cost.region')">{{
            detailData.region
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
    table: 'personnel',
    id: route.params.id
  })
  detailData.value = detailData.value[0]
}
getCostDisplay()

const onBackClick = () => {
  router.push('/personnelManage/personnel')
}
const onEditClick = () => {
  router.push(`/personnelManage/personnelCreateEdit/${route.params.id}`)
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
