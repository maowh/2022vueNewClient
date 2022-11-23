<template>
  <div class="">
    <el-card>
      <el-table :data="allRoles" border style="width: 100%">
        <el-table-column :label="$t('msg.role.index')" type="index" width="120">
        </el-table-column>
        <el-table-column :label="$t('msg.role.name')" prop="title">
        </el-table-column>
        <el-table-column :label="$t('msg.role.desc')" prop="describe">
        </el-table-column>
        <el-table-column
          :label="$t('msg.role.action')"
          prop="action"
          width="260"
          #default="{ row }"
        >
          <el-button
            type="primary"
            size="mini"
            @click="onDistributePermissionClick(row)"
            v-permission="['distributePermission']"
          >
            {{ $t('msg.role.assignPermissions') }}
          </el-button>
        </el-table-column>
      </el-table>
    </el-card>
    <DistributePermission
      v-model="distributePermissionVisible"
      :roleId="selectRoleId"
    ></DistributePermission>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { roleList } from '@/api/role'
import DistributePermission from './components/DistributePermission.vue'

const allRoles = ref([])
const getRoleList = async () => {
  allRoles.value = await roleList()
}
getRoleList()

// 分配权限
const selectRoleId = ref('')
const distributePermissionVisible = ref(false)
const onDistributePermissionClick = (row) => {
  selectRoleId.value = row.id
  distributePermissionVisible.value = true
}
</script>

<style lang="scss" scoped></style>
