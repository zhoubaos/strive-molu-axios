<template>
  <input type="file" id="file" name="file" @change="handleFileChange" />
  <el-button @click="handleUpload">上传</el-button>
  <el-button @click="handleRead">读取</el-button>
</template>

<script setup lang="ts">
import localforage from 'localforage';

import { nextTick, onMounted, shallowRef } from 'vue';

defineOptions({
  name: 'Upload'
});
const ufile = shallowRef<File>();
const handleFileChange = (e: any) => {
  ufile.value = e.target.files[0];
};
const handleUpload = async () => {
  // console.log(ufile.value);
  for (let i = 0; i < 100; i++) {
    localforage.setItem('demo' + i, ufile.value).then((res) => {
      console.log(res);
    });
  }
};

const handleRead = async () => {
  let text: Blob | null = await localforage.getItem('demo');
  console.log(text);
  // let f = new FileReader();
  // f.readAsText(text);
  // f.onload = function () {
  //   console.log(f.result);
  // };
};
</script>

<style scoped></style>
