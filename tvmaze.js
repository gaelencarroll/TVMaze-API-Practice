"use strict";

const $showsList = $("#shows-list");
const $episodesArea = $("#episodes-area");
const $searchForm = $("#search-form");
const $episodesList = $('#episodes-list');


/** Given a search term, search for tv shows that match that query.
 *
 *  Returns (promise) array of show objects: [show, show, ...].
 *    Each show object should contain exactly: {id, name, summary, image}
 *    (if no image URL given by API, put in a default image URL)
 */

async function getShowsByTerm(term) {
  const res = await axios.get(`https://api.tvmaze.com/singlesearch/shows?q=${term}`)
  // ADD: Remove placeholder & make request to TVMaze search shows API.
  return [
    {
      id: res.data.id,
      name: res.data.name,
      summary: res.data.summary,
      image: res.data.image.original ? res.data.image.medium : 'https://store-images.s-microsoft.com/image/apps.65316.13510798887490672.6e1ebb25-96c8-4504-b714-1f7cbca3c5ad.f9514a23-1eb8-4916-a18e-99b1a9817d15?mode=scale&q=90&h=300&w=300'
    }
  ]
  
}


/** Given list of shows, create markup for each and to DOM */

function populateShows(shows) {
  $showsList.empty();

  for (let show of shows) {
    const $show = $(
        `<div data-show-id="${show.id}" class="Show col-md-12 col-lg-6 mb-4">
         <div class="media">
           <img 
              src="${show.image}" 
              alt="${show.name} cover image" 
              class="w-25 mr-3">
           <div class="media-body">
             <h5 class="text-primary">${show.name}</h5>
             <div><small>${show.summary}</small></div>
             <button class="btn btn-outline-light btn-sm Show-getEpisodes">
               Episodes
             </button>
           </div>
         </div>  
       </div>
      `);

    $showsList.append($show);  }
}


/** Handle search form submission: get shows from API and display.
 *    Hide episodes area (that only gets shown if they ask for episodes)
 */

async function searchForShowAndDisplay() {
  //const term = $("#searchForm-term").val();
  const term = $("#search-query").val();
  const shows = await getShowsByTerm(term);

  $episodesArea.hide();
  populateShows(shows);

}

$searchForm.on("submit", async function (evt) {
  evt.preventDefault();
  await searchForShowAndDisplay();
});


/** Given a show ID, get from API and return (promise) array of episodes:
 *      { id, name, season, number }
 */



async function getEpisodesOfShow(id) { 
  const res = await axios.get(`https://api.tvmaze.com/shows/${id}/episodes`)
  let episodes = res.data.map( episode => ({
    id: episode.id,
    name: episode.name,
    season: episode.season,
    number: episode.number,
  }))
  return episodes;
}

/** Write a clear docstring for this function... */

function populateEpisodes(episodes) { 
  $episodesList.empty();
  for(let episode of episodes){
    const $episode = $(
      `<li>Season: ${episode.season}, Episode: ${episode.number}, Name: ${episode.name}</li>`
    )
    $episodesList.append($episode)
  }

}

async function displayEpisodes(id){
  const episodes = await getEpisodesOfShow(id);
  populateEpisodes(episodes);
  $episodesArea.show();
}


document.addEventListener('click',async function(evt){
  if(evt.target.tagName === 'BUTTON' && evt.target.classList.contains('Show-getEpisodes')){
    evt.preventDefault();
    let id = evt.target.closest('.Show').getAttribute('data-show-id');
    await displayEpisodes(id);
  }
})