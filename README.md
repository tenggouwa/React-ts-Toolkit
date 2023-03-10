# react-init

> react16, webpack5构建


## Auther

> Tenggouwa


## 用途

> 构建项目脚手架


## 项目结构 ##

```
.
├── package.json  --------------------- 项目配置
├── README.md  ------------------------ 说明文件
├── build  ---------------------------- 构建代码文件
├── index.html  ----------------------- 入口页面
└── src  ------------------------------ 源码目录
    ├── assets  ----------------------- 项目资源文件目录（图片、字体等）
    ├── components  ------------------- 业务模块集合目录（组件）
    ├── fetch  ------------------------ ajax请求管理文件
    ├──   └── api  -------------------- 请求配置 (axios ajax配置管理文件)
    ├── pages  ------------------------ 页面集合目录
    ├── redux  --------------------- redux文件目录
    ├── App.js  ----------------------- react公共配置文件
    └── index.js  ---------------------- 项目级入口配置文件
```

## 环境准备

``` bash
# 安装依赖
npm install || yarn

# 启动本地调试 localhost:3002
npm run dev || yarn dev

# 本地打包压缩
npm run build || yarn build

```

## 开发细则

+ 框架
  + React15 / React16
+ UI库
  + 使用arco.design
    + 尽量通过arco实现现有内容
+ 路由使用
  + React16
    + 跳转
      ```
        import { useHistory } from 'react-router-dom';
        const history = useHistory()
        history.push('/trade')
      ```
    + 获取当前路由
      + 
      ```
        import { useLocation } from 
        const location = useLocation();
      ```
+ 组件（components文件夹下）
  + 原则上尽量开发无状态组件, 通过hook控制状态;
  + 若有需要类组件 需要特殊命名 使用小驼峰 并采用`business{Xxx}`格式。例如 `businessTradeInput`;
  + 与业务过于耦合 并且 没有复用需求的组件 开发在对应`pages`文件夹下
+ 页面上的枚举值
  + 需要单独接到`pages`文件夹下的与index.js 同级的 constants.js文件下 并在需要的地方使用;
+ 样式
  + 页面上的样式能使用flex的 使用flex布局
  + 尽量少用position来定位
  + 页面上的 背景颜色 字颜色 字体大小 基本都在styles/common.scss 文件下 在 scss 文件下 引入该文件后 可以直接通过`color: $color_black;`使用 (原则上不再在页面里使用特殊颜色)