var wDown = false;
var aDown = false;
var sDown = false;
var dDown = false;
var addr = new URL(document.location.href).searchParams.get('address');
$('#player').src = new URL(document.location.href).searchParams.get('skin');
var name = new URL(document.location.href).searchParams.get('name');
var questions = [
  '1 + 1 =',
  '7 + 8 =',
  '3 + 4 =',
  '11 - 4 =',
  '12 - 6 =',
  '123 - 3 =',
  '1 - 1 =',
  '4 + 10 =',
  '2 + 2 =',
  '4 - 2 ='
]
var answers = [
  '2',
  '15',
  '7',
  '7',
  '6',
  '120',
  '0',
  '14',
  '4',
  '2'
]
var ammo = 5;
var people = {};
var ctx = $('#canvas').getContext('2d');
function connect() {
  request('http://' + addr + '/join?name=' + name, function(data) {});
}
function disconnect() {
  request('http://' + addr + '/leave?name=' + name, function(data) {});
}
setInterval(function() {
  request('http://' + addr + '/get', function(data) {
    people = JSON.parse(data);
  });
  $('#canvas').width = $('#canvas').width;
  if (wDown) {
    request('http://' + addr + '/up?name=' + name, function(data) {});
  }
  if (aDown) {
    request('http://' + addr + '/left?name=' + name, function(data) {});
  }
  if (sDown) {
    request('http://' + addr + '/down?name=' + name, function(data) {});
  }
  if (dDown) {
    request('http://' + addr + '/right?name=' + name, function(data) {});
  }
  for (var person in people) {
    ctx.drawImage($('#shot'), people[person].shotX, people[person].shotY);
    ctx.drawImage($('#player'), people[person].x, people[person].y);
    ctx.font = '30px Arial';
    ctx.fillText(person + ': ' + people[person].hp + '/100 HP', people[person].x, people[person].y);
  }
  
}, 100);
document.onkeydown = function(event) {
  if (event.code == 'KeyW') {
    wDown = true;
  }
  if (event.code == 'KeyA') {
    aDown = true;
  }
  if (event.code == 'KeyS') {
    sDown = true;
  }
  if (event.code == 'KeyD') {
    dDown = true;
  }
}
$('#canvas').onclick = function(event) {
  if (ammo > 0) {
    var rect = $('#canvas').getBoundingClientRect();
    var x = event.clientX - rect.left;
    var y = event.clientY - rect.top;
    request('http://' + addr + '/shoot?name=' + name + '&x=' + (x - 100) + '&y=' + (y - 100), function(data) {});
    $('#shotsound').currentTime = 0;
    $('#shotsound').play();
    ammo -= 1;
  }
  else {
    var question = Math.round(Math.random() * 10);
    console.log(question);
    if (prompt(questions[question]) == answers[question]) {
      $('#correct').currentTime = 0;
      $('#correct').play();
      ammo = 5;
    }
    else {
      $('#incorrect').currentTime = 0;
      $('#incorrect').play();
    }
  }
}
document.onkeyup = function(event) {
  if (event.code == 'KeyW') {
    wDown = false;
  }
  if (event.code == 'KeyA') {
    aDown = false;
  }
  if (event.code == 'KeyS') {
    sDown = false;
  }
  if (event.code == 'KeyD') {
    dDown = false;
  }
}
