document.addEventListener('DOMContentLoaded', () => {
    const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
  
    if (isMobile) {
      alert('For mobile please switch to "Desktop mode" in your browser settings.'.toUpperCase());
    }
    const icons = document.querySelectorAll('.icon');
    const modal = $('#projectModal');
    const modalBody = $('#modalBody');
    const startButton = $('#startButton');
    const startMenu = $('#startMenu');

    // Setup initial random positions for icons
    function setupIcons() {
        const containerWidth = window.innerWidth - 100; 
        const containerHeight = window.innerHeight - 100; 

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
        });
    }

    setupIcons();

    // Initialize interact.js draggable
    interact('.icon').draggable({
        inertia: true,
        modifiers: [
            interact.modifiers.restrictRect({
                restriction: 'parent',
                endOnly: true
            })
        ],
        autoScroll: true,
        listeners: {
            start (event) {
                event.target.classList.add('dragging');
                event.target.style.zIndex = 1000;
            },
            move (event) {
                const target = event.target;
                
                // Get the current position
                const x = (parseFloat(target.getAttribute('data-x')) || 0) + event.dx;
                const y = (parseFloat(target.getAttribute('data-y')) || 0) + event.dy;
                
                // Update the element's position
                target.style.transform = `translate(${x}px, ${y}px)`;
                
                // Store the position
                target.setAttribute('data-x', x);
                target.setAttribute('data-y', y);
            },
            end (event) {
                event.target.classList.remove('dragging');
                event.target.style.zIndex = 1;
            }
        }
    });

    // Single click/tap to open project, but not if dragging
    let dragHappened = false;
    interact('.icon').on('dragmove', function (event) {
        dragHappened = true;
    });

    icons.forEach(icon => {
        icon.addEventListener('click', (e) => {
            // If drag just happened, do not open modal
            if (dragHappened) {
                dragHappened = false;
                return;
            }
            const project = icon.getAttribute('data-project');
            openModal(project);
        });
        // For touch devices, use Interact.js tap event
        interact(icon).on('tap', function (event) {
            // If drag just happened, do not open modal
            if (dragHappened) {
                dragHappened = false;
                return;
            }
            const project = icon.getAttribute('data-project');
            openModal(project);
        });
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
                            <img src="Assets/gravityDemo1.gif" alt="Orbital Gravity Simulation GIF 1" style="width:100%; height:auto;"/>
                            <img src="Assets/gravity2SourcesSmall.gif" alt="Orbital Gravity Simulation GIF 2" style="width:100%; height:auto;"/>
                            `;
                modalBody.html(content);                            
                break;
            case 'SpaceWars':
                modal.find('.modal-title').text('HOW TO PLAY? LEFT mouse click = bullet, Right mouse click = bomb and arrow/WASD for movement')
                modalBody.html('<p><a href="https://bongseng.itch.io/">Art created by bongseng</a></p> <br><iframe  width="850" height="650" src="https://editor.p5js.org/snaved159/full/hKcTgE64E"></iframe>');                            
                break;
            case 'ClothSim':
                modal.find('.modal-title').text('Cloth simulator')
                modalBody.html('<p><a href="https://superheroslice.pages.dev">Click to check it out on the site</a></p> <br><iframe src="https://superheroslice.pages.dev" width="100%" height="600" frameborder="0"></iframe>');                            
                break;
            case 'EarthQuakes':
              modal.find('.modal-title').text('Visualization of real world Earthquakes in the past 30 days from now around the planet.')
             modalBody.html('<iframe width="1024" height="512" src="https://editor.p5js.org/snaved159/full/lgDSXK8Yc"></iframe>');                            
            break;
            case 'UpWay':
                modal.find('.modal-title').text('UP WAY GAME')
               modalBody.html('<p><a href="https://naved90.itch.io/up-way">Play UP WAY on itch.io</a><br><img src="Assets/gameDemo.gif"  style="width:100%; height:auto;"/>');                            
              break;
            default:
                modalBody.html(`<p>Project not found.</p>`);
        }
        
        // Add loading animation
        modalBody.prepend('<div class="loading-spinner" style="text-align: center; margin-bottom: 15px;"><div class="spinner-border text-primary" role="status"><span class="sr-only">Loading...</span></div></div>');
        
        // Remove spinner after content loads
        setTimeout(() => {
            $('.loading-spinner').remove();
        }, 1000);
        
        modal.modal('show');
    }

    // Start Menu Logic
    startButton.on('click', function() {
        startMenu.toggle();
        
        // Add animation when opening menu
        if (startMenu.is(':visible')) {
            anime({
                targets: '#startMenu',
                opacity: [0, 1],
                translateY: [10, 0],
                easing: 'easeOutExpo',
                duration: 300
            });
        }
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

    // Make descriptions clickable too
    // Enable both hover and click to show start menu descriptions
    document.querySelectorAll('.start-menu-item').forEach(item => {
        // Hover to show
        item.addEventListener('mouseenter', function() {
            item.classList.add('active');
        });
        item.addEventListener('mouseleave', function() {
            item.classList.remove('active');
        });

        // Click to toggle (for accessibility)
        item.addEventListener('click', function(e) {
            if (e.target.classList.contains('start-menu-description')) return;
            item.classList.toggle('active');
            e.stopPropagation();
        });

        // Click description to open modal
        item.querySelector('.start-menu-description').addEventListener('click', function(e) {
            const project = item.getAttribute('data-project');
            openModal(project);
            item.classList.remove('active');
            e.stopPropagation();
        });
    });
    // Hide all submenus if clicking outside
    document.addEventListener('click', function(e) {
        document.querySelectorAll('.start-menu-item').forEach(i => i.classList.remove('active'));
    });


    // Add entrance animation for icons
    anime({
        targets: '.icon',
        scale: [0, 1],
        opacity: [0, 1],
        delay: anime.stagger(100),
        easing: 'easeOutElastic(1, .5)',
        duration: 800
    });
});

