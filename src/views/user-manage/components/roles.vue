<template>
  <el-dialog
    :title="$t('msg.excel.roleDialogTitle')"
    :model-value="modelValue"
    @close="closed"
  >
    <el-checkbox-group v-model="userRoleTitleList">
      <el-checkbox
        v-for="item in allRoleList"
        :key="item.id"
        :label="item.title"
      ></el-checkbox
    ></el-checkbox-group>

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
import { roleList, findRole, updateRole } from '@/api/role'
import { ElMessage } from 'element-plus'
import { useI18n } from 'vue-i18n'

// defineProps({
//   modelValue: {
//     type: Boolean,
//     required: true
//   }
// })

const props = defineProps({
  modelValue: {
    type: Boolean,
    required: true
  },
  userId: {
    type: String,
    required: true
  }
})

// 确定按钮点击事件
const i18n = useI18n()

// 所有角色
const allRoleList = ref([])
// 获取所有角色数据的方法
const getListData = async () => {
  allRoleList.value = await roleList()
}
getListData()

// 当前用户角色
const userRoleTitleList = ref([])
// 获取当前用户角色
const getUserRoles = async () => {
  const res = await findRole(props.userId)
  console.log(res)
  userRoleTitleList.value = res.map((item) => item.title)
  // console.log(userRoleTitleList.value)
}
// 从父组件传值，当父组件传过来的userId不为空时候就获取数据库中该用户的角色
watch(
  () => props.userId,
  (val) => {
    if (val) getUserRoles()
  }
)

const emits = defineEmits(['update:modelValue', 'updateRole'])
// 确定按钮点击事件
const onConfirm = async () => {
  const roleIds = userRoleTitleList.value.map((title) => {
    return allRoleList.value.find((role) => role.title === title).id
  })
  const userRoles = []
  for (let i = 0; i < roleIds.length; i++) {
    userRoles.push({ userId: props.userId, roleId: roleIds[i] })
  }
  // console.log(userRoles)
  await updateRole(userRoles)
  ElMessage.success(i18n.t('msg.role.updateRoleSuccess'))
  // 角色更新成功
  emits('updateRole')
  closed()
}
// 关闭
const closed = () => {
  emits('update:modelValue', false)
}
</script>

<style lang="scss" scoped></style>
