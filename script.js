// Demo playlists and songs
const songCoverImage = 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?auto=format&fit=facearea&w=400&h=400&q=80';
const playlists = [
    {
        name: 'Chill Hits',
        cover: 'https://i.scdn.co/image/ab67706f00000002cbb8b7b3e3e1e0e0e0e0e0e0e0e0e0e0',
        songs: [
            {
                title: 'Chill Vibes',
                artist: 'Lo-Fi Beats',
                cover: songCoverImage,
                src: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3',
                duration: 210
            }
        ]
    },
    {
        name: 'Top 50 Global',
        cover: 'https://i.scdn.co/image/ab67706f00000002b4e8b7b3e3e1e0e0e0e0e0e0e0e0e0e0',
        songs: [
            {
                title: 'Global Hit',
                artist: 'Famous Singer',
                cover: songCoverImage,
                src: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3',
                duration: 200
            }
        ]
    },
    {
        name: 'Mood Booster',
        cover: 'https://i.scdn.co/image/ab67706f00000002e0e1e0e0e0e0e0e0e0e0e0e0e0e0e0e0',
        songs: [
            {
                title: 'Happy Mood',
                artist: 'Upbeat Artist',
                cover: songCoverImage,
                src: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3',
                duration: 180
            }
        ]
    },
    {
        name: 'Peaceful Piano',
        cover: 'https://i.scdn.co/image/ab67706f00000002e1e0e0e0e0e0e0e0e0e0e0e0e0e0e0e0',
        songs: [
            {
                title: 'Calm Keys',
                artist: 'Piano Artist',
                cover: songCoverImage,
                src: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-4.mp3',
                duration: 190
            }
        ]
    },
    {
        name: 'RapCaviar',
        cover: 'https://i.scdn.co/image/ab67706f00000002e2e0e0e0e0e0e0e0e0e0e0e0e0e0e0e0',
        songs: [
            {
                title: 'Rap Star',
                artist: 'MC Example',
                cover: songCoverImage,
                src: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-5.mp3',
                duration: 210
            }
        ]
    },
    {
        name: 'Rock Classics',
        cover: 'https://i.scdn.co/image/ab67706f00000002e3e0e0e0e0e0e0e0e0e0e0e0e0e0e0e0',
        songs: [
            {
                title: 'Classic Rock',
                artist: 'Rock Band',
                cover: songCoverImage,
                src: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-6.mp3',
                duration: 220
            }
        ]
    }
];

let currentPlaylist = 0;
let currentSong = 0;
let isPlaying = false;
let isShuffle = false;
let isRepeat = false;
let audio = new Audio();

const playBtn = document.getElementById('play');
const prevBtn = document.getElementById('prev');
const nextBtn = document.getElementById('next');
const shuffleBtn = document.getElementById('shuffle');
const repeatBtn = document.getElementById('repeat');
const songTitle = document.querySelector('.song-title');
const songArtist = document.querySelector('.song-artist');
const songCover = document.querySelector('.song-cover-large');
const progress = document.getElementById('progress');
const currentTimeEl = document.getElementById('current-time');
const durationEl = document.getElementById('duration');
const songListEl = document.querySelector('.song-list');
const playlistCards = document.querySelectorAll('.playlist-card');
const volumeSlider = document.getElementById('volume');
const footerPlayer = document.querySelector('.footer-player');
const selectedPlaylistCover = document.querySelector('.selected-playlist-cover');
const selectedPlaylistName = document.querySelector('.selected-playlist-name');
let footerTimeout;

function loadSong(index) {
    const song = playlists[currentPlaylist].songs[index];
    songTitle.textContent = song.title;
    songArtist.textContent = song.artist;
    songCover.src = song.cover;
    audio.src = song.src;
    durationEl.textContent = formatTime(song.duration);
    progress.value = 0;
    currentTimeEl.textContent = '0:00';
    highlightSong(index);
}

function playSong() {
    audio.play();
    isPlaying = true;
    playBtn.textContent = '⏸️';
}

function pauseSong() {
    audio.pause();
    isPlaying = false;
    playBtn.textContent = '▶️';
}

playBtn.addEventListener('click', () => {
    if (isPlaying) {
        pauseSong();
    } else {
        playSong();
    }
});

prevBtn.addEventListener('click', () => {
    if (isShuffle) {
        currentSong = Math.floor(Math.random() * playlists[currentPlaylist].songs.length);
    } else {
        currentSong = (currentSong - 1 + playlists[currentPlaylist].songs.length) % playlists[currentPlaylist].songs.length;
    }
    loadSong(currentSong);
    if (isPlaying) playSong();
});

nextBtn.addEventListener('click', () => {
    if (isShuffle) {
        currentSong = Math.floor(Math.random() * playlists[currentPlaylist].songs.length);
    } else {
        currentSong = (currentSong + 1) % playlists[currentPlaylist].songs.length;
    }
    loadSong(currentSong);
    if (isPlaying) playSong();
});

shuffleBtn.addEventListener('click', () => {
    isShuffle = !isShuffle;
    shuffleBtn.classList.toggle('active', isShuffle);
});

repeatBtn.addEventListener('click', () => {
    isRepeat = !isRepeat;
    repeatBtn.classList.toggle('active', isRepeat);
});

audio.addEventListener('timeupdate', () => {
    const song = playlists[currentPlaylist].songs[currentSong];
    progress.value = (audio.currentTime / song.duration) * 100;
    currentTimeEl.textContent = formatTime(Math.floor(audio.currentTime));
});

progress.addEventListener('input', () => {
    const song = playlists[currentPlaylist].songs[currentSong];
    audio.currentTime = (progress.value / 100) * song.duration;
});

audio.addEventListener('ended', () => {
    if (isRepeat) {
        audio.currentTime = 0;
        playSong();
    } else {
        nextBtn.click();
    }
});

function setVolumeBarColor() {
    const val = volumeSlider.value;
    const percent = val * 100;
    volumeSlider.style.background = `linear-gradient(to right, #ffb300 0%, #ffb300 ${percent}%, #444 ${percent}%, #444 100%)`;
}

// Set initial color
setVolumeBarColor();

volumeSlider.addEventListener('input', () => {
    audio.volume = volumeSlider.value;
    setVolumeBarColor();
});

document.addEventListener('keydown', (e) => {
    if (e.code === 'Space') {
        e.preventDefault();
        playBtn.click();
    } else if (e.code === 'ArrowRight') {
        nextBtn.click();
    } else if (e.code === 'ArrowLeft') {
        prevBtn.click();
    }
});

function formatTime(seconds) {
    const min = Math.floor(seconds / 60);
    const sec = Math.floor(seconds % 60);
    return `${min}:${sec < 10 ? '0' : ''}${sec}`;
}

function showFooter() {
    footerPlayer.classList.remove('footer-hidden');
    resetFooterTimeout();
}

function hideFooter() {
    footerPlayer.classList.add('footer-hidden');
}

function resetFooterTimeout() {
    clearTimeout(footerTimeout);
    footerTimeout = setTimeout(hideFooter, 4000);
}

function renderSongList() {
    songListEl.innerHTML = '';
    playlists[currentPlaylist].songs.forEach((song, idx) => {
        const li = document.createElement('li');
        li.innerHTML = `<img src="${song.cover}" alt="cover"><span>${song.title} - ${song.artist}</span>`;
        if (idx === currentSong) li.classList.add('active');
        li.addEventListener('click', () => {
            currentSong = idx;
            loadSong(currentSong);
            playSong();
            showFooter();
        });
        songListEl.appendChild(li);
    });
}

function highlightSong(index) {
    const items = songListEl.querySelectorAll('li');
    items.forEach((li, i) => {
        li.classList.toggle('active', i === index);
    });
}

function updateSelectedPlaylistInfo() {
    selectedPlaylistCover.src = playlists[currentPlaylist].cover;
    selectedPlaylistCover.alt = playlists[currentPlaylist].name + ' Cover';
    selectedPlaylistName.textContent = playlists[currentPlaylist].name;
}

playlistCards.forEach((card, idx) => {
    card.addEventListener('click', () => {
        currentPlaylist = idx;
        currentSong = 0;
        renderSongList();
        loadSong(currentSong);
        playSong();
        updateSelectedPlaylistInfo();
    });
});

// Initialize
renderSongList();
loadSong(currentSong);
audio.volume = volumeSlider.value;
updateSelectedPlaylistInfo();

// Show footer on any user interaction
['mousemove', 'keydown', 'touchstart'].forEach(evt => {
    document.addEventListener(evt, showFooter);
});

// Start the timer on page load
resetFooterTimeout(); 