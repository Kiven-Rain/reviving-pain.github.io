<template>
  <div class="forkMeWrp">
    <div class="forkMeCell">
      <span class="forkText">Fork me on GitHub</span>
    </div>
  </div>
</template>

<style scoped>
.forkMeWrp {
  width: 200px;
  height: 28px;
  background: linear-gradient(#A80000, #910000);
  transform: rotate(0deg);
  cursor: pointer;
}
.forkMeWrp .forkMeCell {
  border-top: 1px dashed #fff;
  border-bottom: 1px dashed #fff;
  position: absolute;
  top: 4px;
  right: 0px;
  bottom: 4px;
  left: 0px;
  background: linear-gradient(#a70000, #920000);
  text-align: center;
}
.forkMeWrp .forkMeCell .forkText {
  font-family: "Helvetica Neue", Helvetica, Arial, sans-serif;
  font-size: 12px;
  font-weight: 700;
  color: #fff;
  /* 添加文字内阴影 */
  text-shadow: 0 -1px rgba(0,0,0,0.5);
  user-select: none;
}
</style>
