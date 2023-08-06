<template>
  <div class="mt-4">
    <el-input
      v-model="originalPwd"
      placeholder="请输入原密码"
      type="password"
      show-password
      minlength="6"
    >
      <template #prepend>原密码：&nbsp;&nbsp;&nbsp;&nbsp;</template>
    </el-input>
  </div>
  <div class="mt-4">
    <el-input
      v-model="newPwd"
      placeholder="请输入新密码"
      type="password"
      show-password
    >
      <template #prepend>新密码：&nbsp;&nbsp;&nbsp;&nbsp;</template>
    </el-input>
  </div>
  <div class="mt-4">
    <el-input
      v-model="repeatPwd"
      placeholder="请再次输入新密码"
      type="password"
      show-password
    >
      <template #prepend>确认密码：</template>
    </el-input>
  </div>
  <div>
    <el-row class="mb-4">
      <el-button type="primary" size="small" @click="onSubmit">确定</el-button>
      <el-button size="small" @click="onReset">重置</el-button>
    </el-row>
  </div>
  <div>
    新密码校验规则：密码中必须包含字母、数字、特殊符号，至少8个字符最多20个
  </div>
</template>

<script setup>
import { ref } from 'vue'
import store from '@/store'
import { getOriginalPwd, getUpdatePwd } from '@/api/sys'
import { ElMessage } from 'element-plus'
import { isComplexPwd } from '@/utils/validate.js'

const originalPwd = ref('')
const newPwd = ref('')
const repeatPwd = ref('')
console.log(store.getters.userInfo.username)

const onSubmit = async () => {
  const user = await getOriginalPwd({
    username: store.getters.userInfo.username,
    password: originalPwd.value
  })
  if (user) {
    if (newPwd.value === repeatPwd.value) {
      console.log('1')
      // 密码中必须包含字母、数字、特殊符号，至少8个字符最多20个
      if (isComplexPwd(newPwd.value)) {
        await getUpdatePwd({
          username: store.getters.userInfo.username,
          password: newPwd.value
        }).then(() => {
          onClear()
          ElMessage.success('已更新用户密码，请重新登录系统！')
        })
      } else {
        onClear()
        ElMessage.warning('输入的密码不符合要求，请确认！')
      }
    } else {
      onClear()
      ElMessage.warning('输入的新密码和确认的新密码不一致，请确认！')
    }
  } else {
    onClear()
    ElMessage.warning('输入的原始密码不正确！')
  }
}

const onClear = () => {
  originalPwd.value = ''
  newPwd.value = ''
  repeatPwd.value = ''
}

const onReset = () => {
  onClear()
}
</script>

<style lang="scss" scoped>
.input-with-select .el-input-group__prepend {
  background-color: var(--el-fill-color-blank);
}
.mt-4 {
  width: 300px;
  margin-bottom: 5px;
}
.mb-4 {
  margin-top: 10px;
  margin-bottom: 20px;
}
</style>
