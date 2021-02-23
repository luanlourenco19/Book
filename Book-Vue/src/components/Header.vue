<template>
  <main>
    <header>
      {{ title }}
    </header>
  </main>
</template>

<script>
export default {
  props: ['title']
}
</script>

<style scoped>
header {
  width: 100%;
  float: left;
  height: 50px;
  background: #3498db;
  text-align: center;
  color: #fff;
  font-weight: 300;
  line-height: 2;
  font-size: 2em;
  margin-bottom: 30px;
  box-shadow: 2px 2px 2px #e1e1e1;
}
</style>
