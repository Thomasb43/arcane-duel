/* Arcane Duel v4.54 – individuelle Charaktergeschichten und Storyauswahl.
   Kaels 30 bestehende Missionen bleiben unverändert. */
(function initCharacterStories454(){
 "use strict";
 const byId=id=>document.getElementById(id);
 const HOME=byId('arcaneHome307'),PICKER=byId('arcaneCharacterPicker391'),CARDS=byId('arcaneCharacterCards391');
 if(!HOME||!PICKER||!CARDS||!window.arcaneStory357)return;
 const STORY_KEY='arcane-story-hero-v454-',ACTIVE_KEY='arcane-story-hero-active-v454',POST_KEY='arcane-story-hero-post-v454';
 const SELECTED_KEY='arcane-duel-selected-character-v1';
 const cast=['Leon','Riven','Elara','Noctis','Astra'];
 const enemy=['Leon','Elara','Varek','Darian','Noctis','Seraphine','Riven','Astra','Valtor','Gefallener Eldric'];
 const esc=x=>String(x??'').replace(/[&<>"']/g,ch=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;','\'':'&#39;'}[ch]));
 const stories={
 Leon:{
  title:'Die Krone der Löwenarena',theme:'Ehre · Feuer · Verantwortung',
  intro:'Das Volk jubelt für den König der Löwenarena. Doch nach dem letzten Turnier verstummen die Trommeln: Die goldene Krone ist verschwunden und ein alter Schwur wurde gebrochen.',
  second:'Leon muss entscheiden, ob er nur ein unbesiegbarer Kämpfer sein will – oder jemand, der seine Stadt selbst in der Niederlage beschützt.',
  end:'Leon legt die Krone nieder und schwört, die Arena nicht mit Stärke allein, sondern mit Vertrauen zu führen.',
  missions:[
   ['Der letzte Applaus',2,'Die Arena öffnet ihre Tore, aber auf dem Siegerpodest liegt nur eine zerbrochene Krone.','Leon entdeckt die erste Spur eines fremden Siegels.'],
   ['Asche im Sand',3,'Verbrannte Spuren führen zu einem Händler, der nachts heimlich die Arena betrat.','Ein verkohltes Wappen zeigt den Weg zu den alten Gewölben.'],
   ['Die Stimme der Nacht',4,'Eine Stimme verspricht Leon unbesiegbare Macht, wenn er seinen Schwur vergisst.','Leon widersteht der Versuchung. Die Stimme zieht sich tiefer zurück.'],
   ['Die goldene Prüfung',5,'Eine verschleierte Duellantin fordert den Erben der Arena heraus.','Sie verrät: Die Krone ist nur der Schlüssel zu etwas Größerem.'],
   ['Kristall im Löwenherz',1,'Ein ungewöhnlicher Kristall reagiert auf Leons Löwenkarten.','Elara erkennt darin den Abdruck eines gestohlenen Siegels.'],
   ['Klingen gegen Krallen',6,'Riven erwartet Leon unter den Tribünen, wo einst ein verbotener Kampf stattfand.','Riven überlässt ihm einen Hinweis – aber nicht ohne eine Warnung.'],
   ['Das gebrochene Versprechen',7,'Unter dem Kampffeld erwacht eine Sternenschrift, die Leons Vergangenheit kennt.','Leon versteht, wen er mit seinem alten Versprechen schützen wollte.'],
   ['Tor zur Schattenloge',8,'Jenseits der Arena steht ein versiegeltes Tor, bewacht von einer fremden Macht.','Hinter dem Tor ruht die gestohlene Krone.'],
   ['Die Krone aus Finsternis',9,'Die Krone verwandelt sich in eine Waffe gegen ihren rechtmäßigen Träger.','Leon zerbricht die falsche Krone und rettet die Arena.'],
   ['Der wahre König',2,'Vor seinem Volk stellt sich Leon der letzten Prüfung: ohne das Versprechen von Ruhm.','Die Menge ruft nicht nach der Krone, sondern nach Leon.']
  ]
 },
 Riven:{
  title:'Die Klingen des Schweigens',theme:'Schatten · Vergangenheit · Freiheit',
  intro:'Riven kennt jeden Fluchtweg der Unterstadt – und jedes Geheimnis, das die Schatten verschlucken. Ein Brief mit dem Siegel seiner verschwundenen Einheit reißt alte Wunden auf.',
  second:'Um die Wahrheit zu finden, muss Riven diejenigen wiedersehen, denen er einst die Treue schwor.',
  end:'Riven zerbricht das Zeichen seiner alten Einheit. Zum ersten Mal entscheidet er selbst, wofür seine Klingen kämpfen.',
  missions:[
   ['Der namenlose Auftrag',2,'Ein alter Befehl taucht auf, obwohl seine Auftraggeber längst tot sein sollten.','Ein verschlüsselter Name führt Riven in die Unterstadt.'],
   ['Spuren im Regen',3,'Auf nassem Pflaster findet Riven das Zeichen seiner verlorenen Gefährten.','Die Fährte führt zu einer versiegelten Festung.'],
   ['Der Preis der Stille',4,'Die Nacht selbst fordert Riven auf, seine Erinnerungen preiszugeben.','Er entscheidet sich, nichts mehr zu verbergen.'],
   ['Ein falscher Schwur',5,'Eine Wächterin zeigt ihm ein Dokument über den Verrat an seiner Einheit.','Zum ersten Mal zweifelt Riven an der Schuld seines Bruders.'],
   ['Scherben des Mondes',1,'Kristalle brechen auf, als Riven eine verbotene Klinge berührt.','In ihrem Licht sieht er den wahren Tag des Verrats.'],
   ['Kampf in der Arena',0,'Ein alter Kampfkamerad wartet unter den Tribünen der Löwenarena.','Der Weg führt zu Rivens einstigem Meister.'],
   ['Die verbrannte Chronik',8,'In einem zerstörten Archiv liegt das letzte Zeugnis seiner Einheit.','Die Wahrheit ist gefährlicher als jeder Befehl.'],
   ['Das Urteil der Sterne',7,'Eine fremde Magie stellt Rivens Erinnerung auf die Probe.','Sein eigener Entschluss wird zur Waffe gegen die Schatten.'],
   ['Der letzte Befehl',9,'Der Urheber des Verrats will die Einheit ein zweites Mal opfern.','Riven verweigert den Befehl und befreit die Gefangenen.'],
   ['Klingen der Freiheit',3,'Im Morgenlicht wartet eine letzte Prüfung vor den Toren der Stadt.','Die Klingen schweigen. Riven hat seinen Weg gefunden.']
  ]
 },
 Elara:{
  title:'Die zerbrochene Kristallchronik',theme:'Kristalle · Erinnerung · Wahrheit',
  intro:'Elaras Kristalllabor leuchtet jede Nacht. Doch eines Morgens zeigen alle Spiegel dieselbe Zukunft: eine Stadt ohne Namen und ohne Bewohner.',
  second:'Mit ihrer Magie kann Elara Erinnerungen bewahren. Aber jede neue Wahrheit droht eine andere Erinnerung auszulöschen.',
  end:'Elara bewahrt die zerbrochene Chronik als Mahnung – und entdeckt, dass sich die Zukunft ändern lässt.',
  missions:[
   ['Der erste Riss',3,'Ein Spiegel zerbricht, ohne berührt zu werden. Darin erscheint ein fremdes Gesicht.','Elara birgt einen Splitter, der eine verborgene Erinnerung trägt.'],
   ['Echo im Glas',2,'Eine Stimme ruft aus dem Splitter nach Hilfe.','Der Hilferuf stammt aus einer möglichen Zukunft.'],
   ['Die dunkle Spiegelung',4,'Eine fremde Gestalt nimmt Elaras Platz im Spiegel ein.','Elara lernt, dass Abbilder nicht immer die Wahrheit sagen.'],
   ['Ein Licht für zwei',5,'Ein helles Zeichen öffnet einen Weg durch das Kristalllabyrinth.','Der Weg führt zu einer vergessenen Chronik.'],
   ['Die Arena der Erinnerung',0,'Ein alter Kampf erscheint im Spiegel, doch die Sieger haben ihre Namen verloren.','Die verlorenen Namen werden wieder sichtbar.'],
   ['Klingen aus Splittern',6,'Eine Klinge aus Kristall soll die Chronik endgültig zerstören.','Elara rettet ein unbeschriebenes Kapitel.'],
   ['Hüterin der Sekunden',7,'Ein Sternensiegel hält die Zeit im Herzen des Labors an.','Elara erkennt den Ursprung des Risses.'],
   ['Die verbotene Formel',8,'Eine Formel verspricht, jedes Opfer rückgängig zu machen.','Elara erkennt die verborgene Gefahr der Formel.'],
   ['Das letzte Spiegelbild',9,'Die Chronik zeigt eine Welt ohne Elara.','Sie entscheidet, die Zukunft nicht zu erzwingen.'],
   ['Morgen aus Kristall',4,'Alle Splitter schweben über Arkanis, bereit für eine letzte Entscheidung.','Die Chronik bleibt offen – Elaras Zukunft gehört ihr selbst.']
  ]
 },
 Noctis:{
  title:'Zwischen Nacht und Morgengrauen',theme:'Finsternis · Schuld · Erlösung',
  intro:'Noctis wacht in einem Turm auf, den es auf keiner Karte gibt. Die Schatten flüstern seinen Namen – und eine zweite Stimme nennt ihn Verräter.',
  second:'Er beherrscht die Nacht, aber nicht die Schuld, die sie verbirgt. Um den Ursprung seiner Macht zu finden, muss Noctis die Tür öffnen, vor der er sich selbst fürchtet.',
  end:'Noctis trägt die Dunkelheit weiter, aber nicht länger als Gefangener. Im ersten Licht des Morgens beginnt sein eigener Weg.',
  missions:[
   ['Die schwarze Stunde',2,'Der Turm erwacht bei einer Glocke, die niemand hören dürfte.','Ein Siegel verrät die Richtung des ersten Schattentors.'],
   ['Zeugen der Dämmerung',3,'Ein alter Zeuge kennt den Namen, den Noctis verloren hat.','Der Name gehört zu einem früheren Leben.'],
   ['Das vergessene Opfer',5,'Die Lichtwächterin stellt Noctis eine Frage, die keine Klinge beantworten kann.','Er erinnert sich an sein größtes Opfer.'],
   ['Schattengefährte',6,'Riven erkennt einen Teil von Noctis’ Vergangenheit.','Ihre Wege waren früher enger verbunden als gedacht.'],
   ['Die zerbrochene Maske',1,'Ein Kristall zerlegt jedes Wort in Lüge und Wahrheit.','Noctis findet einen verborgenen Schwur.'],
   ['Das Löwensiegel',0,'Ein Krieger versperrt den Weg zum Herzen der Nacht.','Noctis sieht, dass Mut auch ohne Dunkelheit möglich ist.'],
   ['Der Hunger der Sterne',8,'Ein fremder Herrscher will Noctis an seine alte Rolle erinnern.','Noctis verweigert dessen Angebot.'],
   ['Die letzte Prophezeiung',7,'Die Sterne zeigen, was aus seiner Macht werden könnte.','Die Zukunft bleibt unentschieden.'],
   ['Ein König ohne Licht',9,'Der Ursprung des Fluchs erwartet Noctis im leeren Thronsaal.','Die Finsternis verliert ihren Anspruch auf seinen Willen.'],
   ['Vor dem ersten Morgen',3,'Am Ausgang des Turms wartet die letzte Prüfung seiner Freiheit.','Die ersten Sonnenstrahlen erreichen den Turm.']
  ]
 },
 Astra:{
  title:'Das Herz des Sternenhimmels',theme:'Sterne · Schicksal · kosmische Siegel',
  intro:'Astra hört die Stimme der Sterne, seit sie denken kann. Doch plötzlich verschwindet ein ganzes Sternbild – und mit ihm jede Erinnerung an den Namen Vesperion.',
  second:'Die Sternenkarte führt Astra zu einer Macht, die nicht einfach besiegt werden kann. Vielleicht lässt sich das drohende Schicksal aber verändern.',
  end:'Astra schreibt ein neues Sternbild an den Himmel: eine Antwort auf die Dunkelheit, die eines Tages zurückkehren wird.',
  missions:[
   ['Ein Stern verlischt',1,'Über Arkanis fällt ein Stern aus der Karte des Himmels.','Astra findet einen Splitter seiner verlorenen Bahn.'],
   ['Die verborgene Konstellation',2,'Eine fremde Rune erscheint zwischen den Sternbildern.','Die Rune ist Teil eines uralten Siegels.'],
   ['Botschaft aus Asche',3,'Eine Sternschnuppe bringt eine Warnung aus den Aschengipfeln.','Astra entdeckt den ersten Namen der vergessenen Chronik.'],
   ['Die Nacht ohne Himmel',4,'Die Sterne schweigen, als eine dunkle Gestalt den Horizont berührt.','Ein letzter Lichtpunkt zeigt ihr den Weg.'],
   ['Licht gegen Schicksal',5,'Ein strahlender Wächter stellt ihre Absichten infrage.','Astra beweist, dass Hoffnung kein Irrtum ist.'],
   ['Klinge der Sternenwacht',6,'An einem verlassenen Observatorium wartet ein alter Beschützer.','Das Observatorium gibt eine geheime Karte frei.'],
   ['Der Löwe und die Sterne',0,'Die Löwenarena liegt unter einem unnatürlichen Himmel.','Astra löst einen weiteren Knoten in der Sternenbahn.'],
   ['Die Grenze der Welten',8,'Ein Wächter blockiert das Tor zum Raum zwischen den Sternen.','Astra erreicht den Rand der bekannten Chronik.'],
   ['Herz der Finsternis',9,'Eine Macht versucht die verlorenen Sterne für sich zu beanspruchen.','Die Sternenkarte wird ein letztes Mal vollständig.'],
   ['Der Name Vesperion',8,'Astra liest den vergessenen Namen im Licht eines neuen Sternbilds.','Vesperions Geheimnis ist noch nicht gelöst – ihre Reise geht weiter.']
  ]
 }
 };
 const css=document.createElement('style');
 css.textContent=[
  '#arcaneCharacterStories454[hidden]{display:none!important}',
  '#arcaneCharacterStories454{position:fixed;inset:0;z-index:11500;display:grid;place-items:center;padding:clamp(7px,2.5vw,20px);background:radial-gradient(circle at center,#2d2048eb,#060818f6);backdrop-filter:blur(5px)}',
  '.ac-story-shell454{width:min(96vw,730px);max-height:95svh;overflow:auto;overscroll-behavior:contain;-webkit-overflow-scrolling:touch;padding:clamp(12px,2.5vw,23px);background:linear-gradient(165deg,#2b234a,#111629 68%,#251638);color:#fff0cf;border:2px solid #d9b67e;border-radius:17px;box-shadow:0 9px 40px #000c}',
  '.ac-story-title454{display:flex;align-items:center;justify-content:space-between;gap:12px;margin-bottom:14px}',
  '.ac-story-title454 h2{font:700 clamp(20px,4vw,30px) Georgia,serif;color:#ffe4a3;margin:0}',
  '.ac-story-btn454{border:1px solid #ddc083;border-radius:10px;padding:9px 12px;background:linear-gradient(140deg,#5d3b8a,#251b44);color:#fff0cd;font-weight:800;font-size:13px;cursor:pointer;min-height:37px}',
  '.ac-story-btn454:disabled{opacity:.48;cursor:not-allowed}',
  '.ac-story-btn454.alt{border-color:#807099;background:#1b1c37}',
  '.ac-story-hero454{display:flex;align-items:center;gap:13px;padding:10px;background:#1a1735ba;border:1px solid #665480;border-radius:13px;margin-bottom:12px}',
  '.ac-story-hero454 img{width:80px;height:108px;object-fit:cover;object-position:center top;border:2px solid #e9c780;border-radius:10px;flex-shrink:0}',
  '.ac-story-hero454 h3{margin:0 0 5px;color:#ffe1a2;font:700 22px Georgia,serif}',
  '.ac-story-hero454 p{margin:5px 0;color:#e0d4ec;font-size:13px;line-height:1.4}',
  '.ac-story-roster454{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:10px}',
  '.ac-story-choice454{display:flex;align-items:center;gap:9px;min-width:0;border:1px solid #806d9d;background:#211938;border-radius:12px;padding:8px;text-align:left;color:#fff0c9;cursor:pointer}',
  '.ac-story-choice454 img{width:50px;height:64px;object-fit:cover;object-position:top;border-radius:7px;border:1px solid #ad97c9}',
  '.ac-story-choice454 strong{display:block;font:700 17px Georgia,serif}.ac-story-choice454 small{display:block;font-size:10px;color:#d9c5e5;line-height:1.35;overflow-wrap:anywhere}',
  '.ac-story-list454{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:8px;margin:12px 0}',
  '.ac-story-mission454{display:flex;align-items:center;gap:8px;min-width:0;padding:10px;border-radius:10px;border:1px solid #74618b;background:#191b39;color:#ffedc9;text-align:left;cursor:pointer}',
  '.ac-story-mission454:disabled{opacity:.46;cursor:not-allowed}.ac-story-mission454 strong{display:block;font-size:12px}.ac-story-mission454 small{display:block;font-size:10px;color:#d0bfdf;line-height:1.3}',
  '.ac-story-copy454{font-size:14px;line-height:1.6;color:#eee1fa;margin:10px 0}',
  '.ac-story-dialog454{padding:15px;margin:12px 0;border:1px solid #a58cc0;border-radius:12px;background:linear-gradient(145deg,#291c4c,#181c37);line-height:1.6}',
  '.ac-story-dialog454 strong{color:#ffe2a1}',
  '.ac-story-actions454{display:flex;flex-wrap:wrap;gap:8px;margin:12px 0 3px}',
  '.ac-story-status454{color:#e4c6d4;font-size:12px;line-height:1.45}',
  '.ac-story-track454{height:7px;border-radius:10px;background:#111024;overflow:hidden;margin:8px 0}.ac-story-track454>span{display:block;height:100%;background:linear-gradient(90deg,#865be5,#e8bb6c)}',
  '.arcane-character-card-391{cursor:default!important}.arcane-character-actions454{width:100%;display:flex;flex-wrap:wrap;justify-content:center;gap:6px;margin-top:auto}',
  '.arcane-character-actions454 button{flex:1 1 70px;min-width:0;border:1px solid #c9a978;border-radius:7px;padding:6px 4px;background:#443061;color:#ffe7b0;font-weight:800;font-size:11px;cursor:pointer}',
  '.arcane-character-actions454 button:disabled{opacity:.42;cursor:not-allowed}',
  '@media(max-width:440px){.ac-story-roster454{gap:6px}.ac-story-choice454{padding:6px;gap:5px}.ac-story-choice454 img{width:37px;height:53px}.ac-story-choice454 strong{font-size:14px}.ac-story-choice454 small{font-size:9px}.ac-story-list454{grid-template-columns:1fr}.ac-story-hero454 img{width:64px;height:87px}.ac-story-hero454 h3{font-size:18px}}'
 ].join('\n');document.head.appendChild(css);
 const modal=document.createElement('div');modal.id='arcaneCharacterStories454';modal.hidden=true;modal.setAttribute('role','dialog');modal.setAttribute('aria-modal','true');
 modal.setAttribute('aria-label','Geschichten der Charaktere');
 modal.innerHTML='<div class="ac-story-shell454"><div class="ac-story-title454"><h2 id="acStoryHeading454">Charaktergeschichten</h2><button type="button" class="ac-story-btn454 alt" data-cs454="close">✕ Schließen</button></div><div id="acStoryBody454"></div></div>';
 document.body.appendChild(modal);
 const body=byId('acStoryBody454'),heading=byId('acStoryHeading454');
 let state={view:'hub',hero:null,index:null,page:0},active=null,processed=false;
 function chain(){return window.arcaneCharacterChain453}
 function canPlay(hero){return hero==='Kael'||!!chain()?.available(hero)}
 function selectedHero454(){try{return localStorage.getItem(SELECTED_KEY)||'Kael'}catch(_){return 'Kael'}}
 function storyProgress(hero){
  let stored=null;try{stored=JSON.parse(localStorage.getItem(STORY_KEY+hero)||'null')}catch(_){}
  return {cleared:Array.isArray(stored?.cleared)?[...new Set(stored.cleared.filter(n=>Number.isInteger(n)&&n>=0&&n<10))]:[]};
 }
 function saveProgress(hero,i){
  const previous=storyProgress(hero);if(previous.cleared.includes(i))return false;
  const cleared=[...previous.cleared,i].sort((a,b)=>a-b);
  try{localStorage.setItem(STORY_KEY+hero,JSON.stringify({cleared}))}catch(e){console.warn('Story-Fortschritt konnte nicht gespeichert werden:',e);return false}
  return true;
 }
 function stat(hero){
  if(hero==='Kael')return '30 Missionen · Bestehende Chronik';
  const p=storyProgress(hero).cleared.length;
  return p+'/10 Missionen · Level '+(chain()?.levelFor(hero)||1);
 }
 function photo(hero){return 'artwork/story/'+String(hero).toLowerCase()+'.jpg'}
 function heroBox(hero){
  const item=stories[hero];if(!item)return '';
  return '<div class="ac-story-hero454"><img src="'+photo(hero)+'" alt="'+esc(hero)+'"><div><h3>'+esc(hero)+'</h3><p>'+esc(item.title)+'</p><p>'+esc(item.theme)+'</p><small>'+esc(stat(hero))+'</small></div></div>';
 }
 function unlockStatus(hero){
  if(canPlay(hero))return '✓ Spielbar';
  if(hero==='Leon')return '🔒 Kael Level 10 und Mission 1-1';
  return chain()?.status(hero)||'🔒 Bedingungen noch nicht verfügbar';
 }
 function open(){
  byId('arcaneCharacterPicker391').hidden=true;
  const kaelStage=byId('arcaneStory357');if(kaelStage)kaelStage.hidden=true;
  modal.hidden=false;modal.querySelector('.ac-story-shell454').scrollTop=0;
 }
 function resetFinishedGame(){
  if(!processed)return;
  processed=false;active=null;
  try{prepareBoard();render()}catch(err){console.warn('Duell konnte nicht neu initialisiert werden:',err)}
 }
 function close(){
  modal.hidden=true;state={view:'hub',hero:null,index:null,page:0};
  resetFinishedGame();
  HOME.hidden=false;
 }
 function renderHub(){
  state={view:'hub',hero:null,index:null,page:0};heading.textContent='Die Geschichten der Chronik';open();
  const names=['Kael',...cast];
  body.innerHTML='<p class="ac-story-copy454">Jeder Duellant folgt seinem eigenen Weg. Deine Kapitel und Siege bleiben für jeden Charakter getrennt gespeichert.</p>'
   +'<div class="ac-story-roster454">'+names.map(name=>{
      const item=stories[name],subtitle=name==='Kael'?'Die Chronik der Sieben Siegel':item.title;
      return '<button type="button" class="ac-story-choice454" data-cs454="hero" data-hero454="'+name+'"><img src="'+photo(name)+'" alt=""><span><strong>'+name+'</strong><small>'+esc(subtitle)+'</small><small>'+esc(name==='Kael'?'Eigene 30-Missionen-Chronik':unlockStatus(name))+'</small></span></button>';
   }).join('')+'</div>';
 }
 function openKael(){
  resetFinishedGame();
  modal.hidden=true;PICKER.hidden=true;HOME.hidden=true;
  try{localStorage.setItem(SELECTED_KEY,'Kael')}catch(_){}
  window.syncDuelCharacterPortraits396?.();
  window.arcaneStory357.open();
 }
 function renderHero(hero){
  if(hero==='Kael'){openKael();return}
  const item=stories[hero];if(!item)return;
  state={view:'map',hero,index:null,page:0};heading.textContent=item.title;open();
  const progress=storyProgress(hero),playable=canPlay(hero),next=progress.cleared.length;
  body.innerHTML=heroBox(hero)
   +'<p class="ac-story-copy454">'+esc(item.intro)+'</p>'
   +'<p class="ac-story-copy454">'+esc(item.second)+'</p>'
   +'<div class="ac-story-track454"><span style="width:'+(next*10)+'%"></span></div>'
   +'<div class="ac-story-status454">'+esc(unlockStatus(hero))+(playable?' · Eigene Siege: '+next+'/10':' · Geschichte als Vorschau lesbar, Duelle gesperrt')+'</div>'
   +'<div class="ac-story-actions454"><button class="ac-story-btn454" data-cs454="prologue" data-hero454="'+hero+'">📖 Prolog lesen</button>'
   +(playable?'<button class="ac-story-btn454 alt" data-cs454="select" data-hero454="'+hero+'">✦ '+(selectedHero454()===hero?'Ausgewählt':'Als '+hero+' spielen')+'</button>':'')+'</div>'
   +'<h3>Kapitel 1 · '+esc(item.title)+'</h3>'
   +'<div class="ac-story-list454">'+item.missions.map((m,i)=>{
      const complete=progress.cleared.includes(i),unlocked=playable&&(i===0||progress.cleared.includes(i-1));
      return '<button class="ac-story-mission454" data-cs454="mission" data-hero454="'+hero+'" data-index454="'+i+'" '+(unlocked?'':'disabled')+'><span>'+(complete?'✓':unlocked?'⚔':'🔒')+'</span><div><strong>'+(i+1)+'. '+esc(m[0])+'</strong><small>'+esc(enemy[m[1]])+' · '+(complete?'Geschafft':unlocked?'Bereit':'Gesperrt')+'</small></div></button>';
   }).join('')+'</div>'
   +'<div class="ac-story-actions454"><button type="button" class="ac-story-btn454 alt" data-cs454="hub">← Alle Geschichten</button></div>';
 }
 function renderPrologue(hero){
  state={view:'prologue',hero,index:null,page:0};heading.textContent=hero+' · Prolog';open();
  body.innerHTML=heroBox(hero)
    +'<div class="ac-story-dialog454"><strong>Erzähler</strong><p>'+esc(stories[hero].intro)+'</p><p>'+esc(stories[hero].second)+'</p></div>'
    +'<div class="ac-story-actions454"><button class="ac-story-btn454" data-cs454="hero" data-hero454="'+hero+'">Zur Missionsübersicht</button></div>';
 }
 function renderDialogue(hero,index,post=false){
  const item=stories[hero];if(!item||!item.missions[index])return;
  const mission=item.missions[index],speaker=post?hero:enemy[mission[1]],line=post?mission[3]:mission[2];
  state={view:post?'post':'pre',hero,index,page:0};heading.textContent=hero+' · Mission '+(index+1);open();
  body.innerHTML=heroBox(hero)
    +'<h3>Mission '+(index+1)+'/10 · '+esc(mission[0])+'</h3>'
    +'<div class="ac-story-dialog454"><strong>'+esc(speaker)+'</strong><p>'+esc(line)+'</p>'
    +(post?'<p><strong>'+esc(hero)+'</strong>: Unser Weg ist noch nicht zu Ende.</p>':'<p><strong>'+esc(hero)+'</strong>: Ich werde die Wahrheit finden.</p>')+'</div>'
    +'<div class="ac-story-actions454">'+(post?'<button class="ac-story-btn454" data-cs454="next" data-hero454="'+hero+'" data-index454="'+index+'">'+(index===9?'Kapitel abschließen':'Nächste Mission')+'</button>':
       '<button class="ac-story-btn454" data-cs454="battle" data-hero454="'+hero+'" data-index454="'+index+'">⚔ Duell starten</button>')
    +'<button class="ac-story-btn454 alt" data-cs454="hero" data-hero454="'+hero+'">Missionsübersicht</button></div>';
 }
 function renderEpilogue(hero){
  const item=stories[hero];if(!item)return;
  state={view:'epilogue',hero,index:9,page:0};heading.textContent=hero+' · Kapitel abgeschlossen';open();
  body.innerHTML=heroBox(hero)
   +'<h3>✦ Kapitel 1 abgeschlossen ✦</h3>'
   +'<div class="ac-story-dialog454"><strong>Erzähler</strong><p>'+esc(item.end)+'</p></div>'
   +'<div class="ac-story-actions454"><button class="ac-story-btn454" data-cs454="hero" data-hero454="'+hero+'">Zur Kapitelübersicht</button></div>';
 }
 function renderResult(hero,index,win,draw=false){
  if(win){renderDialogue(hero,index,true);return}
  state={view:'lost',hero,index,page:0};heading.textContent=hero+' · Duell beendet';open();
  body.innerHTML=heroBox(hero)
   +'<div class="ac-story-dialog454"><strong>'+(draw?'Unentschieden':'Duell verloren')+'</strong><p>Die Geschichte wartet auf deinen nächsten Versuch. Deine abgeschlossenen Missionen bleiben gespeichert.</p></div>'
   +'<div class="ac-story-actions454"><button class="ac-story-btn454" data-cs454="retry" data-hero454="'+hero+'" data-index454="'+index+'">⚔ Erneut versuchen</button><button class="ac-story-btn454 alt" data-cs454="hero" data-hero454="'+hero+'">Missionsübersicht</button></div>';
 }
 function choose(hero){
  if(!canPlay(hero))return false;
  try{localStorage.setItem(SELECTED_KEY,hero)}catch(_){return false}
  window.syncDuelCharacterPortraits396?.();
  // Same event flow as the original picker when its own selection button exists.
  const selectButton=CARDS.querySelector('[data-home-character-391="'+hero+'"]');
  if(selectButton&&!selectButton.disabled)selectButton.click();
  return true;
 }
 function clearSessions(){
  try{sessionStorage.removeItem('arcane-story-active-duel-358')}catch(_){}
 }
 function sessionSet(key,value){try{sessionStorage.setItem(key,JSON.stringify(value));return true}catch(_){return false}}
 function sessionGet(key){try{const x=JSON.parse(sessionStorage.getItem(key)||'null');return x&&cast.includes(x.hero)&&Number.isInteger(x.index)&&x.index>=0&&x.index<10?x:null}catch(_){return null}}
 function sessionClear(key){try{sessionStorage.removeItem(key)}catch(_){}}
 function prepareBoard(){
  // Starts an actual duel with existing cards, interactions, effects and 4000 LP.
  if(typeof createDuelDeck!=='function'||typeof render!=='function')throw Error('Duellsteuerung nicht verfügbar');
  drawPile=createDuelDeck();hand=drawPile.splice(0,5);
  aiDeck=createDuelDeck();aiHand=aiDeck.splice(0,5);aiTurn=0;
  myMon=Array(4).fill(null);mySpell=Array(4).fill(null);
  oppMon=Array(4).fill(null);oppSpell=Array(4).fill(null);
  myGraveyard=[];oppGraveyard=[];myLP=4000;oppLP=4000;
  turn=1;phase='main1';normalSummonUsed=false;crystalShield=false;
  selected=-1;chosenMonster=-1;chosenTarget=-1;chosenSpell=-1;
  pendingTribute=null;pendingPlacement=null;pendingSwipeSummon=null;
  byId('duelOutcome306')?.remove();
 }
 function startBattle(hero,index){
  if(!canPlay(hero)||!stories[hero]?.missions[index])return;
  const cleared=storyProgress(hero).cleared;
  if(index!==0&&!cleared.includes(index-1))return;
  if(!choose(hero))return;
  const mission=stories[hero].missions[index];
  try{
   window.arcaneCharacterChain453?.resetVictory?.();
   prepareBoard();
   if(!window.arcaneApplyStoryOpponent362?.(mission[1]))throw Error('Gegnerdeck konnte nicht geladen werden');
   active={hero,index};processed=false;clearSessions();sessionClear(POST_KEY);
   sessionSet(ACTIVE_KEY,active);
   window.arcaneCurrentStoryOpponent397=enemy[mission[1]];
   window.syncDuelCharacterPortraits396?.();
   modal.hidden=true;PICKER.hidden=true;HOME.hidden=true;
   const intro=byId('arcaneIntro308'),title=byId('arcaneTitleScreen447');
   if(intro){intro.hidden=true;intro.querySelector('video')?.pause()}
   if(title)title.hidden=true;
   const menu=byId('arcaneReturnMenu307');if(menu)menu.hidden=false;
   render();
  }catch(error){console.error('Charaktergeschichte konnte nicht gestartet werden:',error);active=null;sessionClear(ACTIVE_KEY);renderHero(hero);
    const message=document.createElement('p');message.className='ac-story-status454';message.textContent='Dieses Duell konnte nicht gestartet werden. Die bestehende Geschichte bleibt erhalten.';body.prepend(message);
  }
 }
 const previousResult=window.arcaneStoryResult357;
 window.arcaneStoryResult357=function(won,draw){
  if(processed)return true;
  if(!active)return typeof previousResult==='function'?previousResult(won,draw):false;
  processed=true;
  const {hero,index}=active;active=null;
  sessionClear(ACTIVE_KEY);
  if(won){saveProgress(hero,index);sessionSet(POST_KEY,{hero,index});}
  renderResult(hero,index,!!won,!!draw);
  return true;
 };
 function next(hero,index){
  sessionClear(POST_KEY);
  if(index===9){renderEpilogue(hero);return}
  if(!canPlay(hero)){renderHero(hero);return}
  // Reload to reset the existing duel state, as Kael's campaign already does.
  if(sessionSet(ACTIVE_KEY,{hero,index:index+1})){window.location.reload();return}
  renderHero(hero);
 }
 function retry(hero,index){
  sessionClear(POST_KEY);
  if(sessionSet(ACTIVE_KEY,{hero,index})){window.location.reload();return}
  renderHero(hero);
 }
 modal.addEventListener('click',e=>{
  const b=e.target.closest('[data-cs454]');if(!b)return;
  const action=b.dataset.cs454,hero=b.dataset.hero454,index=Number(b.dataset.index454);
  if(action==='close')close();
  else if(action==='hub')renderHub();
  else if(action==='hero')hero==='Kael'?openKael():renderHero(hero);
  else if(action==='prologue')renderPrologue(hero);
  else if(action==='select'){choose(hero);renderHero(hero)}
  else if(action==='mission')renderDialogue(hero,index);
  else if(action==='battle')startBattle(hero,index);
  else if(action==='next')next(hero,index);
  else if(action==='retry')retry(hero,index);
 });
 CARDS.addEventListener('click',e=>{
  const button=e.target.closest('[data-character-story-454]');
  if(!button)return;
  e.stopPropagation();e.preventDefault();
  const hero=button.dataset.characterStory454;
  hero==='Kael'?openKael():renderHero(hero);
 },true);
 // The main story landmark opens a story selection; never overwrite Kael's engine.
 const storyButton=HOME.querySelector('[data-arcane-mode="story"]');
 document.addEventListener('click',e=>{
  if(storyButton&&storyButton.contains(e.target)){
   e.stopImmediatePropagation();e.preventDefault();renderHub();
  }
 },true);
 const arenaButton=byId('arcaneStartDuel307');
 arenaButton?.addEventListener('click',resetFinishedGame,true);
 const returnButton=byId('arcaneReturnMenu307');
 returnButton?.addEventListener('click',()=>{
  if(active){active=null;processed=false;sessionClear(ACTIVE_KEY);sessionClear(POST_KEY)}
 },true);
 const pending=sessionGet(ACTIVE_KEY);
 if(pending&&canPlay(pending.hero)){
  sessionClear(ACTIVE_KEY);startBattle(pending.hero,pending.index);
 }else{
  sessionClear(ACTIVE_KEY);
  const post=sessionGet(POST_KEY);
  if(post){sessionClear(POST_KEY);renderResult(post.hero,post.index,true);}
 }
 window.arcaneCharacterStories454={openHub:renderHub,openStory:hero=>hero==='Kael'?openKael():renderHero(hero),progress:storyProgress};
})();
