<template>
  <div class="father">
    <img class="persona" src="@/assets/persona.png" alt="persona" title="take your heart" />
  </div>
</template>

<script>
import {data} from '../../../mock/mock.js'

export default {
  data: function () {
    return {
      mock: data
    }
  },
  created: function () {
    // 打印测试mock数据
    console.log(JSON.stringify(this.mock, null, 2))
  }
}
</script>

<style scoped>
.father {
  position: relative;
  top: 50px;
  perspective: 600px;
  background: #c60023;
}
.persona {
  width: 280px;
  height: 250px;
  display: block;
  margin-right: 50px;
  margin: 0 auto;
  transition: all 1s ease;
  transform: rotateY(0deg);
  cursor: pointer;
}
.persona:hover {
  transition: all 1s ease;
  transform: rotateY(360deg);
}
</style>
