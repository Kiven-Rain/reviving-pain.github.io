<template>
  <div class="notFoundWrp">
    <div class="notFoundBody">
      <img src="../../assets/pageNotFound.svg">
      <h1>页面不见了...</h1>
    </div>
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
  padding: 10px;
  position: absolute;
  top: 0px;
  right: 0px;
  bottom: 0px;
  left: 0px;
  overflow-y: auto;
}
.notFoundWrp .notFoundBody {
  width: 100%;
  height: 100%;
}
.notFoundWrp .notFoundBody img {
  width: 240px;
  height: 260px;
  position: absolute;
  margin-left: -120px;
  margin-top: -150px;
  position: absolute;
  left: 50%;
  top: 50%;
  user-select: none;
}
.notFoundWrp .notFoundBody h1 {
  margin-top: 120px;
  margin-left: -80px;
  position: absolute;
  left: 50%;
  top: 50%;
  font-family: '幼圆';
  user-select: none;
}
</style>
