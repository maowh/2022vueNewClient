<template>
  <div class="login-container">
    <el-form
      class="login-form"
      ref="loginFormRef"
      :model="loginForm"
      :rules="loginRules"
    >
      <div class="title-container">
        <h3 class="title">{{ $t('msg.login.title') }}</h3>
        <LangSelect class="lang-select" effect="light"></LangSelect>
      </div>

      <!-- el-form-item的属性，在定义了 validate、resetFields 的方法时，该属性是必填的 -->
      <el-form-item prop="username">
        <!--  -->
        <!-- <SvgIcon icon="https://res.lgdsunday.club/user.svg"></SvgIcon> -->
        <!-- </span> -->
        <!-- <span class="svg-container">
          <el-icon> <Avatar></Avatar> </el-icon>
        </span> -->
        <span class="svg-container">
          <svg-icon icon="user" />
        </span>
        <el-input
          name="username"
          v-model="loginForm.username"
          placeholder="用户名"
          type="text"
        ></el-input>
      </el-form-item>
      <el-form-item prop="password">
        <span class="svg-container">
          <!-- <el-icon>
            <Avatar></Avatar>
          </el-icon> -->
          <svg-icon icon="password" />
        </span>
        <el-input
          v-model="loginForm.password"
          placeholder="密码"
          name="password"
          :type="passwordType"
        ></el-input>
        <!-- <svg-icon  icon="eye" /> -->
        <span class="show-pwd">
          <svg-icon
            :icon="passwordType === 'password' ? 'eye' : 'eye-open'"
            @click="onChangePwdType"
          ></svg-icon>
        </span>
      </el-form-item>
      <el-button
        type="primary"
        style="width: 100%; margin-bottom: 30px"
        :loading="loading"
        @click="handleLogin"
        >{{ $t('msg.login.loginBtn') }}</el-button
      >
      <!-- <div class="tips" v-html="$t('msg.login.desc')"></div> -->
    </el-form>
  </div>
</template>

<script setup>
// import { Avatar } from '@element-plus/icons'
// import SvgIcon from '@/components/SvgIcon'
import { ref } from 'vue'
import { validatePassword } from './rules'
import { useStore } from 'vuex'
import LangSelect from '@/components/LangSelect/index'
import { useI18n } from 'vue-i18n'
import { ElMessage } from 'element-plus'

// 验证规则
const i18n = useI18n()

// 数据源
const loginForm = ref({
  // username: 'super-admin',
  // password: '123456'
})

// 验证规则
const loginRules = ref({
  username: [
    {
      required: true,
      trigger: 'blur',
      message: i18n.t('msg.login.usernameRule')
    }
  ],
  password: [
    {
      required: true,
      trigger: 'blur',
      validator: validatePassword()
    }
  ]
})

// 处理密码框文本显示状态
const passwordType = ref('password')
const onChangePwdType = () => {
  if (passwordType.value === 'password') {
    passwordType.value = 'text'
  } else {
    passwordType.value = 'password'
  }
}

// 登录动作处理
const loading = ref(false)
const loginFormRef = ref(null)
const store = useStore()
const handleLogin = () => {
  loginFormRef.value.validate((valid) => {
    if (!valid) return
    loading.value = true
    store
      .dispatch('user/login', loginForm.value)
      .then(() => {
        loading.value = false
        // console.log('已登录')
        // TODO:登录后操作
      })
      .catch((err) => {
        ElMessage.warning('账号密码错误，请重新输入登录！')
        console.log(err)
        loading.value = false
      })
  })
}
</script>

<style lang="scss" scoped>
$bg: #2d3a4b;
$dark_gray: #889aa4;
$light_gray: #eee;
$cursor: #fff;

.login-container {
  min-height: 100%;
  width: 100%;
  background-color: $bg;
  overflow: hidden;

  .login-form {
    position: relative;
    width: 520px;
    max-width: 100%;
    padding: 160px 35px 0;
    margin: 0 auto;
    overflow: hidden;

    ::v-deep .el-form-item {
      border: 1px solid rgba(255, 255, 255, 0.1);
      background: rgba(0, 0, 0, 0.1);
      border-radius: 5px;
      color: #454545;
    }

    ::v-deep .el-input {
      display: inline-block;
      height: 47px;
      width: 85%;

      input {
        background: transparent;
        border: 0px;
        -webkit-appearance: none;
        border-radius: 0px;
        padding: 12px 5px 12px 15px;
        color: $light_gray;
        height: 47px;
        caret-color: $cursor;
      }
    }
    .tips {
      font-size: 16px;
      color: white;
      line-height: 24px;
    }
  }

  .svg-container {
    padding: 6px 5px 6px 15px;
    color: $dark_gray;
    vertical-align: middle;
    display: inline-block;
  }

  .title-container {
    position: relative;

    .title {
      font-size: 26px;
      color: $light_gray;
      margin: 0px auto 40px auto;
      text-align: center;
      font-weight: bold;
    }
    ::v-deep .lang-select {
      position: absolute;
      top: 4px;
      right: 0;
      background-color: #fff;
      font-size: 22px;
      padding: 4px;
      border-radius: 4px;
      cursor: pointer;
    }
  }

  .show-pwd {
    position: absolute;
    right: 10px;
    top: 7px;
    font-size: 16px;
    color: $dark_gray;
    cursor: pointer;
    user-select: none;
  }
}
</style>
