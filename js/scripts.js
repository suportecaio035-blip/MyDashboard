const fileInput = document.getElementById('fileInput');
const searchInput = document.getElementById('texto');
const container = document.getElementById('container_password');
const STORAGE_KEY = 'senhas_json_data';
let dadosCarregados = [];

function salvarDados(data) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
}

function carregarDadosSalvos() {
  const salvo = localStorage.getItem(STORAGE_KEY);
  if (!salvo) return [];

  try {
    return JSON.parse(salvo);
  } catch (err) {
    console.error('Erro ao carregar dados salvos:', err);
    return [];
  }
}

fileInput.addEventListener('change', async (event) => {
  const file = event.target.files[0];
  if (!file) return;

  try {
    const text = await file.text();
    const data = JSON.parse(text);
    dadosCarregados = Array.isArray(data) ? data : [];
    salvarDados(dadosCarregados);
    criarCards(dadosCarregados);
  } catch (err) {
    alert('Erro ao ler o arquivo JSON: ' + err.message);
  }
});

searchInput.addEventListener('input', () => {
  const termo = searchInput.value.trim().toLowerCase();
  const filtrados = dadosCarregados.filter((item) => {
    const siteName = (item.site || item.service || '').toLowerCase();
    return siteName.includes(termo);
  });

  criarCards(filtrados);
});

function restaurarDados() {
  dadosCarregados = carregarDadosSalvos();
  if (dadosCarregados.length > 0) {
    criarCards(dadosCarregados);
  }
}

restaurarDados();

function criarCards(data) {
  container.innerHTML = '';

  if (!Array.isArray(data) || data.length === 0) {
    const p = document.createElement('p');
    p.textContent = data && data.length === 0 ? 'Nenhum resultado encontrado.' : 'Formato inválido: o JSON deve ser um array de objetos.';
    container.appendChild(p);
    return;
  }

  const counts = {};
  data.forEach((item) => {
    const siteName = item.site || item.service || '';
    counts[siteName] = (counts[siteName] || 0) + 1;
  });

  data.forEach((item, index) => {
    const card = document.createElement('div');
    card.className = 'card';

    const siteName = item.site || item.service || '';
    if (counts[siteName] > 1) {
      card.style.boxShadow = '0 0 12px rgba(0, 255, 100, 0.7)';
    }

    const site = document.createElement('div');
    site.className = 'site';
    site.textContent = item.site || item.service || `Conta ${index + 1}`;

    const labelUser = document.createElement('div');
    labelUser.textContent = 'Usuário:';

    const valueUser = document.createElement('div');
    valueUser.className = 'value';
    valueUser.textContent = item.usuario || item.user || '';

    const labelPass = document.createElement('div');
    labelPass.textContent = 'Senha:';

    const valuePass = document.createElement('div');
    valuePass.className = 'value';
    valuePass.textContent = item.senha || item.password || '';

    const actions = document.createElement('div');
    actions.className = 'actions';

    const copyUserBtn = document.createElement('button');
    copyUserBtn.className = 'btn-user'
    copyUserBtn.textContent = 'Copiar usuário';
    copyUserBtn.addEventListener('click', async () => {
      try {
        await navigator.clipboard.writeText(valueUser.textContent);
        copyUserBtn.textContent = 'Copiado!';
        setTimeout(() => copyUserBtn.textContent = 'Copiar usuário', 1200);
      } catch (err) {
        alert('Erro ao copiar: ' + err.message);
      }
    });

    const copyPassBtn = document.createElement('button');
    copyPassBtn.className = 'btn-pass';
    copyPassBtn.textContent = 'Copiar senha';
    copyPassBtn.addEventListener('click', async () => {
      try {
        await navigator.clipboard.writeText(valuePass.textContent);
        copyPassBtn.textContent = 'Copiado!';
        setTimeout(() => copyPassBtn.textContent = 'Copiar senha', 1200);
      } catch (err) {
        alert('Erro ao copiar: ' + err.message);
      }
    });

    actions.appendChild(copyUserBtn);
    actions.appendChild(copyPassBtn);

    card.appendChild(site);
    card.appendChild(labelUser);
    card.appendChild(valueUser);
    card.appendChild(labelPass);
    card.appendChild(valuePass);
    card.appendChild(actions);

    container.appendChild(card);
  });
}
