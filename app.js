const $=id=>document.getElementById(id);
const ids=['product','currency','units','purchase','shipping','packaging','labor','other','selling','platformFee','paymentFee','fixedFee','ads','tax','discount','targetMargin'];

function num(id){return Math.max(0,parseFloat($(id).value)||0)}
function money(n){return $('currency').value+Number(n).toLocaleString(undefined,{minimumFractionDigits:2,maximumFractionDigits:2})}

function calculate(){
  const units=Math.max(1,Math.floor(num('units')));
  const purchase=num('purchase'), shipping=num('shipping'), packaging=num('packaging'), labor=num('labor'), other=num('other');
  const selling=num('selling'), platform=num('platformFee')/100, payment=num('paymentFee')/100;
  const fixed=num('fixedFee'), ads=num('ads'), taxRate=num('tax')/100, discount=num('discount')/100, target=num('targetMargin')/100;

  const unitCost=purchase+shipping+packaging+labor+other;
  const discountedPrice=selling*(1-discount);
  const platformFee=discountedPrice*platform;
  const paymentFee=discountedPrice*payment+fixed;
  const tax=discountedPrice*taxRate;
  const fees=platformFee+paymentFee+ads+tax;
  const netRevenue=discountedPrice-fees;
  const profit=netRevenue-unitCost;
  const margin=discountedPrice>0?(profit/discountedPrice)*100:0;
  const markup=unitCost>0?(profit/unitCost)*100:0;
  const roi=markup;

  const variableRate=platform+payment+tax;
  const fixedPerOrder=fixed+ads;
  const breakEven=(unitCost+fixedPerOrder)/(Math.max(0.0001,1-variableRate)*(1-discount));
  const recommended=(unitCost+fixedPerOrder)/(Math.max(0.0001,(1-variableRate)*(1-discount)-target));
  const totalProfit=profit*units;

  $('cost').textContent=money(unitCost);
  $('netRevenue').textContent=money(netRevenue);
  $('profit').textContent=money(profit);
  $('margin').textContent=margin.toFixed(2)+'%';
  $('markup').textContent=markup.toFixed(2)+'%';
  $('roi').textContent=roi.toFixed(2)+'%';
  $('breakEven').textContent=money(breakEven);
  $('recommended').textContent=money(recommended);
  $('totalProfit').textContent=money(totalProfit);
  $('grossSales').textContent=money(discountedPrice*units);
  $('fees').textContent=money(fees);
  $('taxAmount').textContent=money(tax);
  $('variableCosts').textContent=money(unitCost+fees);

  const width=Math.max(0,Math.min(100,margin));
  $('profitBar').style.width=width+'%';
  $('profitBar').style.background=profit<0?'#b42318':'#172033';

  if(profit<0) $('message').textContent='You are losing money at this price. Increase the selling price or reduce costs.';
  else if(margin<target*100) $('message').textContent='Your current margin is below your target. The recommended price is '+money(recommended)+' per unit.';
  else $('message').textContent='Your current price meets or exceeds your target profit margin.';
}

ids.forEach(id=>$(id).addEventListener('input',calculate));
$('currency').addEventListener('change',calculate);
$('reset').addEventListener('click',()=>{
  const defaults={product:'',currency:'$',units:1,purchase:20,shipping:5,packaging:2,labor:3,other:1,selling:49,platformFee:8,paymentFee:3,fixedFee:.30,ads:2,tax:5,discount:0,targetMargin:30};
  Object.entries(defaults).forEach(([k,v])=>$(k).value=v);
  calculate();
});
$('copy').addEventListener('click',async()=>{
  const text=`Smart Profit Calculator Pro
Product: ${$('product').value||'N/A'}
Selling price: ${$('selling').value}
True cost/unit: ${$('cost').textContent}
Net profit/unit: ${$('profit').textContent}
Profit margin: ${$('margin').textContent}
Break-even price: ${$('breakEven').textContent}
Recommended price: ${$('recommended').textContent}
Total estimated profit: ${$('totalProfit').textContent}`;
  try{await navigator.clipboard.writeText(text);$('copied').textContent='Copied!';setTimeout(()=>$('copied').textContent='',1800)}
  catch(e){$('copied').textContent='Select and copy the results manually.'}
});
calculate();
