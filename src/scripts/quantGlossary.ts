import { notationEntries } from '../data/quantNotation';

// The written glossary and inline definitions share the same term catalogue.
// Lowercase p defaults to the p-value; probability equations are handled below.
const glossary = notationEntries.map(term => term.id === 'probability'
  ? { ...term, aliases: term.aliases.filter(alias => alias !== 'p') }
  : term);

export function initQuantGlossary() {
  const root=document.querySelector<HTMLElement>('.qm-deck');
  if(!root) return;
  const terms=new Map(glossary.map(t=>[t.id,t]));
  const aliases=new Map<string,string>();
  glossary.forEach(t=>t.aliases.forEach(a=>{
    aliases.set(a,t.id);
    if(a.length>2 && /^[a-z]/.test(a)) aliases.set(a[0].toUpperCase()+a.slice(1),t.id);
  }));
  const escape=(s:string)=>s.replace(/[.*+?^${}()|[\]\\]/g,'\\$&');
  const pieces=[...aliases.keys()].sort((a,b)=>b.length-a.length).map(a=>
    /^[A-Za-zβλθμπαφΣη]/u.test(a) ? `(?<![\\p{Script=Latin}\\p{N}\\p{Script=Greek}])${escape(a)}(?![\\p{Script=Latin}\\p{N}\\p{Script=Greek}])` : escape(a));
  // Numeric pairs are annotated only in text identifying an interval or bounds;
  // this avoids mislabelling matrix cells and ordinary coordinate pairs.
  const pattern=new RegExp(`(?<!\\[)\\[\\s*[−-]?(?:\\d+(?:\\.\\d+)?|\\.\\d+)\\s*,\\s*[−-]?(?:\\d+(?:\\.\\d+)?|\\.\\d+)\\s*\\](?!\\])|${pieces.join('|')}`,'gu');
  const walker=document.createTreeWalker(root,NodeFilter.SHOW_TEXT,{
    acceptNode(node){
      const p=node.parentElement;
      if(!p || !node.textContent?.trim() || p.closest('button,a,summary,h1,h2,h3,h4,script,style,select,textarea,input,svg,.qm-source,[data-no-glossary]')) return NodeFilter.FILTER_REJECT;
      return p.closest('p,dd,dt,li,th,td,span')?NodeFilter.FILTER_ACCEPT:NodeFilter.FILTER_REJECT;
    },
  });
  const nodes:Text[]=[];while(walker.nextNode())nodes.push(walker.currentNode as Text);
  for(const node of nodes){
    const content=node.textContent||'',frag=document.createDocumentFragment();let offset=0,found=false;
    for(const match of content.matchAll(pattern)){
      const value=match[0],pair=value.startsWith('[');
      const context=node.parentElement?.closest('p,dd,td')?.textContent||content;
      if(pair && !/interval|bounds|CI|區間|界限/.test(context)) continue;
      const id=pair?'interval':aliases.get(value);if(!id)continue;
      const index=match.index!;
      // 方差 is not the whole term when it occurs inside 協方差 (covariance).
      if(id==='variance'&&value==='方差'&&content[index-1]==='協')continue;
      // The English article “a” is not a statistical symbol.
      if(id==='a'&&!/^\s*(?:=|\()/.test(content.slice(index+value.length)))continue;
      frag.append(document.createTextNode(content.slice(offset,index)));
      const button=document.createElement('button');button.type='button';button.className='qm-term';button.dataset.term=id;button.textContent=value;
      button.setAttribute('aria-haspopup','dialog');button.setAttribute('aria-expanded','false');button.setAttribute('aria-controls','qm-term-window');
      if(pair){button.dataset.interval=value;button.dataset.intervalContext=content.slice(Math.max(0,index-100),index);}
      frag.append(button);offset=index+value.length;found=true;
    }
    if(found){frag.append(document.createTextNode(content.slice(offset)));node.replaceWith(frag);}
  }

  const popup=document.createElement('div');popup.id='qm-term-window';popup.className='qm-term-window';popup.setAttribute('popover','manual');popup.setAttribute('role','dialog');popup.setAttribute('aria-modal','false');popup.setAttribute('aria-labelledby','qm-term-heading');popup.setAttribute('aria-describedby','qm-term-definition');
  const header=document.createElement('div');header.className='qm-term-window-header';
  const title=document.createElement('strong');title.id='qm-term-heading';
  const close=document.createElement('button');close.type='button';close.textContent='×';
  const body=document.createElement('p');body.id='qm-term-definition';
  header.append(title,close);popup.append(header,body);document.body.append(popup);
  let active:HTMLButtonElement|null=null,pinned=false,timer:ReturnType<typeof setTimeout>|undefined;
  const visible=()=>popup.matches(':popover-open');
  function hide(){clearTimeout(timer);active?.setAttribute('aria-expanded','false');active?.removeAttribute('aria-describedby');if(visible())popup.hidePopover();active=null;pinned=false;}
  function position(){
    if(!active||!visible())return;
    const r=active.getBoundingClientRect();
    if(!r.width||r.bottom<0||r.top>innerHeight){hide();return;}
    const w=popup.offsetWidth,h=popup.offsetHeight;
    popup.style.left=`${Math.max(12,Math.min(r.left,innerWidth-w-12))}px`;
    popup.style.top=`${Math.max(12,r.bottom+h+12<innerHeight?r.bottom+8:r.top-h-8)}px`;
  }
  function contentFor(button:HTMLButtonElement){
    const zh=button.closest('[data-language]')?.getAttribute('data-language')==='zh',id=button.dataset.term!;
    const method=button.closest<HTMLElement>('[data-method-id]')?.dataset.methodId;
    const t=terms.get(id);let heading=zh?t?.labelZh:t?.label,definition=zh?t?.definitionZh:t?.definition;
    const local=(en:string,cn:string)=>{definition=zh?cn:en;};
    if(id==='mean'&&button.textContent==='M'&&['mediation','conditional'].includes(method||'')){
      const mediator=terms.get('m');heading=zh?mediator?.labelZh:mediator?.label;
      definition=zh?mediator?.definitionZh:mediator?.definition;
    }
    if(id==='interval'){
      const limits=button.dataset.interval!.slice(1,-1).split(',').map(x=>x.trim());
      const bounds=/bounds|界限/.test(button.dataset.intervalContext||'')&&!/interval|區間/.test(button.dataset.intervalContext||'');
      heading=zh?(bounds?'方括號：事先指定的界限':'方括號：區間下限與上限'):(bounds?'Square brackets: prespecified bounds':'Square brackets: lower and upper limits');
      local(bounds?`Here the two numbers are prespecified equivalence bounds: lower=${limits[0]}, upper=${limits[1]}. They are decision criteria, rather than an interval estimated from the sample.`:`Here the first number is the lower limit (${limits[0]}) and the second is the upper limit (${limits[1]}). Read the adjacent label for the interval type and level. For a CI, these limits describe uncertainty about the stated parameter, in that parameter’s units. They do not describe the range of individual scores.`,bounds?`這兩個數字是事先指定的等效界限：下限${limits[0]}、上限${limits[1]}，屬判斷準則，不是由樣本估計的區間。`:`第一個數字是下限（${limits[0]}），第二個是上限（${limits[1]}）。須看旁邊標籤以確定區間類型及水平。若是CI，這些界限表達指定參數的不確定性，單位與參數相同；不是個人分數的範圍。`);
    }
    const probabilitySymbol=id==='p'&&button.textContent==='p'&&['logistic','ordinal','irt'].includes(method||'')&&Boolean(button.closest('.qm-worked')||/logit|ln\[p|p\/\(1/.test(button.parentElement?.textContent||''));
    if(probabilitySymbol)local('In this equation p is the modelled probability of the event or response, between 0 and 1. For example p=.426 means a 42.6% predicted event probability. This p is not a hypothesis-test p-value.','此方程的p表示0至1之間的模型事件／反應機率。例如p=.426表示預測事件機率為42.6%。這個p不是假設檢定的p值。');
    if(id==='b'&&method==='irt')local('In this item-response equation, b is item difficulty, on the latent-trait scale. It is not the unstandardised outcome-regression coefficient called b elsewhere.','在此項目反應方程中，b是潛在特質尺度上的項目難度，不是其他地方稱為b的未標準化結果迴歸係數。');
    if(id==='b'&&['mediation','conditional'].includes(method||''))local('In this mediation model, b is the coefficient linking mediator M to outcome Y, conditional on X and any other included covariates. Multiplying path a by path b gives the specified linear indirect component ab.','在此中介模型中，b為在X及其他已納入協变量條件下，連接中介M與結果Y的係數。路徑a乘以路徑b得到指定線性間接成分ab。');
    if(id==='b'&&method==='svm')local('In f(x)=wᵀx+b, b is the intercept/bias term shifting the decision boundary. It is not a slope for one predictor.','在f(x)=wᵀx+b中，b為移動決策邊界的截距／偏置項，不是某個預測变量的斜率。');
    if(id==='b'&&method==='gam')local('Here b_k is the coefficient multiplying basis function B_k(x). The smooth is obtained by summing these products; an individual basis coefficient is not a single constant slope of the entire curve.','此處b_k是乘以基底函數B_k(x)的係數。把乘積加總才得到平滑曲線；單一基底係數不是整條曲線的固定斜率。');
    if(id==='z'&&method==='neural')local('In this toy neuron, z is the weighted sum of inputs plus the bias, before applying the sigmoid activation. It is not a z-test statistic.','在此教學神經元中，z是輸入加權總和加偏置，之後才套用sigmoid激活函數；它不是z檢定統計量。');
    if(id==='Z'&&method==='regression')local('Z names an additional predictor in this equation. Holding Z constant defines the conditional X–Y comparison. Capital Z here is not a z-test statistic.','此方程以Z命名另一個預測变量。保持Z相同才界定X與Y的條件比較；這個大寫Z不是z檢定統計量。');
    if(id==='beta'&&method==='bayes')local('Here Beta(a,b) names the beta probability distribution used for the binomial probability. Beta(2,2) is the prior and Beta(10,4) is the posterior in this example. This is different from a regression coefficient β.','此處Beta(a,b)是二項機率使用的beta機率分佈。本例先驗為Beta(2,2)，後驗為Beta(10,4)，與迴歸係數β不同。');
    if(id==='k'&&method==='reliability')local('Here k is the number of items in the scale. With four items, k=4 and the alpha multiplier k/(k−1)=4/3.','此處k是量表的項目數。四個項目時k=4，alpha公式中的k/(k−1)=4/3。');
    if(id==='k'&&['lpa','lca'].includes(method||''))local('Here k labels a particular profile/class in the mixture. π_k is its proportion and f_k(x) is its density for indicator pattern x. The total number of profiles/classes is a separate model choice.','此處k是某個剖面／類別的索引。π_k為該群比例，f_k(x)為該群對指標模式x的密度；總剖面／類別數是另一項模型選擇。');
    if(id==='k'&&method==='gam')local('Here k indexes a basis function in the smooth: b_k is its coefficient and B_k(x) is its value at x. Sum their products to obtain f(x).','此處k是平滑函數的基底函數索引；b_k為係數，B_k(x)為該基底在x的值。把乘積加總得到f(x)。');
    if(id==='t'&&['growth','timeseries','riclpm'].includes(method||''))local('Here t indexes a measurement occasion or time value, rather than a t-test statistic. The coding of time determines the interpretation of a growth slope.','此處t是測量時點或時間值的索引，不是t檢定統計量。時間編碼決定成長斜率的解讀。');
    if(id==='beta'&&/1[−-]β/.test(button.parentElement?.textContent||''))local('In power=1−β, β is the Type II error probability: failing to reject the specified null under a specified alternative. It is not a standardised regression coefficient in this expression.','在檢定力=1−β中，β為第二類錯誤機率，即在指定替代情況下未拒絕指定零假設的機率；此式中的β不是標準化迴歸係數。');
    if(probabilitySymbol)heading=zh?'p：模型機率':'p: modelled probability';
    if(id==='b'&&method==='irt')heading=zh?'b：項目難度':'b: item difficulty';
    if(id==='b'&&['mediation','conditional'].includes(method||''))heading=zh?'b：M→Y路徑係數':'b: M→Y path coefficient';
    if(id==='b'&&method==='svm')heading=zh?'b：截距／偏置':'b: intercept / bias';
    if(id==='b'&&method==='gam')heading=zh?'b_k：基底函數係數':'b_k: basis-function coefficient';
    if(id==='z'&&method==='neural')heading=zh?'z：激活前的加權輸入':'z: weighted input before activation';
    if(id==='Z'&&method==='regression')heading=zh?'Z：另一個預測变量':'Z: additional predictor';
    if(id==='beta'&&method==='bayes')heading=zh?'Beta：機率分佈':'Beta: probability distribution';
    if(id==='k'&&method==='reliability')heading=zh?'k：項目數':'k: number of items';
    if(id==='k'&&['lpa','lca'].includes(method||''))heading=zh?'k：剖面／類別索引':'k: profile / class index';
    if(id==='k'&&method==='gam')heading=zh?'k：基底函數索引':'k: basis-function index';
    if(id==='t'&&['growth','timeseries','riclpm'].includes(method||''))heading=zh?'t：時間索引':'t: time index';
    if(id==='beta'&&/1[−-]β/.test(button.parentElement?.textContent||''))heading=zh?'β：第二類錯誤機率':'β: Type II error probability';
    return{heading:heading||button.textContent||'',definition:definition||'',zh};
  }
  function show(button:HTMLButtonElement,pin=false){
    clearTimeout(timer);if(pinned&&!pin&&active!==button)return;
    active?.setAttribute('aria-expanded','false');active?.removeAttribute('aria-describedby');active=button;pinned=pin;
    const c=contentFor(button);title.textContent=c.heading;body.textContent=c.definition;popup.lang=c.zh?'zh-Hant':'en';close.setAttribute('aria-label',c.zh?'關閉解釋':'Close definition');
    button.setAttribute('aria-expanded','true');button.setAttribute('aria-describedby','qm-term-definition');if(!visible())popup.showPopover();position();
  }
  function schedule(){clearTimeout(timer);if(!pinned)timer=setTimeout(()=>{if(!popup.matches(':hover')&&!active?.matches(':hover')&&document.activeElement!==active&&!popup.contains(document.activeElement))hide();},180);}
  root.querySelectorAll<HTMLButtonElement>('.qm-term').forEach(b=>{
    b.addEventListener('pointerenter',e=>{if(e.pointerType==='mouse')show(b);});
    b.addEventListener('pointerleave',schedule);b.addEventListener('focus',()=>show(b));b.addEventListener('blur',schedule);
    b.addEventListener('click',e=>{e.stopPropagation();if(active===b&&pinned)hide();else show(b,true);});
  });
  popup.addEventListener('pointerenter',()=>clearTimeout(timer));popup.addEventListener('pointerleave',schedule);popup.addEventListener('focusin',()=>clearTimeout(timer));popup.addEventListener('focusout',schedule);
  close.addEventListener('click',()=>{const previous=active;hide();previous?.focus();hide();});
  document.addEventListener('pointerdown',e=>{if(visible()&&!popup.contains(e.target as Node)&&!active?.contains(e.target as Node))hide();});
  document.addEventListener('keydown',e=>{if(e.key==='Escape'&&visible()){e.preventDefault();e.stopImmediatePropagation();hide();}},true);
  document.querySelector('[data-global-translate]')?.addEventListener('click',hide);
  document.querySelectorAll('.slide').forEach(s=>new MutationObserver(()=>{if(s.getAttribute('aria-hidden')==='true'&&active&&s.contains(active))hide();}).observe(s,{attributes:true,attributeFilter:['aria-hidden']}));
  window.addEventListener('scroll',position,true);window.addEventListener('resize',position);window.addEventListener('beforeprint',hide);
}
