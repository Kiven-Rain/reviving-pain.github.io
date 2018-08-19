<template>
  <div class="father">
    <span>这页展示CSS3动画</span>
    <img class="persona" src="@/assets/persona.png" alt="女神异闻录" />
  </div>
</template>

<style scoped>
.father {
  position: relative;
  top: 50px;
  perspective: 600px;
  background: #c60023;
}
.persona {
  width: 280px;
  height: 250px;
  position: relative;
  transition: all 1s ease;
  transform: rotateY(0deg);
  /* top: 30px; */
  cursor: pointer;
}
.persona:hover {
  transition: all 1s ease;
  transform: rotateY(360deg);
  /* top: 0px; */
}
</style>
