// 初始化
function init() {
  mtl.coop.initialize({
    server: "im-pre.yyuap.com",
    restServer: "im-pre.yyuap.com",
    resourceUploadServer: "im-pre.yyuap.com",
    resourceDownloadServer: "im-pre.yyuap.com",
    serverPort: 5227,
    serverSSLPort: 5223,
    serverEnableSSL: true,
    serverHttps: true,
    appId: "mttest02",
    etpId: "yonyou",
    deviceName: null,
  });
}

// 登录
function login() {
  init();
  let username = document.getElementById("username").value;
  let password = document.getElementById("password").value;
  mtl.coop.login({
    userId: username,
    password: password,
    success: function () {
      getDevices()
      addListener()
    }
  });
}

// 获取设备列表
function getDevices() {
  mtl.coop.getMyDevices({
    success: function (res) {
      loadDevices(res)
    }
  });
}

var _devices = null;

// 在 html 页面上加载设备列表
function loadDevices(devices) {
  var list = document.getElementById("list");
  var count = devices.length;
  list.innerHTML = "";
  for (var i = 0; i < count; i++) {
    let device = devices[i];
    let { appId, deviceModel, deviceName, online } = device;
    let title = appId + '-' + deviceModel + '-' + deviceName + '-' + (online ? '在线' : '离线')
    list.innerHTML +=
      `<a class="weui-cell weui-cell_access" href="javascript:tapCell(${i});">\
      <div class="weui-cell__bd">\
        <p>${title}</p>\
      </div>\
      <div class="weui-cell__ft">\
      </div>\
    </a>`
  }
  _devices = devices;
}

function tapCell(idx) {
  mtl.scanInvoice({
    appCode: "397a546045454397bfa68c918df3bb18",
    success: function (res) {
      var result = res.data;
      let device = _devices[idx]
      mtl.coop.sendCommand({
        commandType: "自定义指令类型",
        to: device,
        commandParams: result,
        receiveReply: function (res) {
          alert("接收到回复消息:" + JSON.stringify(res));
        }
      });
    },
    fail: function (err) {
      alert(err.errMsg);
    }
  });
}

function addListener() {
  mtl.coop.receiveCommand(function (cmd) {
    var commandParams = cmd.commandParams;
    alert('接收到消息:' + JSON.stringify(cmd))
  });
}