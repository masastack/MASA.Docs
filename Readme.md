# 正在改版中，暂时兼容新老两版共存

## 快速开始（新版文档）

### 运行调试

* 打开 `Masa.Docs.sln`

* 运行`Masa.Docs.Server`

### 编写文档

* 内容存放到`doc-content`
  
  > `Masa.Docs.Shared`的csproj里设置了compile link，将自动从 `*.sln` 同级寻找`doc-content`和`DocContent`目录链接到项目的`Content`内

## 快速开始(老版文档)

* 安装 `yarn`

* 进入`docs`文件夹

* 首次先运行一下命令`yarn`

* 添加导航：修改 `./vuepress/config.ts`的`themeConfig.series`，根据文档是Stack还是Framework到对应的json里添加文档即可
  
  > 文档不要都放到guide文件夹里
  > 
  > 另外建议先加导航，在加文档。改config.ts要重启才能生效

* 运行 `yarn dev`

* 在`Framework`和`Stack`中编写markdown文档
  
  > 第一次写先例子 Stack/guide/introduce
