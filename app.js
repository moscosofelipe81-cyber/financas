// ===== Minhas Finanças v2 — app.js =====
const KEY = 'financas_v1', KEY_LIM = 'financas_limites', KEY_APR = 'financas_aprendizado', KEY_HIDE = 'financas_ocultar';

// ---------- Modelo de categorias (grupo = regra 50/30/20) ----------
// grupo: 'ess' = Essenciais (50%) · 'est' = Estilo de vida (30%) · 'fut' = Futuro: investimentos/dívidas (20%)
const CATS = {
  despesa: {
    'Moradia':      {ic:'🏠', cor:'#60a5fa', g:'ess', kw:['aluguel','condomínio','condominio','iptu','luz','energia','conta de luz','água','agua','gás','gas','internet','reforma','manutenção','manutencao','diarista','faxina']},
    'Mercado':      {ic:'🛒', cor:'#34d399', g:'ess', kw:['mercado','supermercado','feira','hortifruti','sacolão','sacolao','açougue','acougue','atacadão','atacadao','assaí','assai','carrefour','guanabara','prezunic','mundial']},
    'Refeição':     {ic:'🍽️', cor:'#fb923c', g:'est', kw:['restaurante','lanche','lanchonete','ifood','almoço','almoco','jantar','café','cafe','cafeteria','pizza','pizzaria','hamburguer','hambúrguer','burger','padaria','delivery','rappi','marmita','sushi','comida','refeição','refeicao','churrascaria','quentinha']},
    'Transporte':   {ic:'🚗', cor:'#a78bfa', g:'ess', kw:['uber','99','gasolina','combustível','combustivel','etanol','álcool','posto','ônibus','onibus','metrô','metro','brt','vlt','barca','trem','estacionamento','pedágio','pedagio','táxi','taxi','passagem','ipva','oficina','mecânico','mecanico','lava jato','riocard']},
    'Saúde':        {ic:'💊', cor:'#f472b6', g:'ess', kw:['farmácia','farmacia','drogaria','remédio','remedio','médico','medico','plano de saúde','plano de saude','dentista','consulta','exame','hospital','psicólogo','psicologo','terapia','fisioterapia']},
    'Educação':     {ic:'📚', cor:'#38bdf8', g:'ess', kw:['curso','faculdade','escola','livro','livros','mensalidade escolar','material escolar','pós','pos graduação','idioma','inglês','ingles','udemy','alura']},
    'Contas':       {ic:'🧾', cor:'#94a3b8', g:'ess', kw:['telefone','celular','conta do celular','plano do celular','tarifa','seguro','imposto','taxa','boleto','anuidade','cartório','cartorio','darf']},
    'Assinaturas':  {ic:'📺', cor:'#e879f9', g:'est', kw:['netflix','spotify','streaming','prime video','amazon prime','disney','hbo','max','globoplay','youtube','deezer','assinatura','icloud','google one','chatgpt','xbox','playstation']},
    'Lazer':        {ic:'🎉', cor:'#facc15', g:'est', kw:['cinema','show','viagem','bar','cerveja','chopp','festa','passeio','jogo','hotel','pousada','ingresso','balada','praia','teatro','museu','airbnb']},
    'Compras':      {ic:'🛍️', cor:'#f87171', g:'est', kw:['roupa','roupas','sapato','tênis','tenis','loja','shopping','presente','amazon','mercado livre','shopee','shein','magalu','eletrônico','eletronico','móvel','movel','casa e decoração']},
    'Cuidados':     {ic:'💇', cor:'#fda4af', g:'est', kw:['academia','salão','salao','cabelo','cabeleireiro','barbeiro','barbearia','manicure','unha','cosmético','cosmetico','perfume','maquiagem','estética','estetica']},
    'Pets':         {ic:'🐾', cor:'#fbbf24', g:'est', kw:['pet','petshop','pet shop','ração','racao','veterinário','veterinario','banho e tosa','cachorro','gato']},
    'Investimentos':{ic:'📈', cor:'#10b981', g:'fut', kw:['investi','investimento','aplicação','aplicacao','apliquei','poupança','poupanca','tesouro','cdb','ações','acoes','reserva','previdência','previdencia','cripto','bitcoin']},
    'Dívidas':      {ic:'💳', cor:'#ef4444', g:'fut', kw:['empréstimo','emprestimo','financiamento','parcela do carro','consignado','acordo','dívida','divida','juros do cartão','rotativo']},
    'Outros':       {ic:'•',  cor:'#64748b', g:'est', kw:[]}
  },
  receita: {
    'Salário':      {ic:'💼', cor:'#22c55e', kw:['salário','salario','pagamento','holerite','contracheque','adiantamento','vale']},
    'Extra':        {ic:'✨', cor:'#a3e635', kw:['freela','freelance','bico','extra','bônus','bonus','comissão','comissao','13º','décimo terceiro','decimo terceiro','férias','ferias','plr','hora extra']},
    'Rendimentos':  {ic:'📈', cor:'#10b981', kw:['rendimento','rendimentos','dividendo','dividendos','juros','resgate','resgatei']},
    'Reembolso':    {ic:'↩️', cor:'#2dd4bf', kw:['reembolso','devolução','devolucao','estorno','me devolveu','me pagou']},
    'Vendas':       {ic:'🏷️', cor:'#4ade80', kw:['vendi','venda','olx']},
    'Outros':       {ic:'•',  cor:'#64748b', kw:[]}
  }
};
const GRUPOS = {ess:{nome:'Essenciais', meta:50, cor:'#60a5fa'}, est:{nome:'Estilo de vida', meta:30, cor:'#fb923c'}, fut:{nome:'Futuro (investir/quitar dívidas)', meta:20, cor:'#10b981'}};
const MIGRA = {'Alimentação':'Refeição','Investimentos_receita':'Rendimentos'};

const RECEITA_WORDS = ['recebi','ganhei','entrada','entrou','caiu','receita','depositaram','me pagaram','vendi','salário','salario','rendimento','reembolso','resgatei','estorno'];
const DESPESA_WORDS = ['gastei','paguei','comprei','saída','saida','despesa','gasto','pago','transferi','investi','apliquei'];
const PAGS = [['crédito','Crédito'],['credito','Crédito'],['débito','Débito'],['debito','Débito'],['pix','Pix'],['dinheiro','Dinheiro'],['espécie','Dinheiro'],['boleto','Boleto']];

// ---------- Utilidades ----------
const $ = id => document.getElementById(id);
const brl = v => v.toLocaleString('pt-BR',{style:'currency',currency:'BRL'});
const brlK = v => Math.abs(v)>=1000 ? 'R$ '+(v/1000).toLocaleString('pt-BR',{maximumFractionDigits:1})+'k' : 'R$ '+Math.round(v);
const iso = d => { const x=new Date(d); x.setMinutes(x.getMinutes()-x.getTimezoneOffset()); return x.toISOString().slice(0,10); };
const hoje = () => iso(new Date());
const ymOf = d => `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}`;
const esc = s => String(s).replace(/[&<>"]/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));
const norm = s => s.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g,'');
const catInfo = (tipo,c) => CATS[tipo]?.[c] || CATS[tipo]?.Outros || CATS.despesa.Outros;
const parseValor = s => { s=String(s||'').trim(); if(!s) return NaN; if(s.includes(',')) s=s.replace(/\./g,'').replace(',','.'); return parseFloat(s); };

function load(k,def){ try{ return JSON.parse(localStorage.getItem(k)) ?? def; }catch{ return def; } }
function saveAll(){ localStorage.setItem(KEY,JSON.stringify(dados)); localStorage.setItem(KEY_LIM,JSON.stringify(limites)); localStorage.setItem(KEY_APR,JSON.stringify(aprend)); }
function toast(msg,ms=2800){ const t=$('toast'); t.textContent=msg; t.classList.add('show'); clearTimeout(t._h); t._h=setTimeout(()=>t.classList.remove('show'),ms); }

let dados = load(KEY,[]), limites = load(KEY_LIM,{}), aprend = load(KEY_APR,{});
// migração da v1
dados.forEach(d => {
  if (d.categoria==='Alimentação') d.categoria='Refeição';
  if (d.tipo==='receita' && d.categoria==='Investimentos') d.categoria='Rendimentos';
  if (!CATS[d.tipo][d.categoria]) d.categoria='Outros';
  if (!d.pagamento) d.pagamento = d.tipo==='receita' ? 'Pix' : 'Pix';
});
let mesRef = new Date(); mesRef.setDate(1);
let editando = null, catSel = null, filtro = 'todos';

// ---------- Classificação ----------
const KW_INDEX = {};
for (const tipo of ['despesa','receita']) {
  KW_INDEX[tipo] = Object.entries(CATS[tipo]).flatMap(([c,o]) => o.kw.map(k => [norm(k),c])).sort((a,b)=>b[0].length-a[0].length);
}
const temPalavra = (t,w) => new RegExp('(^|[^a-z0-9])'+w.replace(/[.*+?^${}()|[\]\\]/g,'\\$&')+'([^a-z0-9]|$)').test(t);

function classificar(tipo, texto){
  const t = norm(texto||'');
  // 1) categoria dita explicitamente: "... categoria refeição"
  const m = t.match(/categoria\s+([a-z ]+)/);
  if (m) { const c = Object.keys(CATS[tipo]).find(c => m[1].trim().startsWith(norm(c))); if (c) return c; }
  // 2) aprendizado com suas correções
  for (const [k,c] of Object.entries(aprend[tipo]||{}).sort((a,b)=>b[0].length-a[0].length)) if (temPalavra(t,k) && CATS[tipo][c]) return c;
  // 3) palavras-chave (a mais específica vence: "mercado livre" > "mercado")
  for (const [k,c] of KW_INDEX[tipo]) if (temPalavra(t,k)) return c;
  return 'Outros';
}

// ---------- Interpretação da fala ----------
const NUM_PALAVRAS = {'cem':100,'cento':100,'duzentos':200,'trezentos':300,'quatrocentos':400,'quinhentos':500,'mil':1000,'noventa':90,'oitenta':80,'setenta':70,'sessenta':60,'cinquenta':50,'quarenta':40,'trinta':30,'vinte':20,'dez':10,'nove':9,'oito':8,'sete':7,'seis':6,'cinco':5,'quatro':4,'três':3,'tres':3,'dois':2,'duas':2};

function parseFala(texto){
  const original = texto;
  let t = ' ' + texto.toLowerCase().replace(/r\$\s*/g,' ') + ' ';
  const tn = norm(t);
  let tipo = 'despesa';
  const rec = RECEITA_WORDS.some(w => tn.includes(norm(w))), des = DESPESA_WORDS.some(w => tn.includes(norm(w)));
  if (rec && !des) tipo = 'receita';

  let pagamento = tipo==='receita' ? 'Pix' : null;
  for (const [w,p] of PAGS) if (temPalavra(tn,norm(w))) { pagamento = p; break; }

  let valor = null;
  const mil = t.match(/(\d+(?:[.,]\d+)?)\s*mil(?:\s*e\s*(\d+))?/);
  const rc  = t.match(/(\d+)\s*reais?\s*e\s*(\d{1,2})\s*centavos?/);
  if (mil){ valor = parseFloat(mil[1].replace(',','.'))*1000 + (mil[2]?parseInt(mil[2]):0); t=t.replace(mil[0],' '); }
  else if (rc){ valor = parseInt(rc[1]) + parseInt(rc[2])/100; t=t.replace(rc[0],' '); }
  else {
    const n = t.match(/\d{1,3}(?:\.\d{3})+(?:,\d{1,2})?|\d+(?:[.,]\d{1,2})?/);
    if (n){ let s=n[0]; s = /,/.test(s) ? s.replace(/\./g,'').replace(',','.') : (/\.\d{3}$/.test(s) ? s.replace(/\./g,'') : s); valor=parseFloat(s); t=t.replace(n[0],' '); }
    else for (const [w,v] of Object.entries(NUM_PALAVRAS)){ const re=new RegExp('\\s'+w+'\\s'); if (re.test(t)){ valor=v; t=t.replace(re,' '); break; } }
  }

  let data = hoje();
  if (/\banteontem\b/.test(t)){ const d=new Date(); d.setDate(d.getDate()-2); data=iso(d); }
  else if (/\bontem\b/.test(t)){ const d=new Date(); d.setDate(d.getDate()-1); data=iso(d); }

  const categoria = classificar(tipo, t);

  const stop = new Set([...RECEITA_WORDS,...DESPESA_WORDS,...PAGS.map(p=>p[0]),'cartão','cartao','reais','real','centavos','hoje','ontem','anteontem','de','do','da','dos','das','no','na','nos','nas','em','com','pra','para','o','a','os','as','e','um','uma','via','pelo','pela','categoria','valor'].map(norm));
  const catWords = new Set(Object.keys(CATS[tipo]).map(norm));
  let desc = t.replace(/[.,!?]/g,' ').split(/\s+/).filter(w => w && !stop.has(norm(w)) && !(/categoria/.test(norm(t)) && catWords.has(norm(w)))).join(' ').trim();
  desc = desc ? desc.charAt(0).toUpperCase()+desc.slice(1) : categoria;
  return { tipo, valor, categoria, descricao: desc, data, pagamento: pagamento || 'Pix', fala: original };
}

// ---------- Voz ----------
const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
function ouvir(){
  if (!SR){ toast('Seu navegador não suporta voz. Use Chrome/Edge (PC/Android) ou Safari (iPhone).'); return; }
  const rec = new SR(); rec.lang='pt-BR'; rec.interimResults=false; rec.maxAlternatives=1;
  $('listening').hidden = false;
  rec.onresult = e => { const fala=e.results[0][0].transcript; abrirModal(parseFala(fala), fala); };
  rec.onerror = e => toast(e.error==='not-allowed' ? 'Permita o uso do microfone.' : e.error==='no-speech' ? 'Não ouvi nada, tente de novo.' : 'Não entendi, tente de novo.');
  rec.onend = () => { $('listening').hidden = true; };
  $('listening').onclick = () => rec.abort();
  rec.start();
}

// ---------- Modal de lançamento ----------
let autoCat = null;
function tipoAtual(){ return document.querySelector('input[name=tipo]:checked').value; }
function desenharCats(tipo){
  $('catPicker').innerHTML = Object.entries(CATS[tipo]).map(([c,o]) =>
    `<button type="button" data-cat="${esc(c)}" class="${c===catSel?'on':''}"><span>${o.ic}</span>${esc(c)}</button>`).join('');
}
$('catPicker').addEventListener('click', e => { const b=e.target.closest('button'); if(!b) return; catSel=b.dataset.cat; desenharCats(tipoAtual()); });
$('fDesc').addEventListener('input', () => {
  if (editando) return;
  const c = classificar(tipoAtual(), $('fDesc').value);
  if (c!=='Outros' && (catSel===autoCat || catSel==='Outros')) { catSel=c; autoCat=c; desenharCats(tipoAtual()); }
});
document.querySelectorAll('input[name=tipo]').forEach(r => r.addEventListener('change', () => {
  catSel = classificar(r.value, $('fDesc').value); autoCat = catSel; desenharCats(r.value);
}));

function abrirModal(p={}, fala=''){
  editando = p.id || null;
  $('modalTitle').textContent = fala ? 'Confirme o lançamento' : editando ? 'Editar lançamento' : (p.tipo==='receita'?'Nova receita':'Nova despesa');
  $('ouvido').textContent = fala ? `🎤 “${fala}”` : '';
  const tipo = p.tipo || 'despesa';
  document.querySelector(`input[name=tipo][value=${tipo}]`).checked = true;
  catSel = p.categoria || 'Outros'; autoCat = catSel; desenharCats(tipo);
  $('fValor').value = p.valor!=null ? p.valor.toFixed(2).replace('.',',') : '';
  $('fDesc').value = p.descricao || '';
  $('fPag').value = p.pagamento || 'Pix';
  $('fData').value = p.data || hoje();
  $('erro').textContent = fala && p.valor==null ? 'Não identifiquei o valor — preencha manualmente.' : '';
  $('modal').showModal();
  if (!fala && !editando) setTimeout(()=>$('fValor').focus(),100);
}
$('btnCancel').addEventListener('click', () => $('modal').close());
$('form').addEventListener('submit', e => {
  e.preventDefault();
  const v = parseValor($('fValor').value);
  if (!isFinite(v) || v<=0){ $('erro').textContent='Informe um valor maior que zero.'; return; }
  if (v>1e9){ $('erro').textContent='Valor muito alto.'; return; }
  const tipo = tipoAtual();
  const item = { id: editando || Date.now().toString(36)+Math.random().toString(36).slice(2,6), tipo, valor:Math.round(v*100)/100,
    descricao: $('fDesc').value.trim() || catSel, categoria: CATS[tipo][catSel] ? catSel : 'Outros', pagamento: $('fPag').value, data: $('fData').value || hoje() };
  // aprendizado: se você escolheu outra categoria, o app memoriza a descrição
  const sugerida = classificar(tipo, item.descricao);
  if (item.categoria!=='Outros' && sugerida!==item.categoria && item.descricao.length>=3){
    aprend[tipo] = aprend[tipo]||{}; aprend[tipo][norm(item.descricao)] = item.categoria;
  }
  dados = editando ? dados.map(d => d.id===editando ? item : d) : [...dados, item];
  saveAll(); $('modal').close();
  mesRef = new Date(item.data+'T12:00'); mesRef.setDate(1);
  render();
  avisoLimite(item);
});

function gastoCat(ym, cat){ return dados.filter(d=>d.tipo==='despesa' && d.categoria===cat && d.data.startsWith(ym)).reduce((s,d)=>s+d.valor,0); }
function avisoLimite(item){
  const base = `${item.tipo==='receita'?'Receita':'Despesa'} de ${brl(item.valor)} em ${item.categoria} ✔`;
  const lim = limites[item.categoria];
  if (item.tipo!=='despesa' || !lim) return toast(base);
  const g = gastoCat(item.data.slice(0,7), item.categoria), pct = g/lim*100;
  if (pct>100) toast(`⚠️ ${item.categoria}: limite estourado em ${brl(g-lim)} (${Math.round(pct)}%)`,4200);
  else if (pct>=80) toast(`⚠️ ${item.categoria}: ${Math.round(pct)}% do limite usado. Restam ${brl(lim-g)}`,4200);
  else toast(`${base} · restam ${brl(lim-g)} no limite`);
}

// ---------- Modal de limite ----------
let limCat = null;
function abrirLimite(cat){
  limCat = cat;
  $('limTitle').textContent = `${CATS.despesa[cat].ic} Limite de ${cat}`;
  const ym = ymOf(mesRef), media = mediaCat(cat);
  $('limInfo').textContent = `Gasto neste mês: ${brl(gastoCat(ym,cat))}` + (media ? ` · média dos últimos 3 meses: ${brl(media)}` : '');
  $('fLimite').value = limites[cat] ? limites[cat].toFixed(2).replace('.',',') : '';
  $('erroLim').textContent=''; $('modalLimite').showModal();
}
function mediaCat(cat){
  let s=0,n=0; for(let i=1;i<=3;i++){ const d=new Date(mesRef); d.setMonth(d.getMonth()-i); const g=gastoCat(ymOf(d),cat); if(g){s+=g;n++;} } return n? s/n : 0;
}
$('btnCancelLim').addEventListener('click', () => $('modalLimite').close());
$('formLimite').addEventListener('submit', e => {
  e.preventDefault();
  const raw = $('fLimite').value.trim(), v = raw ? parseValor(raw) : 0;
  if (!isFinite(v) || v<0){ $('erroLim').textContent='Valor inválido.'; return; }
  if (v===0) delete limites[limCat]; else limites[limCat] = Math.round(v*100)/100;
  saveAll(); $('modalLimite').close(); render(); toast(v ? `Limite de ${limCat}: ${brl(v)}/mês` : `Limite de ${limCat} removido`);
});

// ---------- Navegação ----------
function ir(v){
  document.querySelectorAll('.view').forEach(s => s.classList.toggle('active', s.id==='view-'+v));
  document.querySelectorAll('.bottom-nav [data-go]').forEach(b => b.classList.toggle('on', b.dataset.go===v));
  window.scrollTo({top:0,behavior:'smooth'});
}
document.addEventListener('click', e => {
  const g = e.target.closest('[data-go]'); if (g) ir(g.dataset.go);
  const a = e.target.closest('[data-add]'); if (a) abrirModal({tipo:a.dataset.add});
});
$('btnVoz').addEventListener('click', ouvir);
$('prevMonth').addEventListener('click', ()=>{ mesRef.setMonth(mesRef.getMonth()-1); render(); });
$('nextMonth').addEventListener('click', ()=>{ mesRef.setMonth(mesRef.getMonth()+1); render(); });
$('btnOlho').addEventListener('click', ()=>{ const h=!document.body.classList.contains('hide'); document.body.classList.toggle('hide',h); localStorage.setItem(KEY_HIDE,h?'1':''); });
if (localStorage.getItem(KEY_HIDE)) document.body.classList.add('hide');

// ---------- Render ----------
function txHTML(d, comDel=true){
  const o = catInfo(d.tipo,d.categoria);
  return `<li class="tx" data-id="${d.id}">
    <div class="ic" style="background:${o.cor}22">${o.ic}</div>
    <div class="info"><b>${esc(d.descricao)}</b><small>${d.data.split('-').reverse().slice(0,2).join('/')} · ${esc(d.categoria)} · ${esc(d.pagamento||'')}</small></div>
    <span class="val money ${d.tipo==='receita'?'pos':''}">${d.tipo==='receita'?'+':'−'} ${brl(d.valor)}</span>
    ${comDel?'<button class="del" type="button" aria-label="Excluir">🗑</button>':''}</li>`;
}
function corPct(p){ return p>100 ? 'var(--neg)' : p>=80 ? 'var(--warn)' : 'var(--pos)'; }

function render(){
  const ym = ymOf(mesRef), agora = new Date(), mesAtual = ym===ymOf(agora);
  const diasMes = new Date(mesRef.getFullYear(), mesRef.getMonth()+1, 0).getDate();
  const diaHoje = mesAtual ? agora.getDate() : (ym < ymOf(agora) ? diasMes : 0);
  const h = agora.getHours(); $('saudacao').textContent = (h<12?'Bom dia':h<18?'Boa tarde':'Boa noite')+' 👋';
  $('monthLabel').textContent = mesRef.toLocaleDateString('pt-BR',{month:'long',year:'numeric'});

  const saldo = dados.filter(d=>d.data<=hoje()).reduce((s,d)=> s+(d.tipo==='receita'?d.valor:-d.valor),0);
  const doMes = dados.filter(d=>d.data.startsWith(ym)).sort((a,b)=> b.data.localeCompare(a.data) || b.id.localeCompare(a.id));
  const desp = doMes.filter(d=>d.tipo==='despesa');
  const rec = doMes.filter(d=>d.tipo==='receita').reduce((s,d)=>s+d.valor,0);
  const des = desp.reduce((s,d)=>s+d.valor,0);
  $('saldoTotal').textContent = brl(saldo);
  $('recMes').textContent = brl(rec); $('desMes').textContent = brl(des);
  const res = rec-des;
  $('resultadoMes').textContent = doMes.length ? `Resultado do mês: ${res>=0?'+':'−'} ${brl(Math.abs(res))}` + (rec? ` · você ${res>=0?'guardou':'gastou além de'} ${Math.abs(Math.round(res/rec*100))}% ${res>=0?'do que recebeu':'da renda'}`:'') : 'Sem lançamentos neste mês';

  // 50/30/20
  const porGrupo = {ess:0,est:0,fut:0};
  desp.forEach(d => porGrupo[catInfo('despesa',d.categoria).g] += d.valor);
  $('regra').innerHTML = rec ? Object.entries(GRUPOS).map(([g,o]) => {
    const p = porGrupo[g]/rec*100, meta=o.meta, ok = g==='fut' ? p>=meta : p<=meta;
    return `<div class="rule"><div class="rule-h"><b>${o.nome}</b><span class="money">${brl(porGrupo[g])} · <span style="color:${ok?'var(--pos)':'var(--warn)'}">${Math.round(p)}%</span> <small>/ meta ${g==='fut'?'≥':'≤'}${meta}%</small></span></div>
      <div class="prog"><div style="width:${Math.min(p/meta*100,100)}%;background:${o.cor}"></div></div></div>`;
  }).join('') : '<p class="empty">Lance suas receitas do mês para comparar com a regra 50/30/20.</p>';

  // limites
  const lims = Object.keys(CATS.despesa).filter(c => limites[c]).map(c => {
    const g = gastoCat(ym,c), l = limites[c]; return {c, g, l, p: g/l*100};
  }).sort((a,b)=>b.p-a.p);
  $('alertasLimite').innerHTML = lims.length ? lims.slice(0,3).map(x => limMini(x)).join('') :
    '<p class="empty">Nenhum limite definido. <button class="link" type="button" data-go="limites">Definir agora</button></p>';

  $('ultimos').innerHTML = doMes.slice(0,5).map(d=>txHTML(d,false)).join('') || '<p class="empty">Toque no 🎤 e diga, por exemplo:<br>“despesa de 100 reais no restaurante”</p>';

  renderExtrato(doMes);
  renderGraficos(ym, doMes, desp, des, diasMes, diaHoje);
  renderLimites(ym, des, diasMes, diaHoje, mesAtual);
}
function limMini(x){
  const o = CATS.despesa[x.c];
  return `<div class="rule" data-go="limites" style="cursor:pointer"><div class="rule-h"><b>${o.ic} ${x.c}</b><span class="money">${brl(x.g)} / ${brl(x.l)} · <b style="color:${corPct(x.p)}">${Math.round(x.p)}%</b></span></div>
    <div class="prog"><div style="width:${Math.min(x.p,100)}%;background:${corPct(x.p)}"></div></div></div>`;
}

// ---------- Extrato ----------
function renderExtrato(doMes){
  const cats = [...new Set(doMes.map(d=>d.categoria))];
  if (filtro!=='todos' && filtro!=='receita' && filtro!=='despesa' && !cats.includes(filtro)) filtro='todos';
  $('filtros').innerHTML = [['todos','Todos'],['despesa','Despesas'],['receita','Receitas'],...cats.map(c=>[c,c])]
    .map(([k,l]) => `<button type="button" data-f="${esc(k)}" class="${k===filtro?'on':''}">${esc(l)}</button>`).join('');
  const q = norm($('busca').value.trim());
  const lista = doMes.filter(d => (filtro==='todos' || d.tipo===filtro || d.categoria===filtro) && (!q || norm(d.descricao+' '+d.categoria).includes(q)));
  if (!lista.length){ $('extrato').innerHTML = '<p class="empty">Nenhum lançamento encontrado.</p>'; return; }
  const dias = {}; lista.forEach(d => (dias[d.data] = dias[d.data]||[]).push(d));
  $('extrato').innerHTML = Object.entries(dias).map(([dia,arr]) => {
    const tot = arr.reduce((s,d)=>s+(d.tipo==='receita'?d.valor:-d.valor),0);
    return `<div class="day-h"><span>${new Date(dia+'T12:00').toLocaleDateString('pt-BR',{weekday:'long',day:'2-digit',month:'short'})}</span><span class="money">${tot>=0?'+':'−'} ${brl(Math.abs(tot))}</span></div>
      <div class="card" style="padding:4px 14px"><ul class="tx-list">${arr.map(d=>txHTML(d)).join('')}</ul></div>`;
  }).join('');
}
$('filtros').addEventListener('click', e => { const b=e.target.closest('[data-f]'); if(!b) return; filtro=b.dataset.f; render(); });
$('busca').addEventListener('input', () => render());
document.addEventListener('click', e => {
  const li = e.target.closest('.tx'); if (!li) return;
  const item = dados.find(d=>d.id===li.dataset.id); if (!item) return;
  if (e.target.classList.contains('del')){
    if (confirm(`Excluir "${item.descricao}" (${brl(item.valor)})?`)){ dados=dados.filter(d=>d.id!==item.id); saveAll(); render(); toast('Lançamento excluído'); }
  } else abrirModal(item);
});

// ---------- Gráficos (SVG puro, funciona offline) ----------
function renderGraficos(ym, doMes, desp, des, diasMes, diaHoje){
  // Donut
  const porCat = {}; desp.forEach(d => porCat[d.categoria]=(porCat[d.categoria]||0)+d.valor);
  const cats = Object.entries(porCat).sort((a,b)=>b[1]-a[1]);
  if (!cats.length) $('donut').innerHTML = '<p class="empty">Sem despesas neste mês.</p>';
  else {
    const R=60, C=2*Math.PI*R; let off=0;
    const arcs = cats.map(([c,v]) => { const len=v/des*C; const s=`<circle r="${R}" cx="85" cy="85" fill="none" stroke="${CATS.despesa[c]?.cor||'#64748b'}" stroke-width="22" stroke-dasharray="${Math.max(len-1.5,0.5)} ${C}" stroke-dashoffset="${-off}" transform="rotate(-90 85 85)"/>`; off+=len; return s; }).join('');
    $('donut').innerHTML = `<svg viewBox="0 0 170 170" role="img" aria-label="Despesas por categoria"><circle r="${R}" cx="85" cy="85" fill="none" stroke="#1b2542" stroke-width="22"/>${arcs}
      <text x="85" y="80" text-anchor="middle" fill="#8b95b5" font-size="11">Total</text><text x="85" y="98" text-anchor="middle" fill="#eef2ff" font-size="15" font-weight="700" class="money">${brlK(des)}</text></svg>
      <ul class="legend">${cats.map(([c,v])=>`<li><i style="background:${CATS.despesa[c]?.cor}"></i><span>${CATS.despesa[c]?.ic||''} ${c}</span><b class="money">${Math.round(v/des*100)}%</b></li>`).join('')}</ul>`;
  }

  // Linha: consumo acumulado
  const sel = $('selLinha'), atual = sel.value || 'todas';
  const opts = ['todas', ...Object.keys(CATS.despesa).filter(c => limites[c] || porCat[c])];
  sel.innerHTML = opts.map(c=>`<option value="${esc(c)}" ${c===atual?'selected':''}>${c==='todas'?'Todas as despesas':CATS.despesa[c].ic+' '+c}</option>`).join('');
  if (!opts.includes(atual)) sel.value='todas';
  const alvo = sel.value;
  const diario = Array(diasMes+1).fill(0);
  desp.filter(d => alvo==='todas' || d.categoria===alvo).forEach(d => diario[+d.data.slice(8,10)] += d.valor);
  const acum = []; let s=0; for(let i=1;i<=diasMes;i++){ s+=diario[i]; acum[i]=s; }
  const limite = alvo==='todas' ? Object.values(limites).reduce((a,b)=>a+b,0) : (limites[alvo]||0);
  $('linha').innerHTML = linhaSVG(acum, diasMes, diaHoje, limite);

  // Barras 6 meses
  const meses = []; for(let i=5;i>=0;i--){ const d=new Date(mesRef); d.setMonth(d.getMonth()-i); const k=ymOf(d);
    const arr = dados.filter(x=>x.data.startsWith(k));
    meses.push({lbl:d.toLocaleDateString('pt-BR',{month:'short'}).replace('.',''), r:arr.filter(x=>x.tipo==='receita').reduce((a,x)=>a+x.valor,0), d:arr.filter(x=>x.tipo==='despesa').reduce((a,x)=>a+x.valor,0)}); }
  $('barras').innerHTML = barrasSVG(meses);

  // Pagamento
  const porPag = {}; desp.forEach(d => porPag[d.pagamento||'Pix']=(porPag[d.pagamento||'Pix']||0)+d.valor);
  const pags = Object.entries(porPag).sort((a,b)=>b[1]-a[1]);
  const corPag = {Pix:'#2dd4bf','Crédito':'#a78bfa','Débito':'#60a5fa',Dinheiro:'#facc15',Boleto:'#94a3b8'};
  $('pagamentos').innerHTML = pags.length ? pags.map(([p,v]) => `<div class="hbar"><div class="lbl"><span>${p}</span><span class="money">${brl(v)} · ${Math.round(v/des*100)}%</span></div><div class="prog"><div style="width:${v/pags[0][1]*100}%;background:${corPag[p]||'#64748b'}"></div></div></div>`).join('')
    : '<p class="empty">Sem despesas neste mês.</p>';

  $('top5').innerHTML = [...desp].sort((a,b)=>b.valor-a.valor).slice(0,5).map(d=>txHTML(d,false)).join('') || '<p class="empty">Sem despesas neste mês.</p>';
}
$('selLinha').addEventListener('change', () => render());

function linhaSVG(acum, dias, diaHoje, limite){
  const W=320,H=170,pl=38,pr=8,pt=10,pb=22, iw=W-pl-pr, ih=H-pt-pb;
  const ate = diaHoje || 0;
  const maxV = Math.max(limite, acum[dias]||0, 1)*1.1;
  const x = d => pl + (d-1)/(dias-1)*iw, y = v => pt + ih - v/maxV*ih;
  let grid=''; for(let i=0;i<=4;i++){ const v=maxV*i/4; grid+=`<line x1="${pl}" x2="${W-pr}" y1="${y(v)}" y2="${y(v)}" stroke="#26314f" stroke-width="1"/><text x="${pl-4}" y="${y(v)+3}" text-anchor="end" fill="#8b95b5" font-size="9" class="money">${brlK(v)}</text>`; }
  [1,8,15,22,dias].forEach(d => grid+=`<text x="${x(d)}" y="${H-6}" text-anchor="middle" fill="#8b95b5" font-size="9">${d}</text>`);
  let lim='';
  if (limite){ lim = `<line x1="${pl}" x2="${W-pr}" y1="${y(limite)}" y2="${y(limite)}" stroke="#f43f5e" stroke-width="1.5" stroke-dasharray="4 3"/>
    <line x1="${x(1)}" y1="${y(limite/dias)}" x2="${x(dias)}" y2="${y(limite)}" stroke="#8b95b5" stroke-width="1.2" stroke-dasharray="2 3"/>`; }
  let path='', area='';
  if (ate>=1){
    const pts = []; for(let d=1; d<=ate; d++) pts.push(`${x(d).toFixed(1)},${y(acum[d]).toFixed(1)}`);
    if (ate===1) pts.push(`${(x(1)+2).toFixed(1)},${y(acum[1]).toFixed(1)}`);
    path = `<polyline points="${pts.join(' ')}" fill="none" stroke="#7c5cff" stroke-width="2.5" stroke-linejoin="round" stroke-linecap="round"/>`;
    area = `<polygon points="${x(1)},${y(0)} ${pts.join(' ')} ${x(Math.max(ate,1)+(ate===1?0.0001:0))},${y(0)}" fill="url(#ga)"/>`;
    path += `<circle cx="${x(ate)}" cy="${y(acum[ate])}" r="4" fill="#7c5cff" stroke="#fff" stroke-width="1.5"/>`;
  }
  const msg = ate ? '' : `<text x="${pl+iw/2}" y="${pt+ih/2}" text-anchor="middle" fill="#8b95b5" font-size="11">Mês futuro</text>`;
  return `<div class="chart"><svg viewBox="0 0 ${W} ${H}" role="img" aria-label="Consumo acumulado no mês"><defs><linearGradient id="ga" x1="0" x2="0" y1="0" y2="1"><stop offset="0" stop-color="#7c5cff" stop-opacity=".45"/><stop offset="1" stop-color="#7c5cff" stop-opacity="0"/></linearGradient></defs>${grid}${lim}${area}${path}${msg}</svg></div>`;
}
function barrasSVG(m){
  const W=320,H=160,pl=8,pb=20,pt=14, ih=H-pt-pb, bw=(W-pl*2)/m.length;
  const max = Math.max(1,...m.flatMap(x=>[x.r,x.d]));
  return `<div class="chart"><svg viewBox="0 0 ${W} ${H}" role="img" aria-label="Receitas e despesas por mês">${m.map((x,i)=>{
    const cx = pl+i*bw+bw/2, w=Math.min(14,bw/3), hr=x.r/max*ih, hd=x.d/max*ih;
    return `<rect x="${cx-w-1}" y="${pt+ih-hr}" width="${w}" height="${Math.max(hr,0)}" rx="4" fill="#22c55e"/>
      <rect x="${cx+1}" y="${pt+ih-hd}" width="${w}" height="${Math.max(hd,0)}" rx="4" fill="#f43f5e"/>
      <text x="${cx}" y="${H-5}" text-anchor="middle" fill="${i===m.length-1?'#eef2ff':'#8b95b5'}" font-size="10">${x.lbl}</text>
      ${(x.r||x.d)?`<text x="${cx}" y="${pt+ih-Math.max(hr,hd)-4}" text-anchor="middle" fill="${x.r-x.d>=0?'#86efac':'#fda4af'}" font-size="8.5" class="money">${brlK(x.r-x.d)}</text>`:''}`;
  }).join('')}</svg></div>`;
}

// ---------- Tela de limites ----------
function renderLimites(ym, des, diasMes, diaHoje, mesAtual){
  const total = Object.values(limites).reduce((a,b)=>a+b,0);
  const usadoLim = Object.keys(limites).reduce((s,c)=>s+gastoCat(ym,c),0);
  $('orcUsado').textContent = total ? `${brl(usadoLim)} de ${brl(total)}` : brl(des);
  $('orcInfo').textContent = total ? `${Math.round(usadoLim/total*100)}% do orçamento usado` : 'Defina limites abaixo para acompanhar seu orçamento';
  $('orcBar').style.width = total ? Math.min(usadoLim/total*100,100)+'%' : '0%';
  const restDias = mesAtual ? diasMes-diaHoje+1 : 0;
  $('orcRitmo').textContent = total && mesAtual ? (total-usadoLim>0 ? `Você pode gastar ${brl((total-usadoLim)/restDias)}/dia até o fim do mês` : `Orçamento estourado em ${brl(usadoLim-total)}`) : '';

  const ordem = Object.entries(CATS.despesa).sort((a,b)=> (limites[b[0]]?1:0)-(limites[a[0]]?1:0) || (limites[a[0]]&&limites[b[0]] ? gastoCat(ym,b[0])/limites[b[0]]-gastoCat(ym,a[0])/limites[a[0]] : gastoCat(ym,b[0])-gastoCat(ym,a[0])));
  $('listaLimites').innerHTML = ordem.map(([c,o]) => {
    const g = gastoCat(ym,c), l = limites[c];
    if (!l) return `<div class="lim" data-lim="${esc(c)}"><div class="lim-top"><div class="ic" style="background:${o.cor}22">${o.ic}</div><div class="nm"><b>${c}</b><small class="money">Gasto: ${brl(g)}</small></div><span class="badge">+ definir limite</span></div></div>`;
    const p = g/l*100;
    let extra = '';
    if (mesAtual && diaHoje>0){
      const proj = g/diaHoje*diasMes;
      extra = l-g>0 ? `<small class="money">Pode gastar ${brl((l-g)/restDias)}/dia</small><small class="money" style="color:${proj>l?'var(--warn)':'var(--muted)'}">Projeção: ${brl(proj)}</small>`
                    : `<small class="neg money">Estourou ${brl(g-l)}</small>`;
    }
    return `<div class="lim" data-lim="${esc(c)}"><div class="lim-top"><div class="ic" style="background:${o.cor}22">${o.ic}</div>
      <div class="nm"><b>${c}</b><small class="money">${brl(g)} de ${brl(l)}${l-g>0?' · restam '+brl(l-g):''}</small></div><span class="pct" style="color:${corPct(p)}">${Math.round(p)}%</span></div>
      <div class="prog"><div style="width:${Math.min(p,100)}%;background:${corPct(p)}"></div></div><div class="lim-foot">${extra}</div></div>`;
  }).join('');
}
$('listaLimites').addEventListener('click', e => { const b=e.target.closest('[data-lim]'); if (b) abrirLimite(b.dataset.lim); });

// ---------- Backup / Export ----------
function baixar(nome, conteudo, tipo){ const a=document.createElement('a'); a.href=URL.createObjectURL(new Blob([conteudo],{type:tipo})); a.download=nome; a.click(); setTimeout(()=>URL.revokeObjectURL(a.href),1000); }
$('btnExport').addEventListener('click', ()=>{
  const linhas = [['Data','Tipo','Categoria','Grupo 50/30/20','Descrição','Pagamento','Valor'], ...[...dados].sort((a,b)=>a.data.localeCompare(b.data)).map(d=>[
    d.data.split('-').reverse().join('/'), d.tipo, d.categoria, d.tipo==='despesa'?GRUPOS[catInfo('despesa',d.categoria).g].nome:'', d.descricao.replace(/;/g,','), d.pagamento||'', (d.tipo==='despesa'?-d.valor:d.valor).toFixed(2).replace('.',',')])];
  baixar('financas.csv','\ufeff'+linhas.map(l=>l.join(';')).join('\n'),'text/csv');
});
$('btnBackup').addEventListener('click', ()=> baixar(`backup-financas-${hoje()}.json`, JSON.stringify({versao:2,dados,limites,aprend}), 'application/json'));
$('fileRestore').addEventListener('change', async e => {
  const f=e.target.files[0]; if(!f) return;
  try{
    const j = JSON.parse(await f.text()); const arr = Array.isArray(j) ? j : j.dados; if(!Array.isArray(arr)) throw 0;
    if (confirm(`Restaurar ${arr.length} lançamentos? Os dados atuais serão substituídos.`)){
      dados=arr; if(!Array.isArray(j)){ limites=j.limites||{}; aprend=j.aprend||{}; } saveAll(); location.reload(); }
  }catch{ toast('Arquivo de backup inválido.'); }
  e.target.value='';
});

if ('serviceWorker' in navigator && location.protocol==='https:') navigator.serviceWorker.register('sw.js');
render();
