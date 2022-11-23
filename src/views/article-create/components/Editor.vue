<template>
  <div class="editor-container">
    <div id="editor-box"></div>
    <div class="bottom">
      <el-button type="primary" @click="onSubmitClick">{{
        $t('msg.article.commit')
      }}</el-button>
    </div>
  </div>
</template>

<script setup>
import E from 'wangeditor'
import { onMounted, defineProps, defineEmits, watch } from 'vue'
import i18next from 'i18next'
import { useStore } from 'vuex'
import { commitArticle, editArticle } from './commit'
import dayjs from 'dayjs'

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

const store = useStore()
// Editor实例
let editor
// 处理离开页面切换语言导致 dom 无法被获取
let el
onMounted(() => {
  el = document.querySelector('#editor-box')
  initEditor()
})

const initEditor = () => {
  editor = new E(el)
  editor.config.zIndex = 1
  // 菜单栏提示
  editor.config.showMenuTooltips = true
  editor.config.menuTooltipPosition = 'down'

  // 国际化相关处理
  editor.config.lang = store.getters.language === 'zh' ? 'zh-CN' : 'en'
  editor.i18next = i18next

  editor.create()
}

// 编辑相关
watch(
  () => props.detail,
  (val) => {
    if (val && val.desc) {
      editor.txt.html(val.desc)
    }
  },
  {
    immediate: true
  }
)

const onSubmitClick = async () => {
  const user = await store.dispatch('user/getUserInfo')
  if (props.detail && props.detail.id) {
    // 编辑文章
    await editArticle({
      // id: props.detail.id,
      // title: props.title,
      // desc: editor.txt.html()
      id: props.detail.id,
      title: props.title,
      desc: editor.txt.html().replace(/<[^>]+>/g, '')
    })
  } else {
    // 创建文章
    await commitArticle({
      // title: props.title,
      // desc: editor.txt.html()
      title: props.title,
      author: user.username,
      publicData: dayjs(`${new Date()}`).format('YYYY-MM-DD'),
      desc: editor.txt.html().replace(/<[^>]+>/g, '')
    })
  }

  editor.txt.html('')
  emits('onSuccess')
}
</script>

<style lang="scss" scoped>
.editor-container {
  .bottom {
    margin-top: 20px;
    text-align: right;
  }
}
</style>
