const panelSideBtn = document.getElementById('panel-side__btn');
const closeBtn = document.getElementById('close-btn');
const panelSide = document.getElementById('panel-side');

panelSideBtn.addEventListener('click', function() {
    panelSide.classList.add('show');
})
closeBtn.addEventListener('click', function() {
    panelSide.classList.remove('show');
})