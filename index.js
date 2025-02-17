const audio = new Audio()
const songs = []
let idx = 0
let shuffle = false
let repeat = false
let shuffledIdxs = []

document.getElementById('file-input').addEventListener('change', e => {
    const files = e.target.files
    songs.length = 0
    for (let file of files) {
        const reader = new FileReader()
        reader.onload = e => {
            songs.push({ name: file.name, src: e.target.result })
            updateList()
            if (!audio.src) playSong(0)
        }
        reader.readAsDataURL(file)
    }
})

document.getElementById('play-pause').addEventListener('click', () => {
    if (!songs.length) return alert('No songs loaded!')
    if (audio.paused) {
        audio.play()
        document.getElementById('play-pause').textContent = 'Pause'
    } else {
        audio.pause()
        document.getElementById('play-pause').textContent = 'Play'
    }
})

document.getElementById('next').addEventListener('click', () => nextSong())
document.getElementById('prev').addEventListener('click', () => prevSong())

document.getElementById('shuffle').addEventListener('click', () => {
    shuffle = !shuffle
    document.getElementById('shuffle').classList.toggle('active', shuffle)
    if (shuffle) {
        shuffledIdxs = shuffleArr([...Array(songs.length).keys()])
    }
    repeat = false
    document.getElementById('repeat').classList.remove('active')
})

document.getElementById('repeat').addEventListener('click', () => {
    repeat = !repeat
    document.getElementById('repeat').classList.toggle('active', repeat)
    shuffle = false
    document.getElementById('shuffle').classList.remove('active')
})

document.getElementById('volume').addEventListener('input', e => {
    audio.volume = e.target.value
})

document.getElementById('progress').addEventListener('input', e => {
    audio.currentTime = e.target.value
})

audio.addEventListener('timeupdate', () => {
    document.getElementById('progress').max = audio.duration
    document.getElementById('progress').value = audio.currentTime
})

audio.addEventListener('ended', () => nextSong())

function playSong(i) {
    idx = i
    audio.src = songs[idx].src
    audio.play()
    document.getElementById('current-song').textContent = songs[idx].name
    document.getElementById('play-pause').textContent = 'Pause'
    highlightTrack()
}

function nextSong() {
    if (!songs.length) return
    if (shuffle) {
        idx = (idx + 1) % shuffledIdxs.length
        playSong(shuffledIdxs[idx])
    } else if (repeat) {
        playSong(idx)
    } else {
        idx = (idx + 1) % songs.length
        playSong(idx)
    }
}

function prevSong() {
    if (!songs.length) return
    idx = (idx - 1 + songs.length) % songs.length
    playSong(idx)
}

function shuffleArr(arr) {
    for (let i = arr.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1))
        [arr[i], arr[j]] = [arr[j], arr[i]]
    }
    return arr
}

function updateList() {
    const list = document.getElementById('track-list')
    list.innerHTML = ''
    songs.forEach((s, i) => {
        const li = document.createElement('li')
        li.textContent = s.name
        li.addEventListener('click', () => playSong(i))
        list.appendChild(li)
    })
}

function highlightTrack() {
    const items = document.querySelectorAll('#track-list li')
    items.forEach((li, i) => {
        li.style.fontWeight = i === idx ? 'bold' : 'normal'
        li.style.color = i === idx ? '#4a90e2' : '#fff'
    })
}