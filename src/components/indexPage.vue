<!--
 * @Author: allensunjian Allen_sun_js@hotmail.com
 * @Date: 2023-04-22 09:41:53
 * @LastEditors: Please set LastEditors
 * @LastEditTime: 2023-04-27 16:49:43
 * @FilePath: \workflow_demo\workflow-demo\src\components\indexPage.vue
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
-->
<template>
  <div style="height: 100vh; width: 100vw">
    <div class="workflow__demo_tab">
      <span
        class="workflow__demo_tabitem"
        :class="{ active: tabState.tabIndex == 1 }"
        @click="tabState.tabIndex = 1"
        >渲染审批流</span
      >
      <span
        class="workflow__demo_tabitem"
        :class="{ active: tabState.tabIndex == 2 }"
        @click="tabState.tabIndex = 2"
        >编辑审批流</span
      >
      <span
        class="workflow__demo_tabitem"
        :class="{ active: tabState.tabIndex == 3 }"
        @click="tabState.tabIndex = 3"
        >手动渲染审批流</span
      >
      <span
        class="workflow__demo_tabitem"
        :class="{ active: tabState.tabIndex == 4 }"
        @click="tabState.tabIndex = 4"
        >操作中间件</span
      >
      <span
        class="workflow__demo_tabitem"
        :class="{ active: tabState.tabIndex == 5 }"
        @click="tabState.tabIndex = 5"
        >全功能</span
      >
    </div>
    <div class="workflow__view">
      <base-flow v-if="tabState.tabIndex == 1"></base-flow>
      <edit-flow v-if="tabState.tabIndex == 2"></edit-flow>
      <handle-flow v-if="tabState.tabIndex == 3"></handle-flow>
      <mid-flow v-if="tabState.tabIndex == 4"></mid-flow>
      <full-flow v-if="tabState.tabIndex == 5"></full-flow>
    </div>
  </div>
</template>

<script setup>
import baseFlow from "./subs/base-flow.vue";
import editFlow from "./subs/edit-flow.vue";
import handleFlow from "./subs/handle-render-flow.vue";
import midFlow from "./subs/mid-flow.vue";
import fullFlow from "./subs/full-flow.vue";
import { reactive } from "vue";

const tabState = reactive({
  tabIndex: 1,
});
</script>
<style>
.workflow__view {
  height: calc(100vh - 42px);
}
.workflow__demo_tab {
  display: flex;
  justify-content: center;
}
.workflow__demo_tabitem {
  height: 40px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  flex: 0 0 120px;
  text-align: center;
  border: 1px solid #eee;
  cursor: pointer;
}
.active {
  background: rgb(45, 112, 248);
  color: #fff;
}
</style>
