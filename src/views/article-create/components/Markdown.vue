<template>
  <div class="markdown-container">
    <!-- 渲染区 -->
    <div id="markdown-box"></div>
    <!-- 按钮 -->
    <div class="bottom">
      <el-button type="primary" @click="onSubmitClick">{{
        $t('msg.article.commit')
      }}</el-button>
    </div>
  </div>
</template>

<script setup>
import { onMounted, defineProps, defineEmits, watch } from 'vue'
import MKEditor from '@toast-ui/editor'
// 导入样式
import '@toast-ui/editor/dist/toastui-editor.css'
// 导入国际化
import '@toast-ui/editor/dist/i18n/zh-cn'
import { useStore } from 'vuex'
import { watchSwitchLang } from '@/utils/i18n'
import { commitArticle, editArticle } from './commit'
import dayjs from 'dayjs'
import { useRouter } from 'vue-router'

const props = defineProps({
  title: {
    required: true,
    type: String
  },
  detail: {
    type: Object
  }
})

const emits = defineEmits(['onSuccess'])
// Editor实例
let mkEditor
let el
onMounted(() => {
  el = document.querySelector('#markdown-box')
  initEditor()
})
const store = useStore()
// 调用了DOM的el，需要在DOM渲染完成的生命周期onMounted再调用
const initEditor = () => {
  mkEditor = new MKEditor({
    // el
    el,
    // 高度
    height: '500px',
    // 样式，竖向显示
    previewStyle: 'vertical',
    // 国际化
    language: store.getters.language === 'zh' ? 'zh-CN' : 'en'
  })
  mkEditor.getMarkdown()
}
watchSwitchLang(() => {
  if (!el) return
  // 保存已输入的文本
  const htmlStr = mkEditor.getHTML()
  // 销毁mkEditor组件
  mkEditor.destroy()
  // 重新初始化组件
  initEditor()
  // 重新填写已保存的文本
  mkEditor.setHTML(htmlStr)
})

const router = useRouter()
const onSubmitClick = async () => {
  console.log(mkEditor.getHTML().replace(/<[^>]+>/g, ''))
  const user = await store.dispatch('user/getUserInfo')
  if (props.detail && props.detail.id) {
    await editArticle({
      id: props.detail.id,
      title: props.title,
      desc: mkEditor.getHTML().replace(/<[^>]+>/g, '')
    })
  } else {
    await commitArticle([
      {
        title: props.title,
        author: user.username,
        publicData: dayjs(`${new Date()}`).format('YYYY-MM-DD'),
        desc: mkEditor.getHTML().replace(/<[^>]+>/g, '')
      }
    ])
  }
  mkEditor.reset()
  emits('onSuccess')
  router.push('/article/ranking')
}

// 编辑相关，子组件使用watch来监控父组件传值的变化，如果有值则更新mkEditor
watch(
  () => props.detail,
  (val) => {
    if (val && val.desc) {
      //   mkEditor.setHTML(val.desc)
      mkEditor.setHTML(val.desc)
    }
  }
)
</script>

<style lang="scss" scoped>
.markdown-container {
  .bottom {
    margin-top: 20px;
    text-align: right;
  }
}
</style>
