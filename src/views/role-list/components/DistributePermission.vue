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
      highlight-current
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
import {
  findPermission,
  permissionList,
  distributePermission
} from '@/api/role'
import { ElMessage } from 'element-plus'
import { useI18n } from 'vue-i18n'

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
const i18n = useI18n()
const onConfirm = async () => {
  const treeRefConfirm = []
  const treeRefTmp = treeRef.value.getCheckedKeys()
  for (let i = 1; i < treeRefTmp.length; i++) {
    console.log(treeRefTmp[i])
    if (treeRefTmp[i].toString().search('-') !== -1) {
      treeRefConfirm.push({
        roleId: props.roleId,
        permissionId: treeRefTmp[i].split('-')[0],
        permissionfunctionId: treeRefTmp[i].split('-')[1]
      })
    } else {
      treeRefConfirm.push({
        roleId: props.roleId,
        permissionId: treeRefTmp[i],
        permissionfunctionId: ''
      })
    }
  }
  await distributePermission(treeRefConfirm)
  ElMessage.success(i18n.t('msg.role.updateRoleSuccess'))
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
      console.log(allPermissionTmp[i].children.length)
      for (let j = 0; j < allPermissionTmp[i].children.length; j++) {
        console.log(allPermissionTmp[i].children[j].permissionFunctionName)
        checkedKeysTmp[i].children.push({
          id:
            allPermissionTmp[i].permissionId +
            '-' +
            allPermissionTmp[i].children[j].permissionFunctionId,
          permissionName:
            allPermissionTmp[i].children[j].permissionFunctionName,
          permissionMark:
            allPermissionTmp[i].children[j].permissionFunctionMark,
          permissionDesc: allPermissionTmp[i].children[j].permissionFunctionDesc
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
  allPermission.value = checkedKeysTmp
}
getPermissionList()

// 获取当前用户角色的权限
// tree节点
const treeRef = ref()
const getRolePermission = async () => {
  const checkedKeys = await findPermission(props.roleId)
  const checkedKeysTmp = []
  const checkedTest = []
  console.log(checkedKeys)
  checkedKeys.forEach((item) => {
    if (item.permissionfunctionId !== null) {
      if (checkedTest.permissionId !== item.permissionId) {
        checkedTest.push(item.permissionId)
        checkedKeysTmp.push(item.permissionId)
        checkedKeysTmp.push(item.permissionId + '-' + item.permissionfunctionId)
      } else {
        checkedKeysTmp.push(item.permissionId + '-' + item.permissionfunctionId)
      }
    } else {
      checkedKeysTmp.push(item.permissionId)
    }
  })
  treeRef.value.setCheckedKeys(checkedKeysTmp)
}
watch(
  () => props.roleId,
  (val) => {
    if (val) getRolePermission()
  }
)
</script>
