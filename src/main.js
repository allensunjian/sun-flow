/*
 * @Author: allensunjian Allen_sun_js@hotmail.com
 * @Date: 2023-04-22 09:41:53
 * @LastEditors: Please set LastEditors
 * @LastEditTime: 2023-04-27 15:10:53
 * @FilePath: \workflow_demo\workflow-demo\src\main.js
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
import { createApp } from "vue";
import App from "./App.vue";
import Element from "element-plus";
// import "sun-flow/workflow_lib/lib/workflow.css";
import "../workflow_lib/lib/workflow.css";
import "element-plus/lib/theme-chalk/index.css";
createApp(App).use(Element).mount("#app");
