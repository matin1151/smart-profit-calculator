const ids=['purchase','shipping','other','selling','currency','product'];
const $=id=>document.getElementById(id);
function money(n){return $('currency').value+Number(n).toLocaleString(undefined,{minimumFractionDigits:2,maximumFractionDigits:2})}
function calculate(){
  const purchase=+$('purchase').value||0, shipping=+$('shipping').value||0, other=+$('other').value||0, selling=+$('selling').value||0;
  const cost=purchase+shipping+other, profit=selling-cost;
  const margin=selling>0?(profit/selling)*100:0, markup=cost>0?(profit/cost)*100:0;
  $('cost').textContent=money(cost); $('profit').textContent=money(profit);
  $('margin').textContent=margin.toFixed(2)+'%'; $('markup').textContent=markup.toFixed(2)+'%';
  $('breakEven').textContent=money(cost); $('roi').textContent=markup.toFixed(2)+'%';
  const width=Math.max(0,Math.min(100,margin)); $('profitBar').style.width=width+'%';
  $('profitBar').style.background=profit<0?'#b42318':'#172033';
  $('message').textContent=profit<0?'You are selling below true cost. Increase the price or reduce costs.':margin<15?'Your margin is relatively thin. Review your price and overhead costs.':'You are making a healthy margin on this sale.';
}
ids.forEach(id=>$(id).addEventListener('input',calculate));
$('currency').addEventListener('change',calculate);
$('reset').addEventListener('click',()=>{ $('product').value=''; $('purchase').value=100; $('shipping').value=10; $('other').value=5; $('selling').value=180; $('currency').value='$'; calculate();});
calculate();
