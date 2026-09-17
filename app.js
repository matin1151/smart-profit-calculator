const $=id=>document.getElementById(id);
const ids=['product','currency','units','purchase','shipping','packaging','labor','other','selling','platformFee','paymentFee','fixedFee','ads','tax','discount','targetMargin'];
function num(id){return Math.max(0,parseFloat($(id).value)||0)}
function money(n){return $('currency').value+Number(n).toLocaleString(undefined,{minimumFractionDigits:2,maximumFractionDigits:2})}
function calc(){
 const units=Math.max(1,Math.floor(num('units'))), selling=num('selling'), discount=num('discount')/100;
 const unitCost=num('purchase')+num('shipping')+num('packaging')+num('labor')+num('other');
 const discounted=selling*(1-discount), platform=num('platformFee')/100, payment=num('paymentFee')/100, taxRate=num('tax')/100, target=num('targetMargin')/100;
 const fixed=num('fixedFee'), ads=num('ads'), platformFee=discounted*platform, paymentFee=discounted*payment+fixed, tax=discounted*taxRate;
 const fees=platformFee+paymentFee+ads+tax, net=discounted-fees, profit=net-unitCost, margin=discounted>0?profit/discounted*100:0, markup=unitCost>0?profit/unitCost*100:0;
 const variableRate=platform+payment+taxRate, fixedOrder=fixed+ads, be=(unitCost+fixedOrder)/Math.max(.0001,(1-variableRate)*(1-discount));
 const targetDen=(1-variableRate)*(1-discount)-target, recommended=targetDen>0?(unitCost+fixedOrder)/targetDen:Infinity;
 const breakUnits=profit>0?Math.ceil(fixedOrder/Math.max(profit,0.0001)):0, monthlyProfit=profit*units, monthlyRevenue=discounted*units;
 $('cost').textContent=money(unitCost);$('netRevenue').textContent=money(net);$('profit').textContent=money(profit);$('margin').textContent=margin.toFixed(2)+'%';$('markup').textContent=markup.toFixed(2)+'%';$('roi').textContent=markup.toFixed(2)+'%';
 $('breakEven').textContent=money(be);$('breakEvenUnits').textContent=breakUnits?breakUnits.toLocaleString():'—';$('recommended').textContent=Number.isFinite(recommended)?money(recommended):'Not available';
 $('totalProfit').textContent=money(monthlyProfit);$('grossSales').textContent=money(monthlyRevenue);$('fees').textContent=money(fees*units);$('taxAmount').textContent=money(tax*units);$('variableCosts').textContent=money((unitCost+fees)*units);
 $('barValue').textContent=margin.toFixed(2)+'%';$('profitBar').style.width=Math.max(0,Math.min(100,margin))+'%';
 const st=$('status');
 if(profit<0){st.textContent='LOSS';st.className='status negative';$('message').textContent='You are losing money at this price. Increase your price or reduce your costs.'}
 else if(margin<target*100){st.textContent='BELOW TARGET';st.className='status warning';$('message').textContent='Your current margin is below your target. Recommended price: '+(Number.isFinite(recommended)?money(recommended):'not available')+' per unit.'}
 else{st.textContent='PROFITABLE';st.className='status positive';$('message').textContent='Your current price meets or exceeds your target profit margin.'}
 $('fUnits').textContent=units.toLocaleString();$('fRevenue').textContent=money(monthlyRevenue);$('fProfit').textContent=money(monthlyProfit);$('fAnnual').textContent=money(monthlyProfit*12);$('forecastFill').style.width=Math.max(0,Math.min(100,margin))+'%';
 return {product:$('product').value||'Untitled product',currency:$('currency').value,price:selling,cost:unitCost,profit,margin,monthlyProfit,units}
}
ids.forEach(id=>$(id).addEventListener('input',calc));$('currency').addEventListener('change',calc);
$('reset').addEventListener('click',()=>{const d={product:'',currency:'$',units:100,purchase:20,shipping:5,packaging:2,labor:3,other:1,selling:49,platformFee:8,paymentFee:3,fixedFee:.30,ads:2,tax:5,discount:0,targetMargin:30};Object.entries(d).forEach(([k,v])=>$(k).value=v);calc()});
$('copy').addEventListener('click',async()=>{const r=calc();const text=`Smart Profit Calculator Pro\nProduct: ${r.product}\nSelling price: ${money(r.price)}\nTrue cost/unit: ${money(r.cost)}\nNet profit/unit: ${money(r.profit)}\nProfit margin: ${r.margin.toFixed(2)}%\nBreak-even price: ${$('breakEven').textContent}\nRecommended price: ${$('recommended').textContent}\nMonthly profit: ${money(r.monthlyProfit)}`;try{await navigator.clipboard.writeText(text);$('copied').textContent='Copied!';setTimeout(()=>$('copied').textContent='',1800)}catch(e){$('copied').textContent='Copy manually.'}});
$('pdf').addEventListener('click',()=>{calc();window.print()});
function loadSaved(){return JSON.parse(localStorage.getItem('sp_saved')||'[]')}
function renderSaved(){const data=loadSaved(),tb=$('compareTable').querySelector('tbody'),empty=$('savedEmpty');tb.innerHTML='';empty.style.display=data.length?'none':'block';data.forEach((r,i)=>{const tr=document.createElement('tr');tr.innerHTML=`<td><strong>${escapeHtml(r.product)}</strong></td><td>${r.currency}${Number(r.price).toFixed(2)}</td><td>${r.currency}${Number(r.cost).toFixed(2)}</td><td>${r.currency}${Number(r.profit).toFixed(2)}</td><td>${Number(r.margin).toFixed(2)}%</td><td>${r.currency}${Number(r.monthlyProfit).toFixed(2)}</td><td><button class="delete" data-i="${i}">Delete</button></td>`;tb.appendChild(tr)});tb.querySelectorAll('.delete').forEach(b=>b.onclick=()=>{const d=loadSaved();d.splice(Number(b.dataset.i),1);localStorage.setItem('sp_saved',JSON.stringify(d));renderSaved()})}
function escapeHtml(s){return String(s).replace(/[&<>"']/g,m=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[m]))}
$('save').addEventListener('click',()=>{const r=calc(),d=loadSaved();d.push(r);localStorage.setItem('sp_saved',JSON.stringify(d));renderSaved();$('copied').textContent='Saved!';setTimeout(()=>$('copied').textContent='',1800)});
calc();renderSaved();