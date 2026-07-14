(() => {
  const $=(s,c=document)=>c.querySelector(s), $$=(s,c=document)=>[...c.querySelectorAll(s)];
  const data=window.CONSILIENT_DATA||{};
  const toast=message=>{
    const el=$("[data-toast]"); if(!el)return;
    el.textContent=message; el.classList.add("is-visible");
    clearTimeout(window.__toastTimer);
    window.__toastTimer=setTimeout(()=>el.classList.remove("is-visible"),3200);
  };

  const root=document.documentElement;
  const stored=localStorage.getItem("consilient-theme");
  root.dataset.theme=stored||(matchMedia("(prefers-color-scheme: dark)").matches?"dark":"light");
  $("[data-theme-toggle]")?.addEventListener("click",()=>{
    root.dataset.theme=root.dataset.theme==="dark"?"light":"dark";
    localStorage.setItem("consilient-theme",root.dataset.theme);
  });

  const header=$("[data-header]"), menuButton=$("[data-menu-toggle]"), mobileMenu=$("[data-mobile-menu]");
  let lastScroll=0;
  menuButton?.addEventListener("click",()=>{
    const open=menuButton.getAttribute("aria-expanded")==="true";
    menuButton.setAttribute("aria-expanded",String(!open));
    mobileMenu?.classList.toggle("is-open",!open);
    document.body.classList.toggle("menu-open",!open);
  });
  addEventListener("scroll",()=>{
    const current=scrollY;
    header?.classList.toggle("is-scrolled",current>24);
    if(current>700&&current>lastScroll+8)header?.classList.add("is-hidden");
    if(current<lastScroll-8)header?.classList.remove("is-hidden");
    lastScroll=current;
  },{passive:true});

  const revealItems=$$("[data-reveal]");
  if("IntersectionObserver"in window){
    const observer=new IntersectionObserver((entries,obs)=>entries.forEach(entry=>{
      if(entry.isIntersecting){entry.target.classList.add("is-visible");obs.unobserve(entry.target)}
    }),{threshold:.12});
    revealItems.forEach(item=>observer.observe(item));
  } else revealItems.forEach(item=>item.classList.add("is-visible"));

  $$("[data-current-year]").forEach(el=>el.textContent=new Date().getFullYear());
  $$("[data-placeholder-link]").forEach(link=>link.addEventListener("click",e=>{
    e.preventDefault();toast("Replace this placeholder with the final social, podcast, or practice URL.");
  }));
  $$("[data-newsletter-form]").forEach(form=>form.addEventListener("submit",e=>{
    e.preventDefault();const input=$("input[type=email]",form);
    if(!input?.value||!input.checkValidity()){input?.focus();toast("Enter a valid email address.");return}
    localStorage.setItem("consilient-newsletter-demo",input.value);input.value="";
    toast("Demo signup saved in this browser. Connect your email platform before launch.");
  }));

  const canvas=$("[data-constellation]");
  if(canvas&&!matchMedia("(prefers-reduced-motion: reduce)").matches){
    const ctx=canvas.getContext("2d");let points=[],pointer={x:-999,y:-999};
    const resize=()=>{
      const ratio=Math.min(devicePixelRatio||1,2);
      canvas.width=canvas.clientWidth*ratio;canvas.height=canvas.clientHeight*ratio;
      ctx.setTransform(ratio,0,0,ratio,0,0);
      points=Array.from({length:Math.min(55,Math.round(canvas.clientWidth/24))},()=>({
        x:Math.random()*canvas.clientWidth,y:Math.random()*canvas.clientHeight,
        vx:(Math.random()-.5)*.08,vy:(Math.random()-.5)*.08,r:Math.random()*1.5+.4
      }));
    };
    canvas.addEventListener("pointermove",e=>{const r=canvas.getBoundingClientRect();pointer={x:e.clientX-r.left,y:e.clientY-r.top}});
    canvas.addEventListener("pointerleave",()=>pointer={x:-999,y:-999});
    addEventListener("resize",resize);resize();
    const draw=()=>{
      ctx.clearRect(0,0,canvas.clientWidth,canvas.clientHeight);
      points.forEach(p=>{
        p.x+=p.vx;p.y+=p.vy;
        if(p.x<0||p.x>canvas.clientWidth)p.vx*=-1;
        if(p.y<0||p.y>canvas.clientHeight)p.vy*=-1;
        const dx=pointer.x-p.x,dy=pointer.y-p.y,d=Math.hypot(dx,dy);
        if(d<140){p.x-=dx*.0008;p.y-=dy*.0008}
      });
      points.forEach((p,i)=>{
        ctx.beginPath();ctx.arc(p.x,p.y,p.r,0,Math.PI*2);ctx.fillStyle="rgba(244,222,177,.65)";ctx.fill();
        for(let j=i+1;j<points.length;j++){
          const q=points[j],d=Math.hypot(p.x-q.x,p.y-q.y);
          if(d<115){ctx.beginPath();ctx.moveTo(p.x,p.y);ctx.lineTo(q.x,q.y);ctx.strokeStyle=`rgba(236,217,179,${.16*(1-d/115)})`;ctx.stroke()}
        }
      });
      requestAnimationFrame(draw);
    };draw();
  }

  const formatTime=s=>{if(!Number.isFinite(s))return"0:00";return`${Math.floor(s/60)}:${Math.floor(s%60).toString().padStart(2,"0")}`};
  const setupPlayer=container=>{
    const audio=$("audio",container),button=$("[data-play]",container),progress=$("[data-progress]",container),track=$("[data-track]",container),time=$("[data-time]",container);
    if(!audio||!button)return;
    button.addEventListener("click",()=>{
      $$("audio").forEach(other=>{if(other!==audio&&!other.paused)other.pause()});
      audio.paused?audio.play():audio.pause();
    });
    audio.addEventListener("play",()=>button.classList.add("is-playing"));
    audio.addEventListener("pause",()=>button.classList.remove("is-playing"));
    audio.addEventListener("timeupdate",()=>{
      if(progress)progress.style.width=`${audio.duration?(audio.currentTime/audio.duration)*100:0}%`;
      if(time)time.textContent=`${formatTime(audio.currentTime)} / ${formatTime(audio.duration)}`;
    });
    track?.addEventListener("click",e=>{
      if(!audio.duration)return;const r=track.getBoundingClientRect();
      audio.currentTime=((e.clientX-r.left)/r.width)*audio.duration;
    });
  };
  $$("[data-player]").forEach(setupPlayer);

  const modal=$("[data-modal]"),modalContent=$("[data-modal-content]");
  const closeModal=()=>{
    if(!modal)return;modal.classList.remove("is-open");modal.setAttribute("aria-hidden","true");
    document.body.classList.remove("menu-open");
  };
  $("[data-modal-close]")?.addEventListener("click",closeModal);
  modal?.addEventListener("click",e=>{if(e.target===modal)closeModal()});
  addEventListener("keydown",e=>{if(e.key==="Escape")closeModal()});
  const openEpisode=episode=>{
    if(!modal||!modalContent||!episode)return;
    modalContent.innerHTML=`
      <p class="eyebrow">${episode.category} · ${episode.duration}</p>
      <h2>${episode.title}</h2><p class="lede">${episode.guest}</p>
      <p>${episode.description}</p>
      <blockquote class="episode-quote">“${episode.quote}”</blockquote>
      <div class="tag-row">${episode.tags.map(t=>`<span class="tag">${t}</span>`).join("")}</div>
      <div class="player" data-player>
        <button class="play-button" type="button" aria-label="Play demo audio" data-play>
          <svg class="play-triangle" viewBox="0 0 24 24"><path d="M7 4v16l13-8Z"/></svg>
          <span class="pause-bars" aria-hidden="true"><i></i><i></i></span>
        </button>
        <div class="player-track" data-track><div class="player-progress" data-progress></div></div>
        <span class="player-time" data-time>0:00 / 0:00</span>
        <audio preload="metadata" src="${episode.audio}"></audio>
      </div>
      <p class="form-note">Demo audio is included only to demonstrate player behavior.</p>`;
    setupPlayer($("[data-player]",modalContent));modal.classList.add("is-open");
    modal.setAttribute("aria-hidden","false");document.body.classList.add("menu-open");
  };

  const episodeGrid=$("[data-episode-grid]");
  if(episodeGrid&&data.episodes){
    let active="All",query="";
    const render=()=>{
      const filtered=data.episodes.filter(ep=>{
        const hit=active==="All"||ep.category===active;
        return hit&&`${ep.title} ${ep.guest} ${ep.description} ${ep.tags.join(" ")}`.toLowerCase().includes(query.toLowerCase());
      });
      episodeGrid.innerHTML=filtered.length?filtered.map(ep=>`
        <article class="episode-card">
          <div class="episode-card-art" aria-hidden="true">${ep.number}</div>
          <div class="episode-card-copy">
            <div class="meta-row"><span>${ep.category}</span><span>${ep.duration}</span></div>
            <h3>${ep.title}</h3><p>${ep.description}</p>
            <div class="episode-card-actions">
              <button class="round-play" type="button" aria-label="Open ${ep.title}" data-episode-id="${ep.id}">
                <svg viewBox="0 0 24 24"><path d="M7 4v16l13-8Z"/></svg>
              </button>
              <button class="text-link" type="button" data-episode-id="${ep.id}">Episode details</button>
            </div>
          </div>
        </article>`).join(""):`<div class="empty-state"><h3>No conversations found.</h3><p>Try another category or a broader search.</p></div>`;
      $$("[data-episode-id]",episodeGrid).forEach(btn=>btn.addEventListener("click",()=>openEpisode(data.episodes.find(ep=>ep.id===btn.dataset.episodeId))));
    };
    const filters=$("[data-episode-filters]"),categories=["All",...new Set(data.episodes.map(ep=>ep.category))];
    if(filters){
      filters.innerHTML=categories.map((c,i)=>`<button class="filter-chip${i===0?" is-active":""}" type="button" data-filter="${c}">${c}</button>`).join("");
      $$("[data-filter]",filters).forEach(btn=>btn.addEventListener("click",()=>{
        active=btn.dataset.filter;$$("[data-filter]",filters).forEach(b=>b.classList.toggle("is-active",b===btn));render();
      }));
    }
    $("[data-episode-search]")?.addEventListener("input",e=>{query=e.target.value;render()});render();
  }

  const articleGrid=$("[data-article-grid]");
  if(articleGrid&&data.articles){
    let active="All",query="";
    const render=()=>{
      const filtered=data.articles.filter(a=>(active==="All"||a.category===active)&&`${a.type} ${a.title} ${a.dek} ${a.category}`.toLowerCase().includes(query.toLowerCase()));
      articleGrid.innerHTML=filtered.length?filtered.map(a=>`
        <a class="editorial-card" href="#" data-article="${a.id}">
          <span class="card-type">${a.type}</span><h3>${a.title}</h3><p>${a.dek}</p>
          <div class="card-foot"><span>${a.category}</span><span>${a.read}</span></div>
        </a>`).join(""):`<div class="empty-state"><h3>No resources found.</h3><p>Try another topic.</p></div>`;
      $$("[data-article]",articleGrid).forEach(card=>card.addEventListener("click",e=>{e.preventDefault();toast("Connect this card to a Squarespace post or a new HTML article page.")}));
    };
    const filters=$("[data-article-filters]"),categories=["All",...new Set(data.articles.map(a=>a.category))];
    if(filters){
      filters.innerHTML=categories.map((c,i)=>`<button class="filter-chip${i===0?" is-active":""}" type="button" data-article-filter="${c}">${c}</button>`).join("");
      $$("[data-article-filter]",filters).forEach(btn=>btn.addEventListener("click",()=>{
        active=btn.dataset.articleFilter;$$("[data-article-filter]",filters).forEach(b=>b.classList.toggle("is-active",b===btn));render();
      }));
    }
    $("[data-article-search]")?.addEventListener("input",e=>{query=e.target.value;render()});render();
  }

  const bookGrid=$("[data-book-grid]");
  if(bookGrid&&data.books)bookGrid.innerHTML=data.books.map(b=>`
    <article class="book-card"><span class="book-theme">${b.theme}</span><h3>${b.title}</h3>
    <p class="author">${b.author}</p><p class="book-note">${b.note}</p></article>`).join("");

  const glossary=$("[data-glossary]");
  if(glossary&&data.glossary){
    glossary.innerHTML=data.glossary.map((item,i)=>`
      <div class="glossary-item">
        <button class="glossary-button" type="button" aria-expanded="false" aria-controls="glossary-${i}">
          <span>${item.term}</span><span aria-hidden="true">+</span>
        </button>
        <div class="glossary-definition" id="glossary-${i}" hidden><p>${item.definition}</p></div>
      </div>`).join("");
    $$(".glossary-button",glossary).forEach(btn=>btn.addEventListener("click",()=>{
      const expanded=btn.getAttribute("aria-expanded")==="true";
      btn.setAttribute("aria-expanded",String(!expanded));document.getElementById(btn.getAttribute("aria-controls")).hidden=expanded;
    }));
  }

  const gatheringList=$("[data-gatherings]");
  if(gatheringList&&data.gatherings)gatheringList.innerHTML=data.gatherings.map(item=>`
    <article class="gathering">
      <div class="gathering-date"><span>${item.month}</span><strong>${item.day}</strong></div>
      <div><p class="eyebrow">${item.kind}</p><h3>${item.title}</h3><p>${item.mode}</p></div>
      <a class="button button-small button-ghost" href="#join">${item.status}</a>
    </article>`).join("");

  $$("[data-tabs]").forEach(tabset=>{
    const buttons=$$("[role=tab]",tabset),panels=$$("[role=tabpanel]",tabset);
    buttons.forEach(btn=>btn.addEventListener("click",()=>{
      buttons.forEach(b=>b.setAttribute("aria-selected",String(b===btn)));
      panels.forEach(p=>p.hidden=p.id!==btn.getAttribute("aria-controls"));
    }));
  });

  const contactForm=$("[data-contact-form]");
  contactForm?.addEventListener("submit",e=>{
    e.preventDefault();let valid=true;
    $$("[required]",contactForm).forEach(field=>{
      const error=$(`[data-error-for="${field.name}"]`,contactForm);
      if(!field.checkValidity()){
        valid=false;field.setAttribute("aria-invalid","true");
        if(error)error.textContent=field.validity.typeMismatch?"Use a valid email address.":"This field is required.";
      } else {field.removeAttribute("aria-invalid");if(error)error.textContent=""}
    });
    if(!valid){$("[aria-invalid=true]",contactForm)?.focus();return}
    contactForm.reset();toast("Prototype message accepted. Connect a form service before launch.");
  });
})();
