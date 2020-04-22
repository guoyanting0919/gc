<template>
  <div id="app">
    <!-- <HelloWorld></HelloWorld> -->
    <!-- <Hello /> -->
    <!-- <Col /> -->
    <!-- <Wz /> -->
    <gc />
  </div>
</template>

<script>
import HelloWorld from "./components/HelloWorld.vue";
import Hello from "./components/Hello.vue";
import Col from "./components/Col.vue";
import Wz from "./components/Wz.vue";
import gc from "./components/gc.vue";

export default {
  name: "App",
  components: {
    HelloWorld,
    Hello,
    Col,
    Wz,
    gc
  }
};
</script>

<style lang="scss">
</style>
