<template>
  <div class="upload-container">
    <el-upload class="editor-slide-upload"
               action="''"
               accept="image/jpg,image/png,image/jpeg"
               :auto-upload="false"
               :show-file-list="false"
               :on-change="handleChange">
      <el-button icon='el-icon-upload' size="mini" :loading="loading" type="primary">上传图片
      </el-button>
    </el-upload>
  </div>
</template>

<script>
  import { uploadImgToBase64 } from '@/utils'
  import { saveImg } from '@/api/goods'
  import { BASE_URL } from '@/utils/fetch'

  export default {
    name: 'editorSlideUpload',
    data () {
      return {
        loading: false
      }
    },
    methods: {
      async handleChange (file, fileList) {
        const isLt2M = file.size / 1024 / 1024 < 2  // 上传头像图片大小不能超过 2MB
        if (!isLt2M) {
          this.$message.error('图片上传失败，图片大小不能超过 2MB!')
          return
        }
        this.loading = true
        const imgFileObj = await uploadImgToBase64(file.raw)
        const res = await saveImg({ img: imgFileObj.result.replace(/.*;base64,/, '') })
        this.$emit('successCBK', [{ url: BASE_URL + '/' + res.data }])
        this.$message.success('图片上传成功')
        this.loading = false
      }
    }
  }
</script>

<style lang="scss" scoped>
  .editor-slide-upload {
    margin-bottom: 20px;
    /deep/ .el-upload--picture-card {
      width: 100%;
    }
  }
</style>
