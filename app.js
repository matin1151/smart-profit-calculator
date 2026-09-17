const $=id=>document.getElementById(id);
const ids=['product','currency','units','purchase','shipping','packaging','labor','other','selling','platformFee','paymentFee','fixedFee','ads','tax','discount','targetMargin'];
function num(id){return Math.max(0,parseFloat($(id).value)||0)}
function money(n){return $('currency').value+Number(n).toLocaleString(undefined,{minimumFractionDigits:2,maximumFractionDigits:2})}
function calculate(){
 const units=Math.max(1,Math.floor(num('units')));
 const unitCost=num('purchase')+num('shipping')+num('packaging')+num('labor')+num('other');
 const selling=num('selling'), discount=num('discount')/100;
 const discountedPrice=selling*(1-discount);
 const platform=num('platformFee')/100, payment=num('paymentFee')/100, taxRate=num('tax')/100, target=num('targetMargin')/100;
 const fixed=num('fixedFee'), ads=num('ads');
 const platformFee=discountedPrice*platform, paymentFee=discountedPrice*payment+fixed, tax=discountedPrice*taxRate;
 const fees=platformFee+paymentFee+ads+tax;
 const netRevenue=discountedPrice-fees, profit=netRevenue-unitCost;
 const margin=discountedPrice>0?(profit/discountedPrice)*100:0;
 const markup=unitCost>0?(profit/unitCost)*100:0;
 const variableRate=platform+payment+taxRate;
 const fixedPerOrder=fixed+ads;
 const denominator=Math.max(.0001,(1-variableRate)*(1-discount));
 const breakEven=(unitCost+fixedPerOrder)/denominator;
 const targetDen=Math.max(.0001,(1-variableRate)*(1-discount)-target);
 const recommended=(unitCost+fixedPerOrder)/targetDen;
 const totalProfit=profit*units;

 $('cost').textContent=money(unitCost); $('netRevenue').textContent=money(netRevenue); $('profit').textContent=money(profit);
 $('margin').textContent=margin.toFixed(2)+'%'; $('markup').textContent=markup.toFixed(2)+'%'; $('roi').textContent=markup.toFixed(2)+'%';
 $('breakEven').textContent=money(breakEven); $('recommended').textContent=money(recommended); $('totalProfit').textContent=money(totalProfit);
 $('grossSales').textContent=money(discountedPrice*units); $('fees').textContent=money(fees*units); $('taxAmount').textContent=money(tax*units);
 $('variableCosts').textContent=money((unitCost*units)+(fees*units)); $('barValue').textContent=margin.toFixed(2)+'%';
 $('profitBar').style.width=Math.max(0,Math.min(100,margin))+'%';
 const status=$('status');
 if(profit<0){status.textContent='LOSS';status.className='status negative';$('message').textContent='You are losing money at this price. Increase the selling price or reduce your costs.'}
 else if(margin<target*100){status.textContent='BELOW TARGET';status.className='status positive';$('message').textContent='Your current margin is below your target. The recommended price is '+money(recommended)+' per unit.'}
 else{status.textContent='PROFITABLE';status.className='status positive';$('message').textContent='Your current price meets or exceeds your target profit margin.'}
}
ids.forEach(id=>$(id).addEventListener('input',calculate));
$('currency').addEventListener('change',calculate);
$('reset').addEventListener('click',()=>{const d={product:'',currency:'$',units:1,purchase:20,shipping:5,packaging:2,labor:3,other:1,selling:49,platformFee:8,paymentFee:3,fixedFee:.30,ads:2,tax:5,discount:0,targetMargin:30};Object.entries(d).forEach(([k,v])=>$(k).value=v);calculate()});
$('copy').addEventListener('click',async()=>{const text=`Smart Profit Calculator Pro
Product: ${$('product').value||'N/A'}
Selling price: ${$('selling').value}
True cost/unit: ${$('cost').textContent}
Net profit/unit: ${$('profit').textContent}
Profit margin: ${$('margin').textContent}
Break-even price: ${$('breakEven').textContent}
Recommended price: ${$('recommended').textContent}
Total estimated profit: ${$('totalProfit').textContent}`;try{await navigator.clipboard.writeText(text);$('copied').textContent='Copied!';setTimeout(()=>$('copied').textContent='',1800)}catch(e){$('copied').textContent='Copy manually.'}});
calculate();