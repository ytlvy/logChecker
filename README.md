### DESC

这个工具是用来接收客户端日志HTTP POST转发, 并实时显示的


### install

1. 下载 nodejs 安装包

```
https://nodejs.org/zh-cn/
```

2. 打开命令行软件 进入当前目录

比如文件目录
```
cd ~/Documents/logChecker
```

或者下载目录
```
cd ~/Downloads//logChecker
```

3. 安装必要支持包
```
npm install
sudo npm -g  install forever
```


4. 设置执行权限

```
chmod +x ./st*
```

5. run app

```
./start
```

6. 打开 浏览器 查看是否服务启动成功
```
http://localhost:19909/
```

7. 修改 localhost 为本机局域网 ip

```
http://192.168.1.108:19909/
```



### autoLogin(以下为高级操作不用关)

```
npm install -g forever
```


```
crontab -u yanjie.guo -e
@reboot @reboot /home/yanjie.guo/apps/bin/forever start -o out.log -e err.log /home/yanjie.guo/logChecker/app.js
```

