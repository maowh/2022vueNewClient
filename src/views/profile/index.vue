<template>
  <div class="my-container">
    <el-row>
      <el-col :span="6">
        <project-card class="user-card" :features="featureData"></project-card>
      </el-col>
      <el-col :span="18">
        <el-card>
          <el-tabs v-model="activeName">
            <el-tab-pane :label="$t('msg.profile.feature')" name="feature">
              <Feature :features="featureData" />
            </el-tab-pane>
            <!-- <el-tab-pane :label="$t('msg.profile.chapter')" name="chapter">
              <Chapter />
            </el-tab-pane> -->
            <el-tab-pane :label="$t('msg.profile.author')" name="author">
              <Author />
            </el-tab-pane>
            <el-tab-pane :label="$t('msg.profile.changepwd')" name="changepwd">
              <ChangePwd />
            </el-tab-pane>
          </el-tabs>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<script setup>
import ProjectCard from './components/ProjectCard.vue'
// import Chapter from './components/Chapter.vue'
import Feature from './components/Feature.vue'
import Author from './components/Author.vue'
import ChangePwd from './components/ChangePwd.vue'
import { feature } from '@/api/sys'
import { ref } from 'vue'
const activeName = ref('feature')

const featureData = ref([])
const getFeatureData = async () => {
  featureData.value = await feature()
  console.log(featureData.value)
}
getFeatureData()
</script>

<style lang="scss" scoped>
.my-container {
  .user-card {
    margin-right: 20px;
  }
}
</style>
