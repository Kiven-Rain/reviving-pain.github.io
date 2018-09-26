
> 使用vue构建的第三方社区网站

[源码github](https://github.com/Reviving-Pain/reviving-pain.github.io)

[在线预览](https://reviving-pain.github.io/dist/#/)

## Build Setup

```
# 下载代码到本地目录
git clone

# 进入到项目目录下执行
npm install

# 运行项目
npm run dev

# 打包项目
npm run build
```

## 关于项目运行起来之后如何登录的问题
> 在这里说明一下，由于cnode社区没有提供用户名密码登录返回token的登录形式接口，所以,这里只能直接使用token进行登录，请保存好自己的token

1. 用自己的github账号登入CnodeJS社区 具体网址是https://cnodejs.org/

2. 注册好之后点击右上角的设置，在页面的最下方找到自己的 Access Token 字符串

3. 在项目主页的登录弹窗中输入自己的token码，检测认证信息(没有弹窗可以点击页面顶部的头像在弹出菜单中选择进行登录)

4. 然后就可以进行话题发布，收藏话题，发表评论，给评论点赞等等活动啦~

For a detailed explanation on how things work, check out the [guide](http://vuejs-templates.github.io/webpack/) and [docs for vue-loader](http://vuejs.github.io/vue-loader).
