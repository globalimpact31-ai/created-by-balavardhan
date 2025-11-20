// FLAMES app logic
// Author: generated example
document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('flamesForm');
  const nameA = document.getElementById('nameA');
  const nameB = document.getElementById('nameB');
  const resultEl = document.getElementById('result');
  const relationEl = document.getElementById('relation');
  const relationDescEl = document.getElementById('relationDesc');
  const resetBtn = document.getElementById('resetBtn');
  const shareBtn = document.getElementById('shareBtn');

  const RELATIONS = {
    F: { title: 'Friends', desc: 'Warm companionship and mutual trust.' },
    L: { title: 'Love', desc: 'Deep romantic connection and attraction.' },
    A: { title: 'Affection', desc: 'Fondness and caring feelings.' },
    M: { title: 'Marriage', desc: 'Long-term commitment and partnership.' },
    E: { title: 'Enemies', desc: 'Conflict, rivalry or incompatibility.' },
    S: { title: 'Siblings', desc: 'Supportive, familial bond or close friendship.' }
  };

  // ==========================================
  // SEND NAMES TO GOOGLE SHEET (YOUR FUNCTION)
  // ==========================================
  function sendToSheet(name1, name2) {
    fetch("https://script.google.com/macros/s/AKfycbx_XJHYtpGJqjSKxA4IFoJsqyUlr6MxKxZkmCHVAImFtC27yAQYvDK5DoSrCl4Vz_0m1A/exec", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        name1: name1,
        name2: name2
      })
    })
    .then(res => console.log("Data sent to sheet:", name1, name2))
    .catch(err => console.error("Error sending data:", err));
  }
  // ==========================================
  // END GOOGLE SHEET FUNCTION
  // ==========================================


  function sanitize(name){
    // Keep letters only (a-z). Lowercase.
    return (name || '').toLowerCase().replace(/[^a-z]/g, '');
  }

  function countRemaining(a, b){
    // Remove common letters by decrementing counts
    const ac = {};
    for(const ch of a) ac[ch] = (ac[ch]||0) + 1;
    for(const ch of b){
      if(ac[ch]) ac[ch]--;
      else ac[ch] = (ac[ch]||0) - 1;
    }
    // sum absolute leftover counts
    return Object.values(ac).reduce((s,n)=> s + Math.abs(n), 0);
  }

  function flamesFromCount(count){
    if (count === 0) return 'S'; // same name => Siblings by convention
    let letters = ['F','L','A','M','E','S'];
    let idx = 0;
    while(letters.length > 1){
      idx = (count % letters.length) - 1;
      if(idx >= 0){
        letters.splice(idx, 1);
        letters = letters.slice(idx).concat(letters.slice(0, idx));
      } else {
        letters.pop();
      }
    }
    return letters[0];
  }

  function showResult(letter, a, b){
    const r = RELATIONS[letter] || { title: 'Unknown', desc: '' };
    relationEl.textContent = `${r.title}`;
    relationDescEl.textContent = `${r.desc} (${letter}) — ${a} + ${b}`;
    resultEl.hidden = false;

    resultEl.querySelector('.result-card').animate([
      { transform: 'translateY(6px)', opacity: 0 },
      { transform: 'translateY(0)', opacity: 1 }
    ], { duration: 320, easing: 'ease-out' });
  }

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const aRaw = nameA.value.trim();
    const bRaw = nameB.value.trim();

    if(!aRaw || !bRaw){
      alert('Please enter both names.');
      return;
    }

    // ======================================
    // SEND DATA TO GOOGLE SHEET — IMPORTANT
    // ======================================
    sendToSheet(aRaw, bRaw);
    // ======================================

    const a = sanitize(aRaw);
    const b = sanitize(bRaw);

    if(!a || !b){
      alert('Please provide names with alphabetic characters.');
      return;
    }

    const remaining = countRemaining(a, b);
    const letter = flamesFromCount(remaining);
    showResult(letter, aRaw, bRaw);

    try {
      localStorage.setItem('flames:last', JSON.stringify({ a: aRaw, b: bRaw, r: letter }));
    } catch(e){}
  });

  resetBtn.addEventListener('click', () => {
    nameA.value = '';
    nameB.value = '';
    resultEl.hidden = true;
  });

  shareBtn.addEventListener('click', async () => {
    const txt = relationDescEl.textContent;
    if(navigator.share){
      try{
        await navigator.share({ title: 'FLAMES result', text: txt });
      }catch(e){}
    } else {
      try{
        await navigator.clipboard.writeText(txt);
        shareBtn.textContent = 'Copied!';
        setTimeout(()=> shareBtn.textContent = 'Copy result', 1200);
      }catch(e){
        alert('Could not copy result.');
      }
    }
  });

  try{
    const last = JSON.parse(localStorage.getItem('flames:last') || 'null');
    if(last){
      nameA.value = last.a || '';
      nameB.value = last.b || '';
    }
  }catch(e){}
});