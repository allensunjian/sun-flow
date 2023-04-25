import { RoutineNodeSize } from "../config/config";

/**
 * type: 0 // 特殊大类
 * nodeType 0 开始节点 -1 结束节点
 */
class ProcessNode {
  constructor(nodeType, text, { nodeRender, removeNodeMethod }) {
    this.nodeType = nodeType;
    this.text = text;
    this.width = 16;
    this.height = 16;
    this.fontSize = 14;
    this.bgColor = "#E6E6E6";
    this.type = 0;
    this.nodeRender = nodeRender;
    this.reference = [];
    this.pos = 0;
    this.parentNode = null;
    this.parentNode = null;
    this.parentNodeIndex = -1;
  }
  setReference(reference, pos) {
    this.reference = reference;
    this.pos = pos;
  }
  setParentNode(parentNode, parentNodeIndex) {
    this.parentNode = parentNode;
    this.parentNodeIndex = parentNodeIndex;
  }
}

/**
 * 大类 type 2
 * nodeType -2 条件分支节点
 */
class AddConditionNode {
  constructor({ nodeRender, removeNodeMethod }) {
    this.type = 2;
    this.nodeType = -2;
    this.width = 72;
    this.height = 24;
    this.title = "添加条件";
    this.reference = [];
    this.currentProcess = [];
    this.pos = 0;
    this.parentNode = null;
    this.parentNodeIndex = -1;
    // 节点渲染外置方法
    this.nodeRender = nodeRender;
    // 删除节点外置方法
    this.removeNode = removeNodeMethod;
  }
  setReference(reference, pos) {
    this.reference = reference;
    this.pos = pos;
  }
  setParentNode(parentNode, parentNodeIndex) {
    this.parentNode = parentNode;
    this.parentNodeIndex = parentNodeIndex;
  }
  setCurrentProcess(process, pos) {
    this.currentProcess = process;
    // 这里的pos是准确的
    this.pos = pos;
  }
}

// 原始节点 大类 type: 1
class OriginalNode {
  constructor(headerBg, title, titleColor = "#fff", { nodeRender, removeNodeMethod }) {
    this.width = RoutineNodeSize.width;
    this.headerHeight = RoutineNodeSize.headerHeight;
    this.headerBg = headerBg;
    this.title = title;
    this.type = 1;
    this.titleColor = titleColor;
    this.nodeRender = nodeRender;
    this.reference = [];
    this.pos = 0;
    this.parentNode = null;
    this.parentNodeIndex = -1;
    this.removeNode = removeNodeMethod;
  }
  setReference(reference, pos) {
    this.reference = reference;
    this.pos = pos;
  }
  setParentNode(parentNode, parentNodeIndex) {
    this.parentNode = parentNode;
    this.parentNodeIndex = parentNodeIndex;
  }
}

// nodeType 1 发起人节点
class InitiatorNode extends OriginalNode {
  constructor({ nodeRender, removeNodeMethod }) {
    super("#46608C", "发起人", "#fff", { nodeRender, removeNodeMethod });
    this.nodeType = 1;
  }
}

// nodeType 2 审批人节点
class ApproverNode extends OriginalNode {
  constructor({ nodeRender, removeNodeMethod }) {
    super("#F0A818", "审批人", "#fff", { nodeRender, removeNodeMethod });
    this.nodeType = 2;
  }
}

// nodeType 3 抄送人节点
class CcNode extends OriginalNode {
  constructor({ nodeRender, removeNodeMethod }) {
    super("#2D70F8", "抄送人", "#fff", { nodeRender, removeNodeMethod });
    this.nodeType = 3;
  }
}

// nodeType 4 办理人节点
class AgentNode extends OriginalNode {
  constructor({ nodeRender, removeNodeMethod }) {
    super("#E01738", "办理人", "#fff", { nodeRender, removeNodeMethod });
    this.nodeType = 4;
  }
}

// nodeType 5 条件节点
class ConditionNode extends OriginalNode {
  constructor({ nodeRender, removeNodeMethod }) {
    super("#fff", `条件`, "#76CC20", { nodeRender, removeNodeMethod });
    this.nodeType = 5;
  }
}

export {
  ProcessNode,
  AddConditionNode,
  InitiatorNode,
  ApproverNode,
  CcNode,
  AgentNode,
  ConditionNode
};
