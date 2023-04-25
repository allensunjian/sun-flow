<!--
 * @Author: allensunjian Allen_sun_js@hotmail.com
 * @Date: 2023-04-22 09:41:53
 * @LastEditors: allensunjian Allen_sun_js@hotmail.com
 * @LastEditTime: 2023-04-25 15:04:30
 * @FilePath: \workflow_demo\workflow-demo\src\App.vue
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
-->
<template>
  <index-page></index-page>
</template>

<script>
import indexPage from "./components/indexPage.vue";

export default {
  name: "App",
  components: {
    indexPage,
  },
};
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}
body {
  margin: 0;
}
</style>
