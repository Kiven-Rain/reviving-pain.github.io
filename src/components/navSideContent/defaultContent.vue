<template>
  <div class="defautlContentWrp">
    <div class="defaultContentBody">
      <span>H</span>
    </div>
  </div>
</template>

<script>
export default {
}
</script>

<style scoped>
.defautlContentWrp {
  padding: 10px;
  position: absolute;
  top: 0px;
  right: 0px;
  bottom: 0px;
  left: 0px;
  overflow-y: auto;
}
.defautlContentWrp .defaultContentBody {
  width: 100%;
  height: 100%;
}
.defautlContentWrp .defaultContentBody span {
  width: 30vw;
  height: 30vw;
  margin: -15vw 0px 0px -15vw;
  position: absolute;
  left: 50%;
  top: 50%;
  text-align: center;
  color: #ccc;
  font-weight: bold;
  font-size: 30vw;
  text-shadow: -3px -3px #666;
}
</style>
