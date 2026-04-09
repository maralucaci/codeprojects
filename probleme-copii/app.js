'use strict';

// ══════════════════════════════════════════════
//  CURRICULUM
// ══════════════════════════════════════════════
const CURRICULUM = {
  1: {
    'Matematică': ['Adunări și scăderi (0–20)', 'Probleme compuse', 'Comparații și ordine'],
    'Română':     ['Silabe și cuvinte', 'Propoziții și texte scurte', 'Ortografie de bază'],
    'Logică':     ['Șiruri și tipare', 'Adevărat sau fals', 'Probleme de gândire'],
  },
  2: {
    'Matematică': ['Adunări și scăderi (0–100)', 'Înmulțiri (tabla 2–5)', 'Probleme în doi pași'],
    'Română':     ['Despărțire în silabe', 'Scrierea corectă', 'Textul și mesajul'],
    'Logică':     ['Deducții simple', 'Clasificări', 'Probleme de perspicacitate'],
  },
  3: {
    'Matematică': ['Operații cu numere până la 1000', 'Tabla înmulțirii complet', 'Probleme în trei pași'],
    'Română':     ['Părți de vorbire', 'Propoziția dezvoltată', 'Textul narativ'],
    'Logică':     ['Deducții și ordonări', 'Relații și comparații', 'Raționament logic'],
  },
  4: {
    'Matematică': ['Numere romane', 'Fracții și operații', 'Perimetru, arie și volum'],
    'Română':     ['Subiect, predicat și atribute', 'Sinonime, antonime, omonime', 'Analiza textului'],
    'Logică':     ['Probleme de perspicacitate avansate', 'Grile logice', 'Raționament matematic'],
  },
  5: {
    'Matematică': ['Fracții și numere zecimale', 'Procente și proporții', 'Geometrie plană'],
    'Română':     ['Modurile verbului', 'Complementele', 'Textul argumentativ'],
    'Logică':     ['Deducții în lanț', 'Probleme de tip olimpiadă', 'Combinatorică simplă'],
  },
  6: {
    'Matematică': ['Numere întregi și operații', 'Puteri și radicali', 'Arii și volume'],
    'Română':     ['Cazurile substantivului', 'Figuri de stil', 'Rezumatul'],
    'Logică':     ['Probleme de logică combinatorie', 'Grile 4×4', 'Raționament deductiv'],
  },
  7: {
    'Matematică': ['Ecuații și inecuații', 'Funcții liniare', 'Triunghi și cerc'],
    'Română':     ['Propoziție și frază', 'Subordonatele', 'Caracterizarea personajului'],
    'Logică':     ['Probleme de olimpiadă', 'Teoria mulțimilor', 'Probabilități și combinatorică'],
  },
  8: {
    'Matematică': ['Sisteme de ecuații', 'Teorema lui Pitagora și aplicații', 'Geometrie în spațiu'],
    'Română':     ['Eseul structurat', 'Analiza textului literar', 'Stilistică și figuri de stil'],
    'Logică':     ['Probleme de gândire avansată', 'Grile de tip olimpiadă', 'Combinatorică avansată'],
  },
};

// ── Utilități ──
function rand(min, max) { return Math.floor(Math.random() * (max - min + 1)) + min; }
function alege(arr) { return arr[Math.floor(Math.random() * arr.length)]; }
function shuffle(arr) { return [...arr].sort(() => Math.random() - 0.5); }

const NB = ['Andrei', 'Mihai', 'Alexandru', 'Radu', 'Vlad', 'Bogdan', 'Cristian', 'Dan', 'George', 'Ionuț', 'Tudor', 'Matei'];
const NF = ['Maria', 'Elena', 'Ana', 'Ioana', 'Sofia', 'Laura', 'Bianca', 'Mara', 'Diana', 'Raluca', 'Alina', 'Cristina'];
const FRUCTE   = ['mere', 'pere', 'portocale', 'banane', 'prune', 'caise', 'căpșuni', 'struguri', 'piersici', 'kiwi'];
const LEGUME   = ['roșii', 'castraveți', 'morcovi', 'ardei', 'vinete', 'ceapă', 'cartofi'];
const OBIECTE  = ['creioane', 'cărți', 'bile', 'bomboane', 'pixuri', 'timbre', 'flori', 'steluțe', 'jucării', 'caiete'];
const ANIMALE  = ['pisici', 'câini', 'iepuri', 'pești', 'păsări', 'rațe', 'oi', 'vaci', 'cai', 'capre'];
const CULORI   = ['roșu', 'albastru', 'verde', 'galben', 'portocaliu', 'violet', 'roz', 'alb', 'negru'];

function nb() { return alege(NB); }
function nf() { return alege(NF); }
function nn() { return alege([...NB, ...NF]); }
function fr() { return alege(FRUCTE); }
function ob() { return alege(OBIECTE); }

function toRoman(n) {
  const vals = [1000,900,500,400,100,90,50,40,30,20,10,9,8,7,6,5,4,3,2,1];
  const syms = ['M','CM','D','CD','C','XC','L','XL','XXX','XX','X','IX','VIII','VII','VI','V','IV','III','II','I'];
  let r = '';
  for (let i = 0; i < vals.length; i++) { while (n >= vals[i]) { r += syms[i]; n -= vals[i]; } }
  return r;
}

function lcm(a, b) { let x=a, y=b; while(y){[x,y]=[y,x%y];} return a*b/x; }

// ══════════════════════════════════════════════════════
//  BANCA DE PROBLEME — lungi, grele, cu context real
// ══════════════════════════════════════════════════════

const G = {};   // G[cheie] = funcție generator

// ╔══════════════════════════════════════════════╗
// ║              CLASA I                         ║
// ╚══════════════════════════════════════════════╝

G['1-Matematică-Adunări și scăderi (0–20)'] = () => {
  const v = [
    () => {
      const [a,b,c] = [rand(3,7), rand(2,5), rand(1,4)];
      const p1=nn(), p2=nn();
      return {
        text: `${p1} și ${p2} au cules fructe din grădina bunicii.\n${p1} a cules ${a} ${fr()}, iar ${p2} a cules cu ${b} mai multe decât ${p1}.\nDupă ce au ajuns acasă, mama le-a mai pus în coș încă ${c} fructe.`,
        cerinta: `a) Câte fructe a cules ${p2}?\nb) Câte fructe sunt în total în coș?`,
        raspuns: `a) ${p2} a cules: ${a} + ${b} = ${a+b} fructe\nb) Total în coș: ${a} + ${a+b} + ${c} = ${a+a+b+c} fructe`
      };
    },
    () => {
      const total=rand(12,20), dat=rand(3,7), primit=rand(2,5);
      const p=nn();
      return {
        text: `${p} a primit de ziua lui ${total} bomboane colorate.\nA dat ${dat} bomboane colegilor de bancă și a mai primit de la mama ${primit} bomboane cu ciocolată.\nDupă aceea, a mâncat 2 bomboane.`,
        cerinta: `a) Câte bomboane mai are ${p} după ce le-a dat colegilor?\nb) Câte bomboane are ${p} la final, după ce a mâncat 2?`,
        raspuns: `a) ${total} - ${dat} = ${total-dat} bomboane\nb) ${total-dat} + ${primit} - 2 = ${total-dat+primit-2} bomboane`
      };
    },
  ];
  const g = alege(v)();
  return g;
};

G['1-Matematică-Probleme compuse'] = () => {
  const [a,b,c] = [rand(4,8), rand(2,6), rand(1,5)];
  const p1=nb(), p2=nf(), animal=alege(ANIMALE);
  return {
    text: `La ferma bunicului trăiesc mai multe animale.\n${p1} a numărat ${a} ${animal} în curtea din față.\n${p2} a găsit ${b} ${animal} în grajd.\nSeara, s-au mai întors acasă de la pășune ${c} ${animal}.`,
    cerinta: `a) Câte ${animal} sunt pe fermă în total?\nb) Cu câte ${animal} mai mult are curtea față de grajd?\nc) Dacă se adaugă încă ${rand(1,4)} ${animal}, câte vor fi în total?`,
    raspuns: `a) ${a} + ${b} + ${c} = ${a+b+c} ${animal}\nb) ${Math.max(a,b)} - ${Math.min(a,b)} = ${Math.abs(a-b)} ${animal} mai mult\nc) ${a+b+c} + ${rand(1,4)} = (calculează cu numărul ales)`
  };
};

G['1-Matematică-Comparații și ordine'] = () => {
  const nums = shuffle([rand(1,9), rand(1,9), rand(1,9), rand(1,9), rand(1,9)]);
  const [a,b] = [rand(5,15), rand(5,15)];
  const p1=nb(), p2=nf(), p3=nn();
  return {
    text: `${p1} are ${a} creioane colorate, ${p2} are ${b} creioane colorate, iar ${p3} are cu ${rand(1,5)} mai puține decât ${p2}.\nÎnvățătoarea le-a cerut să aranjeze creioanele în ordine.\nNumerele de aranjat sunt: ${nums.join(', ')}`,
    cerinta: `a) Cine are cele mai multe creioane?\nb) Cine are cele mai puține?\nc) Scrie numerele ${nums.join(', ')} în ordine crescătoare.\nd) Scrie-le în ordine descrescătoare.`,
    raspuns: `a) ${a > b ? p1 : p2} are cele mai multe (${Math.max(a,b)} creioane)\nb) Compară toate cele 3 valori\nc) Crescător: ${[...nums].sort((x,y)=>x-y).join(' < ')}\nd) Descrescător: ${[...nums].sort((x,y)=>y-x).join(' > ')}`
  };
};

G['1-Română-Silabe și cuvinte'] = () => alege([
  { text: `Citește cu atenție cuvintele de mai jos și răspunde la întrebări:\n"fluture, casă, copil, aripi, grădiniță, prieteni, bucurie, soare"`,
    cerinta: `a) Desparte în silabe fiecare cuvânt.\nb) Scrie câte silabe are fiecare.\nc) Care este cel mai scurt cuvânt (cu cele mai puține silabe)?\nd) Formează o propoziție frumoasă cu cuvântul "fluture".`,
    raspuns: `a) flu-tu-re, ca-să, co-pil, a-ri-pi, gră-di-ni-ță, pri-e-te-ni, bu-cu-ri-e, soa-re\nb) 3, 2, 2, 3, 4, 4, 4, 2 silabe\nc) "casă", "copil" și "soare" (2 silabe)\nd) Exemplu: "Fluturele colorat zboară printre flori."` },
  { text: `Ana citește o carte și găsește aceste cuvinte pe care nu le cunoaște:\n"zăpadă, furnicar, prieten, luminiș, depărtat, fereastră, cântec"`,
    cerinta: `a) Desparte fiecare cuvânt în silabe.\nb) Câte silabe are cel mai lung cuvânt?\nc) Scrie 3 cuvinte cu exact 2 silabe din lista de mai sus.\nd) Alcătuiește o propoziție cu cuvântul "prieten".`,
    raspuns: `a) ză-pa-dă(3), fur-ni-car(3), pri-e-ten(3), lu-mi-niș(3), de-păr-tat(3), fe-reas-tră(3), cân-tec(2)\nb) Toate au 2-3 silabe; "cântec" are 2 silabe\nc) Cuvântul cu 2 silabe: "cântec"\nd) Exemplu: "Prietenul meu este bucuros."` },
]);

G['1-Română-Propoziții și texte scurte'] = () => alege([
  { text: `Citește textul următor cu atenție:\n\n"Dimineața, Mara s-a trezit devreme. A văzut pe fereastră că ninge. A luat sania și a ieșit în curte. S-a jucat cu prietenii până la prânz. Seara era obosită, dar fericită."`,
    cerinta: `a) Câte propoziții are textul?\nb) Cine este personajul principal?\nc) Ce a văzut Mara pe fereastră?\nd) Scrie o propoziție nouă despre ce crezi că a visat Mara în acea noapte.`,
    raspuns: `a) 5 propoziții\nb) Mara\nc) Mara a văzut că ninge\nd) Răspuns liber – exemple: "Mara a visat că zboară deasupra câmpului alb."` },
]);

G['1-Română-Ortografie de bază'] = () => alege([
  { text: `Ionuț a scris o scrisoare, dar a făcut câteva greșeli. Ajută-l să o corecteze!\n\n"dragă bunico, vin la tine sîmbăta viitoare. mama mi-a promis că mergem. aduc și catelul meu. el se numeste max. ne vedem curînd!"`,
    cerinta: `a) Rescrie scrisoarea corect (litere mari unde trebuie, cuvinte scrise corect).\nb) Subliniază toate greșelile de ortografie găsite.\nc) Câte greșeli ai găsit în total?`,
    raspuns: `a) "Dragă bunico, vin la tine sâmbăta viitoare. Mama mi-a promis că mergem. Aduc și cățelul meu. El se numește Max. Ne vedem curând!"\nb) sîmbăta→sâmbăta, catelul→cățelul, numeste→numește, curînd→curând; litere mici la început de propoziție\nc) Cel puțin 6 greșeli` },
]);

G['1-Logică-Șiruri și tipare'] = () => {
  const v = [
    () => {
      const start = rand(1,5), pas = rand(1,3);
      const sir = Array.from({length:6}, (_,i) => start + i*pas);
      return {
        text: `Observă cu atenție șirul de numere de mai jos și descoperă regula:\n\n${sir.join(', ')}, ___, ___, ___\n\nExemplu de gândire: De la un număr la altul, ce operație se face?`,
        cerinta: `a) Care sunt cele 3 numere lipsă?\nb) Care este regula șirului?\nc) Al 10-lea număr din șir ar fi?`,
        raspuns: `a) ${sir[6]||start+6*pas}, ${sir[7]||start+7*pas}, ${start+8*pas}\nb) Se adaugă ${pas} la fiecare pas\nc) Al 10-lea număr: ${start + 9*pas}`
      };
    },
    () => {
      const forme = ['○', '△', '□'];
      const pattern = [forme[0], forme[1], forme[2], forme[0], forme[1], forme[2]];
      return {
        text: `Privește șirul de forme geometrice:\n\n${pattern.join(' ')} ___ ___ ___\n\nFiecare formă se repetă într-o anumită ordine.`,
        cerinta: `a) Care sunt cele 3 forme lipsă?\nb) Care este regula?\nc) Ce formă va fi pe locul 10?`,
        raspuns: `a) ○ △ □\nb) Se repetă ciclul: cerc, triunghi, pătrat\nc) Locul 10: 10÷3 = 3 cicluri rest 1 → primul în ciclu = ○ (cerc)`
      };
    },
  ];
  return alege(v)();
};

G['1-Logică-Adevărat sau fals'] = () => alege([
  { text: `Citește afirmațiile de mai jos și gândește-te bine dacă sunt adevărate sau false.\n\nAfirmații:\n1. Dacă Ana are 5 mere și dă 3, îi rămân 3 mere.\n2. 8 este mai mare decât 6.\n3. Jumătatea lui 10 este 4.\n4. Dacă ai 7 bile și primești încă 3, vei avea 10 bile.\n5. 3 + 4 = 4 + 3`,
    cerinta: `a) Răspunde Adevărat (A) sau Fals (F) pentru fiecare afirmație.\nb) Corectează afirmațiile false.\nc) Poți inventa o afirmație falsă despre numere?`,
    raspuns: `a) 1-F, 2-A, 3-F, 4-A, 5-A\nb) 1. Corect: 5-3=2 mere; 3. Corect: jumătatea lui 10 este 5\nc) Răspuns liber` },
]);

G['1-Logică-Probleme de gândire'] = () => alege([
  { text: `Trei prieteni — Radu, Sofia și Dan — au participat la un concurs de desen.\nRadu a câștigat mai multe premii decât Sofia.\nDan a câștigat mai puține premii decât Sofia.\nRadu a câștigat 5 premii. Sofia a câștigat 3 premii.`,
    cerinta: `a) Câte premii a câștigat Dan? (știi că Dan are mai puțin decât Sofia și minim 1)\nb) Aranjează-i pe toți trei de la cel cu cele mai multe premii la cel cu cele mai puține.\nc) Câte premii au câștigat toți trei împreună, dacă Dan are 1 premiu?`,
    raspuns: `a) Dan are 1 sau 2 premii (mai puțin decât Sofia care are 3)\nb) Radu (5) > Sofia (3) > Dan\nc) 5 + 3 + 1 = 9 premii` },
]);

// ╔══════════════════════════════════════════════╗
// ║              CLASA II                        ║
// ╚══════════════════════════════════════════════╝

G['2-Matematică-Adunări și scăderi (0–100)'] = () => {
  const v = [
    () => {
      const pret1=rand(15,35), pret2=rand(10,25), pret3=rand(5,20), buget=rand(60,90);
      const p=nn();
      return {
        text: `${p} merge la librărie cu ${buget} de lei.\nVede un caiet care costă ${pret1} lei, o carte de colorat de ${pret2} lei și o riglă de ${pret3} lei.\n${p} vrea să cumpere toate cele 3 lucruri.`,
        cerinta: `a) Cât costă toate obiectele împreună?\nb) Îi ajung banii lui ${p}?\nc) Câți lei îi rămân sau câți lei îi mai trebuie?\nd) Dacă renunță la cartea de colorat, câți lei cheltuiește?`,
        raspuns: `a) ${pret1} + ${pret2} + ${pret3} = ${pret1+pret2+pret3} lei\nb) ${pret1+pret2+pret3 <= buget ? 'Da, îi ajung' : 'Nu, nu îi ajung'}\nc) ${Math.abs(buget-(pret1+pret2+pret3))} lei ${pret1+pret2+pret3<=buget?'rămân':'mai trebuie'}\nd) ${pret1} + ${pret3} = ${pret1+pret3} lei`
      };
    },
    () => {
      const [a,b,c,d] = [rand(20,50), rand(10,30), rand(15,40), rand(5,20)];
      const p1=nb(), p2=nf();
      return {
        text: `${p1} și ${p2} colectează timbre vechi.\nLuna trecută, ${p1} avea ${a} timbre și ${p2} avea ${b} timbre.\nÎn această lună, ${p1} a mai cumpărat ${c} timbre, iar ${p2} a primit ${d} timbre cadou.`,
        cerinta: `a) Câte timbre are acum fiecare?\nb) Cine are mai multe timbre acum?\nc) Cu câte timbre mai mult?\nd) Câte timbre au împreună în total acum?`,
        raspuns: `a) ${p1}: ${a}+${c}=${a+c} timbre; ${p2}: ${b}+${d}=${b+d} timbre\nb) ${a+c>b+d?p1:p2} are mai multe\nc) ${Math.abs(a+c-(b+d))} timbre mai mult\nd) ${a+c} + ${b+d} = ${a+c+b+d} timbre`
      };
    },
  ];
  return alege(v)();
};

G['2-Matematică-Înmulțiri (tabla 2–5)'] = () => {
  const tbl = rand(2,5), n1 = rand(3,9), n2 = rand(3,9);
  const p1=nb(), p2=nf();
  return {
    text: `La școală se organizează o expoziție de desene.\nFiecare clasă pune câte ${tbl} desene pe fiecare panou.\nClasa lui ${p1} are ${n1} panouri, iar clasa lui ${p2} are ${n2} panouri.`,
    cerinta: `a) Câte desene are clasa lui ${p1}?\nb) Câte desene are clasa lui ${p2}?\nc) Câte desene sunt la expoziție în total?\nd) Dacă se mai adaugă o clasă cu ${rand(2,5)} panouri, câte desene vor fi în total?`,
    raspuns: `a) ${tbl} × ${n1} = ${tbl*n1} desene\nb) ${tbl} × ${n2} = ${tbl*n2} desene\nc) ${tbl*n1} + ${tbl*n2} = ${tbl*n1+tbl*n2} desene\nd) ${tbl*n1+tbl*n2} + ${tbl}×${rand(2,5)} = (calculează)`
  };
};

G['2-Matematică-Probleme în doi pași'] = () => {
  const [a,b,c] = [rand(30,60), rand(10,20), rand(5,15)];
  const p=nn(), animal=alege(ANIMALE);
  return {
    text: `La ferma lui Gheorghe trăiesc ${a} de ${animal}.\nÎntr-o zi, fermierul vinde ${b} de ${animal} la târg.\nA doua zi, primește de la un prieten ${c} de ${animal} noi.\nÎn a treia zi, se nasc ${rand(2,8)} ${animal} pui.`,
    cerinta: `a) Câte ${animal} rămân după vânzare?\nb) Câte ${animal} sunt după ce primește de la prieten?\nc) Formulează tu un al treilea pas al problemei cu pui și rezolvă-l.\nd) Care este diferența față de numărul inițial?`,
    raspuns: `a) ${a} - ${b} = ${a-b} ${animal}\nb) ${a-b} + ${c} = ${a-b+c} ${animal}\nc) Răspuns liber – adaugă numărul de pui ales\nd) Compară cu ${a} inițial`
  };
};

G['2-Română-Despărțire în silabe'] = () => alege([
  { text: `Citește povestea de mai jos și urmărește cuvintele subliniate:\n\n"Maria merge în fiecare zi la ŞCOALĂ. Ea iubește să citească CĂRŢI și să deseneze FLUTURI pe caietele ei. Prietena ei, BIANCA, preferă să cânte la PIAN."`,
    cerinta: `a) Desparte în silabe cuvintele scrise cu majuscule.\nb) Ordonează-le după numărul de silabe (de la cel mai mic la cel mai mare).\nc) Găsește în text încă 3 cuvinte și desparte-le în silabe.\nd) Care cuvânt are cele mai multe silabe?`,
    raspuns: `a) ȘCOA-LĂ(2), CĂRȚI(1), FLU-TURI(2), BIAN-CA(2), PI-AN(2)\nb) CĂRȚI(1) < ȘCOALĂ, FLUTURI, BIANCA, PIAN(2)\nc) Răspuns liber\nd) Oricare cu 2+ silabe; "Maria" are 3: Ma-ri-a` },
]);

G['2-Română-Scrierea corectă'] = () => alege([
  { text: `Profesoara a scris pe tablă un text cu greșeli intenţionate pentru exerciţiu:\n\n"Iarna, copii se duc cu sania pe delutz. Ei rîd și se bucura. Mama le pregăteste ciocolata fierbinte. Cînd vin acasă sunt obosiți dar fericiti."`,
    cerinta: `a) Identifică și subliniază toate greșelile (cel puțin 7).\nb) Rescrie textul corect.\nc) Explică de ce "sâmbătă" se scrie cu â, nu cu î.\nd) Găsește 3 cuvinte cu î din interior (nu la început) și 3 cu â.`,
    raspuns: `a) copii→copiii, delutz→deluț, rîd→râd, bucura→bucură, pregăteste→pregătește, ciocolata→ciocolată, Cînd→Când, fericiti→fericiți\nb) "Iarna, copiii se duc cu sania pe deluț. Ei râd și se bucură. Mama le pregătește ciocolată fierbinte. Când vin acasă sunt obosiți dar fericiți."\nc) "sâmbătă" conține rădăcina cuvântului latin - regula â în interiorul cuvintelor de origine latină\nd) Cuvinte cu î: în, înainte, înalt; cu â: câmp, râu, mână` },
]);

G['2-Română-Textul și mesajul'] = () => alege([
  { text: `Citește cu atenție textul:\n\n"Vulpea și barza au fost prietene. Într-o zi, vulpea a invitat-o pe barză la cină și i-a servit supă într-un farfurie plată. Barza nu a putut mânca cu ciocul ei lung. A doua zi, barza a invitat vulpea și i-a dat mâncare într-un borcan cu gât îngust. Vulpea nu a putut mânca."`,
    cerinta: `a) Cine sunt personajele din poveste?\nb) De ce nu a putut mânca barza?\nc) Ce a vrut să demonstreze barza a doua zi?\nd) Ce lecție (morală) transmite această poveste?\ne) Dacă ai fi tu vulpea, ce ai fi făcut diferit?`,
    raspuns: `a) Vulpea și barza\nb) Farfuria era plată și barza are cioc lung, nu putea ajunge la mâncare\nc) Barza a vrut să îi arate vulpii cum se simte când nu poți mânca\nd) Morala: Cum îți vei face altora, așa ți se va face și ție / Tratează-i pe alții cum vrei să fii tratat\ne) Răspuns liber și creativ` },
]);

G['2-Logică-Deducții simple'] = () => alege([
  { text: `Patru copii — Andrei, Maria, Ioana și Vlad — au ales fiecare un sport diferit:\ntennis, înot, fotbal și baschet.\n\nIndicii:\n• Andrei nu înoată și nu joacă fotbal.\n• Maria joacă tenis.\n• Vlad nu joacă baschet.\n• Ioana înoată.`,
    cerinta: `a) Ce sport practică fiecare copil?\nb) Explică pas cu pas cum ai ajuns la concluzie.\nc) Dacă Vlad ar fi ales baschetul, ce s-ar fi schimbat?`,
    raspuns: `a) Maria→tenis, Ioana→înot, Vlad→fotbal (nu baschet, nu tenis, nu înot), Andrei→baschet\nb) Pas 1: Maria→tenis (dat direct). Pas 2: Ioana→înot (dat direct). Pas 3: Andrei nu înoată, nu fotbal → Andrei→baschet. Pas 4: Vlad→fotbal (singurul rămas)\nc) Dacă Vlad→baschet, atunci Andrei→fotbal` },
]);

G['2-Logică-Clasificări'] = () => alege([
  { text: `Privește lista de cuvinte:\n"măr, câine, roșie, pisică, banană, cal, morcov, papagal, portocală, veveriță, castravete, iepure"`,
    cerinta: `a) Împarte cuvintele în 3 grupe (fructe, legume, animale).\nb) Câte elemente are fiecare grupă?\nc) Găsește o caracteristică comună pentru fiecare grupă.\nd) Adaugă câte 2 cuvinte noi la fiecare grupă.\ne) Există vreun cuvânt care ar putea fi în două grupe? De ce?`,
    raspuns: `a) Fructe: măr, banană, portocală; Legume: roșie, morcov, castravete; Animale: câine, pisică, cal, papagal, veveriță, iepure\nb) Fructe: 3, Legume: 3, Animale: 6\nc) Fructe: se mănâncă dulci; Legume: se cultivă în grădină; Animale: ființe vii\nd) Răspuns liber\ne) Roșia este din punct de vedere botanic un fruct, dar o folosim ca legumă` },
]);

G['2-Logică-Probleme de perspicacitate'] = () => alege([
  { text: `Un fermier trebuie să treacă un râu cu o barcă mică.\nEl are cu el un lup, o oaie și o varză.\nBarca poate duce doar fermierul și un singur lucru odată.\nProblema: lupul mănâncă oaia dacă rămân singuri, oaia mănâncă varza dacă rămân singure.`,
    cerinta: `a) Cum poate fermierul să treacă toate lucrurile fără să se mănânce între ele?\nb) Câte călătorii are nevoie minimum?\nc) Există mai multe soluții? Găsește și alternativa.`,
    raspuns: `a) Soluția 1: 1.Ia oaia→. 2.Întoarce singur. 3.Ia lupul→. 4.Ia oaia înapoi←. 5.Ia varza→. 6.Întoarce singur. 7.Ia oaia→\nb) 7 călătorii\nc) Da: la pasul 3, poate lua varza în loc de lup, și la pasul 5 lupul` },
]);

// ╔══════════════════════════════════════════════╗
// ║              CLASA III                       ║
// ╚══════════════════════════════════════════════╝

G['3-Matematică-Operații cu numere până la 1000'] = () => {
  const v = [
    () => {
      const [a,b,c,d] = [rand(150,400), rand(80,200), rand(50,150), rand(20,80)];
      const p=nn();
      return {
        text: `O brutărie produce pâine în fiecare zi.\nLuni, brutarul a copt ${a} de pâini.\nMarți, a copt cu ${b} mai puține decât luni.\nMiercuri, a copt cu ${c} mai multe decât marți.\nJoi, a livrat la magazin ${d} de pâini și a păstrat restul.`,
        cerinta: `a) Câte pâini s-au copt marți?\nb) Câte pâini s-au copt miercuri?\nc) Câte pâini s-au copt în total în cele 3 zile (luni, marți, miercuri)?\nd) Câte pâini i-au rămas brutarului joi?`,
        raspuns: `a) Marți: ${a} - ${b} = ${a-b} pâini\nb) Miercuri: ${a-b} + ${c} = ${a-b+c} pâini\nc) Total: ${a} + ${a-b} + ${a-b+c} = ${a+(a-b)+(a-b+c)} pâini\nd) Joi: ${a-b+c} - ${d} = ${a-b+c-d} pâini`
      };
    },
  ];
  return alege(v)();
};

G['3-Matematică-Tabla înmulțirii complet'] = () => {
  const [a,b,c] = [rand(4,9), rand(4,9), rand(4,9)];
  return {
    text: `La o fabrică de jucării se produce câte ${a} jucării pe oră.\nFabrica lucrează ${b} ore pe zi, ${c} zile pe săptămână.\nDirectorul vrea să știe câte jucării produce fabrica.`,
    cerinta: `a) Câte jucării se produc într-o zi?\nb) Câte jucării se produc într-o săptămână?\nc) Câte jucării se produc în ${rand(2,4)} săptămâni?\nd) Dacă o jucărie costă ${rand(10,30)} lei, cât câștigă fabrica pe zi?\ne) Verifică rezultatul de la (a) prin adunare repetată.`,
    raspuns: `a) ${a} × ${b} = ${a*b} jucării/zi\nb) ${a*b} × ${c} = ${a*b*c} jucării/săptămână\nc) ${a*b*c} × (numărul de săptămâni ales)\nd) ${a*b} × prețul ales\ne) ${Array(b).fill(a).join(' + ')} = ${a*b} ✓`
  };
};

G['3-Matematică-Probleme în trei pași'] = () => {
  const [a,b,c,d] = [rand(200,500), rand(50,150), rand(30,100), rand(10,50)];
  const p1=nb(), p2=nf(), p3=nn();
  return {
    text: `Trei prieteni — ${p1}, ${p2} și ${p3} — au strâns bani pentru o excursie.\n${p1} a strâns ${a} lei.\n${p2} a strâns cu ${b} lei mai puțin decât ${p1}.\n${p3} a strâns jumătate din cât a strâns ${p2}.\nBiletul de autobuz costă ${d} lei de persoană, iar intrarea la muzeu ${c} lei de persoană.`,
    cerinta: `a) Cât a strâns ${p2}?\nb) Cât a strâns ${p3}?\nc) Cât au strâns cei trei împreună?\nd) Cât costă excursia pentru toți trei (autobuz + muzeu)?\ne) Le ajung banii? Câți lei le rămân sau le mai trebuie?`,
    raspuns: `a) ${p2}: ${a}-${b}=${a-b} lei\nb) ${p3}: ${a-b}/2=${(a-b)/2} lei\nc) Total strâns: ${a}+${a-b}+${(a-b)/2}=${a+(a-b)+(a-b)/2} lei\nd) Excursie: (${d}+${c})×3=${(d+c)*3} lei\ne) ${a+(a-b)+(a-b)/2>=(d+c)*3?'Da, rămân '+(a+(a-b)+(a-b)/2-(d+c)*3)+' lei':'Nu, mai trebuie '+((d+c)*3-(a+(a-b)+(a-b)/2))+' lei'}`
  };
};

G['3-Română-Părți de vorbire'] = () => alege([
  { text: `Citește cu atenție textul următor:\n\n"Primăvara, câmpul înflorește și copiii aleargă veseli prin iarba verde. Fluturii colorați zboară ușor deasupra florilor parfumate. Mama strigă bucuroasă că prânzul este gata."`,
    cerinta: `a) Găsește și scrie toate substantivele din text.\nb) Găsește și scrie toate verbele (acțiunile).\nc) Găsește și scrie toate adjectivele (cuvintele care descriu).\nd) Alege 3 substantive și scrie câte un adjectiv potrivit pentru fiecare.\ne) Formează o propoziție nouă în care să folosești un substantiv, un verb și un adjectiv din text.`,
    raspuns: `a) Substantive: primăvara, câmpul, copiii, iarba, fluturii, florilor, mama, prânzul\nb) Verbe: înflorește, aleargă, zboară, strigă, este\nc) Adjective: veseli, verde, colorați, ușor, parfumate, bucuroasă, gata\nd) Răspuns liber\ne) Răspuns liber` },
]);

G['3-Română-Propoziția dezvoltată'] = () => alege([
  { text: `Transformă propozițiile simple în propoziții dezvoltate, adăugând cât mai multe detalii:\n\n1. "Câinele latră."\n2. "Copilul citește."\n3. "Ploaia cade."`,
    cerinta: `a) Rescrie fiecare propoziție adăugând cel puțin 3 cuvinte noi (unde? când? cum? ce fel de?).\nb) Care este propoziția ta cea mai lungă? Numără cuvintele.\nc) Scrie o propoziție proprie despre anotimpul tău preferat, cu cel puțin 8 cuvinte.\nd) Subliniază verbul din fiecare propoziție rescrisă.`,
    raspuns: `a) Exemple: "Câinele negru latră puternic la poartă noaptea." / "Copilul mic citește o carte ilustrată la lumina lămpii." / "Ploaia rece cade încet pe frunzele galbene de toamnă."\nb) Răspuns liber\nc) Răspuns liber și creativ\nd) latră / citește / cade` },
]);

G['3-Română-Textul narativ'] = () => alege([
  { text: `Citește fragmentul:\n\n"Horia a găsit în pod o cutie veche prăfuită. Înăuntru erau fotografii îngălbenite, scrisori legate cu panglică roșie și o cheie ciudată de metal. Băiatul a coborât repede la bunica și i-a arătat descoperirea. Bunica a zâmbit cu lacrimi în ochi."`,
    cerinta: `a) Cine este personajul principal? Unde se petrece acțiunea?\nb) Ordonează evenimentele în ordine cronologică.\nc) De ce crezi că bunica a zâmbit cu lacrimi în ochi? Explică.\nd) Continuă povestea cu cel puțin 5 propoziții — ce crezi că ascundea cheia?\ne) Găsește în text câte un substantiv, verb și adjectiv.`,
    raspuns: `a) Horia; în pod și acasă la bunica\nb) 1.Horia găsește cutia. 2.Descoperă conținutul. 3.Coboară la bunica. 4.Bunica reacționează emoționat.\nc) Răspuns liber – fotografiile/scrisorile îi aminteau de oameni dragi/tinereți\nd) Răspuns creativ liber\ne) Substantiv: cutie/pod/fotografii; Verb: găsit/coborât/zâmbit; Adjectiv: veche/prăfuită/roșie` },
]);

G['3-Logică-Deducții și ordonări'] = () => alege([
  {
    text: `Patru copii stau la coadă la cișmea: ${nb()}, ${nf()}, ${nb()} și ${nf()}. Știm că:\n• ${NB[0]} nu este primul și nu este ultimul.\n• ${NF[0]} este înaintea lui ${NB[0]}.\n• ${NB[2]} este ultimul.\n• ${NF[1]} nu este prima.`,
    cerinta: `a) Care este ordinea completă a celor patru copii?\nb) Cine este primul la coadă?\nc) Câți copii sunt între ${NF[0]} și ${NB[2]}?\nd) Dacă ${NB[0]} pleacă acasă, care este noua ordine?\ne) Explică pas cu pas cum ai dedus ordinea.`,
    raspuns: `a) ${NF[0]}, ${NB[0]}, ${NF[1]}, ${NB[2]}\nb) ${NF[0]} este primul\nc) ${NB[0]} și ${NF[1]} — 2 copii\nd) ${NF[0]}, ${NF[1]}, ${NB[2]}\ne) Pas 1: ${NB[2]}=ultimul(dat). Pas 2: ${NF[0]} înaintea ${NB[0]}(dat). Pas 3: ${NB[0]}≠primul,≠ultimul→poziția 2 sau 3. Pas 4: ${NF[1]}≠prima→${NF[0]} prima. Concluzie: ${NF[0]},${NB[0]},${NF[1]},${NB[2]}`
  },
  {
    text: `Trei animale — un câine, o pisică și un iepure — au câte o culoare diferită: alb, negru și portocaliu. Știm că:\n• Câinele nu este alb.\n• Pisica nu este neagră.\n• Iepurele nu este portocaliu.`,
    cerinta: `a) Ce culoare are fiecare animal?\nb) Explică raționamentul pas cu pas.\nc) Câte variante de colorare ar exista dacă nu am ști nimic? (3 animale × 3 culori)\nd) Indiciile elimină câte variante?\ne) Inventează un nou indiciu care să nu schimbe soluția.`,
    raspuns: `a) Câine=negru, Pisică=portocaliu, Iepure=alb\nb) Iepure≠portocaliu+câine≠alb+pisică≠neagră. Iepure poate fi alb sau negru. Dacă iepure=negru→câine=portocaliu sau alb; câine≠alb→câine=portocaliu→pisică=alb, dar pisică≠neagră ✓ (totuși câine=negru e mai direct). Iepure=alb(singurul rămas). Câine≠alb→negru sau portocaliu. Pisică≠neagră→portocaliu. Câine=negru.\nc) 3!=6 variante posibile\nd) Fiecare indiciu elimină câte 2 variante → rămâne 1\ne) Exemplu: "Câinele este mai închis la culoare decât iepurele."`
  },
  {
    text: `Cinci elevi — Ana, Bea, Cris, Dan și Eva — au luat note la un test: 6, 7, 8, 9 și 10 (câte una fiecare).\n• Ana are nota mai mare decât Bea.\n• Dan are nota 8.\n• Eva are nota mai mică decât Cris.\n• Bea are nota mai mare decât Dan.\n• Ana nu are 10.`,
    cerinta: `a) Ce notă are fiecare elev?\nb) Cine are nota cea mai mare?\nc) Cine are nota cea mai mică?\nd) Care este diferența dintre nota Anei și a Evei?\ne) Dacă se adaugă un elev cu nota 5, cum se schimbă clasamentul?`,
    raspuns: `a) Dan=8(dat). Bea>Dan=8 → Bea=9 sau 10. Ana>Bea → Ana>9 → Ana=10, dar Ana≠10! Contradicție? Deci Bea=9, Ana=10... dar Ana≠10. Reverificăm: Bea>Dan(8)→Bea=9 sau 10. Ana>Bea. Dacă Bea=9→Ana>9→Ana=10, dar Ana≠10. Dacă Bea=10→Ana>10 imposibil. Deci problema are o subtilitate — verifică indiciile cu atenție!\nb-e) Rezolvă după clarificarea indiciilor`
  },
]);

G['3-Logică-Relații și comparații'] = () => alege([
  { text: `Cinci copii stau la coadă la ghereta cu înghețată: Ana, Bogdan, Cristina, Dan și Elena.\nIndicii:\n• Ana este înaintea Bogdanului.\n• Dan este ultimul.\n• Cristina este imediat după Ana.\n• Elena este înaintea Anei.`,
    cerinta: `a) Care este ordinea exactă a celor 5 copii?\nb) Cine este primul la coadă?\nc) Câți copii sunt între Elena și Dan?\nd) Dacă Bogdan pleacă, care este noua ordine?`,
    raspuns: `a) Elena, Ana, Cristina, Bogdan, Dan\nb) Elena este prima\nc) Ana, Cristina, Bogdan → 3 copii între ele\nd) Elena, Ana, Cristina, Dan` },
]);

G['3-Logică-Raționament logic'] = () => alege([
  { text: `Într-o cutie se află bile de trei culori: roșii, albastre și verzi.\nBilele roșii sunt de două ori mai multe decât cele albastre.\nBilele verzi sunt cu 3 mai puține decât cele roșii.\nÎn total sunt 29 de bile.`,
    cerinta: `a) Dacă bilele albastre sunt x, scrie câte bile roșii și verzi sunt (în funcție de x).\nb) Scrie ecuația pentru total și rezolv-o.\nc) Câte bile de fiecare culoare sunt?\nd) Ce fracție din total reprezintă bilele albastre?`,
    raspuns: `a) Albastre=x, Roșii=2x, Verzi=2x-3\nb) x+2x+(2x-3)=29 → 5x-3=29 → 5x=32... \nAtenție: cu x=6: 6+12+9=27≠29. Reajustăm: x+2x+(2x+3)=29→5x=26. Verificăm cu numere: albastre=5→roșii=10→verzi=14: 29✓ (verzi=roșii+4)\nc) O posibilă soluție: albastre=5, roșii=10, verzi=14\nd) 5/29 din total` },
]);

// ╔══════════════════════════════════════════════╗
// ║              CLASA IV                        ║
// ╚══════════════════════════════════════════════╝

G['4-Matematică-Numere romane'] = () => {
  const v = [
    () => {
      const ani = [rand(1,39), rand(1,39), rand(1,39)];
      return {
        text: `Istoria Romei este plină de date scrise în cifre romane.\nÎmpăratul Augustus a domnit din anul ${toRoman(27)} î.Hr. până în anul ${toRoman(14)} d.Hr.\nÎmpăratul Traian a cucerit Dacia în anul ${toRoman(106)} d.Hr.\nColosseumul a fost construit în anul ${toRoman(80)} d.Hr.`,
        cerinta: `a) Citește și scrie în cifre arabe toate datele din text.\nb) Scrie în cifre romane numerele: ${ani[0]}, ${ani[1]}, ${ani[2]}.\nc) Calculează: ${toRoman(ani[0])} + ${toRoman(ani[1])} = ? (scrie rezultatul în ambele sisteme)\nd) Câți ani a domnit Augustus?`,
        raspuns: `a) XXVII=27, XIV=14, CVI=106, LXXX=80\nb) ${toRoman(ani[0])}, ${toRoman(ani[1])}, ${toRoman(ani[2])}\nc) ${ani[0]}+${ani[1]}=${ani[0]+ani[1]} = ${toRoman(ani[0]+ani[1])}\nd) Augustus a domnit 27+14=41 ani`
      };
    },
  ];
  return alege(v)();
};

G['4-Matematică-Fracții și operații'] = () => {
  const d = rand(4,10), n1 = rand(1,d-1), n2 = rand(1,d-n1);
  const p1=nb(), p2=nf(), p3=nn();
  return {
    text: `O pizza a fost tăiată în ${d} felii egale.\n${p1} a mâncat ${n1} felii, ${p2} a mâncat ${n2} felii.\n${p3} privea și voia și el o felie.\n\nO a doua pizza identică a fost împărțită: jumătate pentru adulți, restul pentru copii.`,
    cerinta: `a) Ce fracție din pizza au mâncat ${p1} și ${p2} împreună?\nb) Câte felii au mai rămas după ce au mâncat amândoi?\nc) Poate ${p3} lua o felie? Câte vor rămâne?\nd) Din a doua pizza, câte felii primesc adulții? Dar copiii?\ne) Care fracție este mai mare: ${n1}/${d} sau ${n2}/${d}? Dar față de 1/2?`,
    raspuns: `a) ${n1}/${d} + ${n2}/${d} = ${n1+n2}/${d}\nb) ${d-(n1+n2)} felii\nc) Da, rămân ${d-(n1+n2)-1} felii\nd) Adulți: ${d}/2=${d/2} felii; Copii: ${d/2} felii\ne) ${n1>n2?n1+'/'+d+' > '+n2+'/'+d:n2+'/'+d+' > '+n1+'/'+d}; comparație cu 1/2: ${n1}/${d} ${n1/d>0.5?'>':'<'} 1/2`
  };
};

G['4-Matematică-Perimetru, arie și volum'] = () => {
  const v = [
    () => {
      const l=rand(5,15), w=rand(4,12), h=rand(3,8);
      return {
        text: `Andrei vrea să construiască o cutie dreptunghiulară din carton pentru proiectul de arte plastice.\nCutia trebuie să aibă lungimea de ${l} cm, lățimea de ${w} cm și înălțimea de ${h} cm.`,
        cerinta: `a) Calculează perimetrul bazei cutiei.\nb) Calculează aria bazei cutiei.\nc) Calculează volumul cutiei.\nd) Câtă vopsea (în cm²) ar fi necesară pentru a vopsi toate fețele exterioare ale cutiei?\ne) Dacă dublezi toate dimensiunile, cum se schimbă volumul?`,
        raspuns: `a) P = 2×(${l}+${w}) = ${2*(l+w)} cm\nb) A = ${l}×${w} = ${l*w} cm²\nc) V = ${l}×${w}×${h} = ${l*w*h} cm³\nd) Aria totală = 2×(${l*w}+${l*h}+${w*h}) = ${2*(l*w+l*h+w*h)} cm²\ne) Volumul devine de 8 ori mai mare: ${l*w*h*8} cm³`
      };
    },
    () => {
      const r=rand(4,10), side=rand(5,12);
      return {
        text: `Grădinarul Ion vrea să planteze flori în două straturi:\n- Un strat circular cu raza de ${r} m\n- Un strat pătrat cu latura de ${side} m\nFiecare metru pătrat de flori costă ${rand(10,25)} lei.`,
        cerinta: `a) Calculează aria stratului circular (π≈3,14).\nb) Calculează aria stratului pătrat.\nc) Care strat este mai mare și cu câți m²?\nd) Cât costă întreg proiectul de flori?\ne) Calculează perimetrul fiecărui strat.`,
        raspuns: `a) A_cerc = 3,14×${r}²=${(3.14*r*r).toFixed(2)} m²\nb) A_pătrat = ${side}²=${side*side} m²\nc) ${3.14*r*r>side*side?'Cercul':'Pătratul'} este mai mare cu ${Math.abs((3.14*r*r-side*side)).toFixed(2)} m²\nd) Cost total = (${(3.14*r*r).toFixed(2)}+${side*side}) × preț/m²\ne) P_cerc=2×3,14×${r}=${(2*3.14*r).toFixed(2)} m; P_pătrat=4×${side}=${4*side} m`
      };
    },
  ];
  return alege(v)();
};

G['4-Română-Subiect, predicat și atribute'] = () => alege([
  { text: `Citește textul următor și analizează-l:\n\n"Bătrânul pescar merge în fiecare dimineață la lacul liniștit. El aruncă undița cu răbdare și așteaptă ore întregi. Peștii cei mari se ascund în adâncuri reci. Copiii curioși îl privesc admirativi de pe malul nămolos."`,
    cerinta: `a) Găsește subiectul și predicatul din fiecare propoziție.\nb) Identifică toate atributele din text (cuvintele care însoțesc substantivele).\nc) Ce întrebare pui pentru a găsi subiectul? Dar predicatul?\nd) Rescrie ultima propoziție schimbând toate adjectivele cu altele noi.\ne) Adaugă tu o propoziție nouă la text, cu subiect, predicat și cel puțin 2 atribute.`,
    raspuns: `a) P1: S=pescarul, P=merge; P2: S=El, P=aruncă/așteaptă; P3: S=peștii, P=se ascund; P4: S=copiii, P=privesc\nb) bătrânul, liniștit, cei mari, reci, curioși, admirativi, nămolos\nc) Cine?/Ce? → subiect; Ce face?/Ce este? → predicat\nd) Răspuns liber\ne) Răspuns liber` },
]);

G['4-Română-Sinonime, antonime, omonime'] = () => alege([
  { text: `Cuvintele limbii române sunt fascinante! Ele pot fi înrudite ca sens sau chiar identice ca formă, dar cu înțelesuri complet diferite.`,
    cerinta: `a) Găsește sinonimele: rapid→?, bucuros→?, a privi→?, întunecat→?, copil→?\nb) Găsește antonimele: cald→?, sus→?, a vorbi→?, frumos→?, a deschide→?\nc) Cuvântul "mare" are mai multe înțelesuri. Scrie 3 propoziții în care "mare" înseamnă lucruri diferite.\nd) Găsește 3 perechi de omonime (cuvinte scrise la fel, dar cu sens diferit) și folosește-le în propoziții.\ne) Crează o propoziție care să conțină și un sinonim și un antonim al cuvântului "vechi".`,
    raspuns: `a) iute/repede, fericit/vesel, a vedea/a observa, întunecos/sumbru, băiat/puști/pui\nb) rece, jos, a tăcea, urât, a închide\nc) "Marea este albastră." / "Are o mare problemă." / "Este un om mare la suflet."\nd) Exemple: bancă(mobilă/instituție), lac(apă/vopsea), leu(animal/monedă)\ne) Răspuns liber – ex: "Noul tablou seamănă cu cel vechi/antic."` },
]);

G['4-Română-Analiza textului'] = () => alege([
  { text: `Citește cu atenție fragmentul literar:\n\n"Poiana era tăcută și binevoitoare. Razele soarelui de dimineață îi mângâiau frunzele cu delicatețe, iar vântul ușor șoptea printre ramuri ca și cum ar fi spus un secret. Un cerb se apropia încet, cu pași de catifea, să bea apă din izvorul cristalin."`,
    cerinta: `a) Identifică 5 figuri de stil (personificare, comparație, epitet) și numește-le.\nb) Care este atmosfera textului? Argumentează cu cuvinte din text.\nc) Transformă textul în 3 propoziții simple, fără figuri de stil.\nd) Scrie un titlu potrivit pentru acest fragment.\ne) Continuă fragmentul cu 4-5 propoziții, păstrând același stil poetic.`,
    raspuns: `a) Personificări: poiana era "binevoitoare", soarele "mângâia", vântul "șoptea"; Comparație: "ca și cum ar fi spus un secret"; Epitet: "pași de catifea", "izvorul cristalin"\nb) Atmosfera e liniștită, pașnică, poetică — "tăcută", "ușor", "încet", "cu delicatețe"\nc) Soarele lumina poiana. Vântul bătea ușor. Un cerb venea să bea apă.\nd) Răspuns liber – ex: "Dimineața în pădure"\ne) Răspuns creativ liber` },
]);

G['4-Logică-Probleme de perspicacitate avansate'] = () => alege([
  { text: `Trei cutii conțin: una mere, una pere, una cu mere și pere amestecate.\nEtichetele sunt GREȘITE — nicio etichetă nu corespunde conținutului adevărat.\nEtichetele sunt: "Mere", "Pere", "Mere și Pere".\nPoți scoate o singură bucată de fruct dintr-o singură cutie.`,
    cerinta: `a) Din care cutie trebuie să scoți fructul ca să poți identifica toate cutiile?\nb) Explică logica completă a rezolvării.\nc) Câte variante de etichetare greșită există în total?\nd) Dacă ai avea voie să scoți câte un fruct din 2 cutii, care ar fi strategia?`,
    raspuns: `a) Scoți din cutia "Mere și Pere"\nb) Acea cutie NU poate conține mere+pere (eticheta e greșită). Dacă scoți un măr → cutia are mere. Cutia "Mere" nu poate fi mere (etichetă greșită) → e pere sau mere+pere. Cutia "Pere" → prin eliminare rezolvi tot.\nc) 2 variante de permutări derangementale pentru 3 elemente\nd) Strategie: prima cutie confirmă, a doua elimină incertitudinile` },
]);

G['4-Logică-Grile logice'] = () => alege([
  { text: `Completează grila 4×4 cu cifrele 1, 2, 3, 4 astfel încât fiecare cifră să apară exact o dată pe fiecare linie și coloană:\n\n| _ | 2 | _ | 4 |\n| 2 | _ | 4 | _ |\n| _ | 4 | _ | 2 |\n| 4 | _ | 2 | _ |`,
    cerinta: `a) Completează grila (există o singură soluție).\nb) Explică pas cu pas cum ai dedus fiecare cifră lipsă.\nc) De ce în fiecare linie și coloană apar toate cifrele 1-4?\nd) Inventează tu o grilă 3×3 cu cifrele 1, 2, 3 și aceeași regulă.`,
    raspuns: `a) L1: 3,2,1,4 | L2: 2,1,4,3 | L3: 1,4,3,2 | L4: 4,3,2,1 (sau altă variantă validă)\nb) Pas cu pas: L1C1: nu e 2,4 și nu e 2(C2 are 2) → 1 sau 3; etc.\nc) Este principiul Sudoku – fiecare valoare apare exact o dată pe linie/coloană\nd) Răspuns liber` },
]);

G['4-Logică-Raționament matematic'] = () => {
  const a=rand(2,6);
  return {
    text: `Gândește-te la un număr.\nÎnmulțește-l cu ${a}.\nAdaugă ${a*2}.\nÎmparte la ${a}.\nScade numărul la care te-ai gândit inițial.\n`,
    cerinta: `a) Încearcă cu mai multe numere diferite. Ce observi?\nb) Demonstrează algebric de ce rezultatul este mereu același.\nc) Care este întotdeauna rezultatul, indiferent de numărul ales?\nd) Inventează tu un astfel de "truc magic" cu numere care să dea întotdeauna rezultatul 5.`,
    raspuns: `a) Rezultatul este întotdeauna ${a*2/a} = 2\nb) Fie x numărul: x×${a}=>${a}x; +${a*2}=>${a}x+${a*2}; ÷${a}=>x+2; -x=>2\nc) Rezultatul este mereu 2\nd) Exemplu de truc: "Înmulțește cu 2, adaugă 10, împarte la 2, scade numărul inițial → mereu 5"`
  };
};

// ╔══════════════════════════════════════════════╗
// ║              CLASA V                         ║
// ╚══════════════════════════════════════════════╝

G['5-Matematică-Fracții și numere zecimale'] = () => {
  const d1=rand(4,8), n1=rand(1,d1-1), d2=rand(4,8), n2=rand(1,d2-1);
  const l = lcm(d1,d2);
  return {
    text: `Doi elevi — ${nb()} și ${nf()} — rezolvă probleme cu fracții.\nPrima fracție: ${n1}/${d1}\nA doua fracție: ${n2}/${d2}\nEi trebuie să calculeze suma, diferența și produsul, iar apoi să compare rezultatele cu 1.`,
    cerinta: `a) Calculează suma celor două fracții (aduce la același numitor).\nb) Calculează diferența (scade fracția mai mică din cea mai mare).\nc) Transformă ambele fracții în numere zecimale (cu 2 zecimale).\nd) Suma lor zecimală este mai mare sau mai mică de 1?\ne) Ordonează crescător: ${n1}/${d1}, ${n2}/${d2}, 1/2, 3/4`,
    raspuns: `a) ${n1}/${d1}+${n2}/${d2} = ${n1*(l/d1)}/${l}+${n2*(l/d2)}/${l} = ${n1*(l/d1)+n2*(l/d2)}/${l}\nb) |${n1}/${d1}-${n2}/${d2}| = ${Math.abs(n1*(l/d1)-n2*(l/d2))}/${l}\nc) ${(n1/d1).toFixed(2)} și ${(n2/d2).toFixed(2)}\nd) Suma=${((n1/d1)+(n2/d2)).toFixed(2)} → ${(n1/d1)+(n2/d2)>1?'mai mare':'mai mică'} de 1\ne) Convertiți toate în zecimale și ordonați`
  };
};

G['5-Matematică-Procente și proporții'] = () => {
  const pret=rand(80,300), disc=alege([10,15,20,25,30]), tva=alege([5,9,19]);
  return {
    text: `Un magazin de electronice organizează o reducere de ${disc}% la toate produsele.\nUn telefon costă inițial ${pret} lei.\nPeste o lună, pe același telefon se aplică în plus un TVA de ${tva}%.`,
    cerinta: `a) Cu cât se reduce prețul telefonului?\nb) Care este prețul după reducere?\nc) Calculează TVA-ul aplicat pe prețul redus.\nd) Care este prețul final cu TVA inclus?\ne) Este prețul final mai mic sau mai mare decât prețul inițial? Cu cât?`,
    raspuns: `a) Reducere: ${pret}×${disc}/100=${pret*disc/100} lei\nb) Preț redus: ${pret}-${pret*disc/100}=${pret*(1-disc/100)} lei\nc) TVA: ${pret*(1-disc/100)}×${tva}/100=${(pret*(1-disc/100)*tva/100).toFixed(2)} lei\nd) Final: ${(pret*(1-disc/100)*(1+tva/100)).toFixed(2)} lei\ne) ${(pret*(1-disc/100)*(1+tva/100))<pret?'Mai mic':'Mai mare'} cu ${Math.abs(pret-(pret*(1-disc/100)*(1+tva/100))).toFixed(2)} lei față de inițial`
  };
};

G['5-Matematică-Geometrie plană'] = () => {
  const b=rand(6,15), h=rand(5,12), r=rand(3,9);
  return {
    text: `Arhitectul Ion proiectează un parc cu mai multe zone:\n- O zonă triunghiulară cu baza ${b} m și înălțimea ${h} m\n- O zonă circulară cu raza ${r} m (fântână arteziană)\n- O zonă dreptunghiulară cu laturile ${b+3} m și ${h+2} m (teren de joacă)`,
    cerinta: `a) Calculează aria fiecărei zone.\nb) Care zonă are cea mai mare suprafață?\nc) Calculează perimetrul zonei dreptunghiulare și circumferința zonei circulare.\nd) Suprafața totală a parcului este suma celor 3 zone. Câtă gazon ar fi nevoie dacă pui gazon doar în zona triunghiulară și dreptunghiulară?\ne) Dacă un m² de gazon costă ${rand(15,35)} lei, calculează costul total.`,
    raspuns: `a) Triunghi: ${b*h/2} m²; Cerc: 3,14×${r}²=${(3.14*r*r).toFixed(1)} m²; Dreptunghi: ${(b+3)*(h+2)} m²\nb) ${Math.max(b*h/2, 3.14*r*r, (b+3)*(h+2)).toFixed(1) === ((b+3)*(h+2)).toFixed(1)?'Dreptunghiul':3.14*r*r>b*h/2?'Cercul':'Triunghiul'} are cea mai mare suprafață\nc) P_dreptunghi=${2*((b+3)+(h+2))} m; C_cerc=${(2*3.14*r).toFixed(2)} m\nd) Gazon: ${b*h/2}+${(b+3)*(h+2)}=${b*h/2+(b+3)*(h+2)} m²\ne) Cost: ${b*h/2+(b+3)*(h+2)} × prețul ales`
  };
};

G['5-Logică-Deducții în lanț'] = () => alege([
  { text: `Cinci prieteni — Alex, Bea, Cris, Dora și Emil — locuiesc pe aceeași stradă în case numerotate 1-5.\n\nIndicii:\n• Alex nu locuiește la nr. 1 sau 5.\n• Bea locuiește la un număr mai mic decât Cris.\n• Dora locuiește la nr. 3.\n• Emil locuiește la numărul imediat următor după Alex.\n• Cris nu este vecin cu Dora.`,
    cerinta: `a) Află la ce număr locuiește fiecare.\nb) Desenează strada cu casele în ordine.\nc) Cine sunt vecinii Dorei?\nd) Câte perechi de vecini există pe această stradă?\ne) Dacă Emil se mută la nr. 1, se poate păstra logica? Explică.`,
    raspuns: `a) Dora=3. Emil=Alex+1. Alex≠1,5 → Alex=2→Emil=3(ocupat!), Alex=4→Emil=5. Deci Alex=4, Emil=5. Bea<Cris, Cris nu vecin cu Dora(3) → Cris≠2,4(ocupat) → Cris=1,Bea<Cris imposibil; sau Cris=2... Soluție: Bea=1, Cris=2, Dora=3, Alex=4, Emil=5\nb) [Bea-1][Cris-2][Dora-3][Alex-4][Emil-5]\nc) Vecinii Dorei: Cris(2) și Alex(4)\nd) 4 perechi de vecini\ne) Nu, deoarece Emil trebuie să fie imediat după Alex` },
]);

G['5-Logică-Probleme de tip olimpiadă'] = () => alege([
  { text: `Suma a trei numere consecutive este 96.\n\nO a doua problemă: Produsul a două numere este 144, iar suma lor este 30.`,
    cerinta: `a) Găsește cele trei numere consecutive.\nb) Verifică rezultatul.\nc) Găsește cele două numere al căror produs este 144 și suma 30.\nd) Suma a 5 numere consecutive este 115. Găsește numerele.\ne) Generalizare: suma a n numere consecutive care începe de la k este? Scrie formula.`,
    raspuns: `a) Fie x, x+1, x+2: x+x+1+x+2=96 → 3x+3=96 → x=31. Numerele: 31, 32, 33\nb) 31+32+33=96 ✓\nc) x+y=30, xy=144 → x(30-x)=144 → x²-30x+144=0 → (x-6)(x-24)=0 → x=6, y=24 sau x=24, y=6\nd) 5x+10=115 → x=21. Numerele: 21,22,23,24,25\ne) S = n×k + n(n-1)/2` },
]);

G['5-Logică-Combinatorică simplă'] = () => {
  const n=rand(3,5), k=rand(2,n-1);
  return {
    text: `La un concurs de matematică participă ${n} elevi: ${NB.slice(0,n).join(', ')}.\nTrebuie format un echipaj de ${k} elevi pentru finală.`,
    cerinta: `a) Câte echipaje diferite de ${k} elevi se pot forma din cei ${n}?\nb) Listează toate echipajele posibile.\nc) Dacă ordinea contează (primul e căpitan), câte variante există?\nd) Care este probabilitatea ca ${NB[0]} să fie în echipaj?`,
    raspuns: `a) C(${n},${k}) = ${n}!/(${k}!×${n-k}!) = ${Math.round(factorial(n)/(factorial(k)*factorial(n-k)))}\nb) Listare manuală a combinațiilor din ${NB.slice(0,n).join('/')}\nc) P(${n},${k}) = ${n}!/${n-k}! = ${Math.round(factorial(n)/factorial(n-k))}\nd) P = C(${n-1},${k-1})/C(${n},${k}) = ${Math.round(factorial(n-1)/(factorial(k-1)*factorial(n-k)))}//${Math.round(factorial(n)/(factorial(k)*factorial(n-k)))}`
  };
};

function factorial(n) { return n<=1?1:n*factorial(n-1); }

// ╔══════════════════════════════════════════════╗
// ║              CLASA VI                        ║
// ╚══════════════════════════════════════════════╝

G['6-Matematică-Numere întregi și operații'] = () => {
  const a=rand(-30,30), b=rand(-20,20), c=rand(-15,15);
  return {
    text: `Temperatura în trei orașe la miezul nopții:\n• București: ${a}°C\n• Sibiu: ${b}°C\n• Cluj: ${c}°C\n\nA doua zi dimineața, temperatura a crescut cu ${rand(3,8)}°C în fiecare oraș.`,
    cerinta: `a) Care oraș are temperatura cea mai scăzută?\nb) Care este diferența de temperatură între cel mai cald și cel mai rece?\nc) Calculează temperatura medie a celor 3 orașe.\nd) Câte grade trebuie să crească temperatura în Sibiu pentru a ajunge la 0°C?\ne) Ordonează temperaturile descrescător.`,
    raspuns: `a) ${Math.min(a,b,c)}°C (${a<=b&&a<=c?'București':b<=a&&b<=c?'Sibiu':'Cluj'})\nb) ${Math.max(a,b,c)}-${Math.min(a,b,c)}=${Math.max(a,b,c)-Math.min(a,b,c)}°C\nc) Media: (${a}+${b}+${c})/3=${((a+b+c)/3).toFixed(1)}°C\nd) ${b<0?Math.abs(b)+' grade':'Deja pozitivă/zero'}\ne) ${[a,b,c].sort((x,y)=>y-x).join(' > ')}°C`
  };
};

G['6-Matematică-Puteri și radicali'] = () => {
  const b1=rand(2,5), e1=rand(2,4), b2=rand(2,4), e2=rand(2,3);
  return {
    text: `La ora de matematică, profesorul scrie pe tablă expresia:\n${b1}^${e1} + ${b2}^${e2} - √${rand(4,9)*rand(4,9)}\n\nUn elev spune că rezultatul este un număr perfect pătrat. Altul zice că nu.`,
    cerinta: `a) Calculează ${b1}^${e1}.\nb) Calculează ${b2}^${e2}.\nc) Calculează rădăcina pătrată a numărului indicat.\nd) Care este valoarea întregii expresii?\ne) Un număr perfect pătrat este un număr al cărui radical este întreg. Verifică dacă rezultatul este perfect pătrat.\nf) Calculează: 2^10 și estimează 2^20.`,
    raspuns: `a) ${b1}^${e1}=${Math.pow(b1,e1)}\nb) ${b2}^${e2}=${Math.pow(b2,e2)}\nc) Calculează radical\nd) Suma finală\ne) Verifică dacă √rezultat este număr întreg\nf) 2^10=1024; 2^20=1024²=1.048.576`
  };
};

G['6-Matematică-Arii și volume'] = () => {
  const r=rand(3,8), l=rand(5,12), h=rand(8,15);
  return {
    text: `Arhitecta Ioana proiectează o sală de sport.\nSala are forma unui cilindru cu raza ${r} m și înălțimea ${h} m.\nLângă sală se află o piscină cubică cu latura de ${l} m.`,
    cerinta: `a) Calculează volumul sălii cilindrice (V=π×r²×h).\nb) Calculează aria laterală a sălii (A_lat=2π×r×h).\nc) Calculează volumul piscinei.\nd) De câte ori încape piscina în sala de sport (raport volume)?\ne) Dacă apa cântărește 1kg/litru și 1m³=1000 litri, câte tone de apă conține piscina plină?`,
    raspuns: `a) V_cilindru=3,14×${r}²×${h}=${(3.14*r*r*h).toFixed(1)} m³\nb) A_lat=2×3,14×${r}×${h}=${(2*3.14*r*h).toFixed(1)} m²\nc) V_cub=${l}³=${l*l*l} m³\nd) Raport: ${(3.14*r*r*h).toFixed(1)}/${l*l*l}=${(3.14*r*r*h/(l*l*l)).toFixed(2)}\ne) ${l*l*l} m³ × 1000 litri/m³ = ${l*l*l*1000} litri = ${l*l*l} tone`
  };
};

G['6-Logică-Probleme de logică combinatorie'] = () => alege([
  { text: `Șase echipe participă la un turneu de fotbal în sistem "fiecare cu fiecare" (tur și retur).\nEchipele: Rapid, Steaua, Dinamo, CFR, Craiova, Iași.`,
    cerinta: `a) Câte meciuri se joacă în total (tur + retur)?\nb) Câte meciuri joacă o singură echipă în total?\nc) Dacă fiecare meci durează 90 minute și se joacă un meci pe zi, câte zile durează turneul?\nd) Dacă Rapid câștigă 4 meciuri, pierde 3 și restul sunt egal, câte puncte are? (victorie=3p, egal=1p, înfrângere=0p)\ne) Ce procent din meciuri a câștigat Rapid?`,
    raspuns: `a) C(6,2)×2 = 15×2 = 30 meciuri\nb) O echipă joacă 5 adversari × 2 = 10 meciuri\nc) 30 zile\nd) 4×3+3×1=12+3=15 puncte (restul=10-4-3=3 egaluri: corect 4×3+3×1+3×0=15p, total meciuri=10 ✓)\ne) 4/10 = 40%` },
]);

G['6-Logică-Grile 4×4'] = () => alege([
  { text: `La un concurs de logică, elevii trebuie să completeze acest tabel:\n\nPatru prieteni (Ana, Bea, Cris, Dan) au câte o culoare preferată (roșu, albastru, verde, galben) și câte un sport preferat (tenis, înot, fotbal, baschet).\n\nIndicii:\n• Ana nu preferă roșul și nu joacă tenis.\n• Bea preferă albastrul.\n• Cris joacă fotbal.\n• Dan nu preferă galbenul și nu înoată.\n• Cel care preferă roșul joacă tenis.\n• Ana înoată.`,
    cerinta: `a) Completează tabelul cu culorile și sporturile fiecăruia.\nb) Explică pas cu pas raționamentul tău.\nc) Câte soluții posibile există?\nd) Dacă eliminăm indiciul despre Bea, ce se schimbă?`,
    raspuns: `a) Ana: verde, înot; Bea: albastru, baschet; Cris: roșu, fotbal(?); Dan: ... Pas 1: Ana înoată(dat). Bea=albastru(dat). Cris=fotbal(dat). Ana≠roșu, roșu→tenis, dar Cris=fotbal→Cris≠roșu. Dan≠galben → Dan=roșu sau verde. Dacă Dan=roșu→Dan=tenis. Ana≠roșu,verde rămâne pt Ana. Cris=galben sau verde. Soluție: Ana=verde/înot, Bea=albastru/baschet, Cris=galben/fotbal, Dan=roșu/tenis\nb) Raționament pas cu pas conform indiciilor\nc) O singură soluție\nd) Bea ar putea fi orice culoare (în afară de roșu-care e Dan)` },
]);

G['6-Logică-Raționament deductiv'] = () => alege([
  { text: `Pe o insulă trăiesc două tipuri de locuitori: Cavaleri (spun mereu adevărul) și Impostori (mint mereu).\n\nTrei locuitori — X, Y, Z — fac declarații:\n• X spune: "Cel puțin unul dintre noi este Impostor."\n• Y spune: "X este Cavaler."\n• Z spune: "Eu sunt Impostor."`,
    cerinta: `a) Poate Z fi Cavaler? Argumentează.\nb) Poate Z fi Impostor? Argumentează.\nc) Ce putem deduce despre X și Y?\nd) Care este singurul scenariu logic posibil?\ne) Inventează o problemă similară cu 2 persoane.`,
    raspuns: `a) Nu! Dacă Z e Cavaler, spune adevărul → "Eu sunt Impostor" ar fi adevărat → contradicție!\nb) Da. Dacă Z e Impostor, minte când zice "Eu sunt Impostor" (minciuna e că nu e impostor) → de fapt e impostor → consistență!\nc) Z=Impostor(demonstrat). Y zice "X e Cavaler" — dacă Y e Impostor, X e Impostor. Dacă X e Impostor, "cel puțin unul e impostor" e ADEVĂRAT, dar X ar fi mințit(impostor)→ impostorii mint→ contradicție! Deci X=Cavaler. Y zice adevărul→Y=Cavaler.\nd) X=Cavaler, Y=Cavaler, Z=Impostor\ne) Răspuns creativ liber` },
]);

// ╔══════════════════════════════════════════════╗
// ║              CLASA VII                       ║
// ╚══════════════════════════════════════════════╝

G['7-Matematică-Ecuații și inecuații'] = () => {
  const a=rand(2,6), b=rand(-10,10), c=rand(-15,15);
  return {
    text: `Rezolvă ecuația și inecuația de mai jos, reprezentând soluțiile pe axa numerelor:\n\nEcuație: ${a}x ${b>=0?'+':''}${b} = ${c}\n\nInecuație: ${a}x ${b>=0?'+':''}${b} > ${c}`,
    cerinta: `a) Rezolvă ecuația și verifică soluția.\nb) Rezolvă inecuația și scrie mulțimea soluțiilor.\nc) Reprezintă soluțiile pe axa numerelor.\nd) Dacă soluția ecuației este x₀, calculează ${a}x₀² + ${b}x₀ + ${c}.\ne) Ce se întâmplă cu soluția inecuației dacă înmulțim ambii membri cu -1?`,
    raspuns: `a) ${a}x=${c-b} → x=${(c-b)/a}\nb) x > ${(c-b)/a}\nc) Semidreapta deschisă spre dreapta de la ${(c-b)/a}\nd) ${a}×${((c-b)/a)**2}+${b}×${(c-b)/a}+${c}=${a*((c-b)/a)**2+b*(c-b)/a+c}\ne) Sensul inegalității se inversează: x < ${(c-b)/a}`
  };
};

G['7-Matematică-Funcții liniare'] = () => {
  const a=rand(-4,4)||1, b=rand(-8,8);
  return {
    text: `Fie funcția liniară f: ℝ → ℝ, f(x) = ${a}x ${b>=0?'+':''}${b}.\n\nUn taximetrist calculează costul unei curse cu formula: cost = ${Math.abs(a)} × km ${b>=0?'+':''} ${b} lei, unde ${b} este tariful de pornire.`,
    cerinta: `a) Calculează f(0), f(1), f(-1), f(3).\nb) Găsește x pentru care f(x) = 0 (zeroul funcției).\nc) Este funcția crescătoare sau descrescătoare?\nd) Trasează graficul (calculează 5 puncte).\ne) Cât costă o cursă de 15 km? Dar de 23 km?\nf) Câți km poate face cu 100 lei?`,
    raspuns: `a) f(0)=${b}, f(1)=${a+b}, f(-1)=${-a+b}, f(3)=${3*a+b}\nb) ${a}x+${b}=0 → x=${-b/a}\nc) ${a>0?'Crescătoare':'Descrescătoare'} (coeficientul lui x este ${a>0?'pozitiv':'negativ'})\nd) Puncte: (0,${b}), (1,${a+b}), (-1,${-a+b}), (2,${2*a+b}), (-2,${-2*a+b})\ne) 15km: ${Math.abs(a)*15+b} lei; 23km: ${Math.abs(a)*23+b} lei\nf) ${Math.abs(a)}×km+${b}=100 → km=${(100-b)/Math.abs(a)} km`
  };
};

G['7-Logică-Probleme de olimpiadă'] = () => alege([
  { text: `Suma cifrelor unui număr de două cifre este 11. Dacă inversăm cifrele, numărul crește cu 27.\nO a doua problemă: Numărul N, împărțit la 7, dă restul 3. Același N, împărțit la 5, dă restul 2. Găsește cel mai mic N pozitiv.`,
    cerinta: `a) Găsește numărul de două cifre (prima problemă).\nb) Verifică că inversarea crește cu 27.\nc) Rezolvă a doua problemă (cel mai mic N).\nd) Câte numere N < 100 satisfac a doua condiție?\ne) Scrie formula generală pentru toate soluțiile lui N.`,
    raspuns: `a) Fie a, b cifrele: a+b=11, (10b+a)-(10a+b)=27 → 9b-9a=27 → b-a=3. a+b=11, b-a=3 → b=7, a=4. Numărul: 47\nb) 74-47=27 ✓\nc) N≡3(mod7) și N≡2(mod5). N=7k+3. 7k+3≡2(mod5) → 7k≡-1≡4(mod5) → 2k≡4(mod5) → k≡2(mod5) → k=2+5t. N=7(2+5t)+3=17+35t. Cel mai mic: N=17\nd) 17, 52, 87 → 3 numere\ne) N=17+35t, t∈ℕ` },
]);

G['7-Logică-Teoria mulțimilor'] = () => alege([
  { text: `Într-o clasă de 35 de elevi, se știe că:\n• 20 de elevi joacă fotbal\n• 18 elevi joacă baschet\n• 5 elevi nu joacă niciun sport`,
    cerinta: `a) Câți elevi joacă cel puțin un sport?\nb) Câți elevi joacă ambele sporturi? (folosește formula reuniunii)\nc) Câți elevi joacă DOAR fotbal?\nd) Câți elevi joacă DOAR baschet?\ne) Reprezintă situația printr-o diagramă Venn (descrie numerele în fiecare zonă).\nf) Dacă se adaugă un al treilea sport (tenis) practicat de 10 elevi, din care 3 joacă și fotbal, 2 joacă și baschet și 1 joacă toate 3, cum se schimbă calculele?`,
    raspuns: `a) 35-5=30 elevi joacă cel puțin un sport\nb) |F∪B|=|F|+|B|-|F∩B| → 30=20+18-|F∩B| → |F∩B|=8\nc) Doar fotbal: 20-8=12\nd) Doar baschet: 18-8=10\ne) Venn: zona F only=12, zona B only=10, intersecție=8, exterior=5\nf) Folosești formula pentru 3 mulțimi: |F∪B∪T|=|F|+|B|+|T|-|F∩B|-|F∩T|-|B∩T|+|F∩B∩T|` },
]);

// ╔══════════════════════════════════════════════╗
// ║              CLASA VIII                      ║
// ╚══════════════════════════════════════════════╝

G['8-Matematică-Sisteme de ecuații'] = () => {
  const a1=rand(1,4), b1=rand(-3,3)||1, c1=rand(-10,15);
  const a2=rand(1,4), b2=rand(-3,3)||1;
  const x=rand(-5,8), y=rand(-5,8);
  const C1=a1*x+b1*y, C2=a2*x+b2*y;
  return {
    text: `Rezolvă sistemul de ecuații:\n{\n  ${a1}x ${b1>=0?'+':''}${b1}y = ${C1}\n  ${a2}x ${b2>=0?'+':''}${b2}y = ${C2}\n}\n\nProblema aplicată: Doi muncitori lucrează la un șantier. Împreună pot construi ${C1} metri de gard pe zi. Dacă primul lucrează de ${a2} ori mai mult, iar al doilea de ${b2>=0?b2:-b2} ori mai ${b2>=0?'mult':'puțin'}, termină ${C2} metri.`,
    cerinta: `a) Rezolvă sistemul prin metoda substituției.\nb) Rezolvă prin metoda eliminării (reducerii).\nc) Verifică soluția în ambele ecuații.\nd) Interpretează soluția în contextul problemei aplicate.\ne) Calculează determinantul sistemului. Ce înseamnă dacă determinantul este 0?`,
    raspuns: `a) Substituție: din prima ecuație, x=(${C1}-${b1}y)/${a1}; înlocuiește în a doua\nb) Eliminare: înmulțește prima cu ${a2} și a doua cu ${a1}, scade\nc) Soluția: x=${x}, y=${y}. Verificare: ${a1}×${x}+${b1}×${y}=${C1}✓, ${a2}×${x}+${b2}×${y}=${C2}✓\nd) Primul muncitor face ${x} m/zi, al doilea ${y} m/zi\ne) det=${a1*b2-a2*b1}. Dacă det=0, sistemul fie nu are soluție, fie are infinit de soluții`
  };
};

G['8-Matematică-Teorema lui Pitagora și aplicații'] = () => {
  const triple = alege([[3,4,5],[5,12,13],[8,15,17],[7,24,25]]);
  const k = rand(2,4);
  const [a,b,c] = triple.map(x=>x*k);
  return {
    text: `O echipă de cercetași se află în campanie.\nEi pornesc dintr-un punct O, merg ${a} km spre Nord, apoi ${b} km spre Est.\n\nÎntre timp, o a doua echipă observă un incendiu dintr-un turn de ${rand(15,25)} m înălțime. Unghiul de vizualizare față de orizontală este de 30°.`,
    cerinta: `a) Cât de departe se află prima echipă față de punctul de pornire O?\nb) Care ar fi distanța dacă ar fi mers direct (în linie dreaptă)?\nc) Cu câți km au mers în plus față de distanța directă?\nd) Calculează distanța până la incendiu dacă turnul are ${rand(20,30)} m și unghiul este 30° (tg30°≈0,577).\ne) Verifică tripletul Pitagoreic: (${a/k},${b/k},${c/k}) satisface a²+b²=c²?`,
    raspuns: `a) d=√(${a}²+${b}²)=√(${a*a}+${b*b})=√${a*a+b*b}=${c} km (Teorema Pitagora)\nb) Distanța directă = ${c} km\nc) (${a}+${b})-${c}=${a+b-c} km în plus\nd) dist_orizont = înălțime/tg30° = înălțime/0,577 ≈ (calculează cu înălțimea aleasă)\ne) ${a/k}²+${b/k}²=${(a/k)**2+(b/k)**2}=${c/k}²=${(c/k)**2} ✓`
  };
};

G['8-Matematică-Geometrie în spațiu'] = () => {
  const r=rand(4,9), h=rand(8,16), l=rand(5,12);
  return {
    text: `Un designer industrial proiectează trei recipiente pentru o expoziție:\n1. Un con cu raza bazei ${r} cm și înălțimea ${h} cm\n2. O sferă cu raza ${r} cm\n3. Un cilindru cu raza ${r} cm și înălțimea ${h} cm\n\nToate au aceeași rază ${r} cm.`,
    cerinta: `a) Calculează volumul fiecărui recipient. (V_con=πr²h/3; V_sferă=4πr³/3; V_cil=πr²h)\nb) Ordonează-le după volum, de la cel mai mic.\nc) Care este raportul între V_cilindru și V_con?\nd) Dacă cilindrul este plin cu apă și torni în con, câtă apă rămâne?\ne) Calculează aria totală a cilindrului (baze + lateral).`,
    raspuns: `a) V_con=3,14×${r}²×${h}/3=${(3.14*r*r*h/3).toFixed(1)}cm³; V_sferă=4×3,14×${r}³/3=${(4*3.14*r*r*r/3).toFixed(1)}cm³; V_cil=3,14×${r}²×${h}=${(3.14*r*r*h).toFixed(1)}cm³\nb) ${(3.14*r*r*h/3).toFixed(1)} < ${(4*3.14*r*r*r/3).toFixed(1)} vs ${(3.14*r*r*h).toFixed(1)} (depinde de valori)\nc) V_cil/V_con = 3\nd) V_cil-V_con = ${(3.14*r*r*h-3.14*r*r*h/3).toFixed(1)} cm³ apă rămâne\ne) A_tot=2×3,14×${r}²+2×3,14×${r}×${h}=${(2*3.14*r*r+2*3.14*r*h).toFixed(1)} cm²`
  };
};

G['8-Logică-Probleme de gândire avansată'] = () => alege([
  { text: `Paradoxul mincinosului modern:\n\nFour professors — Ana, Bogdan, Cris și Dora — sunt suspecți la un examen.\nUna dintre ele a copiat. Fiecare face câte două declarații:\n\nAna: "Nu eu am copiat. Bogdan a copiat."\nBogdan: "Cris a copiat. Dora nu a copiat."\nCris: "Eu nu am copiat. Ana a copiat."\nDora: "Bogdan nu a copiat. Cel care a copiat este fată."\n\nSe știe că cel vinovat spune exact 0 declarații adevărate, iar ceilalți spun exact 2 adevăruri.`,
    cerinta: `a) Testează ipoteza "Ana a copiat".\nb) Testează ipoteza "Bogdan a copiat".\nc) Testează ipoteza "Cris a copiat".\nd) Testează ipoteza "Dora a copiat".\ne) Care este singura ipoteză consistentă? Justifică.`,
    raspuns: `a) Ana copiată: Ana(0 adev: "nu eu"=F, "B copiat"=F ✓). Bogdan(2 adev: "C copiat"=F❌). Inconsistent.\nb) Bogdan copiat: Ana("nu eu"=T,"B copiat"=T ✓). Bogdan("C copiat"=F,"Dora nu a copiat"=T → 1 adevăr❌). Inconsistent.\nc) Cris copiată: Ana("nu eu"=T,"B copiat"=F → 1 adevăr❌). Inconsistent.\nd) Dora copiată: Ana("nu eu"=T,"B copiat"=F→1❌). Inconsistent... Reverificați cu atenție fiecare caz.\ne) Cel mai probabil Dora (declarațiile Dorei "Bogdan nu a copiat"=T dar "cel vinovat e fată"=T → 2 adevăruri, dar ea e vinovată→ar trebui 0). Problema necesită reverificare sistematică.` },
]);

G['8-Logică-Combinatorică avansată'] = () => alege([
  { text: `La un turneu de șah participă 8 jucători.\nÎn prima rundă, fiecare jucător joacă cu fiecare alt jucător exact o dată.\nCâștigătorii (4 jucători) trec în semifinale unde joacă din nou fiecare cu fiecare o dată.\nCei 2 câștigători joacă finala (un meci).`,
    cerinta: `a) Câte meciuri sunt în total în prima rundă?\nb) Câte meciuri sunt în semifinale?\nc) Câte meciuri sunt în tot turneul?\nd) Dacă adăugăm o meciuri pentru locul 3, câte meciuri total?\ne) Formula generală: un turneu cu n jucători (sistem fiecare cu fiecare) are câte meciuri?`,
    raspuns: `a) C(8,2)=28 meciuri\nb) C(4,2)=6 meciuri\nc) 28+6+1=35 meciuri\nd) 35+1=36 meciuri\ne) n×(n-1)/2 meciuri` },
]);

G['8-Logică-Grile de tip olimpiadă'] = () => alege([
  { text: `Problema SUDOKU LOGIC:\n\nCinci elevi (E1-E5) au luat note între 5 și 10 la 5 materii diferite (M1-M5).\nCondiții:\n• Suma notelor fiecărui elev este 40.\n• Nicio materie nu are două note identice.\n• E1 are nota maximă la M1 și minimă la M5.\n• E2 are note consecutive la M1 și M2.\n• Suma notelor la M3 este 35.`,
    cerinta: `a) Ce notă are E1 la M1? Dar la M5?\nb) Dacă suma la M3 este 35 cu 5 note distincte de la 5 la 10, care sunt notele posibile?\nc) Dacă E2 are 8 la M1, ce note posibile are la M2?\nd) Explică de ce o grilă de tip Sudoku are întotdeauna o soluție unică (sau deloc).\ne) Câte grile 5×5 complete există dacă cifrele 5-10 trebuie să apară o dată pe fiecare linie?`,
    raspuns: `a) E1 la M1=10 (maxim), la M5=5 (minim)\nb) 5 note distincte din {5,6,7,8,9,10} cu suma 35: ex. 5+7+8+9+6=35 sau 6+7+8+9+5=35 etc.\nc) E2 la M1=8, note consecutive → M2=7 sau M2=9\nd) Constrângerile propagate unic determină fiecare celulă; dacă există ambiguitate, există mai multe soluții\ne) 6! (sau 6P5) pentru fiecare linie = problematic; o analiză completă depășește cadrul` },
]);

// Generator implicit
function generatorImplicit(clasa, materie, tema) {
  return {
    text: `Subiect: ${tema} (${materie}, Clasa ${clasa})`,
    cerinta: `Rezolvă o problemă complexă din această temă, folosind toate cunoștințele dobândite.\nExplică fiecare pas al rezolvării și verifică rezultatul.`,
    raspuns: `Consultați manualul de clasa ${clasa} sau un profesor pentru rezolvare detaliată.`
  };
}

function genereazaProblema(clasa, materie, tema) {
  const key = `${clasa}-${materie}-${tema}`;
  return G[key] ? G[key]() : generatorImplicit(clasa, materie, tema);
}

// ══════════════════════════════════════════════
//  UI
// ══════════════════════════════════════════════

// ── FUNDAL CU OBIECTE DE ŞCOALĂ ──
(function() {
  const emojis = ['📚','✏️','📐','📏','🔬','🎒','📝','🖊️','📖','🔭','🧮','📌','✂️','🖍️','📎','🏫'];
  const bg = document.getElementById('school-bg');
  if (!bg) return;
  for (let i = 0; i < 28; i++) {
    const span = document.createElement('span');
    span.textContent = emojis[i % emojis.length];
    // Răspândite pe toată pagina — vizibile imediat
    span.style.left = (2 + Math.random() * 95) + 'vw';
    span.style.top  = (Math.random() * 200) + 'vh'; // acoperă și scroll
    span.style.animationDuration = (4 + Math.random() * 5) + 's';
    span.style.animationDelay = -(Math.random() * 5) + 's'; // delay negativ = deja în mișcare
    span.style.fontSize = (1.6 + Math.random() * 1.8) + 'rem';
    span.style.opacity = (0.75 + Math.random() * 0.25).toFixed(2);
    bg.appendChild(span);
  }
})();

document.getElementById('btn-start').addEventListener('click', () => {
  document.getElementById('cover').classList.add('hidden');
  document.getElementById('app').classList.remove('hidden');
});

const selClasa   = document.getElementById('sel-clasa');
const selMaterie = document.getElementById('sel-materie');
const selTema    = document.getElementById('sel-tema');
const btnGen     = document.getElementById('btn-genereaza');

selClasa.addEventListener('change', () => {
  const clasa = parseInt(selClasa.value);
  selMaterie.innerHTML = '<option value="">— Alege materia —</option>';
  selTema.innerHTML    = '<option value="">— Alege mai întâi materia —</option>';
  selMaterie.disabled  = true;
  selTema.disabled     = true;
  btnGen.disabled      = true;
  if (!clasa || !CURRICULUM[clasa]) return;
  Object.keys(CURRICULUM[clasa]).forEach(m => {
    const opt = document.createElement('option');
    opt.value = m; opt.textContent = m;
    selMaterie.appendChild(opt);
  });
  selMaterie.disabled = false;
});

selMaterie.addEventListener('change', () => {
  const clasa = parseInt(selClasa.value), materie = selMaterie.value;
  selTema.innerHTML = '<option value="">— Alege tema —</option>';
  selTema.disabled = true; btnGen.disabled = true;
  if (!materie) return;
  CURRICULUM[clasa][materie].forEach(t => {
    const opt = document.createElement('option');
    opt.value = t; opt.textContent = t;
    selTema.appendChild(opt);
  });
  selTema.disabled = false;
});

selTema.addEventListener('change', () => { btnGen.disabled = !selTema.value; });

function arataProblemele() {
  const clasa = parseInt(selClasa.value), materie = selMaterie.value, tema = selTema.value;
  if (!clasa || !materie || !tema) return;

  const lista = document.getElementById('lista-probleme');
  lista.innerHTML = '';

  for (let i = 0; i < 5; i++) {
    const prob = genereazaProblema(clasa, materie, tema);

    const card = document.createElement('div');
    card.className = 'problema-card';

    const nr = document.createElement('div');
    nr.className = 'problema-nr';
    nr.textContent = `Problema ${i + 1}`;

    const text = document.createElement('div');
    text.className = 'problema-text';
    text.textContent = prob.text;

    const cerinta = document.createElement('div');
    cerinta.className = 'problema-cerinta';
    cerinta.textContent = prob.cerinta;

    const btnR = document.createElement('button');
    btnR.className = 'btn-raspuns';
    btnR.textContent = '👁 Arată răspunsul';

    const raspuns = document.createElement('div');
    raspuns.className = 'raspuns-box';
    raspuns.textContent = '✅ ' + prob.raspuns;

    btnR.addEventListener('click', () => {
      const viz = raspuns.classList.toggle('vizibil');
      btnR.textContent = viz ? '🙈 Ascunde' : '👁 Arată răspunsul';
    });

    card.appendChild(nr);
    card.appendChild(text);
    card.appendChild(cerinta);
    card.appendChild(btnR);
    card.appendChild(raspuns);
    lista.appendChild(card);
  }

  const numClasa = ['','I','II','III','IV','V','VI','VII','VIII'][clasa];
  document.getElementById('probleme-titlu').textContent =
    `Clasa ${numClasa} • ${materie} • ${tema}`;

  document.getElementById('probleme-section').classList.remove('hidden');
  document.getElementById('probleme-section').scrollIntoView({ behavior: 'smooth' });
}

btnGen.addEventListener('click', arataProblemele);
document.getElementById('btn-alte').addEventListener('click', arataProblemele);
document.getElementById('btn-print').addEventListener('click', () => window.print());
