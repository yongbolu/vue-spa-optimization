<template>
  <div class="wrapper" :class="{hideSidebar:isCollapse}">
    <sidebar class="sidebar-container"></sidebar>
    <el-container class="main-container">
      <el-header height="60px">
        <top-navbar></top-navbar>
      </el-header>
      <el-main style="position: relative">
        <dashboard-content></dashboard-content>
      </el-main>
    </el-container>
  </div>
</template>

<script>
  import TopNavbar from './TopNavbar.vue'
  import DashboardContent from './Content.vue'
  import Sidebar from './Sidebar'

  export default {
    components: {
      TopNavbar,
      DashboardContent,
      Sidebar
    },
    computed: {
      isCollapse () {
        return this.$store.state.sidebar
      }
    },
    methods: {}
  }
</script>
<style scoped lang="scss">
  .wrapper {
    position: relative;
    height: 100%;
    width: 100%;
    .el-header {
      padding: 0;
    }
  }

</style>
