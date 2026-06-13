import{c as e,i as t,n,o as r,s as i,u as a}from"./utils-Blhp9736.js";import{r as o,t as s}from"./watchlist-NUHJL0eY.js";var c=document.getElementById(`detail-container`),l=parseInt(n(`id`)),u=n(`type`)||`movie`;async function d(){if(!l){c.innerHTML=`<div class="loading">No movie ID provided.</div>`;return}try{f(await i(l,u),await t(l,u),await a(l,u),await e(l,u))}catch(e){console.error(e),c.innerHTML=`<div class="loading">Failed to load movie details.</div>`}}function f(e,t,n,i){let a=u===`movie`,d=a?e.title:e.name,f=a?e.release_date:e.first_air_date,p=f?f.substring(0,4):`N/A`,m=a?`${e.runtime} min`:`${e.number_of_seasons} Seasons`,h=e.genres?e.genres.map(e=>e.name).join(`, `):`Unknown`,g=e.vote_average?e.vote_average.toFixed(1):`NR`,_=null;if(n&&n.results){let e=n.results.find(e=>e.type===`Trailer`&&e.site===`YouTube`);e&&(_=e.key)}let v=e.backdrop_path?r(e.backdrop_path,`original`):``,y=r(e.poster_path,`w500`),b=o(l),x=`
    <div class="backdrop" style="background-image: linear-gradient(to right, rgba(13,15,26,1) 150px, rgba(13,15,26,0.5) 100%), url('${v}')">
      <div class="backdrop-content">
        <img src="${y}" alt="${d} Poster" class="detail-poster" />
        <div class="detail-meta">
          <h1>${d} <span>(${p})</span></h1>
          <div class="meta-row">
            <span class="rating">★ ${g}</span>
            <span class="genres">${h}</span>
            <span class="runtime">${m}</span>
          </div>
          <div class="action-buttons">
            <button id="add-watchlist-btn" class="btn btn-secondary" ${b?`disabled`:``}>${b?`Already in Watchlist`:`Add to Watchlist`}</button>
            ${_?`<a href="https://www.youtube.com/watch?v=${_}" target="_blank" class="btn btn-primary">Watch Trailer</a>`:``}
          </div>
          <div class="overview">
            <h3>Overview</h3>
            <p>${e.overview||`No overview available.`}</p>
          </div>
        </div>
      </div>
    </div>
  `;if(t&&t.cast&&t.cast.length>0){let e=t.cast.slice(0,8).map(e=>`
      <div class="cast-card">
        <img src="${r(e.profile_path,`w185`)}" alt="${e.name}" loading="lazy">
        <div class="cast-info">
          <h4>${e.name}</h4>
          <p>${e.character}</p>
        </div>
      </div>
    `).join(``);x+=`
      <section class="cast-section">
        <h2>Top Cast</h2>
        <div class="cast-carousel">
          ${e}
        </div>
      </section>
    `}if(i&&i.length>0){let e=i.slice(0,4).map(e=>{let t=a?e.title:e.name,n=a?e.release_date:e.first_air_date,i=n?n.substring(0,4):`N/A`;return`
      <a href="detail.html?id=${e.id}&type=${u}" class="movie-card">
        <img src="${r(e.poster_path,`w500`)}" alt="${t}" loading="lazy">
        <div class="movie-info">
          <h3 class="movie-title">${t}</h3>
          <div class="movie-meta">
            <span class="movie-year">${i}</span>
            <span class="movie-rating">★ ${e.vote_average?e.vote_average.toFixed(1):`NR`}</span>
          </div>
        </div>
      </a>
    `}).join(``);x+=`
      <section class="similar-section">
        <h2>You Might Also Like</h2>
        <div class="movie-grid">
          ${e}
        </div>
      </section>
    `}c.innerHTML=x;let S=document.getElementById(`add-watchlist-btn`);S&&!b&&S.addEventListener(`click`,()=>{s({id:l,media_type:u,title:e.title,name:e.name,release_date:e.release_date,first_air_date:e.first_air_date,poster_path:e.poster_path,vote_average:e.vote_average}),S.innerText=`Added to Watchlist`,S.disabled=!0})}d();