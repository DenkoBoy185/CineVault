import{o as e,r as t}from"./utils-Blhp9736.js";import{a as n,i as r,n as i}from"./watchlist-NUHJL0eY.js";var a=document.getElementById(`watchlist-grid`),o=document.getElementById(`filter-all`),s=document.getElementById(`filter-unwatched`),c=document.getElementById(`filter-watched`),l=`all`;function u(t){let n=t.media_type===`movie`||!t.media_type,r=n?t.title:t.name,i=n?t.release_date:t.first_air_date,a=i?i.substring(0,4):`N/A`,o=n?`movie`:`tv`;return`
    <div class="movie-card watchlist-card ${t.watched?`is-watched`:``}" data-id="${t.id}">
      <img src="${e(t.poster_path,`w500`)}" alt="${r} Poster" loading="lazy">
      ${t.watched?`<div class="watched-badge">✔ Watched</div>`:``}
      <div class="movie-info">
        <a href="detail.html?id=${t.id}&type=${o}"><h3 class="movie-title">${r}</h3></a>
        <div class="movie-meta">
          <span class="movie-year">${a}</span>
        </div>
        <div class="watchlist-actions">
          <button class="btn btn-sm btn-toggle-watched">${t.watched?`Mark Unwatched`:`Mark Watched`}</button>
          <button class="btn btn-sm btn-danger btn-remove">Remove</button>
        </div>
      </div>
    </div>
  `}function d(){let e=i(),o=e;if(l===`watched`&&(o=e.filter(e=>e.watched)),l===`unwatched`&&(o=e.filter(e=>!e.watched)),o.length===0){a.innerHTML=`<div class="loading">No movies found in this list.</div>`;return}t(u,a,o,`afterbegin`,!0),a.querySelectorAll(`.watchlist-card`).forEach(e=>{let t=parseInt(e.dataset.id);e.querySelector(`.btn-toggle-watched`).addEventListener(`click`,()=>{n(t),d()}),e.querySelector(`.btn-remove`).addEventListener(`click`,()=>{r(t),d()})})}function f(){[o,s,c].forEach(e=>e.classList.remove(`active`,`btn-secondary`)),[o,s,c].forEach(e=>e.classList.add(`btn-secondary`)),l===`all`?(o.classList.remove(`btn-secondary`),o.classList.add(`active`)):l===`watched`?(c.classList.remove(`btn-secondary`),c.classList.add(`active`)):l===`unwatched`&&(s.classList.remove(`btn-secondary`),s.classList.add(`active`))}o.addEventListener(`click`,()=>{l=`all`,f(),d()}),c.addEventListener(`click`,()=>{l=`watched`,f(),d()}),s.addEventListener(`click`,()=>{l=`unwatched`,f(),d()}),d();