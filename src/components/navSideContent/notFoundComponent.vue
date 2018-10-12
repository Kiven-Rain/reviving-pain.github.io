<template>
  <div class="notFoundWrp">
    <img src="../../assets/pageNotFound.svg">
    <h1>页面不见了...</h1>
  </div>
</template>

<script>
import commonUtil from '../../util/common.js'

export default {
  data: function () {
    return {
      // enter some data
    }
  },
  methods: {
    // put some function here
  },
  created: function () {
    commonUtil.exchangePageTitle('页面不见了…')
  }
}
</script>

<style scoped>
.notFoundWrp {
  width: 100%;
  height: 100%;
  overflow: hidden;
}
.notFoundWrp img {
  width: 240px;
  height: 260px;
  margin-left: -120px;
  margin-top: -150px;
  position: absolute;
  left: 50%;
  top: 50%;
  display: block;
  user-select: none;
}
.notFoundWrp h1 {
  margin-top: 120px;
  margin-left: -80px;
  position: absolute;
  left: 50%;
  top: 50%;
  display: block;
  font-family: '幼圆';
  user-select: none;
}
</style>
