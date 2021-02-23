<template>
  <div id="app" :style="bcg">
    <router-view />
  </div>
</template>

<script>
export default {
  name: 'App',
  data() {
    return {
      bcg: { backgroundColor: localStorage.getItem('corFundo') }
    }
  }
}
</script>
