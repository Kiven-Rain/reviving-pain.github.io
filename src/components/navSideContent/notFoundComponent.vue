<template>
  <div class="nsc-commonWrp">
    <div class="notFoundBody">
      <img src="../../assets/img/pageNotFound.svg">
      <h1>页面不见了...</h1>
    </div>
  </div>
</template>

<script>
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
    this.$commonUtil.exchangePageTitle('页面不见了…')
  }
}
</script>

<style scoped>
.notFoundBody {
  width: 100%;
  height: 100%;
}
.notFoundBody img {
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
.notFoundBody h1 {
  margin-top: 120px;
  margin-left: -80px;
  position: absolute;
  left: 50%;
  top: 50%;
  font-family: '幼圆';
  user-select: none;
}
</style>
