<template>
  <div class="article-ranking-container">
    <el-card class="header">
      <div class="dynamic-box">
        <el-button type="primary" @click="onAddClick">{{
          $t('msg.cost.add')
        }}</el-button>
      </div>
      <el-table :data="tableData" border style="width: 100%">
        <!-- <el-table-column label="#" type="index"></el-table-column> -->
        <!-- <el-table-column prop="id" :label="$t('msg.cost.id')"></el-table-column> -->
        <el-table-column
          prop="customer"
          :label="$t('msg.cost.customerName')"
        ></el-table-column>
        <el-table-column
          prop="contractPrice"
          :label="$t('msg.cost.contractPrice')"
        ></el-table-column>
        <el-table-column
          prop="taxIncluded"
          :label="$t('msg.cost.taxIncluded')"
        ></el-table-column>
        <el-table-column
          prop="year"
          :label="$t('msg.cost.year')"
        ></el-table-column>
        <el-table-column
          :label="$t('msg.cost.action')"
          fixed="right"
          width="260"
        >
          <template #default="{ row }">
            <el-button
              type="primary"
              size="mini"
              @click="onShowClick(row.id)"
              >{{ $t('msg.cost.show') }}</el-button
            >
            <el-button type="info" size="mini" @click="onEditClick(row.id)">{{
              $t('msg.cost.edit')
            }}</el-button>
            <el-button type="danger" size="mini" @click="onRemoveClick(row)">{{
              $t('msg.cost.remove')
            }}</el-button>
          </template>
        </el-table-column>
      </el-table>
      <el-pagination
        class="pagination"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="page"
        :page-sizes="[2, 5, 10, 50, 100]"
        :page-size="size"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
      >
      </el-pagination>
    </el-card>
  </div>
</template>

<script setup>
import { ref, onActivated, watch, onMounted } from 'vue'
import { costListDisplay, costDel } from '@/api/cost'
import { useRouter, useRoute } from 'vue-router'
import { useI18n } from 'vue-i18n'
import { ElMessageBox, ElMessage } from 'element-plus'

const router = useRouter()
const route = useRoute()
const i18n = useI18n()
// 数据相关
const tableData = ref([])
const total = ref(0)
const page = ref(1)
const size = ref(10)
// 获取数据的方法
const getListData = async () => {
  const result = await costListDisplay({
    table: 'coefficientinformation',
    page: page.value,
    size: size.value
  })
  tableData.value = result.list
  total.value = result.total
}
getListData()

// 分页相关，size改变触发
const handleSizeChange = (currentSize) => {
  size.value = currentSize
  getListData()
}

// 页码改变触发
const handleCurrentChange = (currentPage) => {
  page.value = currentPage
  getListData()
}

// 处理导入用户后数据不重新加载的问题
// appmain 中使用 keepAlive 进行了组件缓存，需要监听 onActivated 事件，重新获取数据即可
onActivated(getListData)

// 监听当前路由
watch(
  () => router.currentRoute.value,
  (newValue) => {
    console.log('newValue', newValue)
    console.log('routePath', route.path)
    // location.reload()
    // getListData()
  },
  { immediate: true }
)
onMounted(() => {
  getListData()
})

const onRemoveClick = (row) => {
  ElMessageBox.confirm(
    i18n.t('msg.cost.dialogTitle1') + row.id + i18n.t('msg.cost.dialogTitle2'),
    { type: 'warning' }
  )
    .then(async () => {
      await costDel({ table: 'coefficientinformation', id: row.id })
      ElMessage.success(i18n.t('msg.excel.removeSuccess'))
      // 重新渲染数据
      getListData()
    })
    .catch((error) => error)
}

const onShowClick = (id) => {
  router.push(`/basics/coefficientInformationInfo/${id}`)
}

// 新增记录
const onAddClick = () => {
  // const id = ''
  // console.log(id)
  router.push('/basics/coefficientInformationCreate')
}
// 编辑记录
const onEditClick = (id) => {
  router.push(`/basics/coefficientInformationCreateEdit/${id}`)
}
</script>

<style lang="scss" scoped>
.article-ranking-container {
  .header {
    margin-bottom: 20px;
    .dynamic-box {
      display: flex;
      align-items: center;
      margin-bottom: 10px;
      .title {
        margin-right: 20px;
        font-size: 14px;
        font-weight: bold;
      }
    }
  }

  ::v-deep .el-table__row {
    cursor: pointer;
  }

  .pagination {
    margin-top: 20px;
    text-align: center;
  }
}
</style>
