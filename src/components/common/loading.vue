<template>
  <div class="loadingWrp">
    <span class="fa fa-spinner fa-pulse"></span>
  </div>
</template>

<style scoped>
.loadingWrp {
  background: rgba(255, 255, 255, 0.5);
  position: absolute;
  top: 0px;
  right: 0px;
  bottom: 0px;
  left: 0px;
  z-index: 100;
}
.loadingWrp span {
  margin: -2.5rem 0rem 0rem -2.5rem;
  font-size: 5rem;
  color: #000;
  position: absolute;
  left: 50%;
  top: 50%;
}
</style>
