<template>
  <div class="header">
    <span @click="mobilSidebarBtn" class="fa fa-th-list"></span>
    <a href="https://cn.vuejs.org/v2/guide/" target="_blank" title="VUE doc"><img class="vue-logo" src="../assets/logo.png"></a>
  </div>
</template>

<script>
import bus from '../assets/eventBus.js'

export default {
  data: function () {
    return {
      mobilSidebarOrder: true
    }
  },
  methods: {
    mobilSidebarBtn: function () {
      bus.$emit('show-mobil-sidebar', this.mobilSidebarOrder)
      if (this.mobilSidebarOrder === true) {
        this.mobilSidebarOrder = false
      } else if (this.mobilSidebarOrder === false) {
        this.mobilSidebarOrder = true
      }
      // alert('现在移动侧边导航按钮命令已转变为：' + this.mobilSidebarOrder)
      bus.$emit('displayContentMask', !(this.mobilSidebarOrder))
    }
  },
  mounted: function () {
    var self = this
    bus.$on('resetMobilsideBtn', function (msg) {
      self.mobilSidebarOrder = msg
    })
  }
}
</script>

<style scoped>
.header {
  height: 100%;
  width: 100%;
  background: #2a303c;
  /*text-align: left;*/
}
.header .vue-logo {
  height: 40px;
  width: 40px;
  margin: 10px;
  float: right;
}
.header .fa {
  margin: 10px;
  color: #fff;
  left: 0px;
  font-size: 40px;
  position: fixed;
  transform: rotate(-90deg);
}
@media only screen and (min-width: 900px) {
  .header .fa {
    transition: all 0.5s ease;
    transform: rotate(-90deg);
    left: -60px;
  }
  .header .vue-logo {
    float: left;
    margin-left: 25px;
  }
}
@media only screen and (max-width: 900px) {
  .header .fa {
    transition: all 0.5s ease;
    transform: rotate(0deg);
    left: 0px;
  }
}
</style>
