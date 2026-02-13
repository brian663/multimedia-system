    let img, vid, song;
     let currentMedia = null;
      let isPlaying = false;

        let audioAmplitude; // for animation

        const defaultMedia = [
            { type: 'video', name: 'Sample Video 1', url: '/empty-example/vid1.mp4' },
            { type: 'video', name: 'Sample Video 2', url: '/empty-example/vid2.mp4' },
            { type: 'audio', name: 'Sample Audio', url: '/empty-example/aud1.mp3' }
        ];

        function setup() {
            let cnv = createCanvas(800, 500);
            cnv.parent("canvas-container");
            background(20);

            audioAmplitude = new p5.Amplitude();

            const gallery = document.getElementById('gallery');

            // Load default media
            defaultMedia.forEach(media => {
                let item = document.createElement('div');
                item.className = 'gallery-item';
                item.textContent = `${media.type.toUpperCase()}: ${media.name}`;
                gallery.appendChild(item);

                item.addEventListener('click', () => {
                    clearMedia();

                    if (media.type === 'video') {
                        vid = createVideo([media.url]);
                        vid.hide();
                        currentMedia = 'video';
                        vid.play();
                        isPlaying = true;
                        document.getElementById('playToggle').textContent = '⏸️';
                    } 
                    else if (media.type === 'audio') {
                        song = loadSound(media.url, () => {
                            currentMedia = 'audio';
                            song.play();
                            isPlaying = true;
                            document.getElementById('playToggle').textContent = '⏸️';
                        });
                    }
                });
            });

           
            gallery.children[0].click();

            document.getElementById('fileUpload').addEventListener('change', e => {
                let file = e.target.files[0];
                if (file) {
                    let url = URL.createObjectURL(file);
                    let item = document.createElement('div');
                    item.className = 'gallery-item';
                    item.textContent = `File: ${file.name} (${file.type})`;
                    gallery.appendChild(item);

                    item.addEventListener('click', () => {
                        clearMedia();

                        if (file.type.startsWith('image')) {
                            img = loadImage(url, () => {
                                currentMedia = 'image';
                                isPlaying = false;
                                document.getElementById('playToggle').textContent = '▶️';
                            });
                        } else if (file.type.startsWith('video')) {
                            vid = createVideo([url]);
                            vid.hide();
                            currentMedia = 'video';
                            vid.play();
                            isPlaying = true;
                            document.getElementById('playToggle').textContent = '⏸️';
                        } else if (file.type.startsWith('audio')) {
                            song = loadSound(url, () => {
                                currentMedia = 'audio';
                                song.play();
                                isPlaying = true;
                                document.getElementById('playToggle').textContent = '⏸️';
                            });
                        }
                    });
                }
            });

            document.getElementById('playToggle').addEventListener('click', () => {
                if (currentMedia === 'video' && vid) {
                    if (!isPlaying) {
                        vid.play();
                        isPlaying = true;
                        document.getElementById('playToggle').textContent = '⏸️';
                    } else {
                        vid.pause();
                        isPlaying = false;
                        document.getElementById('playToggle').textContent = '▶️';
                    }
                }
                if (currentMedia === 'audio' && song) {
                    if (!isPlaying) {
                        song.play();
                        isPlaying = true;
                        document.getElementById('playToggle').textContent = '⏸️';
                    } else {
                        song.pause();
                        isPlaying = false;
                        document.getElementById('playToggle').textContent = '▶️';
                    }
                }
            });
        }

        function clearMedia() {
            if (vid) {
                vid.stop();
                vid.remove();
                vid = null;
            }
            if (song) {
                song.stop();
                song = null;
            }
            img = null;
            currentMedia = null;
        }

        function draw() {
            background(20);
            if (currentMedia === 'image' && img) {
                let aspect = img.width / img.height;
                let displayW = width;
                let displayH = width / aspect;
                if (displayH > height) {
                    displayH = height;
                    displayW = height * aspect;
                }
                image(img, (width - displayW) / 2, (height - displayH) / 2, displayW, displayH);
            }
            if (currentMedia === 'video' && vid) {
                let aspect = vid.width / vid.height;
                let displayW = width;
                let displayH = width / aspect;
                if (displayH > height) {
                    displayH = height;
                    displayW = height * aspect;
                }
                image(vid, (width - displayW) / 2, (height - displayH) / 2, displayW, displayH);
            }
            if (currentMedia === 'audio' && song && isPlaying) {

                let level = audioAmplitude.getLevel();
                let barCount = 50;
                let spacing = width / barCount;
                fill(224, 163, 43);
                noStroke();
                for (let i = 0; i < barCount; i++) {
                    let h = map(level, 0, 0.5, 10, height);
                    rect(i * spacing, height - h, spacing * 0.8, h);
                }
            }
        }