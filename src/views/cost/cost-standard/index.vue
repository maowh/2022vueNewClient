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
        <el-table-column prop="id" :label="$t('msg.cost.id')"></el-table-column>
        <el-table-column
          prop="systemEngineer"
          :label="$t('msg.cost.systemEngineer')"
        ></el-table-column>
        <el-table-column
          prop="seniorSystemEngineer"
          :label="$t('msg.cost.seniorSystemEngineer')"
        ></el-table-column>
        <el-table-column
          prop="dbaEngineer"
          :label="$t('msg.cost.dbaEngineer')"
        ></el-table-column>
        <el-table-column
          prop="seniorDbaEngineer"
          :label="$t('msg.cost.seniorDbaEngineer')"
        ></el-table-column>
        <el-table-column
          prop="softwareEngineer"
          :label="$t('msg.cost.softwareEngineer')"
        ></el-table-column>
        <el-table-column
          prop="seniorSoftwareEngineer"
          :label="$t('msg.cost.seniorSoftwareEngineer')"
        ></el-table-column>
        <el-table-column
          prop="intermediateSap"
          :label="$t('msg.cost.intermediateSap')"
        ></el-table-column>
        <el-table-column
          prop="seniorSap"
          :label="$t('msg.cost.seniorSap')"
        ></el-table-column>
        <el-table-column
          :label="$t('msg.cost.action')"
          fixed="right"
          width="160"
        >
          <template #default="{ row }">
            <el-button type="info" size="mini" @click="onEditClick(row)">{{
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
    <!-- v-model进行双向数据绑定，roleDialogVisible将值传给子组件同时也接收子组件传过来的数据 -->
    <coststandardDialog
      v-model="classificationDialogVisible"
      :id="selectId"
      @updateList="getListData"
    ></coststandardDialog>
  </div>
</template>

<script setup>
import { ref, onActivated, watch } from 'vue'
import { costList, costDel } from '@/api/cost'
// import { useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n'
import { ElMessageBox, ElMessage } from 'element-plus'
import coststandardDialog from './components/coststandardDialog.vue'

// const router = useRouter()
const i18n = useI18n()
// 数据相关
const tableData = ref([])
const total = ref(0)
const page = ref(1)
const size = ref(5)
// 获取数据的方法
const getListData = async () => {
  const result = await costList({
    table: 'coststandard',
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

const onRemoveClick = (row) => {
  ElMessageBox.confirm(
    i18n.t('msg.cost.dialogTitle1') + row.id + i18n.t('msg.cost.dialogTitle2'),
    { type: 'warning' }
  )
    .then(async () => {
      await costDel({ table: 'coststandard', id: row.id })
      ElMessage.success(i18n.t('msg.excel.removeSuccess'))
      // 重新渲染数据
      getListData()
    })
    .catch((error) => error)
}

// 新增编辑记录
const classificationDialogVisible = ref(false)
const selectId = ref('')

// 关闭dialog时重置selectId
watch(classificationDialogVisible, (val) => {
  if (!val) selectId.value = ''
})

// const onShowClick = (id) => {
//   console.log(id)
//   router.push(`/user/info/${id}`)
// }

// 新增记录
const onAddClick = () => {
  classificationDialogVisible.value = true
  // console.log('selectId.value')
}
// 编辑记录
const onEditClick = (row) => {
  classificationDialogVisible.value = true
  selectId.value = row.id
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
