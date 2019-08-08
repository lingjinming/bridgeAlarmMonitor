<template>
    <div class="upLoad">
      <button @click="file"></button>
      <label ref="upload"
             style="position: relative;">
        <input type="file"
               @change="selectFile"
               style="position: absolute; width: 1px; height: 1px; opacity: 0; z-index: -1;">
      </label>
    </div>
</template>

<script>
    export default {
        name: "Upload",
      methods: {
        file() {
          // 模拟点击file input触发选择文件，注意：不能在任何方式的回调里面执行此语句
          this.$refs.upload.click()
        },
        selectFile(event) {
          // 调用上传方法，传入选择的文件对象
          this.uploadFile(event.target.files[0], () => {
            // upload-success
          })
          // 重置file input控件的值
          event.target.value = ''
        }
      }
    }
</script>

<style scoped>

</style>
