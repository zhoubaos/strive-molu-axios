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
        <el-button type="primary" @click="onClick_submit">提交</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script setup lang="ts">
import request from './http';
import { reactive } from 'vue';
import { ElMessage } from 'element-plus';

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
};

const getApi = async () => {
  try {
    let res = await request({
      url: '/getapi',
      repeatRequestStrategy: false
    });
    console.log(res);
  } catch (error: any) {
    ElMessage.error(error.msg);
    console.error(error.toString());
  }
};
</script>

<style scoped></style>
