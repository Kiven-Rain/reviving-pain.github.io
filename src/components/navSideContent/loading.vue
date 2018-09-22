<template>
  <div class="loadingWrp">
    <div class="loadingBox">
      <span class="fa fa-spinner fa-pulse"></span>
    </div>
  </div>
</template>

export default {
}

<style scoped>
@media only screen and (max-width: 900px) {
  .loadingWrp {
    transition: left 0.4s ease;
    left: 0px;
    right: 0px;
    top: 60px;
    bottom: 50px;
    background: rgba(255, 255, 255, 1);
    position: fixed;
  }
}
@media only screen and (min-width: 900px) {
  .loadingWrp {
    transition: left 0.4s ease;
    left: 260px;
    right: 0px;
    top: 60px;
    bottom: 50px;
    background: rgba(255, 255, 255, 1);
    position: fixed;
  }
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
