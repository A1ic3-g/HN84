function applyPixelationEffect() {
    const pixelationFactor = 2;

    const gameCanvas = document.getElementById('pacmanCanvas');
    const gameCtx = gameCanvas.getContext('2d');
    const offScreenCanvas = document.createElement('canvas');
    const offScreenCtx = offScreenCanvas.getContext('2d');

    offScreenCanvas.width = gameCanvas.width / pixelationFactor;
    offScreenCanvas.height = gameCanvas.height / pixelationFactor;

    // Disable image smoothing on both contexts
    offScreenCtx.imageSmoothingEnabled = false;
    gameCtx.imageSmoothingEnabled = false;

    function pixelate() {
        offScreenCtx.drawImage(gameCanvas, 0, 0, offScreenCanvas.width, offScreenCanvas.height);
        
        gameCtx.clearRect(0, 0, gameCanvas.width, gameCanvas.height);
        gameCtx.drawImage(offScreenCanvas, 0, 0, gameCanvas.width, gameCanvas.height);

        requestAnimationFrame(pixelate);
    }

    pixelate();
}

window.onload = applyPixelationEffect;
