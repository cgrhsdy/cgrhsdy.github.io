# 个人主页

沈阳理工大学 · 信息科学与工程学院 · 网络工程专业 的个人静态主页。

## 在线访问

**https://cgrhsdy.github.io/**

## 项目说明

这是一个**纯静态**网页，不依赖任何后端服务，也不需要构建步骤：

- 无外部依赖 —— 不引用任何 CDN、在线字体或图标库，断网也能正常显示
- 图标全部使用内联 SVG
- 响应式布局，手机、平板、桌面都能正常浏览
- 支持打印（会隐藏按钮、去掉阴影）

## 文件结构

```
personal-page/
├── index.html      页面主体（语义化 HTML5）
├── style.css       样式（CSS 变量 + 媒体查询）
├── .nojekyll       告诉 GitHub Pages 跳过 Jekyll 处理
└── README.md       本文件
```

## 页面结构

| 区块 | 内容 |
| --- | --- |
| 顶部 | 标识、学校、学院、专业 |
| 01 关于我 | 个人介绍与学习态度 |
| 02 基本信息 | 标识 / 学校 / 学院 / 专业 四张卡片 |
| 03 专业方向 | 网络工程的主要学习方向 |
| 04 联系方式 | 电子邮箱（含一键复制） |

## 本地预览

直接用浏览器打开 `index.html` 即可，无需启动服务器。

如果想用本地服务器预览（更接近线上效果）：

```powershell
cd D:\play_do\personal-page
python -m http.server 8000
# 然后浏览器访问 http://localhost:8000
```

## 部署方式

通过 **GitHub Pages** 部署：仓库名为 `cgrhsdy.github.io`，
Pages 从 `main` 分支根目录发布，推送到 `main` 后会自动重新构建。

## 更新方法

修改 `index.html` 或 `style.css` 后：

```powershell
git add -A
git commit -m "更新个人主页"
git push
```

推送后约 1 分钟，线上页面会自动更新。
