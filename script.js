const CATS = {
  clothing:    { label: 'Clothing',    icon: '👕' },
  toiletries:  { label: 'Toiletries',  icon: '🧴' },
  documents:   { label: 'Documents',   icon: '📄' },
  electronics: { label: 'Electronics', icon: '🔌' },
  health:      { label: 'Health',      icon: '💊' },
  misc:        { label: 'Misc',        icon: '🎒' },
};

const DEFAULTS = [
  { name: 'Sunscreen', cat: 'toiletries', packed: false },
  { name: 'Phone charger', cat: 'electronics', packed: false },
  { name: 'Passport / ID', cat: 'documents', packed: false },
  { name: 'Swimsuit', cat: 'clothing', packed: false },
  { name: 'Toothbrush & toothpaste', cat: 'toiletries', packed: false },
];

let items = JSON.parse(localStorage.getItem('packing-items') || 'null')
  || DEFAULTS.map((d, i) => ({ ...d, id: i + 1 }));

let nextId = Math.max(0, ...items.map(i => i.id)) + 1;
let currentFilter = 'all';

function save() {
  localStorage.setItem('packing-items', JSON.stringify(items));
}

function addItem() {
  const input = document.getElementById('item-input');
  const cat = document.getElementById('cat-select').value;
  const name = input.value.trim();
  if (!name) { input.focus(); return; }
  items.push({ id: nextId++, name, cat, packed: false });
  input.value = '';
  input.focus();
  save();
  render();
}

function toggleItem(id) {
  const item = items.find(i => i.id === id);
  if (item) { item.packed = !item.packed; save(); render(); }
}

function deleteItem(id) {
  items = items.filter(i => i.id !== id);
  save();
  render();
}

function setFilter(f, btn) {
  currentFilter = f;
  document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
  btn.classList.add('active');
  render();
}

function packAll()   { items.forEach(i => i.packed = true);  save(); render(); }
function unpackAll() { items.forEach(i => i.packed = false); save(); render(); }

function clearAll() {
  if (items.length === 0 || confirm('Clear the entire list?')) {
    items = [];
    save();
    render();
  }
}

function render() {
  const packed = items.filter(i => i.packed).length;
  const total  = items.length;
  const pct    = total === 0 ? 0 : Math.round(packed / total * 100);

  document.getElementById('progress-fill').style.width = pct + '%';
  document.getElementById('progress-label').textContent = packed + ' / ' + total;

  let visible = items;
  if (currentFilter === 'packed')   visible = items.filter(i => i.packed);
  if (currentFilter === 'unpacked') visible = items.filter(i => !i.packed);

  const container = document.getElementById('list-container');

  if (visible.length === 0) {
    container.innerHTML = `
      <div class="empty-state">
        <div class="empty-icon">🧳</div>
        ${currentFilter === 'packed'   ? "Nothing packed yet — start checking things off!" :
          currentFilter === 'unpacked' ? "Everything is packed. You're ready to go!" :
                                         "Add your first item above to get started."}
      </div>`;
    return;
  }

  const byCat = {};
  visible.forEach(item => {
    if (!byCat[item.cat]) byCat[item.cat] = [];
    byCat[item.cat].push(item);
  });

  let html = '';
  Object.keys(CATS).forEach(cat => {
    if (!byCat[cat]) return;
    const catItems = byCat[cat];
    const catInfo  = CATS[cat];
    const catPacked = catItems.filter(i => i.packed).length;

    html += `<div class="cat-group">
      <div class="cat-header">
        <span class="cat-icon">${catInfo.icon}</span>
        <span class="cat-name">${catInfo.label}</span>
        <span class="cat-count">${catPacked}/${catItems.length}</span>
      </div>`;

    catItems.forEach(item => {
      html += `
        <div class="item-card${item.packed ? ' packed' : ''}" onclick="toggleItem(${item.id})">
          <div class="check-circle">
            <svg class="checkmark" viewBox="0 0 10 7" fill="none">
              <path d="M1 3L4 6L9 1" stroke="white" stroke-width="1.8"
                stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
          </div>
          <span class="item-name">${item.name}</span>
          <button class="delete-btn"
            onclick="event.stopPropagation(); deleteItem(${item.id})"
            title="Remove">✕</button>
        </div>`;
    });

    html += '</div>';
  });

  container.innerHTML = html;
}

document.getElementById('item-input').addEventListener('keydown', e => {
  if (e.key === 'Enter') addItem();
});

render();