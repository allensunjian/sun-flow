/*
 * Copyright (c) 2023 by Allen_sun email: Allen_sun_js@hotmail.com, All Rights Reserved.
 */

import { h } from "vue";

import icon_ApproverNode from "./img/icon_ApproverNode.png";
import icon_CcNode from "./img/icon_CcNode.png";
import ico_AgentNode from "./img/ico_AgentNode.png";
import icon_ConditionNode from "./img/icon_ConditionNode.png";
import icon_add from "./img/icon_add.png";
import icon_close from "./img/icon_close.png";
import icon_close_white from "./img/icon_close--white.png";
import icon_arrow_right from "./img/icon_arrow_right.png";
import {
  ProcessNode,
  AddConditionNode,
  InitiatorNode,
  ApproverNode,
  CcNode,
  AgentNode,
  ConditionNode,
} from "./abstract/baseClass";

// the end of next line is controll-panel renderer
let renderedPanelInstances = [];

const AbstractControllBtn = function (
  text,
  handleClass,
  nodeType,
  icon,
  disabled,
  scope,
  currentNode,
  parentNode
) {
  return h(
    "div",
    {
      class: [
        "workflow__controll_btn",
        handleClass,
        disabled ? "workflow__controll_disabled" : "",
      ],
      onclick: function () {
        if (disabled) return;
        const middleware = middlewareDispatchCenter("add", {
          nodeName: text,
          nodeType,
          currentNode,
        });
        middleware.then(({ header, body } = {}) => {
          if (nodeType == 6) {
            // [添加条件] 节点
            if (currentNode.nodeType == -2) {
              parentNode.splice(
                currentNode.pos + 1,
                0,
                renderMethods.getConditionGroup()
              );
            } else {
              currentNode.reference.splice(
                currentNode.pos + 1,
                0,
                renderMethods.getConditionGroup()
              );
            }
            return;
          }

          let AbstractNode = eval(`new ${NodeCreaterMap[nodeType]}()`);
          if (header) AbstractNode.setHeader(header);
          if (body) AbstractNode.setBody(body);
          // 添加条件节点 后增加其它节点
          if (currentNode.nodeType == -2) {
            if (nodeType == 6)
              return console.error(
                "创建节点错误",
                "条件节点下不允许条件节点的存在"
              );
            return currentNode.currentProcess.splice(currentNode.pos + 1, 0, {
              node: AbstractNode,
            });
          }
          currentNode.reference.splice(currentNode.pos + 1, 0, {
            node: AbstractNode,
          });
        });
      },
    },
    [
      h("img", {
        class: "workflow__controll_icon",
        src: icon,
      }),
      text,
    ]
  );
};
const controllPanelInstance = (currentNode, parentNode) => {
  const defaultControllIcon = {
    2: icon_ApproverNode,
    3: icon_CcNode,
    4: ico_AgentNode,
    6: icon_ConditionNode,
  };
  const defaultControlls = [
    ["审批人", "", 2, icon_ApproverNode, false],
    ["抄送人", "", 3, icon_CcNode, false],
    ["办理人", "", 4, ico_AgentNode, false],
    ["条件", "", 6, icon_ConditionNode, false],
  ];
  const Panel = (scope) => {
    let controlls = [];
    if (REF.panelControlls && REF.panelControlls.length > 0) {
      controlls = REF.panelControlls.map((controll) => [
        controll.text,
        controll.class,
        controll.nodeType,
        defaultControllIcon[controll.nodeType],
        controll.disabled,
      ]);
    } else {
      controlls = defaultControlls;
    }
    return h(
      "div",
      {
        class: "workflow__controll_panel",
      },
      controlls.map((btnInfo) =>
        AbstractControllBtn.apply(null, [
          ...btnInfo,
          scope,
          currentNode,
          parentNode,
        ])
      )
    );
  };

  const AddBtn = function (handleClass, panel, scope) {
    return h(
      "div",
      {
        class: `workflow__addbtn ${handleClass}`,
        onclick: function () {
          renderedPanelInstances.forEach((ins) => (ins.showPanel = false));
          scope.showPanel = true;
        },
      },
      [
        h("img", { src: icon_add, class: "workflow__addbtn" }),
        scope.showPanel ? panel : "",
      ]
    );
  };

  return {
    render: function () {
      renderedPanelInstances.push(this);
      return REF.edit ? AddBtn(this.handleClass, Panel(this), this) : "";
    },
    props: {
      handleClass: {
        type: String,
        default: "",
      },
    },
    data: () => ({
      showPanel: false,
    }),
  };
};

// the end of next line is workflow
let REF = null;

let renderMethods = {
  0: function (scope, zIndex) {
    return h(
      "div",
      {
        class: [
          `workflow__relative workflow__node_${
            scope.nodeType == 0 ? "start" : "end"
          }`,
        ],
        style: `z-index: ${zIndex}`,
      },
      [
        h("div", {
          class: "workflow__node_point",
          style: `width: ${scope.width}px;height:${scope.height}px;background:${scope.bgColor}`,
        }),
        h(
          "span",
          { style: `foint-size:${scope.fontSize}px;color:${scope.bgColor}` },
          scope.nodeType == 0 ? "开始节点" : "结束节点"
        ),
      ]
    );
  },
  1: (scope, zIndex) => {
    // nodeType == 1 无法被删除， 因为是开始节点
    return h(
      "div",
      {
        class:
          "workflow__relative wokflow__node workflow__cursor " +
          "workflow__node_" +
          scope.nodeType,
        style: `width:${scope.width}px;z-index: ${zIndex}`,
      },
      [
        h(
          "div",
          {
            class: "workflow__header",
            style: `height: ${scope.headerHeight}px;background:${scope.headerBg};color:${scope.titleColor}`,
            onclick: headerClick(scope),
          },
          [
            scope.getHeaderContent(),
            scope.nodeType == 1
              ? ""
              : REF.edit
              ? h("img", {
                  class: "workflow__header_close",
                  onclick: scope.removeNode.bind(scope),
                  src: icon_close,
                })
              : "",
          ]
        ),
        h(
          "div",
          {
            class: "workflow__body",
            onclick: bodyClick(scope),
          },
          [scope.getBodyContent()]
        ),
        h(controllPanelInstance(scope), {
          handleClass: "workflow__addbtn_1",
        }),
      ]
    );
  },
  2: (scope, zIndex) => {
    return h(
      "div",
      {
        class: "workflow__node_condition workflow__cursor",
        style: `height:${scope.height}px;width:${scope.width}px;z-index: ${
          zIndex + 999
        };${REF.edit ? "opacity:1;" : "opacity:0;margin-bottom: 0"}`,
        onclick() {
          if (!REF.edit) return;
          const middleware = middlewareDispatchCenter("add", {
            nodeName: "条件",
            nodeType: 5,
            currentNode: scope.orginInfo,
          });
          middleware.then(() => {
            scope.reference.push([
              { node: new UseConditionNode({ num: scope.reference.length }) },
            ]);
          });
        },
      },
      [
        "添加条件",
        REF.edit
          ? h("img", {
              class: "workflow__header_close",
              onclick: scope.removeNode.bind(scope),
              src: icon_close_white,
            })
          : "",
      ]
    );
  },
  3: (scope, zIndex) => {
    return h("span", {
      class: "supplement__line",
      style: `z-index: ${zIndex}`,
    });
  },
  getConditionGroup: () => ({
    node: new UseAddConditionNode(),
    children: [
      [{ node: new UseConditionNode({ num: 1 }) }],
      [{ node: new UseConditionNode({ num: 2 }) }],
    ],
  }),
};
/***
 * middlewareDispatchCenter 控制中间件 调度中心
 * @controllType add/remove/edit/search 增删改查
 * 提供 当前节点信息(scope) next函数（手动控制删除） stop(终止当前操作)
 **/

const middlewareDispatchCenter = (controllType, scope) => {
  return new Promise((next, stop) => {
    if (REF.controllMiddleware) {
      if (REF.middlewareConfig && REF.middlewareConfig[controllType]) {
        REF.middlewareConfig[controllType](scope, next, stop);
      } else {
        console.error("暂无控制中间件【" + controllType + "】");
        stop();
      }
    } else next();
  });
};
// 节点挂在的真是节点render方法
const nodeRender = function (zIndex) {
  return renderMethods[this.type] && renderMethods[this.type](this, zIndex);
};
// 节点真是挂在的删除节点方法
const removeNodeMethod = function (e) {
  const nodeType = this.nodeType;
  // const reference = this.reference;
  const referencePos = this.pos;
  const parentNode = this.parentNode;
  const parentNodePos = this.parentNodeIndex;
  // 两个节点以下无法删除
  if (nodeType == 5) {
    if (parentNode.length <= 2)
      return REF.$emit("error", { text: "至少保留两个节点", errcode: 1 });
  }

  const middleware = middlewareDispatchCenter("remove", this);
  middleware.then(() => {
    if (nodeType == 5) {
      // 删除条件节点其中一个
      if (parentNode.length <= 2) {
        return console.error("至少两个条件");
      }
      return parentNode.splice(parentNodePos, 1);
    }

    if (nodeType == -2) {
      return this.currentProcess.splice(this.pos, 1);
    }
    this.reference.splice(referencePos, 1);
  });

  e.stopPropagation();
};
// 节点真实挂载 setNodeOriginInfo 方法
const setNodeOriginInfo = function (orginInfo) {
  this.orginInfo = orginInfo;
};
const headerClick = (node) =>
  function () {
    REF.$emit("headerClick", node);
  };
const bodyClick = (node) =>
  function () {
    REF.$emit("bodyClick", node);
  };
// header 自定义内容渲染函数
const handlerHeaderRender = function (content) {
  this.headerContent = content;
};

// body 自定义内容渲染函数
const handlerBodyRender = function (content) {
  this.bodyContent = content;
};

const getHeaderContent = function () {
  return this.headerContent ? this.headerContent : this.title;
};

const getBodyContent = function () {
  return this.bodyContent
    ? this.bodyContent
    : h(
        "div",
        { style: "display: flex;justify-content: space-between;color:#BFBFBF" },
        [
          h("span", {}, [`请设置${this.title}`]),
          h(
            "img",
            { class: "workflow__body_arrow", src: icon_arrow_right },
            []
          ),
        ]
      );
};

// class AbstractBuilinMethods {
//   constructor() {
//     this.nodeRender = nodeRender;
//     this.removeNodeMethod = removeNodeMethod;
//   }
// }

// todo: 在原始类中 不应该包括业务方法和属性 需要提出来 比如 nodeRender, removeNodeMethod 之类
// /**
//  * type: 0 // 特殊大类
//  * nodeType 0 开始节点 -1 结束节点
//  */
class UseStartProcessNode extends ProcessNode {
  constructor() {
    super(0, "开始节点", { nodeRender, removeNodeMethod });
  }
}

class UseEndProcessNode extends ProcessNode {
  constructor() {
    super(-1, "结束节点", { nodeRender, removeNodeMethod });
  }
}

// /**
//  * 大类 type 2
//  * nodeType -2 条件分支节点
//  */
class UseAddConditionNode extends AddConditionNode {
  constructor() {
    super({ nodeRender, removeNodeMethod });
    this.setNodeOriginInfo = setNodeOriginInfo;
    this.setBody = handlerBodyRender;
    this.setHeader = handlerHeaderRender;
    this.headerContent = null;
    this.bodyContent = null;
    this.getHeaderContent = getHeaderContent;
    this.getBodyContent = getBodyContent;
  }
}

// nodeType 1 发起人节点
class UseInitiatorNode extends InitiatorNode {
  constructor() {
    super({ nodeRender, removeNodeMethod });
    this.setNodeOriginInfo = setNodeOriginInfo;
    this.setBody = handlerBodyRender;
    this.setHeader = handlerHeaderRender;
    this.headerContent = null;
    this.bodyContent = null;
    this.getHeaderContent = getHeaderContent;
    this.getBodyContent = getBodyContent;
  }
}

// nodeType 2 审批人节点
class UseApproverNode extends ApproverNode {
  constructor() {
    super({ nodeRender, removeNodeMethod });
    this.setNodeOriginInfo = setNodeOriginInfo;
    this.setBody = handlerBodyRender;
    this.setHeader = handlerHeaderRender;
    this.headerContent = null;
    this.bodyContent = null;
    this.getHeaderContent = getHeaderContent;
    this.getBodyContent = getBodyContent;
  }
}

// nodeType 3 抄送人节点
class UseCcNode extends CcNode {
  constructor() {
    super({ nodeRender, removeNodeMethod });
    this.setNodeOriginInfo = setNodeOriginInfo;
    this.setBody = handlerBodyRender;
    this.setHeader = handlerHeaderRender;
    this.headerContent = null;
    this.bodyContent = null;
    this.getHeaderContent = getHeaderContent;
    this.getBodyContent = getBodyContent;
  }
}

// nodeType 4 办理人节点
class UseAgentNode extends AgentNode {
  constructor() {
    super({ nodeRender, removeNodeMethod });
    this.setNodeOriginInfo = setNodeOriginInfo;
    this.setBody = handlerBodyRender;
    this.setHeader = handlerHeaderRender;
    this.headerContent = null;
    this.bodyContent = null;
    this.getHeaderContent = getHeaderContent;
    this.getBodyContent = getBodyContent;
  }
}

// nodeType 5 条件节点
class UseConditionNode extends ConditionNode {
  constructor() {
    super({ nodeRender, removeNodeMethod });
    this.setNodeOriginInfo = setNodeOriginInfo;
    this.setBody = handlerBodyRender;
    this.setHeader = handlerHeaderRender;
    this.headerContent = null;
    this.bodyContent = null;
    this.getHeaderContent = getHeaderContent;
    this.getBodyContent = getBodyContent;
  }
}

const NodeCreaterMap = {
  1: "UseInitiatorNode",
  2: "UseApproverNode",
  3: "UseCcNode",
  4: "UseAgentNode",
  5: "UseConditionNode",
  "-2": "UseAddConditionNode",
  // 防止被tree shark
  UseAgentNode,
  UseCcNode,
  UseApproverNode,
  UseInitiatorNode,
};

// workflow 类
class WorkFlow {
  constructor(nodes) {
    this.nodes = nodes;
  }
  renderFlow() {
    const workFlowGroup = (children, tail, handleClass, zIndex, sort) => {
      return h(
        "div",
        {
          class: [
            tail ? "workflow__group_tail" : "workflow__group",
            handleClass,
            "workflow__group--" + `${sort}`,
          ],
          style: zIndex ? `z-index:${zIndex}` : "",
        },
        children
      );
    };
    let outer = 0;
    let inner = 0;
    const createShortFlow = (
      { nodes, temp, parentNode, parentIndex },
      zIndex
    ) => {
      let maxIndex = nodes.length;
      outer++;
      const currentNodes = temp ? [...nodes, temp] : nodes;
      return workFlowGroup(
        currentNodes.map((nodeIns, index) => {
          if (nodeIns.node.nodeType == -2) {
            // 条件分支情况下；引用自己的子列表,并创建当前流程引用 用于新增
            nodeIns.node.setReference(nodeIns.children);
            nodeIns.node.setCurrentProcess(nodes, index);
          }
          if (nodeIns.children)
            return (() => {
              maxIndex--;
              // temp 用于生成 3 类型节点 （该节点是节点末尾补齐的线）
              let temp = () => ({
                node: {
                  type: 3,
                  nodeRender,
                  setReference: () => {},
                  setParentNode: () => {},
                },
              });
              const retVnode = workFlowGroup(
                [
                  nodeIns.node.nodeRender(maxIndex),
                  // 只有nodeIns.children 时（添加条件节点-条件分支时需要补全）
                  workFlowGroup(
                    nodeIns.children.map((child, index) =>
                      createShortFlow(
                        {
                          nodes: child,
                          temp: temp(),
                          parentNode: nodeIns.children,
                          parentIndex: index,
                        },
                        nodeIns.children.length - index
                      )
                    ),
                    "tail",
                    "",
                    currentNodes.length - index,
                    `${outer}${inner++}`
                  ),
                  h(controllPanelInstance(nodeIns.node, nodes), {
                    handleClass: "workflow__addbtn_tail",
                  }),
                ],
                false,
                "workflow__tail_wrap",
                maxIndex,
                `${outer}${inner++}`
              );
              return retVnode;
            })();
          maxIndex--;
          // 当前node 所处的 数组中 以及位置
          nodeIns.node.setReference(nodes, index);
          // 当前node的 父节点列表 以及父节点所在的 列表中的位置
          nodeIns.node.setParentNode(parentNode, parentIndex);
          return nodeIns.node.nodeRender(maxIndex);
        }),
        false,
        "",
        zIndex,
        `${outer}${inner++}`
      );
    };
    return createShortFlow({ nodes: this.nodes });
  }
}

/**
 * 计算tail边界的原因:
 * 如果“条件分支类型”的节点出现在tail内部，上线的边框计算不会出现问题 计算方式 calc(100% 減去 一个node类型的宽度)
 * 如果"条件分支类型"的节点出现在tail的第一个和第二个内，由于节点的横向的node数量变多导致 计算出现错误 上下边框会超过正确宽度
 * 计算方法：每当flow节点发生更新则重新计算所有tail 节点内部的 第一和最后的宽度 来给 计算方式 赋值
 * */
const computedTailBorder = function () {
  let targetStyleTar = document.getElementById("tailBeforeStyle");
  let textStyleSheet = "";
  if (!targetStyleTar) {
    targetStyleTar = document.createElement("style");
    targetStyleTar.setAttribute("id", "tailBeforeStyle");
    targetStyleTar.setAttribute("type", "text/css");
    document.body.appendChild(targetStyleTar);
  } else {
    targetStyleTar.innerHTML = "";
  }

  Array.prototype.forEach.call(
    document.getElementsByClassName("workflow__tail_wrap"),
    (wrap) => {
      const tail = Array.prototype.find.call(
        wrap.childNodes,
        (wc) => wc.className.indexOf("workflow__group_tail") >= 0
      );
      if (tail) {
        const children = tail.childNodes;
        const first = children[0];
        const last = children[children.length - 1];
        const pc = Array.prototype.find.call(
          wrap.classList,
          (classname) => classname.indexOf("workflow__group--") >= 0
        );
        textStyleSheet += `
                .${pc}>.workflow__group_tail::after {width: calc(100% - ${
          first.offsetWidth / 2 + last.offsetWidth / 2 - 2
        }px) !important;left:${first.offsetWidth / 2 - 1}px !important}
                .${pc}>.workflow__group_tail::before {width: calc(100% - ${
          first.offsetWidth / 2 + last.offsetWidth / 2 - 2
        }px) !important;left:${first.offsetWidth / 2}px !important}
                `;
      }
    }
  );
  targetStyleTar.innerHTML = textStyleSheet;
};
const WorkFlowVnode = function () {
  return {
    props: {
      flowData: {
        type: Object,
        default: () => [],
      },
    },
    render: function () {
      const FlowIns = new WorkFlow(this.flowData);
      return FlowIns.renderFlow();
    },
    mounted: computedTailBorder,
    updated: computedTailBorder,
  };
};

/**
 * nodeType 节点类型 （节点指在页面上 直接展示参与到审批流中的类型）
 * 特殊节点：0 开始节点 -1 结束节点 -2 条件分支节点
 * 常规节点：1 发起人节点 2 审批人节点 3 抄送人节点 4 办理人节点 5 条件节点
 */

const getStartNodeInfo = () => ({
  node: new UseStartProcessNode(),
});
getStartNodeInfo;
const getEndNodeInfo = () => ({
  node: new UseEndProcessNode(),
});

export default {
  name: "workflow",
  render: function () {
    return h(
      "div",
      {
        class: "workflow",
        id: "SUN_WORKFLOW_TARGET",
      },
      [
        h(WorkFlowVnode(), {
          flowData: this.privateFlowData,
          style: `${this.scale ? `transform:scale(${this.scaleSize})` : ""}`,
        }),
        this.scale
          ? h("div", { class: "workflow_indicator" }, [
              h(
                "span",
                {
                  class: "workflow_indicator_btn",
                  onclick: () => {
                    if (this.scaleSize <= 0.5) return;
                    this.scaleSize -= 0.1;
                  },
                },
                ["-"]
              ),
              h(
                "span",
                {
                  class: "workflow_indicator_btn",
                  onclick: () => {
                    if (this.scaleSize >= 1) return;
                    this.scaleSize += 0.1;
                  },
                },
                ["+"]
              ),
              h(
                "span",
                {
                  class: "workflow_indicator_reset",
                  onclick: () => (this.scaleSize = 1),
                },
                ["重置"]
              ),
              h("span", { class: "workflow_indicator_size" }, [
                `缩放：${parseInt(this.scaleSize * 100)}%`,
              ]),
            ])
          : "",
      ]
    );
  },
  data: () => ({
    privateFlowData: [],
    scaleSize: 1,
  }),
  props: {
    /**
     * @scale 开启手动控制方法缩小
     **/
    scale: {
      type: Boolean,
      default: false,
    },
    /**
     * @controllMiddleware
     * 开启控制中间件与middlewareConfig 配合插入 "增删改查" 控件
     * */
    controllMiddleware: {
      type: Boolean,
      default: false,
    },
    /**
     * @middlewareConfig
     * controllMiddleware开启中配置该选项 生效
     * */
    middlewareConfig: {
      type: Object,
      default: () => ({
        // add: function add(node, next, stop) {
        //     console.log("add", node);
        //     next()
        // },
        // remove: function remove(node, next, stop) {
        //     console.log("remove", node);
        //     next()
        // },
        // edit: function edit(node, next, stop) {
        //     console.log("edit", node);
        //     next()
        // },
        // search: function search() {
        //     console.log("search")
        // }
      }),
    },
    /**
     * flowData 识别的结构是 [{},{},{children:[[],[]]}]
     */
    flowData: {
      type: Object,
      default: () => ({}),
    },
    /**
     * @midRender
     * 如果nodeType 和内置类型一致那么 无需开启midRender
     * */
    midRender: {
      type: Boolean,
      default: false,
    },
    /**
     * @nodeRenderer
     * 如果midRender开启 则需要指定 nodeRenderer函数
     * */
    nodeRenderer: {
      type: Function || null,
      default: null,
    },
    /***
     * edit 是否开启编辑
     **/
    edit: {
      type: Boolean,
      default: false,
    },
    panelControlls: {
      type: Array,
      default: () => [],
    },
  },
  beforeCreate() {
    REF = this;
  },
  methods: {
    createAbstractNodes(dataList) {
      return dataList.map((infoNode) => {
        const _infoNode = JSON.parse(JSON.stringify(infoNode));
        if (_infoNode.children) {
          _infoNode.children = _infoNode.children.map((childList) =>
            this.createAbstractNodes(childList)
          );
        }
        // 手动渲染与自动渲染
        let { nodeType, bodyContent, headerContent } = this.midRender
          ? (() => {
              if (!this.nodeRenderer) {
                throw new Error(
                  "[sun-workflow error]: 手动渲染已被打开 midRender: ture 请传入 nodeRender函数"
                );
              }
              const handleNodeInfo = this.nodeRenderer(_infoNode);
              if (!handleNodeInfo) {
                throw new Error(
                  "[sun-workflow error]:nodeRenderer 必须返回 对象并包含节点类型 nodeType， 如: {nodeType: 1}"
                );
              }
              if (!handleNodeInfo.nodeType) {
                throw new Error("[sun-workflow error]:节点类型错误");
              }
              return handleNodeInfo;
            })()
          : infoNode;
        const nodeInstance = eval(`new ${NodeCreaterMap[nodeType]}()`);
        _infoNode.node = nodeInstance;
        if (bodyContent) nodeInstance.setBody(bodyContent);
        if (headerContent) nodeInstance.setHeader(headerContent);
        nodeInstance.setNodeOriginInfo(_infoNode);
        return _infoNode;
      });
    },
    concatAbstractNodes() {
      // 审批流抽象结构
      if (!Array.isArray(this.flowData))
        return console.warn("[sun-workflow error]: flowData 必須是 Array類型");
      this.privateFlowData = [
        // getStartNodeInfo(),
        ...this.createAbstractNodes(this.flowData),
        getEndNodeInfo(),
      ];
    },
    getFlowData(data) {
      return (data || this.privateFlowData).map((item) => {
        let children = null;
        if (item.children) {
          children = item.children.map((items) => this.getFlowData(items));
        }
        return {
          nodeInfo: {
            headerContent: item.node.headerContent,
            bodyContent: item.node.bodyContent,
            nodeType: item.node.nodeType,
            title: item.node.title,
          },
          orginInfo: {
            ...Object.keys(item.node.orginInfo || {})
              .filter((key) => key !== "node")
              .reduce((ref, cur) => {
                if (typeof ref[cur] !== "function") {
                  ref[cur] = item.node[cur];
                }

                return ref;
              }, {}),
          },
          ...(children ? { children } : {}),
        };
      });
    },
  },
  mounted() {
    const target = document.getElementById("SUN_WORKFLOW_TARGET");
    target.onclick = (e) => {
      if (e.target.className.indexOf("workflow__addbtn") == -1)
        renderedPanelInstances.forEach((node) => (node.showPanel = false));
    };
    this.concatAbstractNodes();
  },
  watch: {
    flowData() {
      this.concatAbstractNodes();
    },
  },
};
