function onDocumentReady() {
  require('./game.js');
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', onDocumentReady);
} else {
  onDocumentReady();
}