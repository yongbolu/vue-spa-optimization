<template>
  <div class="header-top">
    <div>
      <button class="sidebar-btn" @click="toggleSideBar">
        <svg-icon :class-name="isCollapse ? 'close':''" icon-class="hanbaobao"></svg-icon>
      </button>
      <breadcrumb class="bread-crumb"></breadcrumb>
    </div>
    <div class='navbar-right'>
      <el-dropdown trigger="click" size="small">
        <el-button type="text">管理员<i class="el-icon-caret-bottom el-icon--right"></i></el-button>
        <el-dropdown-menu slot='dropdown'>
          <el-dropdown-item>
            <router-link to='/'>
              <div>首页</div>
            </router-link>
          </el-dropdown-item>
          <el-dropdown-item>
            <div @click="dialogPassWordVisible=true">修改密码</div>
          </el-dropdown-item>
          <el-dropdown-item divided><span @click='loginOut' style='display:block;'>退出登录</span></el-dropdown-item>
        </el-dropdown-menu>
      </el-dropdown>
    </div>
    <!-- 修改密码弹窗 -->
    <el-dialog
      title="修改密码"
      :close-on-click-modal="false"
      :visible.sync="dialogPassWordVisible">
      <el-form ref="passForm" :model="passForm" :rules="rulePassForm" label-width="80px" size="medium">
        <el-form-item label="原密码" prop="oldPsw">
          <el-input v-model="passForm.oldPsw" type="password" placeholder="请输入原密码"></el-input>
        </el-form-item>
        <el-form-item label="新密码" prop="theValue" required>
          <el-input v-model="passForm.theValue" type="password" placeholder="请输入新密码"></el-input>
        </el-form-item>
        <el-form-item label="确认密码" prop="checkPass" required>
          <el-input v-model="passForm.checkPass" type="password" placeholder="请确认密码"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button :loading="passLoading" type="primary" @click="submitUserPassWord">修&nbsp;&nbsp;改</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
  import Breadcrumb from '@/components/Breadcrumb'
  import { modifyPwd } from '@/api/layout'

  export default {
    components: { Breadcrumb },
    data () {
      const validatePass = (rule, value, callback) => {
        // const reg = /^(?![^a-zA-Z]+$)(?!\D+$)/   // 密码必须包含数字和字母 !reg.test(value)
        if (value.length < 6 || value.length > 12) {
          callback(new Error('密码长度为6-12位'))
        } else {
          if (this.passForm.checkPass !== '') {
            this.$refs.passForm.validateField('checkPass')
          }
          callback()
        }
      }
      const validatePass2 = (rule, value, callback) => {
        if (value === '') {
          callback(new Error('请再次输入密码'))
        } else if (value !== this.passForm.theValue) {
          callback(new Error('两次输入密码不一致!'))
        } else {
          callback()
        }
      }
      return {
        dialogPassWordVisible: false,
        passLoading: false,
        passForm: {
          oldPsw: '',
          theValue: '',
          checkPass: ''
        },
        rulePassForm: {
          oldPsw: [{ required: true, message: '请输入原密码', trigger: 'blur' }],
          theValue: [{ validator: validatePass, trigger: 'blur' }],
          checkPass: [{ validator: validatePass2, trigger: 'blur' }]
        }
      }
    },
    computed: {
      isCollapse () {
        return this.$store.state.sidebar
      }
    },
    methods: {
      toggleSideBar () {
        this.$store.commit('TOGGLE_SIDEBAR')
      },
      loginOut () {
        this.$store.dispatch('logOut').then(() => {
          location.reload()// 为了重新实例化vue-router对象 避免bug
        })
      },
      // 修改密码
      submitUserPassWord () {
        this.$refs.passForm.validate(valid => {
          if (valid) {
            this.passLoading = true
            console.log(this.passForm)
            modifyPwd(this.passForm).then(res => {
              this.passLoading = false
              if (res.status === true) {
                this.$message({ message: '修改密码成功,请重新登录', type: 'success' })
                setTimeout(() => {
                  this.loginOut()
                }, 1000)
              }
            }).catch(err => {
              this.passLoading = false
              console.log(err.data)
            })
          } else {
            console.log('error submit!!')
            return false
          }
        })
      }
    }
  }
</script>

<style lang="scss" scoped>
  .header-top {
    padding: 0 30px 0 30px;
    height: 60px;
    display: flex;
    justify-content: space-between;
    overflow: hidden;
    box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.12), 0 0 3px 0 rgba(0, 0, 0, 0.04);
    .sidebar-btn {
      border-radius: 50%;
      width: 38px;
      height: 38px;
      border: none;
      outline: none;
      position: relative;
      top: -12px;
      background-color: #252c35;
      cursor: pointer;
      opacity: .8;
      transition: opacity .15s;
      .svg-icon {
        color: #fff;
        &.close {
          transform: rotate(90deg)
        }
      }
      &:hover {
        opacity: 1;
      }
      &:focus {
        opacity: 1;
      }
    }
    .bread-crumb {
      position: relative;
      top: 5px
    }
    .btn-icon {
      top: -16px;
      position: relative;
    }
    .navbar-right {
      display: flex;
      line-height: 60px;
      .navbar-right-item {
        margin-right: 30px;
        transition: border .25s;
        border-bottom: 2px solid transparent;
        height: 50px;
        cursor: pointer;
      }
    }
  }
</style>
