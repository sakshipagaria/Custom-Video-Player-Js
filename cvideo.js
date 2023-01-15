const container=document.querySelector('.container');

mainVideo=container.querySelector('video'),
progressBar=container.querySelector('.progress-bar'),
videoTimeLine=container.querySelector('.video-timeline'),
volBtn=container.querySelector('.vol i'),
volSlider=container.querySelector('.left input'),
currVidTime=container.querySelector('.curr-time'),
vidDuration=container.querySelector('.video-duration'),
skipback=container.querySelector('.skip-backwards i'),
skipforward=container.querySelector('.skip-forwards i'),
playPauseBtn=container.querySelector('.play-pause i'),
speedBtn=container.querySelector(".playback-speed span"),
speedOpt=container.querySelector(".speed-option"),
picInPicBtn=container.querySelector(".picinpic span"),
fullscreenBtn=container.querySelector(".fullscreen i");

let timer;

const hideControls = () => {
    if(mainVideo.paused) return;
    timer = setTimeout(() => {
        container.classList.remove("show-controls");
    },3000);
}
hideControls();

container.addEventListener("mousemove",() => {
    container.classList.add("show-controls");        //show controls on mousemove
    clearTimeout(timer);  //clear timer 
    hideControls();   //calling hidecontols
});

const formatTime= time => {
    //get secs,mins,hrs
    let seconds = Math.floor(time % 60),
    minutes = Math.floor(time / 60) % 60,
    hours = Math.floor(time / 3600);

    //add 0 at beginning if particular value value is less than 10
    seconds = seconds < 10 ? `0${seconds}` : seconds;
    minutes = minutes < 10 ? `0${minutes}` : minutes; 
    hours = hours < 10 ? `0${hours}` : hours;  

    if(hours == 0){
        return `${minutes}:${seconds}`;
    }
    return `${hours}:${minutes}:${seconds}`;
}

const draggableProgressBar= e =>{
    let timelinewidth = videoTimeLine.clientWidth;      //get videtimeline width
    progressBar.style.width = `${e.offsetX}px`;    //e.offsetx gives mouse x position
    mainVideo.currentTime = (e.offsetX / timelinewidth) * mainVideo.duration;       //updating video currtime
    currVidTime.innerText = formatTime(mainVideo.currentTime);           //passing video curr time as currvidtime innertext
}

mainVideo.addEventListener("loadeddata",e=>{
    vidDuration.innerText = formatTime(e.target.duration);          //video duration as vid duration innertext
});

speedBtn.addEventListener("click",()=>{
    speedOpt.classList.toggle("show"); //toggle show class
});

fullscreenBtn.addEventListener('click',() =>{
    container.classList.toggle("fullscreen");
    if(document.fullscreenElement){
        //video if already in fullscreen mode
        fullscreenBtn.classList.replace("fa-compress", "fa-expand");
        return  document.exitFullscreen();
    }
    fullscreenBtn.classList.replace("fa-expand", "fa-compress");
    container.requestFullscreen();
});

videoTimeLine.addEventListener("click",e=>{
    let timelinewidth = videoTimeLine.clientWidth;      //get videtimeline width
    mainVideo.currentTime = (e.offsetX / timelinewidth) * mainVideo.duration;       //updating video currtime
});

videoTimeLine.addEventListener("mousedown",() => {
    //calling draggable progressbar function on mousemove event
    videoTimeLine.addEventListener("mousemove" , draggableProgressBar);
});

videoTimeLine.addEventListener("mousemove",e => {
    const progressTime = videoTimeLine.querySelector("span");
    let offsetX = e.offsetX;  //get mouse position
    progressTime.style.left = `${offsetX}px`;    //passing offsetx value as progresstime left value
    let timelinewidth = videoTimeLine.clientWidth;
    let percent = (e.offsetX / timelinewidth)*mainVideo.duration;  //get percent
    progressTime.innerText = formatTime(percent);    //pass percent as progress time
});

container.addEventListener("mouseup",() => {
    //calling draggable progressbar function on mousemove event
    videoTimeLine.removeEventListener("mousemove" , draggableProgressBar);
});

speedOpt.querySelectorAll("li").forEach(options => {
    //console.log(option);
    options.addEventListener("click",()=>{
        //adding click event on all speed option
        mainVideo.playbackRate = options.dataset.speed;   //passing option dataset as video playback value 
        speedOpt.querySelector(".active").classList.remove("active"); //removing active class
        options.classList.add("active"); //adding active class on the selected option
    });
});

picInPicBtn.addEventListener("click",()=>{
    mainVideo.requestPictureInPicture(); //video mode to pic in pic
});

document.addEventListener("click",e=>{
    //hide speed options on document click
    if(e.target.tagName !=="SPAN" || e.target.className !=="material-symbols-rounded"){
        speedOpt.classList.remove("show");
    }
});

mainVideo.addEventListener("timeupdate",e=>{
    let {currentTime,duration} = e.target;     //getting curr time 7 duration of the time 
    //console.log(currentTime,duration);
    let percent =(currentTime/duration)*100;     //getting percent
    progressBar.style.width =`${percent}%`; //passing % as progressbar width
    currVidTime.innerText = formatTime(currentTime);
});

volBtn.addEventListener('click',() =>{
    if(!volBtn.classList.contains("fa-volume-high")){        //if volume icon isn't volume high icon
        mainVideo.volume =0.5;   //passing 0.5 as video volume
        volBtn.classList.replace("fa-volume-xmark","fa-volume-high");
    }
    else{
        mainVideo.volume =0.0;    //passing 0.0 as video vol, so the video mute
        volBtn.classList.replace("fa-volume-high","fa-volume-xmark");
    }
    volSlider.value = mainVideo.volume;   //update slider acc to the video vol
});

volSlider.addEventListener('input',e=>{
    mainVideo.volume = e.target.value;   //passing slider value as video vol
    if(e.target.value==0){
        //if slider value is 0 ,change icon to mute icon
        volBtn.classList.replace("fa-volume-high","fa-volume-xmark");
    }
    else{
        volBtn.classList.replace("fa-volume-xmark","fa-volume-high");
    }
});

skipback.addEventListener("click",()=>{
    mainVideo.currentTime -= 5;       //subtract 5sec from curr video time
});

skipforward.addEventListener("click",()=>{
    mainVideo.currentTime += 5;       //add 5sec to curr video time
});


playPauseBtn.addEventListener('click',()=>{
    //if video is paused ,play it or else pause it
    mainVideo.paused ? mainVideo.play() : mainVideo.pause();
});

mainVideo.addEventListener('play',()=>{         //change play to pause 
    playPauseBtn.classList.replace("fa-play","fa-pause");
});

mainVideo.addEventListener('pause',()=>{          //chnage pause to play
    playPauseBtn.classList.replace("fa-pause","fa-play");
});
