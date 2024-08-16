document.addEventListener('DOMContentLoaded', () => {
    const icons = document.querySelectorAll('.icon');
    const modal = $('#projectModal');
    const modalBody = $('#modalBody');
    const songListItems = document.querySelectorAll('.song-item');
    const playPauseBtn = document.getElementById('playPauseBtn');
    const nextBtn = document.getElementById('nextBtn');
    const prevBtn = document.getElementById('prevBtn');
    const currentSongTitle = document.getElementById('currentSongTitle');
    const volumeSlider = document.getElementById('volumeSlider');
    const startButton = $('#startButton');
    const startMenu = $('#startMenu');
    alert("Pleae double click the icons to see result");

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
    const containerWidth = window.innerWidth; // Use viewport width
    const containerHeight = window.innerHeight; // Use viewport height

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
    
            // Apply the positions
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
            case 'Pendulumsketch':
                modalBody.html(`<iframe width="700" height="700" src="https://editor.p5js.org/snaved159/full/Mi4wM-xu2"></iframe>`);
                modal.find('.modal-title').text('Double Pendulum (Randomized parameters per launch)');
                break; 
            case 'MusicVisualizer':
                modalBody.html(`<iframe  width="800" height="800" src="https://editor.p5js.org/snaved159/full/kxgVyb5mX"></iframe>`);
                modal.find('.modal-title').text('Audio visualization');
                break; 
            case 'OrbitalGravitySimulation':
                modal.find('.modal-title').text('Orbital Gravity Simulation')
                var content = `<p>Simulates orbital dynamics using vector algebra. pythagorean theorem in C++. <a href="https://github.com/spyrex69/orbital-gravity-sim" target="_blank">View Repository</a></p>
                            <img src="gravityDemo1.gif" alt="Orbital Gravity Simulation GIF 1" style="width:100%; height:auto;"/>
                            <img src="gravity2SourcesSmall.gif" alt="Orbital Gravity Simulation GIF 2" style="width:100%; height:auto;"/>
                            `;
                modalBody.html(content);                            
                break;
            case 'About':
                modal.find('.modal-title').text('About me')
var content = ` <h5>Hi, I'm Naved and I have 2+ years of professional fullstack developement experience in web developement on the .NET runtime</h5><br>
    <!-- UNICEF EPP 2 Project -->
    <h3><b>1) UNICEF EPP 2</b></h3>
    <p><strong>Company:</strong> Datamatics Global Services Ltd.</p>
    <p><strong>Duration:</strong> April 2022 – April 2023</p>
    <p><strong>Role:</strong> Full Stack Developer</p>
    <p><strong>Technologies:</strong> Dot Net Core, .NET MVC, jQuery, C#, SQL Server, HTML, CSS, Git, Azure DevOps, AngularJS, JavaScript, Stored Procedures</p>
    <p><strong>Description:</strong> This is an online portal where different countries submit their country risks, responses, and actions, which are analyzed to take appropriate actions to avoid these risks.</p>
    <ul>
        <li>Implemented new requirements for the tool. Designed User Interface using HTML5, CSS, JavaScript, jQuery, and AngularJS.</li>
        <li>Implemented asynchronous endpoints and services in the webserver/web API to implement functionalities using Agile methodology</li>
        <li>Gathered requirements from the client and developed the project accordingly using .NET MVC and C#.</li>
        <li>Performed unit testing and regression testing to meet the deadlines of the PBI requirement.</li>
        <li>Wrote complex queries using CTEs (Common Table Expressions), temp tables, table-valued functions, (INNER, LEFT, FULL)s JOINS, and script</li>
        <li>Improved Query Performance and Optimized data CRUDE operations by creating clustered indexes and analysis by using query execution analysis.</li>
    </ul>

    <!-- IOM ePHR Project -->
    <h3>2)<b>IOM ePHR</b></h3>
    <p><strong>Company:</strong> Datamatics Global Services Ltd.</p>
    <p><strong>Duration:</strong> April 2023 – January 2024</p>
    <p><strong>Role:</strong> Full Stack Developer</p>
    <p><strong>Technologies:</strong> Dot Net Core Web API, jQuery, .NET MVC, Node.js, NPM, C#, SQL Server (Dual server config), HTML, CSS, Git, Azure DevOps, Angular 15, TypeScript, JavaScript, Entity Framework</p>
    <p><strong>Description:</strong> This is a medical platform for doctors and medical professionals to maintain, update, and create records of migrants who have crossed international borders.</p>
    <ul>
        <li>Developed complete features from design to code (Front-end + API endpoints + ORM + SQL stored procedures) with through Angular 15 UI and .NET Core 7. and SQL server</li>
        <li>Implemented asynchronous endpoints, services and features for PDF handling through the ITextsharp library.  Implemented security fixes, report generation, and ID card generation.</li>
        <li>Collaborated with colleagues to integrate localization functionality to support multi-language in the web application.</li>
        <li>Wrote SQL stored procedures for generating text files containing data of migrants from multiple tables.</li>
        </li>Wrote scripts for reading millions of records from Excel file data source into a master table through bulk insert query in SQL </li>
        <li>Used embedded JavaScript in Adobe Acrobat  to create PDF forms</li>
    </ul>

    <h3>3)<b>Datamatics</b></h3>
    <p><strong>Company:</strong> Datamatics Global Services Ltd.</p>
    <p><strong>Duration:</strong> January 2024 - Jul 2024</p>
    <p><strong>Role:</strong> Back end developer</p>
    <p><strong>Technologies:</strong> Dot Net Core Web API, C#, PostgreSQL, HTML, CSS, Git, Azure DevOps, Angular 15, TypeScript, JavaScript, Entity Framework</p>
    <p><strong>Description:</strong> This was a online platform for cloud computing cost analysis and management tool</p>
    <ul>
        <li>Implemented the backend end points with .NET Core web API and PostgreSQL database</li>
        <li>Created a bactch processing console application to insert bulk data by extracting data from the JSON source and then calling the API endpoint of the application for bulk insert operation.</li>
    </ul>
`;
modalBody.html(content);
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
