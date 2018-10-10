<template>
  <div class="mockContentWrp">
    <span>页面初次加载或刷新页面时，生成一组随机人员</span>
    <div v-for="(person, index) in mock.name" :key="index">
      <span>模拟随机人员{{index + 1}}</span>
      <span><b>first name: </b>{{person.first}}</span>
      <span><b>middle name: </b>{{person.middle}}</span>
      <span><b>lase name: </b>{{person.last}}</span>
      <span><b>full name: </b>{{person.full}}</span>
      <br>
    </div>
    <span>点击发送请求，请求响应时间在1~4秒之间，返回结果在浏览器console查看</span>
    <button @click="getMockData('get')">发送Get请求</button>
    <button @click="getMockData('post')">发送Post请求</button>
    <br>
    <br>
    <br>
  </div>
</template>

<script>
import {data} from '../../../mock/mock.js'
import request from '../../../util/apiRequest.js'
import commonUtil from '../../../util/common.js'

export default {
  data: function () {
    return {
      mock: data
    }
  },
  methods: {
    getMockData: function (requestType) {
      if (requestType === 'get') {
        request.getMockUserInfo((res) => {
          console.log(JSON.stringify(res.data, null, 2))
        }, (err) => {
          console.log(err)
        })
      } else if (requestType === 'post') {
        request.postInfoToMock({
          dataInfo: 'thisIsDataInfooooooooooooHa'
        }, (res) => {
          console.log(JSON.stringify(res.data, null, 2))
        }, (err) => {
          console.log(err)
        })
      }
    }
  },
  created: function () {
    commonUtil.exchangePageTitle('Mock数据与请求测试')
    // 在控制台打印出mock随机生成的{data}对象信息
    // console.log('模拟随机邮箱' + JSON.stringify(data.list, null, 2))
    // console.log('模拟随机姓名' + JSON.stringify(data.name, null, 2))
  }
}
</script>

<style scoped>
.mockContentWrp {
  width: 100%;
  height: 100%;
  padding: 10px;
  box-sizing: border-box;
}
.mockContentWrp span {
  display: block;
}
.mockContentWrp > span {
  font-weight: bold;
  color: orange;
}
</style>
