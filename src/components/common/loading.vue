<template>
  <div class="loadingWrp">
    <div class="loadingBox">
      <span class="fa fa-spinner fa-pulse"></span>
    </div>
  </div>
</template>

<style scoped>
.loadingWrp {
  background: rgba(255, 255, 255, 0.5);
  /* background: red; */
  position: absolute;
  top: 0px;
  right: 0px;
  bottom: 0px;
  left: 0px;
  z-index: 100;
}
.loadingWrp .loadingBox {
  width: 5rem;
  height: 5rem;
  margin: -2.5rem 0rem 0rem -2.5rem;
  position: absolute;
  top: 50%;
  left: 50%;
}
.loadingWrp .loadingBox .fa.fa-spinner {
  font-size: 5rem;
  color: #000;
}
</style>
