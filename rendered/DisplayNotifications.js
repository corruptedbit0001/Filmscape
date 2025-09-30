
let notif_open = false;
let notif_displayed = false;
let number_of_notif = 0;
content.addEventListener("click",()=>{
    if(notif_open){
        notifications_container.style.height = "0px";
        notifications_container.style.padding = "0px";
        notif_open = false;
    }
});


notifications.addEventListener("click",()=>{
    if(!notif_open){
        //notifications_container.style.display = "block";
        notifications_container.style.height = "280px";
        notifications_container.style.padding = "5px";
        notif_open = true;
        notif_num.style.display = "none";
        bookmarkes.opened_notif = true;
        bookmarkes.notif_num = 0;
        window.electronAPI.AddNewEpisodes(bookmarkes);
    }else{
        //notifications_container.style.display = "none";
        notifications_container.style.height = "0px";
        notifications_container.style.padding = "0px";
        notif_open = false;
    }
    
});
function CheckIsGreater(date,current_date){
    
    return current_date.getDate() >= date.getDate() &&
         current_date.getMonth()+1 >= date.getMonth() &&
         current_date.getFullYear() >= date.getFullYear();

} 
async function GetTvShowJson(i) {
    let data;
    const notifurl = 'https://api.themoviedb.org/3/tv/'+bookmarkes.tv_id[i].id+'?language=en-US';
    await fetch(notifurl, options)
        .then(res => res.json())
        .then(json =>{
            data = json;
            })
        .catch(err => console.error(err));
        return data;
}
async function GetSeasonEp(json) {
    let data;
    const surl = "https://api.themoviedb.org/3/tv/"+json.id+"/season/"+(json.last_episode_to_air ? json.last_episode_to_air.season_number : 1)+"?language=en-US";
    await fetch(surl, options)
    .then(res => res.json())
    .then(json2 =>{
        data = json2;
    }).catch(err => console.error(err));
    return data;
}

async function GetTvShows() {
    let arr = [];
    let today = new Date();
    for(let i = 0; i < bookmarkes.tv_id?.length;i++){
        if(!CheckIsGreater(new Date(bookmarkes.tv_id[i].last_update),today)){
            continue;
        }
        
        
        let json = await GetTvShowJson(i);

        if(bookmarkes.tv_id[i].season == json.last_episode_to_air?.season_number && bookmarkes.tv_id[i].episode == json.last_episode_to_air?.episode_number ){
            continue;
        }
        let lastair = new Date( ( json.last_episode_to_air ? json.last_episode_to_air?.air_date : json.last_air_date));
        
        if(bookmarkes.tv_id[i].season <= json.last_episode_to_air?.season_number || bookmarkes.tv_id[i].episode < json.last_episode_to_air?.episode_number ){
            console.log("HERE 2 "+json.name);
            let json2 = await GetSeasonEp(json);
            var startep = (bookmarkes.tv_id[i].season == json.last_episode_to_air?.season_number ? bookmarkes.tv_id[i].episode : 0 ) 
            for (let j = startep; j < json.last_episode_to_air?.episode_number; j++) {
                let ep_air_date = new Date(json2.episodes[j].air_date);
                notif_num.style.display = "block";
                !bookmarkes.new_episodes ? bookmarkes.new_episodes = [] : "";
                bookmarkes.new_episodes.push({
                    id : ""+json.id,
                    last_update : ""+ep_air_date.getFullYear()+"-"+(ep_air_date.getMonth()+1)+"-"+ep_air_date.getDate(),
                    last_ep_update : json2.episodes[j].episode_number,
                    last_season_update : (json.last_episode_to_air ? json.last_episode_to_air.season_number : 1),
                    poster_path: json.poster_path,
                    name: json.name
                });
                //ep_air_date.setDate(ep_air_date.getDate() - 7);
                bookmarkes.opened_notif = false;
                number_of_notif++;
                arr.push(json);
            }
            bookmarkes.tv_id[i].last_update = ""+lastair.getFullYear()+"-"+(lastair.getMonth()+1)+"-"+lastair.getDate();
            bookmarkes.tv_id[i].season = (json.last_episode_to_air ? json.last_episode_to_air.season_number : 1);
            bookmarkes.tv_id[i].episode = json.last_episode_to_air ? json.last_episode_to_air?.episode_number : 0
            
        }
            
            
        
    }
    bookmarkes.notif_num = number_of_notif;
    return arr;
}


async function GetLatestEpisodes(){ 
    if(!bookmarkes){
        return;
    }
    if(notif_displayed){
        return;
    }
    notif_displayed = true;
    let num = 0;
    number_of_notif = bookmarkes.notif_num ? bookmarkes.notif_num : 0;

    let res = [];
    
    await GetTvShows();
    res = bookmarkes.new_episodes;
    console.log(bookmarkes.new_episodes);
    res?.sort((a,b)=>{ return new Date(b.last_update) - new Date(a.last_update) });
    
    for (let i = 0; i < res.length; i++) {
        // let ls = (res[i].last_episode_to_air ? res[i].last_episode_to_air.season_number : 1);
        // let le = (res[i].last_episode_to_air ? res[i].last_episode_to_air.episode_number : 1);
        notifications_container.innerHTML += `<div style="position:relative;">
        <a data-title="`+res[i].name+`" data-poster="https://image.tmdb.org/t/p/w600_and_h900_bestv2/`+res[i].poster_path+`" value="watchpage" data-ep="`+(res[i].hasOwnProperty("last_ep_update") ?res[i].last_ep_update:1)+`" 
                data-season="`+(res[i].hasOwnProperty("last_season_update") ?res[i].last_season_update:1)+`" 
                    data-id="`+res[i].id+`" class="latest-ep"><li>
                <img width="40" height="50" style="position:relative;float:left;" src="https://image.tmdb.org/t/p/w600_and_h900_bestv2/`+res[i].poster_path+`">
                `+ (i < number_of_notif ? "<span class='newep'> New Episode! </span>" : "")+`
                <span>`+"SS "+res[i].last_season_update +` / </span>
                <span>`+"EP "+res[i].last_ep_update +`</span>
                
                <p>`+res[i].name+`</p>
                </li>
                </a>
                <span data-id="`+res[i].id+`" data-ep="`+res[i].last_ep_update+`" class="del_notif material-symbols-outlined">cancel</span>
                </div>`;
        
    }
    window.electronAPI.AddNewEpisodes(bookmarkes);
    notif_num.innerHTML = number_of_notif;
    if(!bookmarkes.opened_notif){
        notif_num.style.display = "block";
    }
    document.querySelectorAll(".latest-ep").forEach((item,index)=>{
        item.addEventListener("click",()=>{
            console.log("Click");
            const path = item.getAttribute("value");
                console.log("Latest Upload click");
                movie_id = index;
                ismovie = "tv";
                vidsrc = "tv";
                isTrend = true;
                tmdb_id = item.dataset.id;
                titleName = item.dataset.title;
                posterPath = item.dataset.poster;
                ep = item.dataset.ep;
                season = item.dataset.season;
                apiUrl = "https://api.2embed.cc/trending?time_window=day&page=1";
                notifications_container.style.height = "0px";
                notifications_container.style.padding = "0px";
                notif_open = false;
                LoadPage(path,tmdb_id);
        });
    });
    document.querySelectorAll(".del_notif").forEach((item,index)=>{
        item.addEventListener("click",()=>{
            item.parentElement.style.display = "none";
            for (let i = 0; i < bookmarkes.new_episodes?.length; i++) {
                if(bookmarkes.new_episodes[i].id == item.dataset.id && bookmarkes.new_episodes[i].last_ep_update == item.dataset.ep){
                    
                    bookmarkes.new_episodes.splice(i,1);
                    break;
                }
            }
            window.electronAPI.AddNewEpisodes(bookmarkes);
        });
    });
    clear_all_notif.addEventListener("click",()=>{ console.log("deleting all notif");
        if(bookmarkes.new_episodes && bookmarkes.new_episodes.length > 0){
            bookmarkes.new_episodes = [];
            notifications_container.innerHTML = `<a id="clear_all_notif">clear all</a>
            <h4>New Episodes</h4>`;
            window.electronAPI.AddNewEpisodes(bookmarkes);
        }
    });
}

