import{a as e,d as t,l as n,o as r,r as i,t as a}from"./utils-Blhp9736.js";var o=document.getElementById(`movie-grid`),s=document.getElementById(`search-input`),c=document.getElementById(`search-results`),l=document.getElementById(`genre-container`),u=document.getElementById(`sort-select`),d=[];function f(e){let t=e.media_type===`movie`||!e.media_type,n=t?e.title:e.name,i=t?e.release_date:e.first_air_date,a=i?i.substring(0,4):`N/A`,o=t?`movie`:`tv`;return`
    <a href="detail.html?id=${e.id}&type=${o}" class="movie-card">
      <img src="${r(e.poster_path,`w500`)}" alt="${n} Poster" loading="lazy">
      <div class="movie-info">
        <h3 class="movie-title">${n}</h3>
        <div class="movie-meta">
          <span class="movie-year">${a}</span>
          <span class="movie-rating">★ ${e.vote_average?e.vote_average.toFixed(1):`NR`}</span>
        </div>
      </div>
    </a>
  `}function p(e){let t=e.media_type===`movie`||!e.media_type,n=t?e.title:e.name,i=t?e.release_date:e.first_air_date,a=i?i.substring(0,4):`N/A`,o=t?`movie`:`tv`;return`
    <a href="detail.html?id=${e.id}&type=${o}" class="search-item">
      <img src="${r(e.poster_path,`w92`)}" alt="${n}">
      <div>
        <h4>${n}</h4>
        <span>${a}</span>
      </div>
    </a>
  `}async function m(){try{d=await n(),v()}catch{o.innerHTML=`<div class="loading">Failed to load movies. Did you add the API Key?</div>`}}var h=null;async function g(){try{let t=await e(`movie`);if(t){l.innerHTML=t.map(e=>`<button class="genre-btn" data-id="${e.id}">${e.name}</button>`).join(``);let e=l.querySelectorAll(`.genre-btn`);e.forEach(t=>{t.addEventListener(`click`,t=>{let n=parseInt(t.target.dataset.id);h===n?(h=null,t.target.classList.remove(`active`)):(h=n,e.forEach(e=>e.classList.remove(`active`)),t.target.classList.add(`active`)),_()})})}}catch(e){console.error(`Failed to load genres`,e)}}function _(){if(!d||d.length===0)return;let e=d;if(h&&(e=d.filter(e=>e.genre_ids&&e.genre_ids.includes(h))),e.length===0){o.innerHTML=`<div class="loading">No movies found for this genre.</div>`;return}let t=[...e],n=u.value;n===`popularity.desc`?t.sort((e,t)=>(t.popularity||0)-(e.popularity||0)):n===`vote_average.desc`?t.sort((e,t)=>(t.vote_average||0)-(e.vote_average||0)):n===`release_date.desc`&&t.sort((e,t)=>{let n=new Date(e.release_date||e.first_air_date||0);return new Date(t.release_date||t.first_air_date||0)-n}),i(f,o,t,`afterbegin`,!0)}function v(){_()}var y=a(async e=>{let n=e.target.value.trim();if(n.length<2){c.innerHTML=``,c.classList.add(`hidden`);return}try{let e=await t(n);e.length>0?(i(p,c,e.slice(0,5),`afterbegin`,!0),c.classList.remove(`hidden`)):(c.innerHTML=`<div class="search-item">No results found</div>`,c.classList.remove(`hidden`))}catch(e){console.error(e)}},400);s.addEventListener(`input`,y),document.addEventListener(`click`,e=>{e.target.closest(`.search-container`)||c.classList.add(`hidden`)}),u.addEventListener(`change`,v),m(),g();