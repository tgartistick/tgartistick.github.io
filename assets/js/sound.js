/* artistick — звук: старт после клика «войти», кнопка-переключатель */
(function () {
  'use strict';

  var KEY = 'artistick.sound';

  var enter = document.querySelector('[data-enter]');
  if (enter) {
    enter.addEventListener('click', function () {
      try { localStorage.setItem(KEY, '1'); } catch (e) {}
    });
  }

  var audio = document.getElementById('track');
  if (!audio) return;

  var toggles = document.querySelectorAll('[data-sound]');
  var texts = document.querySelectorAll('[data-sound-text]');

  audio.volume = 0.45;

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
    var p = audio.play();
    if (p && typeof p.then === 'function') {
      p.then(function () { paint(true); }).catch(function () { paint(false); });
    } else {
      paint(true);
    }
  }

  function toggle() {
    if (audio.paused) play();
    else { audio.pause(); paint(false); }
  }

  for (var k = 0; k < toggles.length; k++) {
    toggles[k].addEventListener('click', toggle);
  }

  audio.addEventListener('play', function () { paint(true); });
  audio.addEventListener('pause', function () { paint(false); });

  try {
    if (localStorage.getItem(KEY) === '1') play();
  } catch (e) {}

  /* если браузер всё же не дал автозапуск — включим на первом касании */
  function onFirstGesture() {
    document.removeEventListener('pointerdown', onFirstGesture);
    if (audio.paused) play();
  }
  document.addEventListener('pointerdown', onFirstGesture);
})();
