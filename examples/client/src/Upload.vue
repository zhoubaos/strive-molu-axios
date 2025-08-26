<template>
  <el-button @click="handleUpload">按钮</el-button>
</template>

<script setup lang="ts">
import localforage from 'localforage';

defineOptions({
  name: 'Upload'
});

const handleUpload = () => {
  // localforage.setItem('demo', new Blob(['demo', { type: '' }]));
};
</script>

<style scoped></style>
