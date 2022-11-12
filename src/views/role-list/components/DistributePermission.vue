<template>
  <el-dialog
    :title="$t('msg.excel.roleDialogTitle')"
    :model-value="modelValue"
    @close="closed"
  >
    <el-tree
      ref="treeRef"
      :data="allPermission"
      :props="defaultProps"
      node-key="id"
      show-checkbox
      check-strictly
      default-expand-all
    >
    </el-tree>
    <template #footer>
      <span class="dialog-footer">
        <el-button @click="closed">{{ $t('msg.universal.cancel') }}</el-button>
        <el-button type="primary" @click="onConfirm">{{
          $t('msg.universal.confirm')
        }}</el-button>
      </span>
    </template>
  </el-dialog>
</template>

<script setup>
import { defineProps, defineEmits, ref, watch } from 'vue'
import { findPermission, permissionList } from '@/api/role'

const props = defineProps({
  modelValue: {
    type: Boolean,
    required: true
  },
  roleId: {
    type: String,
    required: true
  }
})
// 属性结构配置
const defaultProps = {
  children: 'children',
  label: 'permissionName'
}

const emits = defineEmits(['update:modelValue'])

/**
    确定按钮点击事件
   */
const onConfirm = async () => {
  console.log(treeRef.value.getCheckedKeys())
  closed()
}

/**
 * 关闭
 */
const closed = () => {
  emits('update:modelValue', false)
}

// 所有权限
const allPermission = ref([])
const getPermissionList = async () => {
  const allPermissionTmp = await permissionList()
  console.log(allPermissionTmp)
  const checkedKeysTmp = []
  for (let i = 0; i < allPermissionTmp.length; i++) {
    if (allPermissionTmp[i].children !== undefined) {
      checkedKeysTmp.push({
        id: allPermissionTmp[i].permissionId,
        permissionName: allPermissionTmp[i].permissionName,
        permissionMark: allPermissionTmp[i].permissionMark,
        permissionDesc: allPermissionTmp[i].permissionDesc,
        children: []
      })
      for (let j = 0; j < allPermissionTmp[i].children.length; j++) {
        console.log(allPermissionTmp[i].children[j].permissionFunctionName)
        checkedKeysTmp[i].children.push({
          id:
            allPermissionTmp[i].permissionId +
            '-' +
            allPermissionTmp[i].children[j].permissionFunctionId,
          permissionFunctionName:
            allPermissionTmp[i].children[j].permissionFunctionName,
          permissionFunctionMark:
            allPermissionTmp[i].children[j].permissionFunctionMark,
          permissionFunctionDesc:
            allPermissionTmp[i].children[j].permissionFunctionDesc
        })
      }
    } else {
      checkedKeysTmp.push({
        id: allPermissionTmp[i].permissionId,
        permissionName: allPermissionTmp[i].permissionName,
        permissionMark: allPermissionTmp[i].permissionMark,
        permissionDesc: allPermissionTmp[i].permissionDesc
      })
    }
  }
  console.log(checkedKeysTmp)
  allPermission.value = checkedKeysTmp
}
getPermissionList()

// 获取当前用户角色的权限
// tree节点
const treeRef = ref()
const getRolePermission = async () => {
  const checkedKeys = await findPermission(props.roleId)
  const checkedKeysTmp = []
  checkedKeys.forEach((item) => {
    if (item.permissionfunctionId !== null) {
      checkedKeysTmp.push(item.permissionId + '-' + item.permissionfunctionId)
    } else {
      checkedKeysTmp.push(item.permissionId)
    }
  })
  console.log(checkedKeysTmp)
  treeRef.value.setCheckedKeys(checkedKeysTmp)
  console.log(treeRef.value.getCheckedKeys())
}
watch(
  () => props.roleId,
  (val) => {
    if (val) getRolePermission()
  }
)
</script>
