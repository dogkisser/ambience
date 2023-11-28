async function getVideos(tags, count) {
    const posts_req = await fetch(`https://e621.net/posts.json?limit=${count}\
&_client="github:zoomasochist/ambience@0.0.1"\
&tags=animated score:>=600 sound order:random duration:<=90 -young -music -meme`);
    const post_json = await posts_req.json();

    return post_json.posts.map(e => e.file.url);
}

window.onload = async () => {
const number_videos_element = document.getElementById('number-of-videos');
const reroll_button = document.getElementById('reroll');
const volume_slider = document.getElementById('volume');
let vid_count = number_videos_element.value;
let volume = 100;

function addVideo(src) {
    const video_container = document.getElementsByTagName('main')[0];

    const video = document.createElement('video');
    video.autoplay = true;
    video.controls = false;
    video.muted = false;
    video.volume = volume / 100;
    video.src = src;
    video.addEventListener('ended', async (evt) => {
        const vid = evt.target;
        const lor = document.getElementById('loop-or-replace');
        const should_loop = lor.options[lor.selectedIndex].text == 'Loop';
        if (should_loop) {
            video.load();
        } else {
            let new_vid = await getVideos([], 1);
            vid.src = new_vid[0];
        }
    });

    video_container.appendChild(video);
}

volume_slider.addEventListener('input', async (event) => {
    const new_volume = event.target.value;

    Array.from(document.getElementsByTagName('main')[0].children).forEach(v => {
        v.volume = new_volume / 100;
    });

    volume = new_volume;
});

reroll_button.addEventListener('click', async (event) => {
    const video_container = document.getElementsByTagName('main')[0];
    video_container.textContent = '';

    const video_urls = await getVideos([], vid_count);
    
    for (let i = 0; i < vid_count; i++) {
        addVideo(video_urls.pop());
    }
});

number_videos_element.addEventListener('change', async (event) => {
    const new_value = event.target.value;

    if (new_value <= vid_count) {
        const remove_count = vid_count - new_value;

        for (let i = 0; i < remove_count; i++) {
            const videos = Array.from(document.getElementsByTagName('video'));
            const elem = videos[Math.floor(Math.random()*videos.length)];
            elem ? elem.remove() : undefined;
        }
    } else {
        const add_count = new_value - vid_count;
        const video_urls = await getVideos([], add_count);

        for (let i = 0; i < add_count; i++) {
            addVideo(video_urls.pop());
        }
    }

    vid_count = new_value;
});
};