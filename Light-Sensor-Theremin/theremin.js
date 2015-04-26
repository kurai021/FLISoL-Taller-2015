function getUuid() {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
    var r = Math.random()*16|0, v = c == 'x' ? r : (r&0x3|0x8);
    return v.toString(16);
  });
}

var deviceId = getUuid();
if ('requestWakeLock' in navigator) {
  var lock = navigator.requestWakeLock('screen');
  window.addEventListener('visibilitychange', function() {
    if (document.hidden) {
      lock.unlock();
    }

    else {
      lock = navigator.requestWakeLock('screen');
    }
  });
}

var wsOpen = false;
var ws;

function connect() {
  ws = new WebSocket('ws://192.168.2.138:8322');
  ws.onopen = () => {
    wsOpen = true;
  };

  ws.onclose = () => {
    wsOpen = false;
    connect();
  };
}
connect();

window.addEventListener('devicelight', function(e) {
  if (wsOpen) {
    ws.send(JSON.stringify({
      type: 'devicelight',
      deviceId: deviceId,
      value: e.value
    }));
  }
});
