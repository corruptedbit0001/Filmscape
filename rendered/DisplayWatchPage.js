function SetActiveServer(){
  var current = document.getElementsByClassName("active");
      current[0].className = current[0].className.replace(" active", "");
  document.querySelectorAll(".server").forEach((item)=>{
    
    if(selectedServer == item.dataset.embedUrl){
      item.className = "server active";
      
    }
  });
}
function SetQuality(){
  const url2 = "https://moviesapi.to/api/discover/movie?direction=desc&page=1&imdb_id="+imdb_id;
    fetch(url2)
    .then(res => res.json())
    .then(data3 => {
      if(data3){
        if(data3.result){
          quality.innerText = data3.data[0]?.quality?.split("|")[0];
        }
      }
    });
}
function DisplayData(emburl){
        mainbody.scrollTo(0, 0);
        const f = document.getElementById("frame");
        const title = document.getElementById("titlename");
        const desc = document.getElementById("desc");
        SetActiveServer();
        SetQuality();
        backBtn.addEventListener("click",()=>{
          currenth = (currenth-1) <0 ? 0 : currenth-1;
          LoadPage(history[currenth],"",true);
        });
        //console.log("Movie: "+emburl+" is "+data['result'][movie_id].tmdb_id);
        let url = "";
        if(isTrend){
           url = 'https://api.themoviedb.org/3/'+ismovie+'/'+tmdb_id+'?language=en-US';
        }else{
           url = 'https://api.themoviedb.org/3/'+ismovie+'/'+tmdb_id+'?language=en-US';
        }
            fetch(url, options)
              .then(res => res.json())
              .then(json =>{ 
                data = json;
                if(ismovie == "movie"){
                  title.innerText = json.title;
                  year.innerText = json.release_date.split("-")[0];
                  yeardet.innerText = json.release_date;
                }else{
                  title.innerText = json.name;
                  seasonind.innerText = "Season "+season;
                  for (let s = 0; s < json.number_of_seasons; s++) {
                    dropdown.innerHTML += `<a href="javascript:;" class="dropdown-item season-item active" data-embed="`+tmdb_id+`" data-tab="`+(s+1)+`">Season `+(s+1)+`</a>`;
                  }
                  document.querySelectorAll(".season-item").forEach((item)=>{
                    item.addEventListener("click",function(){
                        season = item.dataset.tab;
                        seasonind.innerText = "Season "+season;
                        f.style.display = "block";
                        dropdown.style.display = "none";
                        play.style.display = "none";
                        ep = 1;
                        DisplayEpisodes(json.id,json.number_of_seasons);
                        OnWatch(tmdb_id,ismovie,titleName,season,ep,posterPath);
                        SelectedServer(item.dataset.embed,selectedServer,season,ep);
                    });
                  });
                  year.innerText = json.first_air_date.split("-")[0];
                  yeardet.innerText = json.first_air_date;
                  json.created_by.forEach(element=>{
                    creators.innerText = element.name+", ";
                  });
                  DisplayEpisodes(json.id,json.number_of_seasons);
                }
                backgroundimage.style.backgroundImage = "url('https://image.tmdb.org/t/p/original"+json.backdrop_path+"')";
                desc.innerText = json.overview;
                rating.innerText = json.vote_average;
                descposter.src = (json.poster_path == null? "./images/error-img.png" : 'https://image.tmdb.org/t/p/w600_and_h900_bestv2/'+json.poster_path);
                
                runtime.innerText = json.runtime+' min';
                for(let i = 0; i < json.origin_country.length;i++){
                  country.innerText += countries.find(item => item.iso_3166_1 == json.origin_country[i])?.english_name+", ";
                }
                json.genres.forEach(element => {
                  genre.innerText += element.name+",";
                });
                add_book.dataset.season = json.last_episode_to_air ? json.last_episode_to_air?.season_number : 1;
                add_book.dataset.ep = json.last_episode_to_air ? json.last_episode_to_air?.episode_number : 0;
              }).then(()=>{
                document.querySelectorAll(".server").forEach((item)=>{
                item.dataset.embed = tmdb_id;
              
                item.addEventListener("click",function(){
                  var current = document.getElementsByClassName("active");
                  current[0].className = current[0].className.replace(" active", "");
                  item.className = "server active";
                  selectedServer = item.dataset.embedUrl;
                  play.style.display = "none";
                  f.style.display = "block";
                  OnWatch(tmdb_id,ismovie,titleName,season,ep,posterPath);
                  SelectedServer(item.dataset.embed,item.dataset.embedUrl,season,ep);

                  });
                });
                
              })
              .catch(err => console.error(err));
          //f.src = emburl;//data['result'][0]['embed_url'];
 
}

function DisplayEpisodes(id,number_of_seasons){
  const url2 = 'https://api.themoviedb.org/3/tv/'+tmdb_id+'/season/'+season+'?language=en-US';
    fetch(url2, options)
    .then(res => res.json())
    .then(json2 =>{ 
      //console.log(json2);
      episodelist.innerHTML = '';
      for (let index = 0; index < json2["episodes"].length; index++) {
        
          const date = new Date(json2.episodes[index].air_date); // Or any other Date object
          const monthName = date.toLocaleString('default', { month: 'long' });  
          episodelist.innerHTML += ` <li> 
                                      <a data-episode="`+(index+1)+`" data-embed="`+id+`" class="eplink `+(index+1 == ep ? "epactive": "")+`"> <span>Ep `+(index+1)+` - `+json2["episodes"][index].name+` - `+monthName+` `+date.getDate()+`, `+date.getFullYear()+`</span> </a> 
                                    </li> `;
        
      }
      NextPrevEpControls(ismovie,data.seasons,number_of_seasons,id);
  }).then(()=>{
    document.querySelectorAll(".eplink").forEach((item)=>{
    item.addEventListener("click",function(){
        var current = document.getElementsByClassName("epactive");        
        current[0].className = "eplink ";

        item.className = "eplink epactive";
        frame.style.display = "block";
        play.style.display = "none";
        ep = item.dataset.episode;
        OnWatch(tmdb_id,ismovie,titleName,season,ep,posterPath);
        console.log("episode id: "+item.dataset.embed+" ep: "+item.dataset.episode);
        SelectedServer(item.dataset.embed,selectedServer,season,ep);

      });
    });
  });
}

function SelectedServer(embedId, server, season, episode){
  console.log("data: "+server+" id:"+embedId);
  if(server== "2embed"){
    if(ismovie == "movie")
      frame.src = "https://www.2embed.cc/embed/"+embedId;
    else
      frame.src = "https://www.2embed.cc/embedtv/"+embedId+"&s="+season+"&e="+episode;
  }else if(server == "vidsrc.xyz"){
    if(ismovie == "movie")
      frame.src = "https://vidsrc.xyz/embed/movie/"+embedId;
    else
      frame.src = "https://vidsrc.xyz/embed/tv/"+embedId+"/"+season+"-"+episode;
  }else if(server == "videasy"){
    if(ismovie == "movie")
      frame.src = "https://player.videasy.net/movie/"+embedId+"?color="+maincol.split("#")[1];
    else
      frame.src = "https://player.videasy.net/tv/"+embedId+"/"+season+"/"+episode+"?color="+maincol.split("#")[1];
  }else if(server == "vidpro"){
    if(ismovie == "movie"){
      frame.src = "https://vidlink.pro/movie/"+embedId+"?primaryColor="+maincol.split("#")[1]+"&secondaryColor="+backcol.split("#")[1]+"&iconColor="+maincol.split("#")[1];
    }else{
      frame.src = "https://vidlink.pro/tv/"+embedId+"/"+season+"/"+episode+"?primaryColor="+maincol.split("#")[1]+"&secondaryColor="+backcol.split("#")[1]+"&iconColor="+maincol.split("#")[1];
    }
  }else if(server == "mov"){ 
    if(ismovie ==  "movie"){
      frame.src = "https://moviesapi.club/movie/"+embedId;
    }else{
      frame.src = "https://moviesapi.club/tv/"+embedId+"-"+season+"-"+episode;
    }
  }
}