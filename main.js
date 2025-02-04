document.addEventListener('DOMContentLoaded', () => {
    const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
  
    if (isMobile) {
      alert('For mobile please switch to "Desktop mode" in your browser settings.'.toUpperCase());
    }
    const icons = document.querySelectorAll('.icon');
    const modal = $('#projectModal');
    const modalBody = $('#modalBody');
    const songListItems = document.querySelectorAll('.song-item');
    const playPauseBtn = document.getElementById('playPauseBtn');
    const nextBtn = document.getElementById('nextBtn');
    const prevBtn = document.getElementById('prevBtn');
    const currentSongTitle = document.getElementById('currentSongTitle');
    const currentSongImage = document.getElementById('currentSongImage');
    const volumeSlider = document.getElementById('volumeSlider');
    const startButton = $('#startButton');
    const startMenu = $('#startMenu');
  

    const audioPlayer = new Howl({
        src: [''],
        autoplay: false,
        volume: 0.5,
        onend: function() {
            playNextSong();
        }
    });

    let isDragging = false;
    let currentIcon = null;
    let currentSongIndex = 0;
    let isPlaying = false;

    const songs = Array.from(songListItems).map(item => ({
        src: item.getAttribute('data-src'),
        title: item.textContent
    }));

    function loadSong(index) {
        const songItem = songListItems[index];
        const songSrc = songItem.getAttribute('data-src');
        const songTitle = songItem.textContent;
        currentSongTitle.textContent = songTitle;
        currentSongImage.src = songSrc.replace('mp3','jpg');
        audioPlayer.unload();
        audioPlayer._src = songSrc;
        audioPlayer.load();
    }

    function playPauseSong() {
        if (isPlaying) {
            audioPlayer.pause();
            playPauseBtn.textContent = '▶';
        } else {
            audioPlayer.play();
            playPauseBtn.textContent = '⏸';
        }
        isPlaying = !isPlaying;
    }

    function playNextSong() {
        currentSongIndex = (currentSongIndex + 1) % songListItems.length;
        loadSong(currentSongIndex);
        audioPlayer.play();
        isPlaying = true;
        playPauseBtn.textContent = '⏸';
    }

    function playPrevSong() {
        currentSongIndex = (currentSongIndex - 1 + songListItems.length) % songListItems.length;
        loadSong(currentSongIndex);
        audioPlayer.play();
        isPlaying = true;
        playPauseBtn.textContent = '⏸';
    }

    function togglePlayPause() {
        if (isPlaying) {
            pauseSong();
        } else {
            playSong();
        }
    }

    function handleDragStart(e) {
        currentIcon = e.target;
        isDragging = true;
        currentIcon.style.position = 'absolute';
        currentIcon.style.zIndex = 1000;
    }

    function handleDragEnd(e) {
        isDragging = false;
        currentIcon = null;
    }

    function handleDrag(e) {
        if (!isDragging) return;
        const { clientX, clientY } = e;
        currentIcon.style.left = `${clientX}px`;
        currentIcon.style.top = `${clientY}px`;
    }

    function setupDraggableIcons() {
    //300 is offset for both cuz icons get over shadowed by music player
    const containerWidth = window.innerWidth - 400; 
    const containerHeight = window.innerHeight - 400; 

        icons.forEach(icon => {
            const iconWidth = icon.offsetWidth;
            const iconHeight = icon.offsetHeight;
    
            let randomX, randomY;
            let isPositionValid = false;
    
            while (!isPositionValid) {
                randomX = Math.floor(Math.random() * (containerWidth - iconWidth));
                randomY = Math.floor(Math.random() * (containerHeight - iconHeight));
    
                if (randomX >= 0 && randomY >= 0 &&
                    randomX + iconWidth <= containerWidth &&
                    randomY + iconHeight <= containerHeight) {
                    isPositionValid = true;
                }
            }
    
            icon.style.position = 'absolute';
            icon.style.left = `${randomX}px`;
            icon.style.top = `${randomY}px`;
            icon.addEventListener('mousedown', handleDragStart);
            icon.addEventListener('mouseup', handleDragEnd);
        });

        document.addEventListener('mousemove', handleDrag);
    }

    playPauseBtn.addEventListener('click', playPauseSong);
    nextBtn.addEventListener('click', playNextSong);
    prevBtn.addEventListener('click', playPrevSong);
    volumeSlider.addEventListener('input', (e) => {
        audioPlayer.volume(e.target.value / 10);
    });

    songListItems.forEach((songItem, index) => {
        songItem.addEventListener('click', () => {
            currentSongIndex = index;
            loadSong(index);
            audioPlayer.play();
            isPlaying = true;
            playPauseBtn.textContent = '⏸';
        });
    });

    setupDraggableIcons();

    // Initial load
    loadSong(currentSongIndex);

    icons.forEach(icon => {
        icon.addEventListener('mousedown', (e) => {
            isDragging = true;
            currentIcon = icon;
            icon.style.zIndex = 1000;
            icon.startX = e.clientX - icon.offsetLeft;
            icon.startY = e.clientY - icon.offsetTop;
        });

        icon.addEventListener('dblclick', (e) => {
            const project = icon.getAttribute('data-project');
            openModal(project);
        });
    });

    document.addEventListener('mousemove', (e) => {
        if (isDragging && currentIcon) {
            currentIcon.style.left = `${e.clientX - currentIcon.startX}px`;
            currentIcon.style.top = `${e.clientY - currentIcon.startY}px`;
        }
    });

    document.addEventListener('mouseup', () => {
        isDragging = false;
        if (currentIcon) {
            currentIcon.style.zIndex = 1;
            currentIcon = null;
        }
    });

    function openModal(project) {
        switch (project) {
            case '2DFluidSolver':
                modalBody.html(`<iframe width="560" height="315" src="https://www.youtube.com/embed/9BaUaAe4TmI?si=QRom_XN0AWaW5BO3" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen></iframe> <br><a href="https://github.com/spyrex69/2D-Fluid-Solver/blob/main/Fluidsim2D.cpp" > CLICK HERE TO SEE MY CODE ON GITHUB </a>`);
                modal.find('.modal-title').text('2D fluid solver');
                break;
            case 'MusicVisualizer':
                modalBody.html(`<iframe  width="800" height="800" src="https://editor.p5js.org/snaved159/full/kxgVyb5mX"></iframe>`);
                modal.find('.modal-title').text('Audio visualization - using the FFT (Fast Fourier transform) provided by p5');
                break; 
            case 'OrbitalGravitySimulation':
                modal.find('.modal-title').text('Orbital Gravity Simulation')
                var content = `<p>Simulates orbital dynamics using vector algebra. Pythagorean theorem in C++. <a href="https://github.com/spyrex69/orbital-gravity-sim" target="_blank">View Repository</a></p>
                            <img src="gravityDemo1.gif" alt="Orbital Gravity Simulation GIF 1" style="width:100%; height:auto;"/>
                            <img src="gravity2SourcesSmall.gif" alt="Orbital Gravity Simulation GIF 2" style="width:100%; height:auto;"/>
                            `;
                modalBody.html(content);                            
                break;
            case 'SpaceWars':
                modal.find('.modal-title').text('Please click on the screen once so it can read input. HOW TO PLAY? LEFT mouse click = bullet, Right mouse click = bomb and arrow/WASD for movement')
                modalBody.html('<iframe src="https://editor.p5js.org/snaved159/full/hKcTgE64E"></iframe>');                            
                break;
            default:
                modalBody.html(`<p>Project not found.</p>`);
        }
        modal.modal('show');
    }

    // Start Menu Logic
    startButton.on('click', function() {
        startMenu.toggle();
    });

    $(document).on('click', function(event) {
        if (!$(event.target).closest('#startButton, #startMenu').length) {
            startMenu.hide();
        }
    });

    $('.start-menu-item').on('click', function() {
        const project = $(this).data('project');
        openModal(project);
        startMenu.hide();
    });

    document.querySelectorAll('.start-menu-item').forEach(item => {
        item.addEventListener('mouseover', (e) => {
            const description = e.currentTarget.querySelector('.start-menu-description');
            description.style.display = 'block';
        });
    
        item.addEventListener('mouseout', (e) => {
            const description = e.currentTarget.querySelector('.start-menu-description');
            description.style.display = 'none';
        });
    
        item.addEventListener('click', () => {
            const project = item.getAttribute('data-project');
            openModal(project);
        });
    });

});
