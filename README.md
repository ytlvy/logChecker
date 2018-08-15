### DESC

这个工具是用来接收客户端日志HTTP POST转发, 并实时显示的


### install

1. install nodejs and npm

```
https://nodejs.org/zh-cn/
```

mac
```
brew install npm
```

2. install packages

```
npm install
```

2. run app

```
npm start
```

or

```
./start
```


### autoLogin

```
npm install -g forever
```


```
crontab -u yanjie.guo -e
@reboot @reboot /home/yanjie.guo/apps/bin/forever start -o out.log -e err.log /home/yanjie.guo/logChecker/app.js
```

