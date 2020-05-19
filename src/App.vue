<template>
  <div id="app">
    <!-- <router-view v-if="isRouterAlive"></router-view> -->
    <router-view ></router-view>
  </div>
</template>

<script>
// export default {
//   provide() {
//     return {
//       reload: this.reload
//     };
//   },
//   data() {
//     return {
//       isRouterAlive: true
//     };
//   },
//   methods: {
//     reload() {
//       this.isRouterAlive = false;
//       this.$$nextTick(function() {
//         this.isRouterAlive = true;
//       });
//     }
//   }
// };
</script>



<style scoped>
#app {
  height: 100%;
  width: 100%;
  padding: 0px;
  margin: 0px;
}
</style>