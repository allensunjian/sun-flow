<!--
 * @Author: allensunjian Allen_sun_js@hotmail.com
 * @Date: 2023-04-22 09:41:53
 * @LastEditors: allensunjian Allen_sun_js@hotmail.com
 * @LastEditTime: 2023-04-22 17:32:33
 * @FilePath: \workflow_demo\workflow-demo\src\components\indexPage.vue
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
-->
<template>
  <div style="height: 100vh; width: 100vw">
    <workflow
      @error="getError"
      :flow-data="State.flowData"
      :edit="true"
    ></workflow>
  </div>
</template>

<script setup>
import workflow from "sun-workflow";
import { reactive, h } from "vue";
const getError = (err) => {
  alert(JSON.stringify(err));
};
const State = reactive({
  flowData: [
    {
      bodyContent: "发起人1",
      nodeType: 1,
    },
    {
      bodyContent: "审核人1",
      nodeType: 2,
    },
    {
      bodyContent: "抄送人1",
      nodeType: 3,
    },
    {
      bodyContent: "办理人1",
      nodeType: 4,
    },
    {
      nodeType: "-2",
      children: [
        [
          {
            nodeType: 5,
            headerContent: "条件01",
            bodyContent: "这是01条件内容",
          },
        ],
        [
          {
            nodeType: 5,
            headerContent: h("div", { style: "color:rgb(45, 112, 248)" }, [
              "这是自定义标题",
            ]),
            bodyContent: h("div", { style: "color:red" }, ["这是自定义内容"]),
          },
        ],
      ],
    },
  ],
});
</script>
<style>
.active {
  background: rgb(45, 112, 248);
  color: #fff;
}
</style>
