<template>
  <div class="notFoundWrp">
    <img src="../../assets/pageNotFound.png">
    <h1>页面不见了...</h1>
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
}
</style>
