<template>
  <div class="father">
    <img class="persona" src="@/assets/persona.png" alt="persona" title="take your heart" />
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
  display: block;
  margin-right: 50px;
  margin: 0 auto;
  transition: all 1s ease;
  transform: rotateY(0deg);
  cursor: pointer;
}
.persona:hover {
  transition: all 1s ease;
  transform: rotateY(360deg);
}
</style>
