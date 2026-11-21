/* artistick — один экран: дверь → комната, звук стартует по клику */
(function () {
  'use strict';

  var ROOM_KEY = 'artistick.room';

  var audio = document.getElementById('track');
  var doorView = document.querySelector('[data-view="door"]');
  var roomView = document.querySelector('[data-view="room"]');
  var enter = document.querySelector('[data-enter]');
  var back = document.querySelector('[data-back]');
  var toggles = document.querySelectorAll('[data-sound]');
  var texts = document.querySelectorAll('[data-sound-text]');

  function paint(on) {
    document.body.classList.toggle('is-playing', on);
    for (var i = 0; i < texts.length; i++) {
      texts[i].textContent = on ? 'выключить' : 'включить';
    }
    for (var j = 0; j < toggles.length; j++) {
      toggles[j].setAttribute('aria-pressed', on ? 'true' : 'false');
    }
  }

  function play() {
    if (!audio) return;
    var p = audio.play();
    if (p && typeof p.then === 'function') {
      p.then(function () { paint(true); }).catch(function () { paint(false); });
    } else {
      paint(true);
    }
  }

  function toggle() {
    if (!audio) return;
    if (audio.paused) play();
    else { audio.pause(); paint(false); }
  }

  function isRoom() {
    return !!(roomView && roomView.classList.contains('is-active'));
  }

  function showRoom() {
    if (!roomView) return;
    roomView.classList.add('is-active');
    if (doorView) doorView.classList.remove('is-active');
    document.body.className = 'page page--room';
    document.title = 'artistick — комната';
    if (window.scrollY) window.scrollTo(0, 0);
  }

  function showDoor() {
    if (!doorView) return;
    doorView.classList.add('is-active');
    if (roomView) roomView.classList.remove('is-active');
    document.body.className = 'page page--door';
    document.title = 'artistick';
    if (window.scrollY) window.scrollTo(0, 0);
  }

  if (enter) {
    enter.addEventListener('click', function (event) {
      event.preventDefault();
      showRoom();
      play();
    });
  }

  if (back) {
    back.addEventListener('click', function (event) {
      event.preventDefault();
      showDoor();
    });
  }

  if (audio) {
    audio.volume = 0.45;
    audio.addEventListener('play', function () { paint(true); });
    audio.addEventListener('pause', function () { paint(false); });
  }

  for (var k = 0; k < toggles.length; k++) {
    toggles[k].addEventListener('click', toggle);
  }

  /* старые ссылки на komnata.html приводят сюда — сразу открываем комнату */
  try {
    if (sessionStorage.getItem(ROOM_KEY) === '1') {
      sessionStorage.removeItem(ROOM_KEY);
      showRoom();
    }
  } catch (e) {}

  /* браузеры не дают звук без действия — ловим первое касание уже в комнате */
  function onFirstGesture() {
    document.removeEventListener('pointerdown', onFirstGesture);
    if (audio && audio.paused && isRoom()) play();
  }
  document.addEventListener('pointerdown', onFirstGesture);
})();
