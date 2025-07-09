<template>
  <div class="container">
    <el-form :model="form" :rules="rules">
      <el-form-item label="名称" prop="name">
        <el-input v-model="form.name"></el-input>
      </el-form-item>
      <el-form-item label="年龄" prop="age">
        <el-input-number v-model="form.age"></el-input-number>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="onClick_submit">get提交</el-button>
        <el-button type="primary" @click="onClick_submit1">get提交V2</el-button>
        <el-button @click="onClick_cancel">取消请求</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script setup lang="ts">
import { getServer, getServerV2 } from './api/get';
import { reactive } from 'vue';
import { ElMessage } from 'element-plus';
import { request } from './http';

const form = reactive({
  name: '',
  age: 0
});

const rules = reactive({
  name: { required: true, message: '请输入名称' },
  age: { required: true, message: '请输入年龄' }
});

const onClick_submit = () => {
  getApi();
  getApi();
  // getApiV2();
};

const onClick_submit1 = () => {
  getApiV2();
  getApiV2();
};

const onClick_cancel = () => {
  request.cancelAllRequesting('没有原因');
};

const getApi = async () => {
  try {
    let res = await getServer();
    console.log(res);
  } catch (error: any) {
    ElMessage.error(error.message);
    console.error(error);
  }
};

const getApiV2 = async () => {
  try {
    let res = await getServerV2();
    console.log(res);
  } catch (error: any) {
    ElMessage.error(error.message);
    console.error(error.toString());
  }
};
</script>

<style scoped></style>
