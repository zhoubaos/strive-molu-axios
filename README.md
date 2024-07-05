## 依赖安装

```bash
npm install strive-molu-axios
```

## 介绍

基于axios进行二次封装，除了支持axios原有功能外，额外新增接口失败重新请求、取消重复请求、批量取消正在发送的请求功能。

## 基本用例

发送一个`get`请求。

```typescript
import smAxios from 'strive-molu-axios';

// 默认发起get请求
smAxios({
  data: {
    name: 'zbs'
  }
})
  .then((res) => {
    // res类型为string
    console.log(res);
  })
  .catch((e) => {
    // 可能为axios错误或该库的库
    console.error(e);
  });

// 别名请求
smAxios
  .get<string>('/user', {
    data: {
      name: 'zbs'
    }
  })
  .then((res) => {
    // res类型为string
    console.log(res);
  })
  .catch((e) => {
    // 可能为axios错误或该库的库
    console.error(e);
  });

// 请求传参
smAxios.get<string>('/user', {
  data: {
    name: 'zbs'
  }
});

//async/await用户
const getUserInfoServer = async () => {
  try {
    const res = await smAxios.get('/user');
  } catch (e) {
    console.error(e);
  }
};
```

自定义请求成功判断，预计成功后返回的值。

```typescript
smAxios({
  data: {
    name: 'zbs'
  },
  // 当请求的api满足以下条件时才能成功返回，且在then方法才能打印
  customBridgeSuccess(res: any) {
    return res?.data?.info == 'Success' && res?.data?.status == 1;
  },
  // 对于接口返回后的结果进行处理
  customBridgeSuccessData(res: any) {
    return res.data;
  }
})
  .then((res) => {
    // customBridgeSuccess方法返回true后，
    // 才能获取经过customBridgeSuccessData方法处理后的值
    console.log(res);
  })
  .catch((e) => {
    // 可能为axios错误或该库的库
    console.error(e);
  });
```

## SmAxios API

通过向`SmAxios`方法传递配置来创建请求，传递的配置会覆盖默认的配置。

```typescript
import smAxios from 'strive-molu-axios';

//发起post请求
smAxios({
  method: 'post',
  url: '/reg',
  data: {
    name: 'zbs',
    age: 25
  }
});
```

发起post请求，且修改 `Content-Type` 值为`multipart/formdata`。
通过别名的方式请求，可以传第三个参数`isForm`，该参数值默认为`true`，当值为true时会设置`content-type`值为`multipart/formdata`。

```typescript
//方式1
smAxios({
  method: 'post',
  url: '/regsiter',
  contentType: 'formdata',
  data: {
    name: 'zbs',
    age: 25
  }
});

//方式二
smAxios.post('/regsiter', {
  data: {
    name: 'zbs',
    age: 25
  }
});
```

`smAxios`额外支持的属性方法。
**smAxios.get(url,config)**
创建一个get请求。
**smAxios.post(url,config,isForm)**
创建一个post请求。
**setTimeouts(n)**
修改配置中的`timeout`值
**setHeaders(o)**
修改配置中的请求头参数
**setCongfig(config)**
去修改默认的配置
**cancelAllRequesting(str)**
取消所有正在请求的接口，可以传入取消请求的原因。该方法基于原生的`AbortController`方法实现。

## 创建新的实例

`smAxios`方法本身是基于内置默认配置创建的实例，可以使用该方法的`create`属性方法，传入新的参数去覆盖默认参数，然后创建新的实例具有`smAxios`相同的扩展方法。

```typescript
import smAxios from 'strive-molu-axios';

const request = smAxios.create({
  baseURL: '/api',
  timeout: 10000,
  retryTimes: 1,
  repeatRequestStrategy: 1,
  headers: {
    Authorization: 'xxxx token'
  }
});

//发起get请求，该请求会继承上面的配置
request({
  data: {
    name: 'dd'
  }
});
```

使用上面新建的实例发起`get`请求，且自定义`timeout`配置。

```typescript
// repeatRequestStrategy 值为1，会直接拦截触发的请求，且会抛出重复请求的错误。
request({
  url: '/user',
  timeout: 5000
});
```

新创建的实例具有和默认实例相同的实例方法。

## 参数配置

在创建请求时，可以传的参数配置，以及默认值。
可以通过`axiosReqConfig`属性覆盖[axios请求配置](https://axios-http.com/zh/docs/req_config)。

```javascript
const config = {
  // 会自动加在相对url前面
  baseURL: '/api',

  // 请求方法
  method: 'get',

  // 接口超时
  timeout: 10000,

  // 请求头Content-type 属性值的映射值
  // json：application/json;charset=UTF-8
  // urlencoded：application/x-www-form-urlencoded;charset=UTF-8
  // formdata：multipart/formdata
  contentType: 'json',

  // 接口失败后，重新进行请求的次数
  retryTimes: 0,

  //当值布尔值时：false对重复请求不做处理，true拦截触发请求，且抛出错误
  //当值为数字类型时：0 => false 1 =>true，2 会拦截请求，然后在第一个请求成功后，返回对应的值。
  repeatRequestStrategy: true,

  // 自定义请求头
  headers: {},

  // 传递给axios的参数。
  // 如果axios参数的配置和该库的配置冲突，该库的配置优先级会高于axios的配置
  axiosReqConfig: {},

  // 对于接口是否请求成功的判断
  customBridgeSuccess(res: any): boolean {
    return res?.data?.info == 'Success' && res?.data?.status == 1;
  },

  // customBridgeSuccess返回值为ture情况下，进行res进行处理
  customBridgeSuccessData(res: any): unknown {
    return res?.data?.data;
  },

  // customBridgeSuccess返回false时，返回的错误信息。
  customBridgeErrorMsg(error: any): string {
    return error?.data?.info;
  },

  // 获取错误的原始信息
  getSourceError(error: any) {
    //
  }
}
```

## 默认配置

自定义实例默认值

```typescript
// 处理实例时的默认值
const instance = smAxios.create({
  baseURL: '/api'
});

// 创建实例后修改默认值
instance.setTimeout(2000);
```

**配置的优先级**
请求、实例和默认配置会进行合并为最终的一个配置。优先级关系是 `请求配置` > `实例配置` > `默认配置`，默认配置请查看[lib/defaults](https://github.com/zhoubaos/strive-molu-axios/blob/main/lib/defaults/config.ts)。

```typescript
// 实例默认配置
const instance = smAxios.create({
  timeout: '10000'
});

// 修改默认配置
instance.setTimeout(2000);

// 最后接口自定义的配置
instance.get('/user', {
  timeout: 3000
});
```

该库对于axios的部分配置进行简化，所以配置的属性也包含优先级。

```typescript
// 如果有如下配置，其优先级 contentType > headers > axiosReqConfig.headers
smAxios.create({
  contentType: 'urlencoded',
  headers: {
    'Content-Type': 'multipart/formdata'
  },
  axiosReqConfig: {
    headers: {
      'Content-Type': 'application/json;charset=UTF-8'
    }
  }
});
```

## 取消请求

单个接口取消请求

```typescript
import smAxios from 'strive-molu-axios';
const controller = new AbortController();

smAxios
  .get('/user', {
    axiosReqConfig: {
      signal: controller.signal
    }
  })
  .then(function (response) {
    //...
  });
// 取消请求
controller.abort();
```

取消所有未完成的接口请求。

```typescript
import smAxios from 'strive-molu-axios';

smAxios.cancelAllRequesting('手动取消请求');
```

## 错误处理

该库封装的错误类继承于`Error`类，所以可以直接通过`console`的方法打印抛出的错误对象。

```typescript
smAxios.get('/user').catch((e) => {
  console.error(e);
});
```

包含`name`、`msg`和`config`3个属性。

- name：表示错误的类型。
- msg：错误的提示信息。
- config：错误的原始对象。

对于`axios`的错误配置请参考[链接](https://axios-http.com/zh/docs/handling_errors)。
