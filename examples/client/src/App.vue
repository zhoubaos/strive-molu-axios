<template>
  <div class="container">
    <el-form :model="form" :rules="rules">
      <el-form-item label="名称" prop="name">
        <el-input v-model="form.name"></el-input>
      </el-form-item>
      <el-form-item label="年龄" prop="age">
        <el-input-number v-model="form.age"></el-input-number>
      </el-form-item>
      <el-form-item label="文件" prop="address">
        <input type="file" id="file" name="file" multiple webkitdirectory />
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="onClick_submit">get提交</el-button>
        <el-button type="primary" @click="onClick_submit1">get提交V2</el-button>
        <el-button @click="onClick_cancel">取消请求</el-button>
        <el-button @click="onClick_upload">上传文件</el-button>
      </el-form-item>
    </el-form>
    <el-divider />
    <upload />
  </div>
</template>

<script setup lang="ts">
import { getServer, getServerV2 } from './api/get';
import { reactive, onMounted } from 'vue';
import { ElMessage } from 'element-plus';
import { request } from './http';
import Upload from '@/Upload.vue';

const form = reactive({
  name: '',
  age: 0
});

const rules = reactive({
  name: { required: true, message: '请输入名称' },
  age: { required: true, message: '请输入年龄' }
});

const onClick_submit = () => {
  let data = {
    list: Array(1000).fill({ id: 1, name: 'test', content: '重复的长文本内容...' })
  };
  getApi(data);
};
onMounted(() => {
  document.querySelector('#file')?.addEventListener('change', (e) => {
    let file = e?.target?.files[0] as File;
    console.log(file);
  });
});
const onClick_submit1 = () => {
  getApiV2();
  getApiV2();
};

const onClick_cancel = async () => {
  request.cancelAllRequesting('全部取消');
};

const onClick_upload = () => {};

const getApi = async (data: any) => {
  try {
    let res = await getServer(data);
    console.log('==v1==', res);
  } catch (error: any) {
    console.error(error);
    ElMessage.error(error.message);
  }
};

const getApiV2 = async () => {
  try {
    let res = await getServerV2();
    console.log('==v2==', res);
  } catch (error: any) {
    ElMessage.error(error.message);
  }
};
</script>

<style scoped></style>
