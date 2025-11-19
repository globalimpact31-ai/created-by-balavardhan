// FLAMES logic and UI interactions for the static HTML version.
// Usage: include <script src="script.js"></script> in your index.html (before </body>).
(function () {
  'use strict';

  const LETTERS = ['F', 'L', 'A', 'M', 'E', 'S'];

  const icons = {
    F: `<svg viewBox="0 0 24 24" width="56" height="56" fill="none" aria-hidden><path d="M3 12s4-5 9-5 9 5 9 5-4 5-9 5S3 12 3 12z" fill="#FDE68A"/><path d="M7 12c0 1.657 2 3 5 3s5-1.343 5-3" stroke="#92400E" stroke-width="1.2" stroke-linecap="round" stroke-linejoin="round"/><path d="M8.5 9.2c.8-.8 2.4-.8 3.2 0" stroke="#92400E" stroke-width="1.2" stroke-linecap="round" stroke-linejoin="round"/></svg>`,
    L: `<svg viewBox="0 0 24 24" width="56" height="56" fill="none" aria-hidden><path d="M12 21s-7-4.8-9-8.4C1 8.2 6 4 9.6 6.2 11 7.1 12 8.4 12 8.4s1-1.3 2.4-2.2C18 4 23 8.2 21 12.6 19 16.2 12 21 12 21z" fill="#FCA5A5"/><path d="M12 21s-7-4.8-9-8.4C1 8.2 6 4 9.6 6.2 11 7.1 12 8.4 12 8.4" stroke="#9B1C1C" stroke-width="1.2" stroke-linecap="round" stroke-linejoin="round"/></svg>`,
    A: `<svg viewBox="0 0 24 24" width="56" height="56" fill="none" aria-hidden><circle cx="12" cy="10" r="3" fill="#C7F9CC"/><path d="M5 20c2-3 6-4 7-4s5 1 7 4" stroke="#166534" stroke-width="1.2" stroke-linecap="round" stroke-linejoin="round"/></svg>`,
    M: `<svg viewBox="0 0 24 24" width="56" height="56" fill="none" aria-hidden><circle cx="8" cy="10" r="2" fill="#E6E6FA"/><circle cx="16" cy="10" r="2" fill="#E6E6FA"/><path d="M3 20c2-3 6-4 9-4s7 1 9 4" stroke="#6D28D9" stroke-width="1.2" stroke-linecap="round" stroke-linejoin="round"/><path d="M7 8c2-2 6-2 10 0" stroke="#6D28D9" stroke-width="1.2" stroke-linecap="round" stroke-linejoin="round"/></svg>`,
    E: `<svg viewBox="0 0 24 24" width="56" height="56" fill="none" aria-hidden><path d="M12 3l9 18H3L12 3z" fill="#FEE2E2"/><path d="M12 9v4" stroke="#B91C1C" stroke-width="1.2" stroke-linecap="round"/><path d="M12 15v.01" stroke="#B91C1C" stroke-width="1.2" stroke-linecap="round"/></svg>`,
    S: `<svg viewBox="0 0 24 24" width="56" height="56" fill="none" aria-hidden><path d="M6 8c1-2 4-3 6-3s5 1 6 3" stroke="#0EA5A4" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round" /><path d="M8 21v-6a4 4 0 014-4h0a4 4 0 014 4v6" stroke="#065F46" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round" /></svg>`
  };

  // Wait for DOM ready
  document.addEventListener('DOMContentLoaded', () => {
    const nameA = document.getElementById('nameA');
    const nameB = document.getElementById('nameB');
    const lettersEl = document.getElementById('letters');
    const finalEl = document.getElementById('final');
    const runBtn = document.getElementById('runBtn');
    const runBtnAlt = document.getElementById('runBtnAlt');
    const resetBtn = document.getElementById('resetBtn');

    if (!nameA || !nameB || !lettersEl || !finalEl || !runBtn || !resetBtn) {
      // Missing expected DOM nodes; nothing to do.
      return;
    }

    function sanitize(s) {
      return (s || '').toLowerCase().replace(/[^a-z]/g, '');
    }

    function countRemaining(a, b) {
      const sa = sanitize(a).split('');
      const sb = sanitize(b).split('');
      for (let i = 0; i < sa.length; i++) {
        const ch = sa[i];
        const idx = sb.indexOf(ch);
        if (idx !== -1) {
          sa[i] = '';
          sb[idx] = '';
        }
      }
      return sa.concat(sb).filter(Boolean).length;
    }

    function renderLetters(arr, highlightRemoved) {
      lettersEl.innerHTML = '';
      arr.forEach(letter => {
        const d = document.createElement('div');
        d.className = 'letter';
        if (highlightRemoved === letter) d.classList.add('removed');
        d.setAttribute('data-letter', letter);
        d.innerHTML = `<div class="letter-inner">${letter}</div>`;
        lettersEl.appendChild(d);
      });
    }

    function showFinal(letter) {
      finalEl.innerHTML = '';
      const block = document.createElement('div');
      block.className = 'final-card';
      const title = {
        F: 'Friendship',
        L: 'Love',
        A: 'Affection',
        M: 'Marriage',
        E: 'Enemy',
        S: 'Sibling'
      }[letter] || '—';
      block.innerHTML = `
        <div class="final-icon">${icons[letter] || ''}</div>
        <div class="final-meta">
          <div class="final-title">${title}</div>
          <div class="final-sub">Letter: <strong>${letter}</strong></div>
        </div>
      `;
      finalEl.appendChild(block);
    }

    function disableControls(disabled) {
      runBtn.disabled = disabled;
      if (runBtnAlt) runBtnAlt.disabled = disabled;
      resetBtn.disabled = disabled;
      if (disabled) {
        runBtn.setAttribute('aria-busy', 'true');
        if (runBtnAlt) runBtnAlt.setAttribute('aria-busy', 'true');
      } else {
        runBtn.removeAttribute('aria-busy');
        if (runBtnAlt) runBtnAlt.removeAttribute('aria-busy');
      }
    }

    function computeAndAnimate() {
      const aVal = (nameA.value || '').trim();
      const bVal = (nameB.value || '').trim();
      if (!aVal || !bVal) {
        // Basic UX: focus first empty input
        if (!aVal) nameA.focus();
        else nameB.focus();
        return;
      }

      disableControls(true);
      finalEl.innerHTML = '';

      const count = countRemaining(aVal, bVal);

      // Special case: identical or zero remaining -> treat as 'S'
      if (count === 0) {
        renderLetters(LETTERS);
        setTimeout(() => {
          renderLetters(['S']);
          showFinal('S');
          disableControls(false);
        }, 600);
        return;
      }

      let arr = [...LETTERS];
      const steps = [{ remaining: [...arr], removed: undefined }];

      while (arr.length > 1) {
        const removeIndex = (count - 1) % arr.length;
        const removed = arr.splice(removeIndex, 1)[0];
        steps.push({ remaining: [...arr], removed });
        // rotate so counting starts from next index (classic approach)
        arr = [...arr.slice(removeIndex), ...arr.slice(0, removeIndex)];
      }

      // animate the steps
      let idx = 0;
      renderLetters(steps[0].remaining);

      const tickMs = 640;
      const fadeDelay = 320;
      const interval = setInterval(() => {
        idx++;
        if (idx >= steps.length) {
          clearInterval(interval);
          // final letter
          const finalLetter = steps[steps.length - 1].remaining[0] || LETTERS[0];
          renderLetters([finalLetter]);
          showFinal(finalLetter);
          disableControls(false);
          return;
        }

        const s = steps[idx];
        // show the removed highlight briefly by rendering previous set plus removed
        renderLetters([...(s.remaining || []), s.removed].filter(Boolean), s.removed);

        setTimeout(() => {
          renderLetters(s.remaining || []);
        }, fadeDelay);
      }, tickMs);
    }

    // initial render
    renderLetters(LETTERS);

    // Attach events
    runBtn.addEventListener('click', computeAndAnimate);
    if (runBtnAlt) runBtnAlt.addEventListener('click', computeAndAnimate);

    resetBtn.addEventListener('click', () => {
      nameA.value = '';
      nameB.value = '';
      finalEl.innerHTML = '';
      renderLetters(LETTERS);
      nameA.focus();
    });

    // Enter triggers run
    [nameA, nameB].forEach(el => {
      el.addEventListener('keydown', (ev) => {
        if (ev.key === 'Enter') {
          ev.preventDefault();
          computeAndAnimate();
        }
      });
    });
  });
})();