<!--
 * @Author: allensunjian Allen_sun_js@hotmail.com
 * @Date: 2023-04-22 09:41:53
 * @LastEditors: Please set LastEditors
 * @LastEditTime: 2023-04-25 16:56:12
 * @FilePath: \workflow_demo\workflow-demo\src\components\indexPage.vue
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
-->
<template>
  <div style="height: 100vh; width: 100vw">
    <workflow
      :ref="getWorkflowIns"
      :middleware-config="controllMiddleWareConfig"
      :controll-middleware="true"
      :flow-data="State.flowData"
      :edit="State.flag"
      :scale="true"
      @body-click="bodyClick"
      @header-click="headerClick"
    ></workflow>
    <span class="btn workflow__edit" @click="State.flag = !State.flag">{{
      State.flag ? "预览" : "编辑"
    }}</span>
    <span class="btn workflow__edit" style="top: 60px" @click="getWorkflowData"
      >获取审批流数据</span
    >
    <el-drawer v-model="State.drawer" :with-header="false">
      <div class="workflow__drawer_header">
        {{ State.currentNode.pos == "header" ? "编辑header" : "编辑body" }}
      </div>
      <div style="padding: 20px">
        <div style="text-align: left">{{ State.currentNode.pos }}内容：</div>
        <el-input size="small" v-model="State.input"></el-input>
      </div>
      <div>
        <el-button type="primary" size="small" @click="submit">保存</el-button>
        <el-button size="small" @click="State.drawer = false">取消</el-button>
      </div>
    </el-drawer>
    <el-dialog
      v-model="syncModal.modal"
      :title="syncModal.modalTitle"
      width="30%"
    >
      <div>
        <div style="text-align: left">header内容：</div>
        <el-input
          size="small"
          v-model="syncModal.modelParams.header"
        ></el-input>
      </div>
      <div>
        <div style="text-align: left; margin-top: 20px">body内容：</div>
        <el-input size="small" v-model="syncModal.modelParams.body"></el-input>
      </div>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="syncModal.modal = false">Cancel</el-button>
          <el-button type="primary" @click="syncModal.modelSure">
            确定
          </el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import workflow from "sun-flow";
import { reactive } from "vue";
import { ElMessageBox } from "element-plus";
let workflowIns = null;

const State = reactive({
  input: "",
  drawer: false,
  flag: true,
  currentNode: {
    pos: null,
    node: null,
  },
  flowData: [
    {
      nodeType: 1,
    },
  ],
});

const syncModal = reactive(
  (() => {
    let _callback = null;
    let _node = null;
    return {
      modal: false,
      nodeType: null,
      modalTitle: "",
      modelParams: {
        header: "",
        body: "",
      },
      modelSure() {
        console.log("确定", _node);
        syncModal.modal = false;
        _callback(syncModal.modelParams);
      },
      modelShow(callback, node) {
        syncModal.modal = true;
        syncModal.modalTitle = node.nodeName;
        _callback = callback;
        _node = node;
      },
    };
  })()
);

const controllMiddleWareConfig = {
  /**
   * @param {*} node
   * @param {*} next
   * @param {*} stop
   */
  add: function addNode(node, next) {
    console.log("添加", node);
    if (node.nodeType !== 6) {
      syncModal.modelShow(next, node);
    } else next();
  },
  /**
   * @param {*} node
   * @param {*} next
   * @param {*} stop
   */
  remove: async function removeNode(node, next) {
    await ElMessageBox.confirm("确定删除该节点吗", "提示", {
      confirmButtonText: "确定",
      cancelButtonText: "取消",
    });
    next();
    console.log("移除", node);
  },
};

const bodyClick = (node) => {
  State.currentNode = {
    node,
    pos: "body",
  };
  State.input = node.bodyContent;
  State.drawer = true;
};

const headerClick = (node) => {
  State.currentNode = {
    pos: "header",
    node,
  };
  State.input = node.headerContent;
  State.drawer = true;
};

const submit = () => {
  console.log("提交");
  if (State.currentNode.pos == "header") {
    State.currentNode.node.setHeader(State.input);
  } else {
    State.currentNode.node.setBody(State.input);
  }

  State.drawer = false;
};

const getWorkflowIns = (ins) => {
  workflowIns = ins;
};

const getWorkflowData = () => {
  alert(JSON.stringify(workflowIns.getFlowData()));
};
</script>
<style>
.workflow__drawer_header {
  padding: 20px;
  font-size: 16px;
  text-align: left;
}
.workflow__edit {
  position: fixed;
  top: 20px;
  left: 20px;
}
.btn {
  background: rgb(45, 112, 248);
  color: #fff;
  padding: 6px 12px;
  border-radius: 4px;
  text-align: center;
  cursor: pointer;
}
.active {
  background: rgb(45, 112, 248);
  color: #fff;
}
</style>
