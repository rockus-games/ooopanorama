function videoPlay(e) {
    if (e.paused) {
        e.play();
    } else {
        e.pause();
    }
}
