'use strict';

// ══════════════════════════════════════════════
//  STRUCTURA CURRICULUM
// ══════════════════════════════════════════════
const CURRICULUM = {
  1: {
    'Matematică': ['Adunări (0-10)', 'Scăderi (0-10)', 'Adunări (0-20)', 'Scăderi (0-20)', 'Probleme cu mere și fructe'],
    'Română':     ['Litere mari și mici', 'Silabe', 'Cuvinte și propoziții'],
  },
  2: {
    'Matematică': ['Adunări (0-100)', 'Scăderi (0-100)', 'Înmulțiri simple (tabla 2,3,4)', 'Probleme cu bani', 'Ordine și comparații'],
    'Română':     ['Despărțirea în silabe', 'Scrierea cu î/â', 'Propoziții afirmative și negative', 'Ortografie de bază'],
  },
  3: {
    'Matematică': ['Adunări și scăderi (0-1000)', 'Înmulțiri (tabla 1-10)', 'Împărțiri simple', 'Probleme în două operații', 'Unități de măsură (cm, m, kg)'],
    'Română':     ['Substantiv', 'Verb', 'Adjectiv', 'Propoziții dezvoltate', 'Scrierea corectă (x, ge, gi)'],
  },
  4: {
    'Matematică': ['Numere romane', 'Fracții simple', 'Înmulțiri cu 2 cifre', 'Împărțiri cu rest', 'Perimetru și arie'],
    'Română':     ['Subiect și predicat', 'Felul propoziției', 'Sinonime și antonime', 'Textul narativ', 'Semnele de punctuație'],
  },
  5: {
    'Matematică': ['Fracții ordinare', 'Numere zecimale', 'Procente simple', 'Ecuații simple', 'Figuri geometrice'],
    'Română':     ['Părțile de vorbire', 'Subiect și predicat', 'Atribut și complement', 'Textul descriptiv', 'Virgula în propoziție'],
  },
  6: {
    'Matematică': ['Numere întregi', 'Fracții și operații', 'Rapoarte și proporții', 'Arii și perimetre', 'Puterea unui număr'],
    'Română':     ['Verb – moduri și timpuri', 'Substantiv – cazuri', 'Complement direct/indirect', 'Textul argumentativ', 'Figuri de stil'],
  },
  7: {
    'Matematică': ['Ecuații de gradul I', 'Sisteme de ecuații', 'Funcții liniare', 'Geometrie (triunghi, cerc)', 'Statistică simplă'],
    'Română':     ['Propoziție și frază', 'Subordonatele', 'Rezumatul', 'Caracterizarea personajului', 'Mijloace artistice'],
  },
  8: {
    'Matematică': ['Ecuații de gradul II', 'Funcții de gradul II', 'Teorema lui Pitagora', 'Geometrie în spațiu', 'Probabilități'],
    'Română':     ['Redactare eseu', 'Analiza textului literar', 'Relații sintactice', 'Vocabular – familie lexicală', 'Stiluri funcționale'],
  },
};

// ══════════════════════════════════════════════
//  GENERATOARE DE PROBLEME
// ══════════════════════════════════════════════

function rand(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function alege(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}

// Nume și contexte pentru probleme
const PRENUME_BAIETI = ['Andrei', 'Mihai', 'Alexandru', 'Radu', 'Vlad', 'Bogdan', 'Cristian', 'Dan', 'George', 'Ionuț'];
const PRENUME_FETE   = ['Maria', 'Elena', 'Ana', 'Ioana', 'Sofia', 'Laura', 'Bianca', 'Mara', 'Diana', 'Raluca'];
const PRENUME        = [...PRENUME_BAIETI, ...PRENUME_FETE];
const FRUCTE         = ['mere', 'pere', 'portocale', 'banane', 'prune', 'caise', 'căpșuni', 'struguri'];
const OBIECTE        = ['creioane', 'cărți', 'bile', 'bomboane', 'pixuri', 'timbre', 'flori', 'steluțe'];
const ANIMALE        = ['pisici', 'câini', 'iepuri', 'pești', 'păsări', 'rațe', 'oi', 'vaci'];

function numeB() { return alege(PRENUME_BAIETI); }
function numeF() { return alege(PRENUME_FETE); }
function nume()  { return alege(PRENUME); }
function fruct() { return alege(FRUCTE); }
function obiect(){ return alege(OBIECTE); }

// ── Numerele romane ──
const ROMANE = {1:'I',2:'II',3:'III',4:'IV',5:'V',6:'VI',7:'VII',8:'VIII',9:'IX',10:'X',
  11:'XI',12:'XII',13:'XIII',14:'XIV',15:'XV',16:'XVI',17:'XVII',18:'XVIII',19:'XIX',20:'XX',
  30:'XXX',40:'XL',50:'L',60:'LX',70:'LXX',80:'LXXX',90:'XC',100:'C',
  200:'CC',300:'CCC',400:'CD',500:'D',1000:'M'};

function toRoman(n) {
  const vals = [1000,900,500,400,100,90,50,40,30,20,10,9,8,7,6,5,4,3,2,1];
  const syms = ['M','CM','D','CD','C','XC','L','XL','XXX','XX','X','IX','VIII','VII','VI','V','IV','III','II','I'];
  let result = '';
  for (let i = 0; i < vals.length; i++) {
    while (n >= vals[i]) { result += syms[i]; n -= vals[i]; }
  }
  return result;
}

// ══════════════════════════════════════════════
//  BANCĂ DE PROBLEME (cu generare procedurală)
// ══════════════════════════════════════════════

const GENERATOARE = {

  // ────────────── CLASA I ──────────────
  '1-Matematică-Adunări (0-10)': () => {
    const a = rand(1,8), b = rand(1, 10-a);
    const p = nume(), o = obiect();
    return {
      text: `${p} are ${a} ${o}. Primește încă ${b} ${o}.\nCâte ${o} are acum?`,
      raspuns: `${a} + ${b} = ${a+b} ${o}`
    };
  },
  '1-Matematică-Scăderi (0-10)': () => {
    const a = rand(3,10), b = rand(1, a-1);
    const p = nume(), o = obiect();
    return {
      text: `${p} are ${a} ${o} și dă ${b} ${o} prietenului său.\nCâte ${o} îi rămân lui ${p}?`,
      raspuns: `${a} - ${b} = ${a-b} ${o}`
    };
  },
  '1-Matematică-Adunări (0-20)': () => {
    const a = rand(5,18), b = rand(1, 20-a);
    const p = nume(), f = fruct();
    return {
      text: `Într-un coș sunt ${a} ${f}. Mama pune încă ${b} ${f}.\nCâte ${f} sunt în total în coș?`,
      raspuns: `${a} + ${b} = ${a+b} ${f}`
    };
  },
  '1-Matematică-Scăderi (0-20)': () => {
    const a = rand(10,20), b = rand(1, a-1);
    const p = numeF();
    return {
      text: `${p} culege ${a} flori din grădină.\nDă ${b} flori bunicii. Câte flori îi rămân?`,
      raspuns: `${a} - ${b} = ${a-b} flori`
    };
  },
  '1-Matematică-Probleme cu mere și fructe': () => {
    const a = rand(2,8), b = rand(1,6);
    const p1 = numeB(), p2 = numeF(), f = fruct();
    return {
      text: `${p1} are ${a} ${f} și ${p2} are ${b} ${f}.\nCâte ${f} au ei împreună?`,
      raspuns: `${a} + ${b} = ${a+b} ${f}`
    };
  },

  '1-Română-Litere mari și mici': () => {
    const perechi = [
      { intrebare: 'Scrie litera mare corespunzătoare literei mici: a, e, i, o, u', raspuns: 'A, E, I, O, U' },
      { intrebare: 'Scrie litera mică corespunzătoare literei mari: M, T, C, R, B', raspuns: 'm, t, c, r, b' },
      { intrebare: 'Completează spațiile cu litera mare sau mică:\n_aria merge la _coal?.  (M/m, ș/Ș)', raspuns: 'Maria merge la școală.' },
      { intrebare: 'Câte litere mari are cuvântul: MAMA?', raspuns: '4 litere mari: M, A, M, A' },
      { intrebare: 'Scrie cu litere mari: "soare, luna, stea"', raspuns: 'SOARE, LUNA, STEA' },
    ];
    return alege(perechi);
  },

  '1-Română-Silabe': () => {
    const cuvinte = [
      { cuv: 'ma-ma', nr: 2 }, { cuv: 'ca-sa', nr: 2 }, { cuv: 'soa-re', nr: 2 },
      { cuv: 'a-ri-pi', nr: 3 }, { cuv: 'flu-tu-re', nr: 3 }, { cuv: 'pă-du-re', nr: 3 },
      { cuv: 'car-te', nr: 2 }, { cuv: 'fe-reas-tră', nr: 3 }, { cuv: 'bi-ci-cle-tă', nr: 4 },
    ];
    const ex = alege(cuvinte);
    const cuv = ex.cuv.replace(/-/g, '');
    return {
      text: `Desparte în silabe cuvântul: "${cuv}"\nCâte silabe are?`,
      raspuns: `${ex.cuv} — ${ex.nr} silabe`
    };
  },

  '1-Română-Cuvinte și propoziții': () => {
    const exemple = [
      { text: 'Ordonează cuvintele și formează o propoziție:\n"merge • Ana • la • școală"', raspuns: 'Ana merge la școală.' },
      { text: 'Câte cuvinte are propoziția:\n"Mama face tort dulce."?', raspuns: '4 cuvinte: Mama / face / tort / dulce' },
      { text: 'Formează o propoziție cu cuvântul: "pisică"', raspuns: 'Exemplu: Pisica doarme pe canapea.' },
      { text: 'Este aceasta o propoziție? "Merge repede acasă copilul."', raspuns: 'Da, este propoziție (are înțeles).' },
      { text: 'Câte cuvinte are propoziția:\n"Soarele strălucește frumos."?', raspuns: '3 cuvinte: Soarele / strălucește / frumos' },
    ];
    return alege(exemple);
  },

  // ────────────── CLASA II ──────────────
  '2-Matematică-Adunări (0-100)': () => {
    const a = rand(10,80), b = rand(5, 99-a);
    const p = nume(), o = obiect();
    return {
      text: `${p} are ${a} de ${o}. Primește încă ${b} de ${o}.\nCâte ${o} are acum?`,
      raspuns: `${a} + ${b} = ${a+b} ${o}`
    };
  },
  '2-Matematică-Scăderi (0-100)': () => {
    const a = rand(20,99), b = rand(5, a-5);
    const p = numeF();
    return {
      text: `${p} are ${a} de lei. Cheltuiește ${b} de lei la magazin.\nCâți lei îi mai rămân?`,
      raspuns: `${a} - ${b} = ${a-b} lei`
    };
  },
  '2-Matematică-Înmulțiri simple (tabla 2,3,4)': () => {
    const tbl = alege([2,3,4]);
    const n = rand(1,10);
    return {
      text: `Calculează:\n${tbl} × ${n} = ?\n\nSau altfel: un ${alege(['pachet','set','grup'])} are ${tbl} ${obiect()}.\nCâte ${obiect()} sunt în ${n} ${alege(['pachete','seturi','grupuri'])}?`,
      raspuns: `${tbl} × ${n} = ${tbl*n}`
    };
  },
  '2-Matematică-Probleme cu bani': () => {
    const pret1 = rand(5,30), pret2 = rand(5,30), total = rand(pret1+pret2+5, 99);
    const p = numeB();
    return {
      text: `${p} vrea să cumpere o carte de ${pret1} lei și un caiet de ${pret2} lei.\nCât trebuie să plătească în total?`,
      raspuns: `${pret1} + ${pret2} = ${pret1+pret2} lei`
    };
  },
  '2-Matematică-Ordine și comparații': () => {
    const a = rand(10,90), b = rand(10,90);
    const semn = a > b ? '>' : a < b ? '<' : '=';
    return {
      text: `Compară numerele și pune semnul corect (>, <, =):\n${a} ○ ${b}\n\nOrdonează crescător: ${[a, b, rand(10,90)].sort(()=>Math.random()-0.5).join(', ')}`,
      raspuns: `${a} ${semn} ${b}\nOrdonat crescător: ${[a,b].sort((x,y)=>x-y).join(' < ')}`
    };
  },

  '2-Română-Despărțirea în silabe': () => {
    const cuvinte2 = [
      { cuv: 'ca-iet', nr: 2 }, { cuv: 'cre-ion', nr: 2 }, { cuv: 'co-pi-lă-ri-e', nr: 5 },
      { cuv: 'şco-a-lă', nr: 3 }, { cuv: 'bu-ni-că', nr: 3 }, { cuv: 'pri-mă-va-ră', nr: 4 },
    ];
    const ex = alege(cuvinte2);
    const cuv = ex.cuv.replace(/-/g, '');
    return {
      text: `Desparte în silabe: "${cuv}"\nCâte silabe are?`,
      raspuns: `${ex.cuv} → ${ex.nr} silabe`
    };
  },

  '2-Română-Scrierea cu î/â': () => {
    const exemple = [
      { text: 'Completează cu î sau â:\n"_nainte de a pleca, _și luă haina."', raspuns: '"Înainte de a pleca, își luă haina."' },
      { text: 'Alege forma corectă:\n"rând" sau "rînd"?', raspuns: '"rând" este forma corectă.' },
      { text: 'Completează: "Câinele _doară _n casă." (î/â)', raspuns: 'Câinele adoarme în casă.' },
      { text: 'Care cuvânt este scris corect?\na) "înger" b) "ânger"', raspuns: 'a) "înger" — corect' },
      { text: 'Scrie corect: "a_nta", "p_ine", "rom_n"', raspuns: 'a cânta, pâine, român' },
    ];
    return alege(exemple);
  },

  '2-Română-Propoziții afirmative și negative': () => {
    const exemple = [
      { text: 'Transformă propoziția în negativă:\n"Maria merge la școală."', raspuns: '"Maria nu merge la școală."' },
      { text: 'Este afirmativă sau negativă?\n"Câinele nu latră noaptea."', raspuns: 'Negativă (conține "nu").' },
      { text: 'Transformă în propoziție afirmativă:\n"Andrei nu citește cartea."', raspuns: '"Andrei citește cartea."' },
      { text: 'Formează o propoziție negativă cu verbul: "a alerga"', raspuns: 'Exemplu: "Eu nu alerg în clasă."' },
      { text: 'Câte propoziții negative găsești?\n"Soarele strălucește. Ploaia nu vine. Copiii nu dorm."', raspuns: '2 propoziții negative.' },
    ];
    return alege(exemple);
  },

  '2-Română-Ortografie de bază': () => {
    const exemple = [
      { text: 'Alege varianta corectă:\na) "geantă" b) "jeantă"', raspuns: 'a) "geantă"' },
      { text: 'Completează cu ce sau că:\n"Știu ___ vine mâine. Îmi place ___ citesc."', raspuns: '"Știu că vine mâine. Îmi place să citesc."' },
      { text: 'Pune punctul sau semnul exclamării:\n"Vai, ce frumos ___" / "Mâine este ziua mea ___"', raspuns: '"Vai, ce frumos!" / "Mâine este ziua mea."' },
      { text: 'Scrie corect pluralul:\ncarte → ?, masă → ?, copil → ?', raspuns: 'cărți, mese, copii' },
      { text: 'Alege: "sau" / "s-au":\n"Ei ___ dus acasă. Vrei apă ___ suc?"', raspuns: '"Ei s-au dus acasă. Vrei apă sau suc?"' },
    ];
    return alege(exemple);
  },

  // ────────────── CLASA III ──────────────
  '3-Matematică-Adunări și scăderi (0-1000)': () => {
    const a = rand(100,900), b = rand(10, 999-a);
    const op = alege(['+','-']);
    if (op === '+') {
      return { text: `Calculează:\n${a} + ${b} = ?\n\n${numeB()} a colecționat ${a} de timbre, iar fratele său ${b}.\nCâte timbre au împreună?`, raspuns: `${a} + ${b} = ${a+b}` };
    } else {
      const mare = Math.max(a,b), mic = Math.min(a,b);
      return { text: `Calculează:\n${mare} - ${mic} = ?\n\n${numeF()} a parcurs ${mare} km cu mașina și s-a întors ${mic} km.\nCâți km mai are de parcurs?`, raspuns: `${mare} - ${mic} = ${mare-mic}` };
    }
  },
  '3-Matematică-Înmulțiri (tabla 1-10)': () => {
    const a = rand(2,10), b = rand(2,10);
    return {
      text: `Calculează:\n${a} × ${b} = ?\n\nUn ${alege(['ghiveci','raft','rând'])} are ${a} ${obiect()}.\nCâte ${obiect()} sunt în ${b} ${alege(['ghivece','rafturi','rânduri'])}?`,
      raspuns: `${a} × ${b} = ${a*b}`
    };
  },
  '3-Matematică-Împărțiri simple': () => {
    const b = rand(2,9), rez = rand(2,12);
    const a = b * rez;
    const p = numeF(), o = obiect();
    return {
      text: `${p} împarte ${a} de ${o} în mod egal la ${b} prieteni.\nCâte ${o} primește fiecare?`,
      raspuns: `${a} ÷ ${b} = ${rez} ${o} pentru fiecare`
    };
  },
  '3-Matematică-Probleme în două operații': () => {
    const a = rand(20,80), b = rand(5,20), c = rand(5,15);
    const p = numeB();
    return {
      text: `${p} are ${a} de bile.\nCumpără încă ${b} bile, apoi dă ${c} bile fratelui său.\nCâte bile are ${p} la final?`,
      raspuns: `${a} + ${b} - ${c} = ${a+b-c} bile`
    };
  },
  '3-Matematică-Unități de măsură (cm, m, kg)': () => {
    const tipuri = [
      () => { const a=rand(1,5), b=rand(10,90); return { text: `Converte:\n${a} m și ${b} cm = ___ cm`, raspuns: `${a*100+b} cm` }; },
      () => { const a=rand(200,900); return { text: `Converte:\n${a} cm = ___ m și ___ cm`, raspuns: `${Math.floor(a/100)} m și ${a%100} cm` }; },
      () => { const a=rand(1,4), b=rand(1,4); return { text: `${numeF()} cântărește ${a} kg și ${rand(100,900)} g. ${numeB()} cântărește ${b} kg și ${rand(100,900)} g.\nCine este mai greu?`, raspuns: `Compară valorile în grame și alege cel mai mare.` }; },
    ];
    return alege(tipuri)();
  },

  '3-Română-Substantiv': () => {
    const exemple = [
      { text: 'Identifică substantivele din propoziție:\n"Copilul joacă fotbal în curte cu prietenii."', raspuns: 'copilul, fotbal, curte, prietenii' },
      { text: 'Formează pluralul substantivelor:\ncarte → ?, elev → ?, floare → ?', raspuns: 'cărți, elevi, flori' },
      { text: 'Scrie 3 substantive din categoria: animale domestice', raspuns: 'Exemplu: câine, pisică, vacă' },
      { text: 'Arată genul (masculin/feminin/neutru):\nmasa, calculatorul, caietul, floarea', raspuns: 'masa – feminin, calculatorul – neutru, caietul – neutru, floarea – feminin' },
      { text: 'Care cuvinte sunt substantive?\ncitesc, carte, frumos, școală, merge, copil', raspuns: 'carte, școală, copil' },
    ];
    return alege(exemple);
  },

  '3-Română-Verb': () => {
    const exemple = [
      { text: 'Identifică verbele din propoziție:\n"Maria aleargă și cântă în parc."', raspuns: 'aleargă, cântă' },
      { text: 'Conjugă verbul "a merge" la prezent:\neu ___, tu ___, el/ea ___', raspuns: 'eu merg, tu mergi, el/ea merge' },
      { text: 'Pune verbele la trecut:\n"Copilul mănâncă. Mama gătește."', raspuns: '"Copilul a mâncat. Mama a gătit."' },
      { text: 'Care cuvinte sunt verbe?\nalb, joacă, rapid, doarme, carte, cântă', raspuns: 'joacă, doarme, cântă' },
      { text: 'Conjugă "a citi" la viitor:\neu ___, tu ___, el ___', raspuns: 'eu voi citi, tu vei citi, el va citi' },
    ];
    return alege(exemple);
  },

  '3-Română-Adjectiv': () => {
    const exemple = [
      { text: 'Găsește adjectivele:\n"Fetița mică are părul lung și ochii albaștri."', raspuns: 'mică, lung, albaștri' },
      { text: 'Formează adjectivele opuse (antonime):\nmare → ?, frumos → ?, rapid → ?', raspuns: 'mic, urât, lent' },
      { text: 'Potrivește adjectivul cu substantivul:\nmunți (înalt), flori (colorat), mașini (rapid)', raspuns: 'munți înalți, flori colorate, mașini rapide' },
      { text: 'Scrie 3 adjective care descriu un câine', raspuns: 'Exemplu: mare, blând, jucăuș' },
      { text: 'Este "verde" adjectiv în propoziția:\n"Îmi place culoarea verde."?', raspuns: 'Da, "verde" este adjectiv (descrie substantivul "culoarea").' },
    ];
    return alege(exemple);
  },

  // ────────────── CLASA IV ──────────────
  '4-Matematică-Numere romane': () => {
    const tipuri = [
      () => { const n=rand(1,39); return { text: `Scrie în cifre romane:\n${n}`, raspuns: toRoman(n) }; },
      () => { const n=rand(1,39); const r=toRoman(n); return { text: `Scrie în cifre arabe:\n${r}`, raspuns: String(n) }; },
      () => { const a=rand(1,20), b=rand(1,20); return { text: `Calculează (scrie în cifre arabe):\n${toRoman(a)} + ${toRoman(b)} = ?`, raspuns: `${a} + ${b} = ${a+b} = ${toRoman(a+b)}` }; },
      () => { const a=rand(5,30), b=rand(1,a-1); return { text: `Calculează:\n${toRoman(a)} - ${toRoman(b)} = ?`, raspuns: `${a} - ${b} = ${a-b} = ${toRoman(a-b)}` }; },
    ];
    return alege(tipuri)();
  },
  '4-Matematică-Fracții simple': () => {
    const num = rand(1,7), den = rand(num+1, 10);
    const tipuri = [
      { text: `${numeF()} mănâncă ${num}/${den} dintr-o pizza.\nCe fracție din pizza a mai rămas?`, raspuns: `1 - ${num}/${den} = ${den-num}/${den} din pizza` },
      { text: `Coloreaza ${num} din ${den} pătrate egale.\nCe fracție reprezintă partea colorată?`, raspuns: `${num}/${den}` },
      { text: `Compară:\n${num}/${den} ○ ${num+1}/${den}\n(pune >, < sau =)`, raspuns: `${num}/${den} < ${num+1}/${den}` },
      { text: `Un tort este împărțit în ${den} felii egale.\n${numeB()} mănâncă ${num} felii.\nCe fracție din tort a mâncat?`, raspuns: `${num}/${den} din tort` },
    ];
    return alege(tipuri);
  },
  '4-Matematică-Înmulțiri cu 2 cifre': () => {
    const a = rand(11,49), b = rand(11,29);
    return {
      text: `Calculează:\n${a} × ${b} = ?\n\nO sală de cinema are ${a} de rânduri cu câte ${b} scaune.\nCâte scaune sunt în total?`,
      raspuns: `${a} × ${b} = ${a*b} scaune`
    };
  },
  '4-Matematică-Împărțiri cu rest': () => {
    const b = rand(3,9), rez = rand(5,15), rest = rand(1,b-1);
    const a = b*rez + rest;
    return {
      text: `Împarte și află câtul și restul:\n${a} ÷ ${b} = ?\n\n${numeF()} vrea să împartă ${a} bomboane la ${b} colegi.\nCâte bomboane primește fiecare și câte rămân?`,
      raspuns: `${a} ÷ ${b} = ${rez} rest ${rest}\nFiecare primește ${rez} bomboane, rămân ${rest}.`
    };
  },
  '4-Matematică-Perimetru și arie': () => {
    const tipuri = [
      () => { const l=rand(3,12); return { text: `Calculează perimetrul și aria unui pătrat cu latura de ${l} cm.`, raspuns: `P = 4 × ${l} = ${4*l} cm\nA = ${l} × ${l} = ${l*l} cm²` }; },
      () => { const l=rand(4,15), w=rand(3,10); return { text: `Calculează perimetrul și aria unui dreptunghi cu lungimea ${l} cm și lățimea ${w} cm.`, raspuns: `P = 2 × (${l} + ${w}) = ${2*(l+w)} cm\nA = ${l} × ${w} = ${l*w} cm²` }; },
    ];
    return alege(tipuri)();
  },

  '4-Română-Subiect și predicat': () => {
    const exemple = [
      { text: 'Găsește subiectul și predicatul:\n"Pisica doarme pe canapea."', raspuns: 'Subiect: pisica\nPredicat: doarme' },
      { text: 'Găsește subiectul și predicatul:\n"Copiii aleargă bucuroși în parc."', raspuns: 'Subiect: copiii\nPredicat: aleargă' },
      { text: 'Completează cu un subiect potrivit:\n"___ cântă frumos la pian."', raspuns: 'Exemplu: Maria cântă frumos la pian.' },
      { text: 'Completează cu un predicat potrivit:\n"Vântul ___ puternic."', raspuns: 'Exemplu: Vântul bate puternic.' },
      { text: 'Câte perechi subiect-predicat are fraza:\n"Mama gătește și tata spală vasele."', raspuns: '2 perechi: mama-gătește, tata-spală' },
    ];
    return alege(exemple);
  },

  '4-Română-Sinonime și antonime': () => {
    const perechi = [
      { text: 'Găsește sinonimele cuvintelor:\nrapid → ?, bucurie → ?, a vorbi → ?', raspuns: 'repede, fericire, a spune' },
      { text: 'Găsește antonimele cuvintelor:\nmicuț → ?, trist → ?, a urca → ?', raspuns: 'mare, vesel, a coborî' },
      { text: 'Care pereche este de sinonime?\na) cald – rece  b) frumos – chipeș  c) sus – jos', raspuns: 'b) frumos – chipeș (sinonime)' },
      { text: 'Înlocuiește cuvântul subliniat cu un sinonim:\n"Copilul este foarte _fericit_."', raspuns: 'Exemplu: bucuros, vesel, mulțumit' },
      { text: 'Găsește antonimul și folosește-l în propoziție:\ncuvânt: "întunecos"', raspuns: 'Antonim: luminos\nEx: "Ziua era luminoasă."' },
    ];
    return alege(perechi);
  },

  // ────────────── CLASA V ──────────────
  '5-Matematică-Fracții ordinare': () => {
    const d1=rand(3,8), n1=rand(1,d1-1), d2=rand(3,8), n2=rand(1,d2-1);
    const lcm = (a,b) => { let x=a,y=b; while(y){ [x,y]=[y,x%y]; } return a*b/x; };
    const l = lcm(d1,d2);
    const sum_n = n1*(l/d1) + n2*(l/d2);
    return {
      text: `Calculează:\n${n1}/${d1} + ${n2}/${d2} = ?\n\n${numeF()} a parcurs ${n1}/${d1} din drum dimineața\nși ${n2}/${d2} din drum după-amiaza.\nCât din drum a parcurs în total?`,
      raspuns: `${n1}/${d1} + ${n2}/${d2} = ${n1*(l/d1)}/${l} + ${n2*(l/d2)}/${l} = ${sum_n}/${l}`
    };
  },
  '5-Matematică-Numere zecimale': () => {
    const a = (rand(10,99)/10).toFixed(1), b = (rand(10,99)/10).toFixed(1);
    const sum = (parseFloat(a)+parseFloat(b)).toFixed(1);
    return {
      text: `Calculează:\n${a} + ${b} = ?\n\nUn kg de mere costă ${a} lei și un kg de pere costă ${b} lei.\nCât costă în total?`,
      raspuns: `${a} + ${b} = ${sum} lei`
    };
  },
  '5-Matematică-Procente simple': () => {
    const total = alege([100,200,50,80,150]);
    const proc = alege([10,20,25,50]);
    const rez = total * proc / 100;
    return {
      text: `Calculează ${proc}% din ${total}.\n\nUn magazin oferă o reducere de ${proc}% la un produs care costă ${total} lei.\nCât este reducerea?`,
      raspuns: `${proc}% din ${total} = ${rez} lei reducere\nPreț final: ${total-rez} lei`
    };
  },
  '5-Matematică-Ecuații simple': () => {
    const b = rand(2,9), c = rand(5,40);
    const a = c - b;
    return {
      text: `Rezolvă ecuația:\nx + ${b} = ${c}\n\nCaută numărul necunoscut.`,
      raspuns: `x = ${c} - ${b} = ${a}`
    };
  },
  '5-Matematică-Figuri geometrice': () => {
    const tipuri = [
      () => { const r=rand(3,10); return { text: `Calculează circumferința și aria unui cerc cu raza r = ${r} cm.\n(folosește π ≈ 3,14)`, raspuns: `C = 2 × 3,14 × ${r} = ${(2*3.14*r).toFixed(2)} cm\nA = 3,14 × ${r}² = ${(3.14*r*r).toFixed(2)} cm²` }; },
      () => { const b=rand(5,15), h=rand(4,12); return { text: `Calculează aria unui triunghi cu baza b = ${b} cm și înălțimea h = ${h} cm.`, raspuns: `A = (b × h) / 2 = (${b} × ${h}) / 2 = ${b*h/2} cm²` }; },
    ];
    return alege(tipuri)();
  },

  // ────────────── CLASA VI ──────────────
  '6-Matematică-Numere întregi': () => {
    const a = rand(-20, 20), b = rand(-20, 20);
    const op = alege(['+', '-', '×']);
    const rez = op==='+' ? a+b : op==='-' ? a-b : a*b;
    return {
      text: `Calculează:\n(${a}) ${op} (${b}) = ?\n\nTemperatura a fost ${a}°C dimineața și a ${op==='+'?'crescut':'scăzut'} cu ${Math.abs(b)}°C.\nCare este temperatura acum?`,
      raspuns: `(${a}) ${op} (${b}) = ${rez}`
    };
  },
  '6-Matematică-Rapoarte și proporții': () => {
    const a=rand(2,8), b=rand(2,8), n=rand(10,50);
    const total = a+b;
    const pa = Math.round(n*a/total), pb = n - pa;
    return {
      text: `${n} bomboane se împart în raportul ${a}:${b} între două persoane.\nCâte bomboane primește fiecare?`,
      raspuns: `Total părți: ${a}+${b} = ${total}\nPersoana 1: ${n} × ${a}/${total} = ${pa} bomboane\nPersoana 2: ${n} × ${b}/${total} = ${pb} bomboane`
    };
  },

  '6-Matematică-Puterea unui număr': () => {
    const b = rand(2,5), e = rand(2,4);
    const rez = Math.pow(b,e);
    return {
      text: `Calculează:\n${b}^${e} = ?\n\n(${b} înmulțit cu el însuși de ${e} ori)`,
      raspuns: `${b}^${e} = ${Array(e).fill(b).join(' × ')} = ${rez}`
    };
  },

  // ────────────── CLASA VII ──────────────
  '7-Matematică-Ecuații de gradul I': () => {
    const a=rand(2,9), b=rand(1,20), c=rand(b+1, 50);
    return {
      text: `Rezolvă ecuația:\n${a}x + ${b} = ${c}`,
      raspuns: `${a}x = ${c} - ${b} = ${c-b}\nx = ${c-b}/${a} = ${((c-b)/a).toFixed(2)}`
    };
  },
  '7-Matematică-Funcții liniare': () => {
    const a=rand(1,5), b=rand(-5,5);
    const x1=rand(0,5), x2=rand(0,5);
    return {
      text: `Fie funcția f(x) = ${a}x ${b>=0?'+':''}${b}.\nCalculează f(${x1}) și f(${x2}).`,
      raspuns: `f(${x1}) = ${a}×${x1}+${b} = ${a*x1+b}\nf(${x2}) = ${a}×${x2}+${b} = ${a*x2+b}`
    };
  },

  // ────────────── CLASA VIII ──────────────
  '8-Matematică-Teorema lui Pitagora': () => {
    const triple = alege([[3,4,5],[5,12,13],[8,15,17],[6,8,10]]);
    const k = rand(1,3);
    const [a,b,c] = triple.map(x=>x*k);
    const tipuri = [
      { text: `Un triunghi dreptunghic are catetele a = ${a} cm și b = ${b} cm.\nCalculează ipotenuza c.`, raspuns: `c² = ${a}² + ${b}² = ${a*a} + ${b*b} = ${a*a+b*b}\nc = √${a*a+b*b} = ${c} cm` },
      { text: `Un triunghi dreptunghic are ipotenuza c = ${c} cm și cateta a = ${a} cm.\nCalculează cealaltă catetă b.`, raspuns: `b² = c² - a² = ${c*c} - ${a*a} = ${b*b}\nb = ${b} cm` },
    ];
    return alege(tipuri);
  },
  '8-Matematică-Probabilități': () => {
    const total = alege([6,10,20,52]);
    const fav = rand(1, Math.floor(total/2));
    return {
      text: `Dintr-o urnă cu ${total} bile (${fav} roșii, ${total-fav} albastre),\nse extrage o bilă la întâmplare.\nCare este probabilitatea de a extrage o bilă roșie?`,
      raspuns: `P(roșie) = ${fav}/${total} = ${(fav/total).toFixed(2)} (${((fav/total)*100).toFixed(0)}%)`
    };
  },
};

// Generatoare implicite pentru teme fără generator specific
function generatorImplicit(clasa, materie, tema) {
  return {
    text: `[Clasa ${clasa} – ${materie}]\nTema: ${tema}\n\nFormulează și rezolvă o problemă din această temă.`,
    raspuns: 'Consultați manualul sau profesorul pentru rezolvare detaliată.'
  };
}

function genereazaProblema(clasa, materie, tema) {
  const key = `${clasa}-${materie}-${tema}`;
  if (GENERATOARE[key]) {
    return GENERATOARE[key]();
  }
  return generatorImplicit(clasa, materie, tema);
}

// ══════════════════════════════════════════════
//  UI LOGIC
// ══════════════════════════════════════════════

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

  const materii = Object.keys(CURRICULUM[clasa]);
  materii.forEach(m => {
    const opt = document.createElement('option');
    opt.value = m; opt.textContent = m;
    selMaterie.appendChild(opt);
  });
  selMaterie.disabled = false;
});

selMaterie.addEventListener('change', () => {
  const clasa   = parseInt(selClasa.value);
  const materie = selMaterie.value;
  selTema.innerHTML = '<option value="">— Alege tema —</option>';
  selTema.disabled  = true;
  btnGen.disabled   = true;

  if (!materie || !CURRICULUM[clasa]?.[materie]) return;

  CURRICULUM[clasa][materie].forEach(t => {
    const opt = document.createElement('option');
    opt.value = t; opt.textContent = t;
    selTema.appendChild(opt);
  });
  selTema.disabled = false;
});

selTema.addEventListener('change', () => {
  btnGen.disabled = !selTema.value;
});

function arataProblemele() {
  const clasa   = parseInt(selClasa.value);
  const materie = selMaterie.value;
  const tema    = selTema.value;
  if (!clasa || !materie || !tema) return;

  const lista = document.getElementById('lista-probleme');
  lista.innerHTML = '';

  // Generează 5 probleme unice
  const generate = [];
  for (let i = 0; i < 5; i++) {
    generate.push(genereazaProblema(clasa, materie, tema));
  }

  generate.forEach((prob, idx) => {
    const card = document.createElement('div');
    card.className = 'problema-card';

    const nr = document.createElement('div');
    nr.className = 'problema-nr';
    nr.textContent = `Problema ${idx + 1}`;

    const text = document.createElement('div');
    text.className = 'problema-text';
    text.textContent = prob.text;

    const btnR = document.createElement('button');
    btnR.className = 'btn-raspuns';
    btnR.textContent = '👁 Arată răspunsul';

    const raspuns = document.createElement('div');
    raspuns.className = 'raspuns-box';
    raspuns.textContent = '✅ ' + prob.raspuns;

    btnR.addEventListener('click', () => {
      const viz = raspuns.classList.toggle('vizibil');
      btnR.textContent = viz ? '🙈 Ascunde răspunsul' : '👁 Arată răspunsul';
    });

    card.appendChild(nr);
    card.appendChild(text);
    card.appendChild(btnR);
    card.appendChild(raspuns);
    lista.appendChild(card);
  });

  const numClasa = ['','I','II','III','IV','V','VI','VII','VIII'][clasa];
  document.getElementById('probleme-titlu').textContent =
    `Clasa ${numClasa} • ${materie} • ${tema}`;

  document.getElementById('probleme-section').classList.remove('hidden');
  document.getElementById('probleme-section').scrollIntoView({ behavior: 'smooth' });
}

btnGen.addEventListener('click', arataProblemele);
document.getElementById('btn-alte').addEventListener('click', arataProblemele);
document.getElementById('btn-print').addEventListener('click', () => window.print());
