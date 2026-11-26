/* Chapter 5: story-exclusive solar and storm boss decks. */
window.ARCANE_CH5_BOSSES=(()=>{
const data={
  "solarius": {
    "hero": "solarius",
    "element": "Licht",
    "pool": [
      {
        "name": "Sonnenorden-Rekrut",
        "kind": "monster",
        "level": 3,
        "atk": 1300,
        "def": 1000,
        "fx": "self200",
        "effectText": "Bei offener Beschwörung: Diese Karte erhält 200 ATK.",
        "race": "Krieger",
        "copies": 3
      },
      {
        "name": "Lichtfunken-Phönix",
        "kind": "monster",
        "level": 2,
        "atk": 800,
        "def": 1300,
        "fx": "heal300",
        "effectText": "Bei offener Beschwörung: Erhalte 300 LP.",
        "race": "Geflügeltes Ungeheuer",
        "copies": 3
      },
      {
        "name": "Helios-Schildwache",
        "kind": "monster",
        "level": 4,
        "atk": 1100,
        "def": 1900,
        "fx": "flipdef",
        "effectText": "Beim Aufdecken durch einen Angriff: Erhält 300 DEF.",
        "race": "Krieger",
        "copies": 3
      },
      {
        "name": "Strahlenklingen-Ritter",
        "kind": "monster",
        "level": 4,
        "atk": 1700,
        "def": 1200,
        "fx": "ally300",
        "effectText": "Bei offener Beschwörung: Ein anderes eigenes offenes Lichtmonster erhält 300 ATK.",
        "race": "Krieger",
        "copies": 3
      },
      {
        "name": "Sonnengreif Aurix",
        "kind": "monster",
        "level": 4,
        "atk": 1600,
        "def": 1300,
        "fx": "draw",
        "effectText": "Bei offener Beschwörung: Ziehe 1 Karte.",
        "race": "Geflügeltes Ungeheuer",
        "copies": 3
      },
      {
        "name": "Dämmerungspriesterin",
        "kind": "monster",
        "level": 4,
        "atk": 1400,
        "def": 1600,
        "fx": "heal400",
        "effectText": "Bei offener Beschwörung: Erhalte 400 LP.",
        "race": "Magier",
        "copies": 3
      },
      {
        "name": "Goldlanzen-Kommandant",
        "kind": "monster",
        "level": 5,
        "atk": 2100,
        "def": 1800,
        "fx": "tributeBoost",
        "effectText": "Bei offener Tributbeschwörung: Diese Karte erhält 400 ATK.",
        "race": "Krieger",
        "copies": 3
      },
      {
        "name": "Sonnentempel-Phönix",
        "kind": "monster",
        "level": 6,
        "atk": 2300,
        "def": 2100,
        "fx": "tributeHeal",
        "effectText": "Bei offener Tributbeschwörung: Erhalte 500 LP.",
        "race": "Geflügeltes Ungeheuer",
        "copies": 3
      },
      {
        "name": "Solarius, Fürst der Sonnenglut",
        "kind": "monster",
        "level": 8,
        "atk": 2900,
        "def": 2500,
        "fx": "solarBoss",
        "effectText": "Benötigt 2 Tribute. Bei offener Tributbeschwörung: Alle eigenen offenen Lichtmonster erhalten 500 ATK bis Zugende.",
        "race": "Krieger",
        "copies": 2
      },
      {
        "name": "Schwur des Sonnenordens",
        "kind": "spell",
        "fx": "boost500",
        "effectText": "Ein eigenes offenes Lichtmonster erhält 500 ATK bis Zugende.",
        "copies": 3
      },
      {
        "name": "Heilendes Morgenlicht",
        "kind": "spell",
        "fx": "drawheal",
        "effectText": "Ziehe 1 Karte und erhalte 300 LP.",
        "copies": 3
      },
      {
        "name": "Auferstehung der Sonnenglut",
        "kind": "spell",
        "fx": "revive4",
        "effectText": "Beschwöre ein Lichtmonster der Stufe 4 oder niedriger aus deinem Friedhof offen in Verteidigung.",
        "copies": 3
      },
      {
        "name": "Ruf der Goldenen Legion",
        "kind": "spell",
        "fx": "searchLow",
        "effectText": "Nimm ein Lichtmonster der Stufe 4 oder niedriger aus deinem Deck auf die Hand.",
        "copies": 3
      },
      {
        "name": "Sonnenlanze",
        "kind": "spell",
        "fx": "weak500",
        "effectText": "Das stärkste offene gegnerische Monster verliert 500 ATK bis Zugende.",
        "copies": 3
      },
      {
        "name": "Krone der Morgensonne",
        "kind": "spell",
        "fx": "allboost",
        "effectText": "Alle eigenen offenen Lichtmonster erhalten 300 ATK bis Zugende.",
        "copies": 3
      },
      {
        "name": "Schild der Morgenröte",
        "kind": "trap",
        "fx": "trapheal",
        "effectText": "Ab dem nächsten eigenen Zug: Stoppe einen gegnerischen Angriff und erhalte 300 LP.",
        "copies": 3
      },
      {
        "name": "Vergeltung des Sonnenordens",
        "kind": "trap",
        "fx": "trapburn",
        "effectText": "Ab dem nächsten eigenen Zug: Stoppe einen gegnerischen Angriff und füge dem Gegner 300 LP Schaden zu.",
        "copies": 3
      }
    ],
    "decks": [
      [
        {
          "name": "Sonnenorden-Rekrut",
          "count": 3
        },
        {
          "name": "Lichtfunken-Phönix",
          "count": 3
        },
        {
          "name": "Helios-Schildwache",
          "count": 3
        },
        {
          "name": "Strahlenklingen-Ritter",
          "count": 3
        },
        {
          "name": "Sonnengreif Aurix",
          "count": 3
        },
        {
          "name": "Dämmerungspriesterin",
          "count": 3
        },
        {
          "name": "Schwur des Sonnenordens",
          "count": 3
        },
        {
          "name": "Heilendes Morgenlicht",
          "count": 3
        },
        {
          "name": "Ruf der Goldenen Legion",
          "count": 3
        },
        {
          "name": "Schild der Morgenröte",
          "count": 3
        }
      ],
      [
        {
          "name": "Sonnenorden-Rekrut",
          "count": 3
        },
        {
          "name": "Helios-Schildwache",
          "count": 3
        },
        {
          "name": "Strahlenklingen-Ritter",
          "count": 3
        },
        {
          "name": "Sonnengreif Aurix",
          "count": 3
        },
        {
          "name": "Dämmerungspriesterin",
          "count": 3
        },
        {
          "name": "Goldlanzen-Kommandant",
          "count": 3
        },
        {
          "name": "Schwur des Sonnenordens",
          "count": 3
        },
        {
          "name": "Auferstehung der Sonnenglut",
          "count": 3
        },
        {
          "name": "Ruf der Goldenen Legion",
          "count": 3
        },
        {
          "name": "Schild der Morgenröte",
          "count": 3
        }
      ],
      [
        {
          "name": "Sonnenorden-Rekrut",
          "count": 3
        },
        {
          "name": "Helios-Schildwache",
          "count": 3
        },
        {
          "name": "Strahlenklingen-Ritter",
          "count": 3
        },
        {
          "name": "Sonnengreif Aurix",
          "count": 3
        },
        {
          "name": "Goldlanzen-Kommandant",
          "count": 3
        },
        {
          "name": "Sonnentempel-Phönix",
          "count": 3
        },
        {
          "name": "Heilendes Morgenlicht",
          "count": 3
        },
        {
          "name": "Auferstehung der Sonnenglut",
          "count": 3
        },
        {
          "name": "Krone der Morgensonne",
          "count": 3
        },
        {
          "name": "Vergeltung des Sonnenordens",
          "count": 3
        }
      ],
      [
        {
          "name": "Sonnenorden-Rekrut",
          "count": 3
        },
        {
          "name": "Lichtfunken-Phönix",
          "count": 3
        },
        {
          "name": "Strahlenklingen-Ritter",
          "count": 3
        },
        {
          "name": "Sonnengreif Aurix",
          "count": 3
        },
        {
          "name": "Goldlanzen-Kommandant",
          "count": 3
        },
        {
          "name": "Sonnentempel-Phönix",
          "count": 3
        },
        {
          "name": "Auferstehung der Sonnenglut",
          "count": 3
        },
        {
          "name": "Krone der Morgensonne",
          "count": 3
        },
        {
          "name": "Vergeltung des Sonnenordens",
          "count": 3
        },
        {
          "name": "Solarius, Fürst der Sonnenglut",
          "count": 2
        },
        {
          "name": "Helios-Schildwache",
          "count": 1
        }
      ]
    ]
  },
  "zephyron": {
    "hero": "zephyron",
    "element": "Wind",
    "pool": [
      {
        "name": "Windfeder-Späher",
        "kind": "monster",
        "level": 3,
        "atk": 1300,
        "def": 1000,
        "fx": "draw",
        "effectText": "Bei offener Beschwörung: Ziehe 1 Karte.",
        "race": "Geflügeltes Ungeheuer",
        "copies": 3
      },
      {
        "name": "Himmelsgeist Aeri",
        "kind": "monster",
        "level": 2,
        "atk": 700,
        "def": 1400,
        "fx": "weak200",
        "effectText": "Bei offener Beschwörung: Das stärkste offene gegnerische Monster verliert 200 ATK bis Zugende.",
        "race": "Geist",
        "copies": 3
      },
      {
        "name": "Wolkenfestungs-Wächter",
        "kind": "monster",
        "level": 4,
        "atk": 1000,
        "def": 2000,
        "fx": "flipdef",
        "effectText": "Beim Aufdecken durch einen Angriff: Erhält 300 DEF.",
        "race": "Krieger",
        "copies": 3
      },
      {
        "name": "Sturmklingen-Duellant",
        "kind": "monster",
        "level": 4,
        "atk": 1700,
        "def": 1200,
        "fx": "weak300",
        "effectText": "Bei offener Beschwörung: Das stärkste offene gegnerische Monster verliert 300 ATK bis Zugende.",
        "race": "Krieger",
        "copies": 3
      },
      {
        "name": "Donnergreif Veyr",
        "kind": "monster",
        "level": 4,
        "atk": 1600,
        "def": 1300,
        "fx": "lock",
        "effectText": "Bei offener Beschwörung: Das stärkste offene gegnerische Monster kann im nächsten gegnerischen Zug nicht angreifen.",
        "race": "Geflügeltes Ungeheuer",
        "copies": 3
      },
      {
        "name": "Wirbelwind-Wyvern",
        "kind": "monster",
        "level": 4,
        "atk": 1500,
        "def": 1500,
        "fx": "ally300",
        "effectText": "Bei offener Beschwörung: Ein anderes eigenes offenes Windmonster erhält 300 ATK.",
        "race": "Drache",
        "copies": 3
      },
      {
        "name": "Himmelslanzen-Ritter",
        "kind": "monster",
        "level": 5,
        "atk": 2100,
        "def": 1700,
        "fx": "tributeWeak",
        "effectText": "Bei offener Tributbeschwörung: Das stärkste offene gegnerische Monster verliert 500 ATK bis Zugende.",
        "race": "Krieger",
        "copies": 3
      },
      {
        "name": "Orkandrache Aetherion",
        "kind": "monster",
        "level": 6,
        "atk": 2400,
        "def": 1900,
        "fx": "destroySet",
        "effectText": "Bei offener Tributbeschwörung: Zerstöre eine gesetzte gegnerische Zauber- oder Fallenkarte.",
        "race": "Drache",
        "copies": 3
      },
      {
        "name": "Zephyron, Klinge des ewigen Sturms",
        "kind": "monster",
        "level": 8,
        "atk": 3000,
        "def": 2400,
        "fx": "stormBoss",
        "effectText": "Benötigt 2 Tribute. Bei offener Tributbeschwörung: Alle offenen gegnerischen Monster verlieren 500 ATK bis Zugende; das stärkste kann im nächsten gegnerischen Zug nicht angreifen.",
        "race": "Krieger",
        "copies": 2
      },
      {
        "name": "Klingen des Orkans",
        "kind": "spell",
        "fx": "weak500",
        "effectText": "Das stärkste offene gegnerische Monster verliert 500 ATK bis Zugende.",
        "copies": 3
      },
      {
        "name": "Atem des Himmels",
        "kind": "spell",
        "fx": "searchLow",
        "effectText": "Nimm ein Windmonster der Stufe 4 oder niedriger aus deinem Deck auf die Hand.",
        "copies": 3
      },
      {
        "name": "Wiederkehr der Windseelen",
        "kind": "spell",
        "fx": "revive4",
        "effectText": "Beschwöre ein Windmonster der Stufe 4 oder niedriger aus deinem Friedhof offen in Verteidigung.",
        "copies": 3
      },
      {
        "name": "Ruf der Sturmkrone",
        "kind": "spell",
        "fx": "searchHigh",
        "effectText": "Nimm ein Windmonster der Stufe 5 oder höher aus deinem Deck auf die Hand.",
        "copies": 3
      },
      {
        "name": "Himmelssturz",
        "kind": "spell",
        "fx": "destroySpell",
        "effectText": "Falls du ein offenes tributbeschworenes Windmonster kontrollierst: Zerstöre eine gegnerische Zauber- oder Fallenkarte.",
        "copies": 3
      },
      {
        "name": "Zyklon der Verheerung",
        "kind": "spell",
        "fx": "allweak",
        "effectText": "Alle offenen gegnerischen Monster verlieren 300 ATK bis Zugende.",
        "copies": 3
      },
      {
        "name": "Mauer des Windes",
        "kind": "trap",
        "fx": "trapstop",
        "effectText": "Ab dem nächsten eigenen Zug: Stoppe einen gegnerischen Angriff.",
        "copies": 3
      },
      {
        "name": "Fesseln des Donnersturms",
        "kind": "trap",
        "fx": "traplock",
        "effectText": "Ab dem nächsten eigenen Zug: Stoppe einen gegnerischen Angriff und das angreifende Monster kann in seinem nächsten Zug nicht angreifen.",
        "copies": 3
      }
    ],
    "decks": [
      [
        {
          "name": "Windfeder-Späher",
          "count": 3
        },
        {
          "name": "Himmelsgeist Aeri",
          "count": 3
        },
        {
          "name": "Wolkenfestungs-Wächter",
          "count": 3
        },
        {
          "name": "Sturmklingen-Duellant",
          "count": 3
        },
        {
          "name": "Donnergreif Veyr",
          "count": 3
        },
        {
          "name": "Wirbelwind-Wyvern",
          "count": 3
        },
        {
          "name": "Klingen des Orkans",
          "count": 3
        },
        {
          "name": "Atem des Himmels",
          "count": 3
        },
        {
          "name": "Wiederkehr der Windseelen",
          "count": 3
        },
        {
          "name": "Mauer des Windes",
          "count": 3
        }
      ],
      [
        {
          "name": "Windfeder-Späher",
          "count": 3
        },
        {
          "name": "Wolkenfestungs-Wächter",
          "count": 3
        },
        {
          "name": "Sturmklingen-Duellant",
          "count": 3
        },
        {
          "name": "Donnergreif Veyr",
          "count": 3
        },
        {
          "name": "Wirbelwind-Wyvern",
          "count": 3
        },
        {
          "name": "Himmelslanzen-Ritter",
          "count": 3
        },
        {
          "name": "Klingen des Orkans",
          "count": 3
        },
        {
          "name": "Wiederkehr der Windseelen",
          "count": 3
        },
        {
          "name": "Ruf der Sturmkrone",
          "count": 3
        },
        {
          "name": "Mauer des Windes",
          "count": 3
        }
      ],
      [
        {
          "name": "Windfeder-Späher",
          "count": 3
        },
        {
          "name": "Wolkenfestungs-Wächter",
          "count": 3
        },
        {
          "name": "Sturmklingen-Duellant",
          "count": 3
        },
        {
          "name": "Donnergreif Veyr",
          "count": 3
        },
        {
          "name": "Himmelslanzen-Ritter",
          "count": 3
        },
        {
          "name": "Orkandrache Aetherion",
          "count": 3
        },
        {
          "name": "Wiederkehr der Windseelen",
          "count": 3
        },
        {
          "name": "Ruf der Sturmkrone",
          "count": 3
        },
        {
          "name": "Himmelssturz",
          "count": 3
        },
        {
          "name": "Fesseln des Donnersturms",
          "count": 3
        }
      ],
      [
        {
          "name": "Windfeder-Späher",
          "count": 3
        },
        {
          "name": "Himmelsgeist Aeri",
          "count": 3
        },
        {
          "name": "Sturmklingen-Duellant",
          "count": 3
        },
        {
          "name": "Donnergreif Veyr",
          "count": 3
        },
        {
          "name": "Himmelslanzen-Ritter",
          "count": 3
        },
        {
          "name": "Orkandrache Aetherion",
          "count": 3
        },
        {
          "name": "Wiederkehr der Windseelen",
          "count": 3
        },
        {
          "name": "Zyklon der Verheerung",
          "count": 3
        },
        {
          "name": "Fesseln des Donnersturms",
          "count": 3
        },
        {
          "name": "Zephyron, Klinge des ewigen Sturms",
          "count": 2
        },
        {
          "name": "Wolkenfestungs-Wächter",
          "count": 1
        }
      ]
    ]
  }
};
function create(index,tier,shuffle){
 const d=data[index===44?'solarius':index===49?'zephyron':''];if(!d)return null;
 const n=Math.max(1,Math.min(4,Math.trunc(Number(tier)||1)));
 const cards=d.decks[n-1].flatMap(c=>{const {copies,...base}=d.pool.find(x=>x.name===c.name);return Array.from({length:c.count},()=>({...base,element:d.element,skin:base.kind==='monster'?'ice':'spell',emoji:base.kind==='monster'?(d.hero==='solarius'?'☀️':'🌪️'):base.kind==='spell'?'✨':'🛡️',ch3Hero:d.hero,ch5Hero:d.hero}));});
 if(cards.length!==30||cards.some(c=>cards.filter(x=>x.name===c.name).length>3))throw Error('Chapter 5 boss deck invalid');
 return {cards:shuffle(cards),extra:[]};
}
return {data,create};
})();
function ch5IsBoss(){return ['Solarius','Zephyron'].includes(window.arcaneStoryOpponentInfo362?.name)}
const ch5PrevBoss=ch3IsBoss;
ch3IsBoss=function(){return ch5PrevBoss()||ch5IsBoss()};
const ch5PrevMonster=ch3MonsterEvent;
ch3MonsterEvent=function(card,event,owner){
 if(!card?.ch5Hero||owner!=='opponent')return ch5PrevMonster(card,event,owner);
 if(event==='flip'&&card.fx==='flipdef')ch3Def(card,300);
 if(event!=='summon'||card.faceDown)return;
 const enemy=ch3Top(myMon), allies=oppMon.filter(m=>m&&!m.faceDown&&m.element===card.element);
 switch(card.fx){
 case 'self200':ch3Boost(card,200);break;
 case 'heal300':oppLP+=300;break;
 case 'heal400':oppLP+=400;break;
 case 'ally300':ch3Boost(ch3Top(allies.filter(m=>m!==card)),300);break;
 case 'draw':ch3Draw();break;
 case 'weak200':ch3TurnBoost(enemy,-200);break;
 case 'weak300':ch3TurnBoost(enemy,-300);break;
 case 'lock':if(enemy)enemy.varekLockedUntil=Math.max(enemy.varekLockedUntil||0,turn+1);break;
 case 'tributeBoost':if(card.ch3Tribute)ch3Boost(card,400);break;
 case 'tributeHeal':if(card.ch3Tribute)oppLP+=500;break;
 case 'tributeWeak':if(card.ch3Tribute)ch3TurnBoost(enemy,-500);break;
 case 'destroySet':if(card.ch3Tribute)ch3EnemyDestroy(mySpell,true);break;
 case 'solarBoss':if(card.ch3Tribute)allies.forEach(m=>ch3TurnBoost(m,500));break;
 case 'stormBoss':if(card.ch3Tribute){myMon.filter(m=>m&&!m.faceDown).forEach(m=>ch3TurnBoost(m,-500));if(enemy)enemy.varekLockedUntil=Math.max(enemy.varekLockedUntil||0,turn+1)}break;
 }
};
function ch5Spell(c){
 const own=ch3Top(oppMon.filter(m=>m?.element===c.element)), enemy=ch3Top(myMon);
 switch(c.fx){
 case 'boost500':if(!own)return false;ch3TurnBoost(own,500);return true;
 case 'weak500':if(!enemy)return false;ch3TurnBoost(enemy,-500);return true;
 case 'drawheal':if(!aiDeck.length)return false;ch3Draw();oppLP+=300;return true;
 case 'searchLow':return ch3Search(m=>m.kind==='monster'&&m.element===c.element&&m.level<=4);
 case 'searchHigh':return ch3Search(m=>m.kind==='monster'&&m.element===c.element&&m.level>=5);
 case 'revive4':{
 const z=oppMon.findIndex(m=>!m),i=oppGraveyard.findLastIndex(m=>m.kind==='monster'&&m.element===c.element&&m.level<=4&&!m.resonance);
 if(z<0||i<0)return false;const m=oppGraveyard.splice(i,1)[0];oppMon[z]={...m,faceDown:false,position:'defense',tempAtkBonus:0,tempDefBonus:0,ch3TurnAtk:0,ch3Tribute:false,summonedTurn:aiTurn,attacksThisTurn:1};return true;
 }
 case 'allboost':if(!own)return false;oppMon.filter(m=>m&&!m.faceDown&&m.element===c.element).forEach(m=>ch3TurnBoost(m,300));return true;
 case 'allweak':if(!enemy)return false;myMon.filter(m=>m&&!m.faceDown).forEach(m=>ch3TurnBoost(m,-300));return true;
 case 'destroySpell':return oppMon.some(m=>m?.ch3Tribute&&!m.faceDown&&m.element===c.element)&&ch3EnemyDestroy(mySpell);
 }
 return false;
}
const ch5PrevSpells=ch3AiSpells;
ch3AiSpells=async function(show,after){
 if(!ch5IsBoss())return ch5PrevSpells(show,after);
 const early=['drawheal','searchLow','searchHigh','revive4'];
 for(const c of aiHand.filter(c=>c.ch5Hero&&c.kind==='spell'&&(after?!early.includes(c.fx):early.includes(c.fx)))){
 const i=aiHand.indexOf(c);if(i<0)continue;aiHand.splice(i,1);
 if(!ch5Spell(c)){aiHand.splice(i,0,c);continue}
 sendToGraveyard(c,'opponent');log(c.emoji+' '+c.name+' aktiviert.');
 if(show)await arcaneAiPlay491(c,'Gegner aktiviert');break;
 }
};
const ch5PrevTrap=ch3DefenseTrap;
ch3DefenseTrap=function(attacker){
 if(!ch5IsBoss())return ch5PrevTrap(attacker);
 const i=oppSpell.findIndex(c=>c?.ch5Hero&&c.kind==='trap'&&aiTurn>c.setTurn);if(i<0)return false;
 return arcaneResolveOpponentTrap492(i,c=>{
 if(c.fx==='trapheal')oppLP+=300;
 if(c.fx==='trapburn')myLP=Math.max(0,myLP-300);
 if(c.fx==='traplock'&&attacker)attacker.varekLockedUntil=Math.max(attacker.varekLockedUntil||0,turn+1);
 log(c.emoji+' '+c.name+' stoppt den Angriff.');return true;
 });
};
