<template>
  <input type="file" id="file" name="file" @change="handleFileChange" />
  <el-button @click="handleUpload">上传</el-button>
  <el-button @click="handleRead">读取</el-button>
</template>

<script setup lang="ts">
import localforage from 'localforage';

import { nextTick, onMounted, shallowRef } from 'vue';
import { upload } from './api/upload';

defineOptions({
  name: 'Upload'
});
const ufile = shallowRef<File>();
const handleFileChange = (e: any) => {
  ufile.value = e.target.files[0];
};
const handleUpload = async () => {
  try {
    console.log(ufile.value);
    // localforage.setItem('file', ufile.value);
    await upload(ufile.value as File);
  } catch (error) {
    console.error(error);
  }
};

const handleRead = async () => {
  let text: Blob | null = await localforage.getItem('file');
  console.log(text);
  let s = await text?.text();
  console.log(s);

  // let f = new FileReader();
  // f.readAsText(text);
  // f.onload = function () {
  //   console.log(f.result);
  // };
};
</script>

<style scoped></style>
