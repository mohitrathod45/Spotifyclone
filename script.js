// ========= MUSIC LIBRARY WITH LOCAL FILES =========
const tracks = [
    {
        name: "Blinding Lights",
        artist: "The Weeknd",
        src: "assets/songs/song-1.mp3",
        cover: "assets/images/album-1.jpg",
        duration: "3:20"
    },
    {
        name: "Bairan",
        artist: "Haryanvi",
        src: "assets/songs/song-1.mp3",
        cover: "assets/images/album-7.jpg",
        duration: "2.29"
    },  
    {
        name: "Levitating",
        artist: "Dua Lipa",
        src: "assets/songs/song-2.mp3",
        cover: "assets/images/album-2.jpg",
        duration: "3:23"
    },
    {
        name: "Stay",
        artist: "Justin Bieber",
        src: "assets/songs/song-3.mp3",
        cover: "assets/images/album-3.jpg",
        duration: "2:21"
    },
    {
        name: "As It Was",
        artist: "Harry Styles",
        src: "assets/songs/song-4.mp3",
        cover: "assets/images/album-4.jpg",
        duration: "2:47"
    },
    {
        name: "Flowers",
        artist: "Miley Cyrus",
        src: "assets/songs/song-5.mp3",
        cover: "assets/images/album-5.jpg",
        duration: "3:20"
    },
    {
        name: "Cruel Summer",
        artist: "Taylor Swift",
        src: "assets/songs/song-6.mp3",
        cover: "assets/images/album-6.jpg",
        duration: "2:58"
    },
    {
        name: "Vampire",
        artist: "Olivia Rodrigo",
        src: "assets/songs/song-1.mp3",
        cover: "assets/images/album-1.jpg",
        duration: "3:39"
    },
    {
        name: "What Was I Made For",
        artist: "Billie Eilish",
        src: "assets/songs/song-2.mp3",
        cover: "assets/images/album-2.jpg",
        duration: "3:42"
    },
    {
        name: "Dance The Night",
        artist: "Dua Lipa",
        src: "assets/songs/song-3.mp3",
        cover: "assets/images/album-3.jpg",
        duration: "2:56"
    },
    {
        name: "I'm Good (Blue)",
        artist: "David Guetta",
        src: "assets/songs/song-4.mp3",
        cover: "assets/images/album-4.jpg",
        duration: "2:55"
    },
    {
        name: "Anti-Hero",
        artist: "Taylor Swift",
        src: "assets/songs/song-5.mp3",
        cover: "assets/images/album-5.jpg",
        duration: "3:21"
    },
    {
        name: "Unholy",
        artist: "Sam Smith",
        src: "assets/songs/song-6.mp3",
        cover: "assets/images/album-6.jpg",
        duration: "2:36"
    }
];

// ========= GLOBAL VARIABLES =========
let currentTrackIndex = 0;
let isPlaying = false;
let currentVolume = 0.7;
let isShuffled = false;
let repeatMode = 'none'; // 'none', 'one', 'all'

// Audio Element
const audio = new Audio();

// DOM Elements
const playPauseBtn = document.getElementById('playPauseBtn');
const prevBtn = document.getElementById('prevBtn');
const nextBtn = document.getElementById('nextBtn');
const shuffleBtn = document.getElementById('shuffleBtn');
const repeatBtn = document.getElementById('repeatBtn');
const progressFill = document.getElementById('progressFill');
const progressBar = document.getElementById('progressBar');
const currentTimeSpan = document.getElementById('currentTime');
const totalDurationSpan = document.getElementById('totalDuration');
const volumeSlider = document.getElementById('volumeSlider');
const volumeIcon = document.getElementById('volumeIcon');
const currentSongTitle = document.getElementById('currentSongTitle');
const currentArtist = document.getElementById('currentArtist');
const albumArt = document.getElementById('albumArt');

// ========= HELPER FUNCTIONS =========
function showToast(message, isError = false) {
    const toast = document.createElement('div');
    toast.className = 'toast-notification';
    toast.style.background = isError ? 'rgba(220, 53, 69, 0.95)' : 'rgba(30,215,96,0.95)';
    toast.style.color = '#fff';
    toast.innerHTML = message;
    document.body.appendChild(toast);
    setTimeout(() => toast.remove(), 3000);
}

function formatTime(seconds) {
    if (isNaN(seconds)) return "0:00";
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs < 10 ? '0' + secs : secs}`;
}

function highlightActiveCard() {
    document.querySelectorAll('.music-card').forEach((card) => {
        const cardIndex = parseInt(card.getAttribute('data-track-index'));
        if (cardIndex === currentTrackIndex) {
            card.style.border = "2px solid #1ed760";
            card.style.transform = "scale(1.02)";
            card.style.background = "#2a2a2a";
        } else {
            card.style.border = "1px solid rgba(255,255,255,0.05)";
            card.style.transform = "scale(1)";
            card.style.background = "rgba(24,24,24,0.9)";
        }
    });
}

// ========= MUSIC PLAYER CORE FUNCTIONS =========
function loadTrack(index) {
    if (index < 0) index = 0;
    if (index >= tracks.length) index = 0;
    currentTrackIndex = index;
    const track = tracks[currentTrackIndex];
    
    audio.src = track.src;
    currentSongTitle.innerText = track.name;
    currentArtist.innerText = track.artist;
    albumArt.src = track.cover;
    
    progressFill.style.width = "0%";
    currentTimeSpan.innerText = "0:00";
    totalDurationSpan.innerText = track.duration || "0:00";
    
    if (isPlaying) {
        audio.play().catch(e => {
            console.log("Autoplay blocked, waiting for user interaction");
            isPlaying = false;
            playPauseBtn.innerHTML = '<i class="fas fa-play"></i>';
        });
    }
    
    highlightActiveCard();
    updateNowPlayingInfo();
}

function togglePlayPause() {
    if (isPlaying) {
        audio.pause();
        playPauseBtn.innerHTML = '<i class="fas fa-play"></i>';
        isPlaying = false;
        albumArt.parentElement.classList.remove('playing-animation');
    } else {
        audio.play().catch(err => {
            console.warn("Playback failed:", err);
            showToast("Click anywhere to enable audio playback", true);
        });
        playPauseBtn.innerHTML = '<i class="fas fa-pause"></i>';
        isPlaying = true;
        albumArt.parentElement.classList.add('playing-animation');
    }
}

function playTrack(index) {
    if (currentTrackIndex === index && audio.src && !audio.paused) {
        return;
    }
    loadTrack(index);
    audio.play().then(() => {
        isPlaying = true;
        playPauseBtn.innerHTML = '<i class="fas fa-pause"></i>';
        albumArt.parentElement.classList.add('playing-animation');
        showToast(`Now playing: ${tracks[index].name}`);
    }).catch(() => {
        isPlaying = false;
        playPauseBtn.innerHTML = '<i class="fas fa-play"></i>';
    });
}

function nextTrack() {
    let nextIndex;
    if (repeatMode === 'one') {
        nextIndex = currentTrackIndex;
    } else if (isShuffled) {
        do {
            nextIndex = Math.floor(Math.random() * tracks.length);
        } while (nextIndex === currentTrackIndex && tracks.length > 1);
    } else {
        nextIndex = (currentTrackIndex + 1) % tracks.length;
    }
    playTrack(nextIndex);
}

function prevTrack() {
    let prevIndex;
    if (repeatMode === 'one') {
        prevIndex = currentTrackIndex;
    } else if (isShuffled) {
        do {
            prevIndex = Math.floor(Math.random() * tracks.length);
        } while (prevIndex === currentTrackIndex && tracks.length > 1);
    } else {
        prevIndex = (currentTrackIndex - 1 + tracks.length) % tracks.length;
    }
    playTrack(prevIndex);
}

function updateNowPlayingInfo() {
    document.title = `${tracks[currentTrackIndex].name} - Spotify Clone`;
}

// ========= PROGRESS & VOLUME CONTROLS =========
function updateProgress() {
    if (audio.duration && !isNaN(audio.duration)) {
        const percent = (audio.currentTime / audio.duration) * 100;
        progressFill.style.width = `${percent}%`;
        currentTimeSpan.innerText = formatTime(audio.currentTime);
        totalDurationSpan.innerText = formatTime(audio.duration);
    }
}

progressBar.addEventListener('click', (e) => {
    const rect = progressBar.getBoundingClientRect();
    const percent = (e.clientX - rect.left) / rect.width;
    if (audio.duration) {
        audio.currentTime = percent * audio.duration;
    }
});

volumeSlider.addEventListener('input', (e) => {
    currentVolume = parseFloat(e.target.value);
    audio.volume = currentVolume;
    updateVolumeIcon();
});

volumeIcon.addEventListener('click', () => {
    if (audio.volume > 0) {
        audio.volume = 0;
        volumeSlider.value = 0;
    } else {
        audio.volume = currentVolume || 0.7;
        volumeSlider.value = currentVolume || 0.7;
    }
    updateVolumeIcon();
});

function updateVolumeIcon() {
    if (audio.volume === 0) {
        volumeIcon.className = "fas fa-volume-mute volume-icon";
    } else if (audio.volume < 0.5) {
        volumeIcon.className = "fas fa-volume-down volume-icon";
    } else {
        volumeIcon.className = "fas fa-volume-up volume-icon";
    }
}

// ========= SHUFFLE & REPEAT FUNCTIONS =========
shuffleBtn.addEventListener('click', () => {
    isShuffled = !isShuffled;
    shuffleBtn.style.color = isShuffled ? '#1ed760' : 'white';
    showToast(isShuffled ? 'Shuffle mode ON' : 'Shuffle mode OFF');
});

repeatBtn.addEventListener('click', () => {
    if (repeatMode === 'none') {
        repeatMode = 'one';
        repeatBtn.innerHTML = '<i class="fas fa-repeat-1"></i>';
        showToast('Repeat: One song');
    } else if (repeatMode === 'one') {
        repeatMode = 'all';
        repeatBtn.innerHTML = '<i class="fas fa-redo-alt"></i>';
        showToast('Repeat: All songs');
    } else {
        repeatMode = 'none';
        repeatBtn.innerHTML = '<i class="fas fa-redo-alt"></i>';
        showToast('Repeat: OFF');
    }
    repeatBtn.style.color = repeatMode !== 'none' ? '#1ed760' : 'white';
});

// ========= GENERATE MUSIC CARDS DYNAMICALLY =========
function generateCards() {
    const mainGrid = document.getElementById('musicGrid');
    const recGrid = document.getElementById('recommendedGrid');
    mainGrid.innerHTML = '';
    recGrid.innerHTML = '';
    
    tracks.forEach((track, idx) => {
        const card = document.createElement('div');
        card.className = 'music-card';
        card.setAttribute('data-track-index', idx);
        card.innerHTML = `
            <div class="card-img">
                <img src="${track.cover}" alt="${track.name}" onerror="this.parentElement.innerHTML='<i class=\'fas fa-music\'></i>'">
            </div>
            <div class="card-title">${track.name}</div>
            <div class="card-artist">${track.artist}</div>
            <div style="font-size:0.7rem; margin-top:8px; color:#1ed760;">
                <i class="fas fa-play-circle"></i> Play now
            </div>
        `;
        card.addEventListener('click', () => playTrack(idx));
        
        if (idx < 6) {
            mainGrid.appendChild(card);
        } else {
            recGrid.appendChild(card);
        }
    });
}

// ========= EVENT LISTENERS =========
audio.addEventListener('timeupdate', updateProgress);
audio.addEventListener('ended', () => {
    if (repeatMode === 'one') {
        audio.currentTime = 0;
        audio.play();
    } else {
        nextTrack();
    }
});
audio.addEventListener('loadedmetadata', updateProgress);
audio.addEventListener('canplay', () => {
    console.log('Audio ready to play');
});

playPauseBtn.addEventListener('click', togglePlayPause);
nextBtn.addEventListener('click', nextTrack);
prevBtn.addEventListener('click', prevTrack);

// ========= NAVIGATION & UI INTERACTIONS =========
document.querySelectorAll('.nav-item').forEach(item => {
    item.addEventListener('click', function() {
        document.querySelectorAll('.nav-item').forEach(nav => nav.classList.remove('active'));
        this.classList.add('active');
        const txt = this.innerText;
        if(txt.includes('Search')) {
            showToast('🔍 Search feature - Find your favorite music!');
        } else if(txt.includes('Library')) {
            showToast('📚 Your library: ' + tracks.length + ' amazing songs');
        } else {
            showToast('🏠 Welcome to Home');
        }
    });
});

document.querySelectorAll('.playlist-item').forEach(pl => {
    pl.addEventListener('click', (e) => {
        const playlist = pl.getAttribute('data-play