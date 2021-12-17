
// initialising variables
let song_index = 0;
let master_play_btn = document.getElementById('master_play');
let audio_element = new Audio('songs/1.mp3');
let my_progress_bar = document.getElementById('myProgressBar');
let play_gif = document.getElementById("gif");
let song_list = document.querySelector(".song-list");
let master_song_name = document.getElementById("master-song-name");
let song_duration = document.getElementsByClassName("duration");
let sound_gif = document.getElementById("gif2");
let volume_btn = document.getElementById("volume_btn");
let volume_stat_icon = document.getElementById("volume_stat_icon");


// getting all songs' data
let songs = [
    {song_name: "First Song", file_path: "songs/1.mp3", cover_path: "cover/cover.jpg"},
    {song_name: "Second Song", file_path: "songs/2.mp3", cover_path: "cover/cover.jpg"},
    {song_name: "Third Song", file_path: "songs/3.mp3", cover_path: "cover/cover.jpg"},
    {song_name: "Fourth Song", file_path: "songs/4.mp3", cover_path: "cover/cover.jpg"},
]

// updating DOM
// document.addEventListener("DOMContentLoaded", ()=>{

//     for (let i = 0; i < songs.length; i++) {
//         // setting the duration
//         let song_name2 = new Audio(songs[i].file_path);
//         song_name2.addEventListener('loadeddata', ()=>{
//             let divisor_for_minutes = song_name2.duration % (60*60);
//             let divisor_for_seconds = divisor_for_minutes % 60;

//             // populating the DOM
//             song_list.innerHTML += `<div class="song-item">
//             <img width="50" src="${songs[i].cover_path}" height="40" alt="cover">
//             <span class="song-name">${songs[i].song_name}</span><span class="songlistplay"><span class="timestamp"><span class="duration">${Math.floor(divisor_for_minutes / 60) +  ":" + Math.ceil(divisor_for_seconds)}</span><i id="0"  style="margin-right:15px;" class="far song-item-play fa-1x fa-play-circle"></i></span></div>`;
//           })
//     }
// })


// setting music volume according to the volume bar's range ALWAYS
audio_element.volume = volume_btn.value / 100;

// creating mute and unmute buttons
volume_stat_icon.addEventListener("click", (e)=>{

    let file = e.target.src;

    if(file.includes("playing.png")){
        e.target.src = "muted.png";
        audio_element.volume = 0;
        volume_btn.value = 0;
    }
    else{
        e.target.src = "playing.png";
        volume_btn.value = 50;
        audio_element.volume = volume_btn.value/100;
    }
})


// this function will change the mini play/pause buttons of the corresponding songs
function changeButtons(button_type){
    Array.from(document.getElementsByClassName("song-name")).forEach((element2, index)=>{

        if(element2.textContent.toLowerCase() === master_song_name.innerHTML.toLowerCase().trim()){
            Array.from(document.getElementsByClassName("song-item-play")).forEach((element)=>{
                if(parseInt(element.id) == index){
                    if(button_type == "play"){
                        element.classList.remove("fa-play-circle");
                        element.classList.add('fa-pause-circle');
                    }
                    else{
                        element.classList.remove("fa-pause-circle");
                        element.classList.add('fa-play-circle');
                    }
                }
            })
        }
    })    
}

// handle play/pause click
master_play_btn.addEventListener("click", ()=>{

    if(audio_element.paused || audio_element.currentTime<=0){
        audio_element.play();
        master_song_name.innerHTML = " " + songs[song_index].song_name;
        master_play_btn.classList.remove('fa-play-circle');
        master_play_btn.classList.add('fa-pause-circle');
        play_gif.style.opacity = 1;
        changeButtons("play");
    }

    else{
        audio_element.pause();
        master_play_btn.classList.remove('fa-pause-circle');
        master_play_btn.classList.add('fa-play-circle');
        play_gif.style.opacity = 0;
        changeButtons("pause");
    }

})

// function for changing the volume of the playing music
function change_vol(){
    audio_element.volume = volume_btn.value / 100;

    if(audio_element.volume == 0){
        volume_stat_icon.src = "muted.png";
    }
    else{
        volume_stat_icon.src = "playing.png";
    }
}


// listen to events
audio_element.addEventListener('timeupdate', ()=>{

    // update seekbar
    let progress = parseInt((audio_element.currentTime/audio_element.duration) * 100);
    my_progress_bar.value = progress; // value is in percentage
    

    // making next song autoplay
    let current_index;
    if(audio_element.ended){
        songs.forEach((i, index_of_song)=>{
            if(audio_element.currentSrc.slice(22,)==i.file_path){
                song_index = index_of_song;
            }
        })
        audio_element.src = `songs/${parseInt(song_index)+2}.mp3`;
        audio_element.play();
        master_song_name.innerHTML = songs[song_index+1].song_name;
    }
})

my_progress_bar.addEventListener('change', ()=>{
    audio_element.currentTime = (my_progress_bar.value * audio_element.duration)/100;
})

const make_all_plays = ()=>{
    Array.from(document.getElementsByClassName("song-item-play")).forEach((element)=>{
        element.classList.remove("fa-pause-circle");
        element.classList.add("fa-play-circle");
    })
}


Array.from(document.getElementsByClassName("song-item-play")).forEach((element)=>{

    element.addEventListener('click', (e)=>{

        if(audio_element.paused || audio_element.currentTime<=0){
            make_all_plays();
            song_index = parseInt(e.target.id);
            e.target.classList.remove("fa-play-circle");
            e.target.classList.add("fa-pause-circle");
            audio_element.src = `songs/${song_index+1}.mp3`;
            master_song_name.innerHTML = songs[song_index].song_name;
            audio_element.currentTime = 0;
            audio_element.play();
            play_gif.style.opacity = 1;
            master_play_btn.classList.remove("fa-play-circle");
            master_play_btn.classList.add("fa-pause-circle");
        }
        else{
            if(e.target.classList[3] == "fa-pause-circle"){
                e.target.classList.remove("fa-pause-circle");
                e.target.classList.add("fa-play-circle"); 
                audio_element.pause();
                e.target.classList.remove("fa-pause-circle");
                e.target.classList.add("fa-play-circle");
                master_play_btn.classList.remove("fa-pause-circle");
                master_play_btn.classList.add("fa-play-circle");
                play_gif.style.opacity = 0; 
            }
            else{

                // doing this coz except the current button every button should be paused
                Array.from(document.getElementsByClassName("song-item-play")).forEach((element)=>{
                    element.classList.remove("fa-pause-circle");
                    element.classList.add("fa-play-circle");
                })

                audio_element.pause();
                song_index = parseInt(e.target.id);
                audio_element.src = `songs/${song_index+1}.mp3`;
                audio_element.play();
                master_song_name.innerHTML = songs[song_index].song_name;
                e.target.classList.remove("fa-play-circle");
                e.target.classList.add("fa-pause-circle");
                master_play_btn.classList.remove("fa-play-circle");
                master_play_btn.classList.add("fa-pause-circle");
            }
        }
    })
})

// creating next/previous buttons
document.getElementById('next').addEventListener('click', ()=>{
    if(song_index >= songs.length-1){
        song_index = 0;
    }
    else{
        song_index += 1;
    }

    // doing this coz except the current button every button should be paused
    Array.from(document.getElementsByClassName("song-item-play")).forEach((element)=>{
        element.classList.remove("fa-pause-circle");
        element.classList.add("fa-play-circle");
    })
    
    audio_element.src = `songs/${song_index+1}.mp3`;
    audio_element.currentTime = 0;
    audio_element.play();
    play_gif.style.opacity = 1;
    master_song_name.innerHTML = songs[song_index].song_name;
    master_play_btn.classList.remove("fa-play-circle");
    master_play_btn.classList.add("fa-pause-circle");
    changeButtons("play");
})

document.getElementById('previous').addEventListener('click', ()=>{
    if(song_index <= 1){
        song_index = 0;
    }
    else{
        song_index -= 1;
    }

    // doing this coz except the current button every button should be paused
    Array.from(document.getElementsByClassName("song-item-play")).forEach((element)=>{
        element.classList.remove("fa-pause-circle");
        element.classList.add("fa-play-circle");
    })
    
    audio_element.src = `songs/${song_index+1}.mp3`;
    audio_element.currentTime = 0;
    audio_element.play();
    play_gif.style.opacity = 1;
    master_song_name.innerHTML = songs[song_index].song_name;
    master_play_btn.classList.remove("fa-play-circle");
    master_play_btn.classList.add("fa-pause-circle");
    changeButtons("play");
})