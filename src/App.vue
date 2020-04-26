<template>
  <div id="app">
    <!-- <HelloWorld></HelloWorld> -->
    <!-- <Hello /> -->
    <!-- <Col /> -->
    <!-- <Wz /> -->
    <cuty />
  </div>
</template>

<script>
import HelloWorld from "./components/HelloWorld.vue";
import Hello from "./components/Hello.vue";
import Col from "./components/Col.vue";
import Wz from "./components/Wz.vue";
import cuty from "./components/cuty.vue";

export default {
  name: "App",
  components: {
    HelloWorld,
    Hello,
    Col,
    Wz,
    cuty
  }
};
</script>

<style lang="scss">
</style>
