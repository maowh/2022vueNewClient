<template>
  <div class="user-manage-container">
    <el-card class="header">
      <div>
        <el-button
          type="primary"
          @click="onImportExcelClick"
          v-permission="['importUser']"
          >{{ $t('msg.excel.importExcel') }}</el-button
        >
        <el-button type="success" @click="onToExcelClick">{{
          $t('msg.excel.exportExcel')
        }}</el-button>
      </div>
    </el-card>
    <el-card>
      <el-table :data="tableData" border style="width: 100%">
        <el-table-column label="#" type="index"></el-table-column>
        <el-table-column
          prop="username"
          :label="$t('msg.excel.name')"
        ></el-table-column>
        <el-table-column
          prop="mobile"
          :label="$t('msg.excel.mobile')"
        ></el-table-column>
        <el-table-column :label="$t('msg.excel.avatar')" align="center">
          <template v-slot="{ row }">
            <el-image
              class="avatar"
              :src="row.avatar"
              :preview-src-list="[row.avatar]"
            ></el-image></template
        ></el-table-column>
        <el-table-column :label="$t('msg.excel.role')">
          <template #default="{ row }">
            <div v-if="row.role && row.role.length > 0">
              <el-tag v-for="item in row.role" :key="item.id" size="mini">{{
                item.title
              }}</el-tag>
            </div>
            <div v-else>
              <el-tag size="mini">{{ $t('msg.excel.defaultRole') }}</el-tag>
            </div>
            <!-- <el-tag size="mini">{{ row.title }}</el-tag> -->
          </template></el-table-column
        >
        <el-table-column :label="$t('msg.excel.openTime')">
          <template #default="{ row }">
            {{ $filters.dateFilter(row.openTime) }}
          </template>
        </el-table-column>
        <el-table-column
          :label="$t('msg.excel.action')"
          fixed="right"
          width="260"
        >
          <template #default="{ row }">
            <el-button
              type="primary"
              size="mini"
              @click="onShowClick(row.id)"
              >{{ $t('msg.excel.show') }}</el-button
            >
            <el-button
              type="info"
              size="mini"
              @click="onShowRoleClick(row)"
              v-permission="['distributeRole']"
              >{{ $t('msg.excel.showRole') }}</el-button
            >
            <el-button
              type="danger"
              size="mini"
              @click="onRemoveClick(row)"
              v-permission="['removeUser']"
              >{{ $t('msg.excel.remove') }}</el-button
            >
          </template>
        </el-table-column>
      </el-table>
      <el-pagination
        class="pagination"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="page"
        :page-sizes="[2, 5, 10, 20]"
        :page-size="size"
        layout="total,sizes,prev,pager,next,jumper"
        :total="total"
      ></el-pagination>
    </el-card>
    <!-- v-model进行双向数据绑定，roleDialogVisible将值传给子组件同时也接收子组件传过来的数据 -->
    <ExportToExcel v-model="exportToExcelVisible"></ExportToExcel>
    <RolesDialog
      v-model="roleDialogVisible"
      :userId="selectUserId"
      @updateRole="getListData"
    ></RolesDialog>
  </div>
</template>

<script setup>
import { ref, onActivated, watch } from 'vue'
import { getUserList, deleteUser } from '@/api/sys'
import { useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n'
import { ElMessageBox, ElMessage } from 'element-plus'
import ExportToExcel from './components/Export2Excel.vue'
import RolesDialog from './components/roles.vue'

const router = useRouter()
const i18n = useI18n()
// 数据相关
const tableData = ref([])
const total = ref(0)
const page = ref(1)
const size = ref(5)
// 获取数据的方法
const getListData = async () => {
  const result = await getUserList({
    page: page.value,
    size: size.value
  })
  tableData.value = result.list
  total.value = result.list.length
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

// excel导入点击事件
const onImportExcelClick = () => {
  router.push('/user/import')
}

// 处理导入用户后数据不重新加载的问题
// appmain 中使用 keepAlive 进行了组件缓存，需要监听 onActivated 事件，重新获取数据即可
onActivated(getListData)

const onRemoveClick = (row) => {
  ElMessageBox.confirm(
    i18n.t('msg.excel.dialogTitle1') +
      row.username +
      i18n.t('msg.excel.dialogTitle2'),
    { type: 'warning' }
  )
    .then(async () => {
      await deleteUser(row.id)
      ElMessage.success(i18n.t('msg.excel.removeSuccess'))
      // 重新渲染数据
      getListData()
    })
    .catch((error) => error)
}

// 显示用户角色列表
const roleDialogVisible = ref(false)
const selectUserId = ref('')
const onShowRoleClick = (row) => {
  roleDialogVisible.value = true
  selectUserId.value = row.id
}

// 关闭dialog时重置selectUserId
watch(roleDialogVisible, (val) => {
  if (!val) selectUserId.value = ''
})

const onShowClick = (id) => {
  router.push(`/user/info/${id}`)
}
// excel导出点击事件
const exportToExcelVisible = ref(false)
const onToExcelClick = () => {
  exportToExcelVisible.value = true
}
</script>

<style lang="scss" scoped>
.user-manage-container {
  .header {
    margin-bottom: 22px;
    text-align: right;
  }
  ::v-deep .avatar {
    width: 60px;
    height: 60px;
    border-radius: 50%;
  }

  ::v-deep .el-tag {
    margin-right: 6px;
  }

  .pagination {
    margin-top: 20px;
    text-align: center;
  }
}
</style>
