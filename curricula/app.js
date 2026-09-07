// Variable global para almacenar los datos del JSON
let cvData = {};
let currentLang = 'es';
let editMode = false;
let editingJobIndex = null;
let pendingLinkRange = null;
let storedLinkSelectionRange = null;
let activeLinkAnchor = null;
let activeEditorId = 'about-input-text';
let editingTechnologies = [];
let editingModality = [];
let editingSidebarField = null;

// Inicialización al cargar la página
document.addEventListener('DOMContentLoaded', () => {
  const jsonScript = document.getElementById('cv-data');
  if (jsonScript) {
    try {
      cvData = JSON.parse(jsonScript.textContent);
      renderTechnologies();
      renderModality();
      renderProfile();
      setupProfileIconType();
      renderContact();
      setupContactIconType();
    } catch (e) {
      console.error('Error al parsear el JSON cv-data:', e);
    }
  }
});

// --- Gestión de Idiomas ---
function switchLanguage(lang) {
  currentLang = lang;
  document.documentElement.lang = lang;
  
  if (!cvData[lang]) return;

  const data = cvData[lang];

  renderProfile();
  renderContact();

  // Actualizar Header
  if (data.header) {
    const roleEl = document.querySelector('.cv-header__role');
    const subtitleEl = document.querySelector('.cv-header__subtitle');
    const stackEl = document.querySelector('.cv-header__stack');
    const dateEl = document.querySelector('.cv-header__date');

    if (roleEl) roleEl.textContent = data.header.role;
    if (subtitleEl) subtitleEl.textContent = data.header.subtitle;
    if (stackEl) stackEl.textContent = data.header.stack;
    if (dateEl) dateEl.textContent = data.header.date;
  }

  // Actualizar Títulos de Secciones
  if (data.sections) {
    const aboutTitle = document.getElementById('about-title');
    const experienceTitle = document.getElementById('experience-title');
    const objectiveTitle = document.getElementById('objective-title');
    const techTitle = document.getElementById('tech-title-text');
    const modalityTitle = document.getElementById('modality-title-text');
    const availabilityTitle = document.getElementById('availability-title-text');
    const educationTitle = document.getElementById('education-title-text');
    const languagesTitle = document.getElementById('languages-title-text');
    if (aboutTitle) aboutTitle.textContent = data.sections.about_title;
    if (experienceTitle) experienceTitle.textContent = data.sections.experience_title;
    if (objectiveTitle) objectiveTitle.textContent = data.sections.objective_title;
    if (techTitle) techTitle.textContent = data.sections.tech_title;
    if (modalityTitle) modalityTitle.textContent = data.sections.modality_title;
    if (availabilityTitle) availabilityTitle.textContent = data.sections.availability_title;
    if (educationTitle) educationTitle.textContent = data.sections.education_title;
    if (languagesTitle) languagesTitle.textContent = data.sections.languages_title;
  }

  // Actualizar Sobre Mí
  if (data.about_text) {
    const aboutText = document.getElementById('about-text');
    if (aboutText) aboutText.innerHTML = data.about_text;
  }

  // Actualizar Objetivo
  if (data.objective_text) {
    const objText = document.getElementById('objective-text');
    if (objText) objText.innerHTML = data.objective_text;
  }

  // Actualizar Sidebar
  if (data.sidebar) {
    const availEl = document.getElementById('sidebar-availability');
    const eduEl = document.getElementById('sidebar-education');
    const langEl = document.getElementById('sidebar-languages');

    if (availEl) availEl.innerHTML = normalizeRichTextHTML(data.sidebar.availability || '');
    if (eduEl && data.sidebar.education) {
      eduEl.innerHTML = Array.isArray(data.sidebar.education)
        ? data.sidebar.education.map(value => `<p>${value}</p>`).join('')
        : normalizeRichTextHTML(data.sidebar.education);
    }
    if (langEl) langEl.innerHTML = normalizeRichTextHTML(data.sidebar.languages || '');
  }

  renderTechnologies();
  renderModality();

  // Renderizar Trabajos
  renderJobs();
}

// ==========================================
// UTILIDADES DE AUTENTICACIÓN Y SEGURIDAD
// ==========================================

// 1. Motor matemático SHA-256
async function calcularSHA256(texto) {
  const msgBuffer = new TextEncoder().encode(texto);
  const hashBuffer = await crypto.subtle.digest('SHA-256', msgBuffer);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
}

// 2. Control del Modal de Contraseña con Ojo (Opción B)
let passResolve = null;

function openAuthModal() {
  const dialog = document.getElementById('auth-modal');
  const input = document.getElementById('auth-pass');
  const eyeBtn = document.getElementById('btn-toggle-show-pass');
  const eyeIcon = document.getElementById('eye-icon');

  // Resetear el campo y el icono al estado por defecto cada vez que se abre
  input.value = '';
  input.type = 'password';
  if (eyeIcon) eyeIcon.textContent = 'visibility';

  if (eyeBtn && !eyeBtn.dataset.listenerAdded) {
    eyeBtn.addEventListener('click', () => {
      const isPassword = input.type === 'password';
      
      // Alternar tipo de input
      input.type = isPassword ? 'text' : 'password';
      
      // Alternar el icono de Material Symbols
      if (eyeIcon) {
        eyeIcon.textContent = isPassword ? 'visibility_off' : 'visibility';
      }
    });
    
    eyeBtn.dataset.listenerAdded = 'true';
  }

  dialog.showModal();
  input.focus();

  return new Promise((resolve) => {
    passResolve = resolve;
  });
}

function closeAuthModal() {
  document.getElementById('auth-modal').close();
  if (passResolve) {
    passResolve(null); // Cancelado o cerrado sin enviar
    passResolve = null;
  }
}

function confirmPassword(event) {
  event.preventDefault();
  const val = document.getElementById('auth-pass').value;
  document.getElementById('auth-modal').close();
  
  if (passResolve) {
    passResolve(val); // Devolvemos el texto de la contraseña
    passResolve = null;
  }
}

async function toggleEditMode() {
  const HASH_GUARDADO = "9da630899ba2c8ef5e29234245006b42379acc62b218510989a26c51d367edc3";

  if (!editMode && sessionStorage.getItem('edit_granted') !== 'true') {
    // Abrimos tu modal exactamente igual que el de Header
    const pass = await openAuthModal();

    if (pass !== null) {
      const hashIngresado = await calcularSHA256(pass);
      if (hashIngresado === HASH_GUARDADO) {
        sessionStorage.setItem('edit_granted', 'true');
      } else {
        alert("Contraseña incorrecta.");
        return;
      }
    } else {
      return; // Le dio a Cancelar o pulsa ESC
    }
  }

  // --- Tu código original intacto ---
  editMode = !editMode;
  document.body.classList.toggle('is-editing', editMode);

  const btn = document.getElementById('btn-toggle-edit');
  if (btn) {
    btn.classList.toggle('active', editMode);
  }
}

// --- Zoom ---
let currentZoom = 1;
function adjustZoom(delta) {
  currentZoom = Math.min(Math.max(0.7, currentZoom + delta * 0.1), 1.3);
  document.documentElement.style.fontSize = `${13.5 * currentZoom}px`;
}

function openHeaderModal() {
  const header = cvData[currentLang] && cvData[currentLang].header;
  if (!header) return;

  document.getElementById('header-role').value = header.role || '';
  document.getElementById('header-subtitle').value = header.subtitle || '';
  document.getElementById('header-stack').value = header.stack || '';
  document.getElementById('header-date').value = header.date || '';
  document.getElementById('header-modal').showModal();
  document.getElementById('header-role').focus();
}

function closeHeaderModal() {
  document.getElementById('header-modal').close();
}

function saveHeader(event) {
  event.preventDefault();

  if (!cvData[currentLang]) return;
  if (!cvData[currentLang].header) cvData[currentLang].header = {};

  const updatedHeader = {
    role: document.getElementById('header-role').value.trim(),
    subtitle: document.getElementById('header-subtitle').value.trim(),
    stack: document.getElementById('header-stack').value.trim(),
    date: document.getElementById('header-date').value.trim()
  };

  cvData[currentLang].header = updatedHeader;
  const roleEl = document.querySelector('.cv-header__role');
  const subtitleEl = document.querySelector('.cv-header__subtitle');
  const stackEl = document.querySelector('.cv-header__stack');
  const dateEl = document.querySelector('.cv-header__date');

  if (roleEl) roleEl.textContent = updatedHeader.role;
  if (subtitleEl) subtitleEl.textContent = updatedHeader.subtitle;
  if (stackEl) stackEl.textContent = updatedHeader.stack;
  if (dateEl) dateEl.textContent = updatedHeader.date;

  closeHeaderModal();
}

// --- Gestión de Trabajos (Experiencia) ---
function renderJobs() {
  const container = document.getElementById('jobs-container');
  if (!container || !cvData[currentLang] || !cvData[currentLang].jobs) return;

  const jobs = cvData[currentLang].jobs;
  container.innerHTML = jobs.map((job, index) => `
    <article class="cv-job">
      <div class="cv-job__actions edit-only">
        <button type="button" class="btn-job-action" onclick="openJobModal(${index})" title="Editar Puesto">
          <span class="material-symbols-outlined">edit</span>
        </button>
        <button type="button" class="btn-job-action btn-job-delete" onclick="deleteJob(${index})" title="Eliminar Puesto">
          <span class="material-symbols-outlined">delete</span>
        </button>
      </div>
      <div class="cv-job__role">${job.role}</div>
      ${job.tech ? `<div class="cv-job__tech">${job.tech}</div>` : ''}
      <div class="cv-job__company">${job.company}</div>
      <div class="cv-job__period">${job.period}</div>
      <p class="cv-job__desc">${job.desc}</p>
    </article>
  `).join('');
}

function openJobModal(index = null) {
  editingJobIndex = index;
  const modal = document.getElementById('job-modal');
  const modalTitle = document.getElementById('modal-title');
  const form = document.getElementById('job-form');

  if (index !== null) {
    modalTitle.textContent = 'Editar Experiencia';
    const job = cvData[currentLang].jobs[index];
    document.getElementById('job-role').value = job.role || '';
    document.getElementById('job-tech').value = job.tech || '';
    document.getElementById('job-company').value = job.company || '';
    document.getElementById('job-period').value = job.period || '';
    document.getElementById('job-desc').value = job.desc || '';
  } else {
    modalTitle.textContent = 'Añadir Experiencia';
    form.reset();
  }

  modal.showModal();
}

function closeJobModal() {
  document.getElementById('job-modal').close();
  editingJobIndex = null;
}

function saveJob(event) {
  event.preventDefault();

  const newJob = {
    role: document.getElementById('job-role').value,
    tech: document.getElementById('job-tech').value,
    company: document.getElementById('job-company').value,
    period: document.getElementById('job-period').value,
    desc: document.getElementById('job-desc').value
  };

  if (!cvData[currentLang].jobs) {
    cvData[currentLang].jobs = [];
  }

  if (editingJobIndex !== null) {
    cvData[currentLang].jobs[editingJobIndex] = newJob;
  } else {
    cvData[currentLang].jobs.unshift(newJob);
  }

  renderJobs();
  closeJobModal();
}

function deleteJob(index) {
  if (confirm('¿Estás seguro de que deseas eliminar este puesto?')) {
    cvData[currentLang].jobs.splice(index, 1);
    renderJobs();
  }
}

function getSortedTechnologies(technologies) {
  return [...technologies].sort((first, second) => first.localeCompare(second, undefined, { sensitivity: 'base' }));
}

function escapeHTML(value) {
  return String(value)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

function renderTechnologies() {
  const container = document.getElementById('technologies-container');
  const technologies = cvData[currentLang] && cvData[currentLang].sidebar
    ? cvData[currentLang].sidebar.technologies || []
    : [];

  if (!container) return;

  container.innerHTML = getSortedTechnologies(technologies)
    .map(technology => `<span class="cv-tag">${escapeHTML(technology)}</span>`)
    .join('');
}

function renderTechnologyEditor() {
  const list = document.getElementById('technology-editor-list');
  if (!list) return;

  list.innerHTML = editingTechnologies.map((technology, index) => `
    <div class="technology-editor-item">
      <span>${escapeHTML(technology)}</span>
      <button type="button" class="btn-tag-delete" onclick="removeTechnology(${index})" title="Eliminar tag">
        <span class="material-symbols-outlined">delete</span>
      </button>
    </div>
  `).join('');
}

function openTechnologiesModal() {
  const technologies = cvData[currentLang] && cvData[currentLang].sidebar
    ? cvData[currentLang].sidebar.technologies || []
    : [];

  editingTechnologies = [...technologies];
  document.getElementById('new-technology').value = '';
  renderTechnologyEditor();
  document.getElementById('technologies-modal').showModal();
  document.getElementById('new-technology').focus();
}

function closeTechnologiesModal() {
  document.getElementById('technologies-modal').close();
  editingTechnologies = [];
}

function removeTechnology(index) {
  editingTechnologies.splice(index, 1);
  renderTechnologyEditor();
}

function addTechnology() {
  const input = document.getElementById('new-technology');
  const technology = input.value.trim();

  if (!technology) return;

  editingTechnologies.push(technology);
  input.value = '';
  renderTechnologyEditor();
  input.focus();
}

function saveTechnologies(event) {
  event.preventDefault();

  if (cvData[currentLang]) {
    if (!cvData[currentLang].sidebar) cvData[currentLang].sidebar = {};
    cvData[currentLang].sidebar.technologies = getSortedTechnologies(editingTechnologies);
  }

  renderTechnologies();
  closeTechnologiesModal();
}

function renderModality() {
  const container = document.getElementById('modality-container');
  const modality = cvData[currentLang] && cvData[currentLang].sidebar
    ? cvData[currentLang].sidebar.modality || []
    : [];

  if (!container) return;

  container.innerHTML = getSortedTechnologies(modality)
    .map(value => `<span class="cv-tag">${escapeHTML(value)}</span>`)
    .join('');
}

function renderModalityEditor() {
  const list = document.getElementById('modality-editor-list');
  if (!list) return;

  list.innerHTML = editingModality.map((value, index) => `
    <div class="technology-editor-item">
      <span>${escapeHTML(value)}</span>
      <button type="button" class="btn-tag-delete" onclick="removeModality(${index})" title="Eliminar tag">
        <span class="material-symbols-outlined">delete</span>
      </button>
    </div>
  `).join('');
}

function openModalityModal() {
  const modality = cvData[currentLang] && cvData[currentLang].sidebar
    ? cvData[currentLang].sidebar.modality || []
    : [];

  editingModality = [...modality];
  document.getElementById('new-modality').value = '';
  renderModalityEditor();
  document.getElementById('modality-modal').showModal();
  document.getElementById('new-modality').focus();
}

function closeModalityModal() {
  document.getElementById('modality-modal').close();
  editingModality = [];
}

function removeModality(index) {
  editingModality.splice(index, 1);
  renderModalityEditor();
}

function addModality() {
  const input = document.getElementById('new-modality');
  const value = input.value.trim();

  if (!value) return;

  editingModality.push(value);
  input.value = '';
  renderModalityEditor();
  input.focus();
}

function saveModality(event) {
  event.preventDefault();

  if (cvData[currentLang]) {
    if (!cvData[currentLang].sidebar) cvData[currentLang].sidebar = {};
    cvData[currentLang].sidebar.modality = getSortedTechnologies(editingModality);
  }

  renderModality();
  closeModalityModal();
}

const sidebarContentConfig = {
  availability: {
    title: 'Disponibilidad',
    elementId: 'sidebar-availability',
    dataKey: 'availability'
  },
  education: {
    title: 'Formación',
    elementId: 'sidebar-education',
    dataKey: 'education'
  },
  languages: {
    title: 'Idiomas',
    elementId: 'sidebar-languages',
    dataKey: 'languages'
  }
};

function getSidebarContent(field) {
  const config = sidebarContentConfig[field];
  const sidebar = cvData[currentLang] && cvData[currentLang].sidebar;
  const value = sidebar && sidebar[config.dataKey];

  if (Array.isArray(value)) return value.map(item => `<p>${item}</p>`).join('');
  return value ? normalizeRichTextHTML(value) : document.getElementById(config.elementId).innerHTML;
}

function normalizeRichTextHTML(value) {
  const template = document.createElement('template');
  template.innerHTML = value;
  const normalized = document.createElement('div');
  let paragraph = null;

  const appendToParagraph = node => {
    if (!paragraph) {
      paragraph = document.createElement('p');
      normalized.appendChild(paragraph);
    }
    paragraph.appendChild(node);
  };

  Array.from(template.content.childNodes).forEach(node => {
    if (node.nodeType === Node.TEXT_NODE && !node.textContent.trim()) return;

    if (node.nodeType === Node.ELEMENT_NODE && ['P', 'DIV'].includes(node.tagName)) {
      paragraph = document.createElement('p');
      paragraph.innerHTML = node.innerHTML;
      normalized.appendChild(paragraph);
      return;
    }

    if (node.nodeType === Node.ELEMENT_NODE && node.tagName === 'SPAN') {
      paragraph = document.createElement('p');
      paragraph.innerHTML = node.innerHTML;
      normalized.appendChild(paragraph);
      return;
    }

    appendToParagraph(node.cloneNode(true));
  });

  normalized.querySelectorAll('span').forEach(span => {
    span.replaceWith(...Array.from(span.childNodes));
  });

  return normalized.innerHTML;
}

function openSidebarContentModal(field) {
  const config = sidebarContentConfig[field];
  if (!config) return;

  editingSidebarField = field;
  activeEditorId = 'sidebar-input-text';
  document.getElementById('sidebar-content-modal-title').textContent = `Editar "${config.title}"`;
  document.getElementById('sidebar-input-text').innerHTML = getSidebarContent(field);
  document.getElementById('sidebar-content-modal').showModal();
}

function closeSidebarContentModal() {
  document.getElementById('sidebar-content-modal').close();
  editingSidebarField = null;
}

function saveSidebarContent(event) {
  event.preventDefault();

  const config = sidebarContentConfig[editingSidebarField];
  if (!config || !cvData[currentLang]) return;

  let rawHTML = document.getElementById('sidebar-input-text').innerHTML;
  rawHTML = rawHTML.replace(/<b\b([^>]*)>/gi, '<strong$1>');
  rawHTML = rawHTML.replace(/<\/b>/gi, '</strong>');
  rawHTML = normalizeRichTextHTML(rawHTML);

  if (!cvData[currentLang].sidebar) cvData[currentLang].sidebar = {};
  cvData[currentLang].sidebar[config.dataKey] = rawHTML;

  const contentElement = document.getElementById(config.elementId);
  if (contentElement) contentElement.innerHTML = rawHTML;

  closeSidebarContentModal();
}

// --- Gestión Modal "Sobre mí" ---
function openAboutModal() {
  const modal = document.getElementById('about-modal');
  const editableArea = document.getElementById('about-input-text');
  activeEditorId = 'about-input-text';

  const currentHTML = (cvData[currentLang] && cvData[currentLang].about_text)
    ? cvData[currentLang].about_text 
    : document.getElementById('about-text').innerHTML;

  editableArea.innerHTML = currentHTML;
  modal.showModal();
}

function closeAboutModal() {
  document.getElementById('about-modal').close();
}

function saveAbout(event) {
  event.preventDefault();

  // 1. Capturar el HTML enriquecido del div editable
  let rawHTML = document.getElementById('about-input-text').innerHTML;

  // 2. Limpieza semántica automática: transformar cualquier <b> en <strong> (accesibilidad WCAG)
  rawHTML = rawHTML.replace(/<b\b([^>]*)>/gi, '<strong$1>');
  rawHTML = rawHTML.replace(/<\/b>/gi, '</strong>');
  rawHTML = normalizeRichTextHTML(rawHTML);

  // Actualizar la vista DOM principal
  const aboutTextEl = document.getElementById('about-text');
  if (aboutTextEl) {
    aboutTextEl.innerHTML = rawHTML;
  }

  // Actualizar el estado global del JSON con el formato semántico limpio
  if (cvData[currentLang]) {
    cvData[currentLang].about_text = rawHTML;
  }

  closeAboutModal();
}

// --- Gestión Modal "Objetivo" ---
function openObjectiveModal() {
  const modal = document.getElementById('objective-modal');
  const editableArea = document.getElementById('objective-input-text');
  activeEditorId = 'objective-input-text';
  const currentHTML = (cvData[currentLang] && cvData[currentLang].objective_text)
    ? cvData[currentLang].objective_text
    : document.getElementById('objective-text').innerHTML;

  editableArea.innerHTML = currentHTML;
  modal.showModal();
}

function closeObjectiveModal() {
  document.getElementById('objective-modal').close();
}

function saveObjective(event) {
  event.preventDefault();

  let rawHTML = document.getElementById('objective-input-text').innerHTML;
  rawHTML = rawHTML.replace(/<b\b([^>]*)>/gi, '<strong$1>');
  rawHTML = rawHTML.replace(/<\/b>/gi, '</strong>');
  rawHTML = normalizeRichTextHTML(rawHTML);

  const objectiveTextEl = document.getElementById('objective-text');
  if (objectiveTextEl) {
    objectiveTextEl.innerHTML = rawHTML;
  }

  if (cvData[currentLang]) {
    cvData[currentLang].objective_text = rawHTML;
  }

  closeObjectiveModal();
}

function getSelectedAnchor() {
  const editor = document.getElementById(activeEditorId);
  const selection = window.getSelection();

  if (!selection || selection.rangeCount === 0 || !editor) {
    return null;
  }

  const range = selection.getRangeAt(0);
  const container = range.commonAncestorContainer;
  const ancestor = container.nodeType === Node.ELEMENT_NODE ? container : container.parentElement;

  if (!ancestor || !editor.contains(ancestor)) {
    return null;
  }

  return ancestor.closest('a');
}

function captureLinkSelection() {
  const editor = document.getElementById(activeEditorId);
  const selection = window.getSelection();

  if (!selection || selection.rangeCount === 0 || !editor) {
    storedLinkSelectionRange = null;
    activeLinkAnchor = null;
    return;
  }

  const range = selection.getRangeAt(0);
  storedLinkSelectionRange = editor.contains(range.commonAncestorContainer)
    ? range.cloneRange()
    : null;

  activeLinkAnchor = getSelectedAnchor();
}

function openLinkModal() {
  const editor = document.getElementById(activeEditorId);
  const selection = window.getSelection();
  const linkTextInput = document.getElementById('link-text');
  const linkUrlInput = document.getElementById('link-url');
  const linkNewTab = document.getElementById('link-new-tab');
  const unlinkBtn = document.getElementById('btn-unlink');
  const title = document.getElementById('link-modal-title');
  const modal = document.getElementById('link-modal');

  const existingAnchor = getSelectedAnchor() || activeLinkAnchor;
  const isEditingExistingLink = !!existingAnchor;

  pendingLinkRange = null;
  linkTextInput.value = '';
  linkUrlInput.value = '';
  linkNewTab.checked = true;
  unlinkBtn.style.display = isEditingExistingLink ? 'inline-flex' : 'none';
  title.textContent = isEditingExistingLink ? 'Editar enlace' : 'Insertar enlace';

  if (isEditingExistingLink) {
    activeLinkAnchor = existingAnchor;
    linkTextInput.value = existingAnchor.textContent.trim();
    linkUrlInput.value = existingAnchor.getAttribute('href') || '';
    linkNewTab.checked = existingAnchor.getAttribute('target') === '_blank';
  } else {
    activeLinkAnchor = null;
    const rangeToUse = storedLinkSelectionRange && editor && editor.contains(storedLinkSelectionRange.commonAncestorContainer)
      ? storedLinkSelectionRange
      : (selection && selection.rangeCount > 0 && editor && editor.contains(selection.anchorNode)
        ? selection.getRangeAt(0).cloneRange()
        : null);

    if (!rangeToUse) {
      alert('Primero selecciona el texto dentro del editor para crear el enlace.');
      return;
    }

    const selectedText = rangeToUse.toString().trim();
    if (!selectedText) {
      alert('Primero selecciona el texto dentro del editor para crear el enlace.');
      return;
    }

    pendingLinkRange = rangeToUse.cloneRange();
    linkTextInput.value = selectedText;
    linkUrlInput.value = 'https://www.';
  }

  modal.showModal();
  linkUrlInput.focus();
}

function closeLinkModal() {
  const modal = document.getElementById('link-modal');
  if (modal) {
    modal.close();
  }
  pendingLinkRange = null;
  storedLinkSelectionRange = null;
  activeLinkAnchor = null;
}

function removeLink() {
  const anchor = activeLinkAnchor || getSelectedAnchor();
  if (!anchor || !anchor.parentNode) {
    closeLinkModal();
    return;
  }

  const parent = anchor.parentNode;
  const textNode = document.createTextNode(anchor.textContent);
  parent.replaceChild(textNode, anchor);

  const selection = window.getSelection();
  if (selection) {
    const range = document.createRange();
    range.setStart(textNode, 0);
    range.setEnd(textNode, textNode.textContent.length);
    selection.removeAllRanges();
    selection.addRange(range);
  }

  closeLinkModal();
}

function saveLink(event) {
  event.preventDefault();

  const editor = document.getElementById(activeEditorId);
  const linkTextInput = document.getElementById('link-text');
  const linkUrlInput = document.getElementById('link-url');
  const linkNewTab = document.getElementById('link-new-tab');
  const text = (linkTextInput.value || '').trim();
  let url = (linkUrlInput.value || '').trim();

  if (!url) {
    alert('Debes introducir una URL.');
    return;
  }

  if (!/^([a-z]+:\/\/|mailto:|\/|#)/i.test(url)) {
    url = 'https://' + url;
  }

  if (activeLinkAnchor) {
    activeLinkAnchor.textContent = text || activeLinkAnchor.textContent || 'Enlace';
    activeLinkAnchor.href = url;

    if (linkNewTab.checked) {
      activeLinkAnchor.setAttribute('target', '_blank');
      activeLinkAnchor.setAttribute('rel', 'noopener noreferrer');
    } else {
      activeLinkAnchor.removeAttribute('target');
      activeLinkAnchor.removeAttribute('rel');
    }

    closeLinkModal();
    return;
  }

  const selection = window.getSelection();
  const range = pendingLinkRange || (selection && selection.rangeCount ? selection.getRangeAt(0) : null);

  if (!editor || !range || !editor.contains(range.commonAncestorContainer)) {
    alert('Primero selecciona el texto dentro del editor para crear el enlace.');
    return;
  }

  const anchor = document.createElement('a');
  anchor.href = url;
  anchor.textContent = text || range.toString() || 'Enlace';

  if (linkNewTab.checked) {
    anchor.setAttribute('target', '_blank');
    anchor.setAttribute('rel', 'noopener noreferrer');
  }

  range.deleteContents();
  range.insertNode(anchor);

  if (selection) {
    selection.removeAllRanges();
    const newRange = document.createRange();
    newRange.selectNodeContents(anchor);
    selection.addRange(newRange);
  }

  closeLinkModal();
}

// --- Restablecer Datos ---
function resetData() {
  if (confirm('¿Restablecer el contenido a los datos originales del script HTML?')) {
    const jsonScript = document.getElementById('cv-data');
    if (jsonScript) {
      cvData = JSON.parse(jsonScript.textContent);
      switchLanguage(currentLang);
    }
  }
}

// --- Descarga de HTML Actualizado para Git ---
function downloadUpdatedHTML() {
  // Salir del modo edición antes de clonar y descargar
  if (editMode) {
    toggleEditMode();
  }

  // Clonar el documento para no modificar la sesión viva
  const docClone = document.documentElement.cloneNode(true);

  // Desactivar clases de edición activas en la descarga
  docClone.querySelector('body').classList.remove('is-editing');

  // Sincronizar bloque JSON con cvData actualizado
  const jsonScript = docClone.querySelector('#cv-data');
  if (jsonScript) {
    jsonScript.textContent = JSON.stringify(cvData, null, 2);
  }

  const htmlContent = '<!DOCTYPE html>\n' + docClone.outerHTML;
  const blob = new Blob([htmlContent], { type: 'text/html' });
  const url = URL.createObjectURL(blob);
  
  const a = document.createElement('a');
  a.href = url;
  a.download = 'index.html';
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

function getProfileData() {
  return cvData[currentLang] && cvData[currentLang].profile
    ? cvData[currentLang].profile
    : null;
}

function sanitizeSvg(svgCode) {
  const template = document.createElement('template');
  template.innerHTML = svgCode.trim();
  const svg = template.content.querySelector('svg');

  if (!svg) return '';

  template.content.querySelectorAll('script, foreignObject').forEach(element => element.remove());
  template.content.querySelectorAll('*').forEach(element => {
    Array.from(element.attributes).forEach(attribute => {
      if (attribute.name.toLowerCase().startsWith('on')) {
        element.removeAttribute(attribute.name);
      }
    });
  });

  svg.classList.add('cv-profile__icon-svg');
  return svg.outerHTML;
}

function normalizeMaterialIconName(value) {
  return String(value || '')
    .trim()
    .toLowerCase()
    .replace(/[\s-]+/g, '_')
    .replace(/_+/g, '_');
}

function renderProfile() {
  const profile = getProfileData();
  if (!profile) return;

  const image = document.getElementById('profile-image');
  const name = document.getElementById('profile-name');
  const icon = document.getElementById('profile-icon');

  if (image) {
    image.src = profile.imageUrl || '';
    image.alt = profile.name || '';
  }
  if (name) name.textContent = profile.name || '';
  if (icon) {
    const rotation = Number.isFinite(Number(profile.iconRotation)) ? Number(profile.iconRotation) : 145;
    const color = /^#[0-9a-f]{6}$/i.test(profile.iconColor || '') ? profile.iconColor : '#fbc02d';
    const patch = profile.iconPatch !== false;
    const patchWidth = Number.isFinite(Number(profile.patchWidth)) ? Number(profile.patchWidth) : 2.5;
    const patchHeight = Number.isFinite(Number(profile.patchHeight)) ? Number(profile.patchHeight) : 2.7;
    const patchTop = Number.isFinite(Number(profile.patchTop)) ? Number(profile.patchTop) : 1.23;
    const patchLeft = Number.isFinite(Number(profile.patchLeft)) ? Number(profile.patchLeft) : 1.23;
    const materialFill = Number(profile.materialFill) === 1 ? 1 : 0;
    const materialWeight = Number.isFinite(Number(profile.materialWeight)) ? Number(profile.materialWeight) : 400;
    const materialGrade = Number.isFinite(Number(profile.materialGrade)) ? Number(profile.materialGrade) : 0;
    const materialOpticalSize = Number.isFinite(Number(profile.materialOpticalSize)) ? Number(profile.materialOpticalSize) : 24;

    icon.style.setProperty('--profile-icon-rotation', `${rotation}deg`);
    icon.style.setProperty('--profile-icon-color', color);
    icon.style.setProperty('--profile-patch-display', patch ? 'block' : 'none');
    icon.style.setProperty('--profile-patch-width', `${patchWidth}rem`);
    icon.style.setProperty('--profile-patch-height', `${patchHeight}rem`);
    icon.style.setProperty('--profile-patch-top', `${patchTop}em`);
    icon.style.setProperty('--profile-patch-left', `${patchLeft}em`);
    icon.style.setProperty('--profile-material-fill', materialFill);
    icon.style.setProperty('--profile-material-weight', materialWeight);
    icon.style.setProperty('--profile-material-grade', materialGrade);
    icon.style.setProperty('--profile-material-optical-size', materialOpticalSize);
    icon.innerHTML = profile.iconType === 'svg'
      ? sanitizeSvg(profile.iconSvg || '')
      : `<span class="material-symbols-outlined">${escapeHTML(normalizeMaterialIconName(profile.iconName) || 'lightbulb')}</span>`;

    if (profile.iconType !== 'svg') {
      const materialIcon = icon.querySelector('.material-symbols-outlined');
      materialIcon.style.fontVariationSettings = `'FILL' ${materialFill}, 'wght' ${materialWeight}, 'GRAD' ${materialGrade}, 'opsz' ${materialOpticalSize}`;
    }
  }
}

function setupProfileIconType() {
  const svgRadio = document.querySelector('input[name="profile-icon-type"][value="svg"]');
  const materialGroup = document.getElementById('profile-material-group');
  const svgGroup = document.getElementById('profile-svg-group');

  const updateIconTypeFields = () => {
    const isSvg = svgRadio.checked;
    materialGroup.hidden = isSvg;
    svgGroup.hidden = !isSvg;
  };

  document.querySelectorAll('input[name="profile-icon-type"]').forEach(input => {
    input.addEventListener('change', updateIconTypeFields);
  });

  updateIconTypeFields();

  document.getElementById('profile-icon-patch').addEventListener('change', event => {
    document.getElementById('profile-patch-group').hidden = !event.target.checked;
  });
}

function openProfileModal() {
  const profile = getProfileData();
  if (!profile) return;

  document.getElementById('profile-image-url').value = profile.imageUrl || 'https://juliomg82.github.io/assets/img/profile-img.jpg';
  document.getElementById('profile-name-input').value = profile.name || '';
  document.getElementById('profile-material-icon').value = profile.iconName || 'lightbulb';
  document.getElementById('profile-material-fill').checked = Number(profile.materialFill) === 1;
  document.getElementById('profile-material-weight').value = profile.materialWeight ?? 400;
  document.getElementById('profile-material-grade').value = profile.materialGrade ?? 0;
  document.getElementById('profile-material-optical-size').value = profile.materialOpticalSize ?? 24;
  document.getElementById('profile-svg-code').value = profile.iconSvg || '';
  document.getElementById('profile-icon-rotation').value = profile.iconRotation ?? 145;
  document.getElementById('profile-icon-color').value = profile.iconColor || '#fbc02d';
  document.getElementById('profile-icon-patch').checked = profile.iconPatch !== false;
  document.getElementById('profile-patch-width').value = profile.patchWidth ?? 2.5;
  document.getElementById('profile-patch-height').value = profile.patchHeight ?? 2.7;
  document.getElementById('profile-patch-top').value = profile.patchTop ?? 1.23;
  document.getElementById('profile-patch-left').value = profile.patchLeft ?? 1.23;
  document.getElementById('profile-patch-group').hidden = profile.iconPatch === false;

  const iconType = profile.iconType === 'svg' ? 'svg' : 'material';
  document.querySelector(`input[name="profile-icon-type"][value="${iconType}"]`).checked = true;
  document.getElementById('profile-material-group').hidden = iconType === 'svg';
  document.getElementById('profile-svg-group').hidden = iconType !== 'svg';

  document.getElementById('profile-modal').showModal();
  document.getElementById('profile-image-url').focus();
}

function closeProfileModal() {
  document.getElementById('profile-modal').close();
}

function saveProfile(event) {
  event.preventDefault();

  if (!cvData[currentLang]) return;
  const iconType = document.querySelector('input[name="profile-icon-type"]:checked').value;
  const iconSvg = sanitizeSvg(document.getElementById('profile-svg-code').value);
  const iconRotation = Math.min(Math.max(Number(document.getElementById('profile-icon-rotation').value) || 0, -360), 360);
  const iconColor = document.getElementById('profile-icon-color').value;
  const iconPatch = document.getElementById('profile-icon-patch').checked;
  const patchWidth = Math.max(Number(document.getElementById('profile-patch-width').value) || 0, 0);
  const patchHeight = Math.max(Number(document.getElementById('profile-patch-height').value) || 0, 0);
  const patchTop = Number(document.getElementById('profile-patch-top').value) || 0;
  const patchLeft = Number(document.getElementById('profile-patch-left').value) || 0;
  const materialFill = document.getElementById('profile-material-fill').checked ? 1 : 0;
  const materialWeight = Math.min(Math.max(Number(document.getElementById('profile-material-weight').value) || 400, 100), 700);
  const materialGrade = Math.min(Math.max(Number(document.getElementById('profile-material-grade').value) || 0, -25), 200);
  const materialOpticalSize = Math.min(Math.max(Number(document.getElementById('profile-material-optical-size').value) || 24, 20), 48);

  if (iconType === 'svg' && !iconSvg) {
    alert('Pega un código SVG válido para usar este tipo de icono.');
    return;
  }

  if (!cvData[currentLang].profile) cvData[currentLang].profile = {};
  cvData[currentLang].profile = {
    imageUrl: document.getElementById('profile-image-url').value.trim(),
    name: document.getElementById('profile-name-input').value.trim(),
    iconType,
    iconName: normalizeMaterialIconName(document.getElementById('profile-material-icon').value) || 'lightbulb',
    iconSvg,
    materialFill,
    materialWeight,
    materialGrade,
    materialOpticalSize,
    iconRotation,
    iconColor,
    iconPatch,
    patchWidth,
    patchHeight,
    patchTop,
    patchLeft
  };

  renderProfile();
  closeProfileModal();
}

function getContactData() {
  return cvData[currentLang] && cvData[currentLang].sidebar
    ? cvData[currentLang].sidebar.contact || []
    : [];
}

function renderContactIcon(contact) {
  const iconType = contact.iconType === 'svg' ? 'svg' : 'material';
  const iconColor = /^#[0-9a-f]{6}$/i.test(contact.iconColor || '') ? contact.iconColor : '#444444';
  const fill = Number(contact.materialFill) === 1 ? 1 : 0;
  const weight = Number.isFinite(Number(contact.materialWeight)) ? Number(contact.materialWeight) : 400;
  const grade = Number.isFinite(Number(contact.materialGrade)) ? Number(contact.materialGrade) : 0;
  const opsz = Number.isFinite(Number(contact.materialOpticalSize)) ? Number(contact.materialOpticalSize) : 24;
  const rotation = Number.isFinite(Number(contact.iconRotation)) ? Number(contact.iconRotation) : 0;

  if (iconType === 'svg') {
    return sanitizeSvg(contact.iconSvg || '')
      .replace('cv-profile__icon-svg', 'cv-contact__icon-svg')
      .replace('<svg', `<svg style="color: ${iconColor}; transform: rotate(${rotation}deg);"`);
  }

  return `<span class="material-symbols-outlined" style="color: ${iconColor}; transform: rotate(${rotation}deg); font-variation-settings: 'FILL' ${fill}, 'wght' ${weight}, 'GRAD' ${grade}, 'opsz' ${opsz};">${escapeHTML(normalizeMaterialIconName(contact.iconName) || 'link')}</span>`;
}

function getContactHref(value, linkType) {
  if (linkType === 'tel') return `tel:${value}`;
  if (linkType === 'mailto') return `mailto:${value}`;
  return /^https?:\/\//i.test(value) ? value : `https://${value}`;
}

function renderContact() {
  const container = document.getElementById('contact-container');
  if (!container) return;

  container.innerHTML = getContactData().map(contact => `
    <div class="cv-contact__item">
      <span class="cv-contact__icon">${renderContactIcon(contact)}</span>
      <span>${contact.type === 'web' ? 'Portfolio: ' : ''}<a href="${escapeHTML(contact.href)}"${contact.newTab ? ' target="_blank" rel="noopener noreferrer"' : ''}>${escapeHTML(contact.value)}</a></span>
    </div>
  `).join('');
}

function openContactModal() {
  const contacts = getContactData();
  contacts.forEach(contact => {
    const input = document.getElementById(`contact-${contact.type}`);
    if (input) input.value = contact.value || '';
    const linkType = contact.linkType || (contact.type === 'phone' ? 'tel' : contact.type === 'email' ? 'mailto' : 'https');
    document.getElementById(`contact-${contact.type}-link-type`).value = linkType;
    document.getElementById(`contact-${contact.type}-new-tab`).checked = contact.newTab === true || (contact.newTab === undefined && contact.type === 'web');
  });
  document.getElementById('contact-modal').showModal();
  document.getElementById('contact-phone').focus();
}

function closeContactModal() {
  document.getElementById('contact-modal').close();
}

function saveContact(event) {
  event.preventDefault();
  if (!cvData[currentLang]) return;
  const values = {
    phone: document.getElementById('contact-phone').value.trim(),
    web: document.getElementById('contact-web').value.trim(),
    email: document.getElementById('contact-email').value.trim()
  };

  getContactData().forEach(contact => {
    contact.value = values[contact.type];
    contact.linkType = document.getElementById(`contact-${contact.type}-link-type`).value;
    contact.newTab = document.getElementById(`contact-${contact.type}-new-tab`).checked;
    contact.href = getContactHref(contact.value, contact.linkType);
  });
  cvData[currentLang].sidebar.contact = getContactData();
  renderContact();
  closeContactModal();
}

function setupContactIconType() {
  document.querySelectorAll('input[name="contact-icon-type"]').forEach(input => {
    input.addEventListener('change', () => {
      const isSvg = document.querySelector('input[name="contact-icon-type"]:checked').value === 'svg';
      document.getElementById('contact-material-group').hidden = isSvg;
      document.getElementById('contact-svg-group').hidden = !isSvg;
    });
  });
  document.getElementById('contact-material-group').hidden = false;
  document.getElementById('contact-svg-group').hidden = true;
}

let editingContactIconIndex = null;

function openContactIconModal(index) {
  const contact = getContactData()[index];
  if (!contact) return;
  editingContactIconIndex = index;
  document.getElementById('contact-material-icon').value = contact.iconName || 'link';
  document.getElementById('contact-svg-code').value = contact.iconSvg || '';
  document.getElementById('contact-icon-fill').checked = Number(contact.materialFill) === 1;
  document.getElementById('contact-icon-weight').value = contact.materialWeight ?? 400;
  document.getElementById('contact-icon-grade').value = contact.materialGrade ?? 0;
  document.getElementById('contact-icon-opsz').value = contact.materialOpticalSize ?? 24;
  document.getElementById('contact-icon-rotation').value = contact.iconRotation ?? 0;
  document.getElementById('contact-icon-color').value = contact.iconColor || '#444444';
  const iconType = contact.iconType === 'svg' ? 'svg' : 'material';
  document.querySelector(`input[name="contact-icon-type"][value="${iconType}"]`).checked = true;
  document.getElementById('contact-material-group').hidden = iconType === 'svg';
  document.getElementById('contact-svg-group').hidden = iconType !== 'svg';
  document.getElementById('contact-icon-modal').showModal();
}

function closeContactIconModal() {
  document.getElementById('contact-icon-modal').close();
  editingContactIconIndex = null;
}

function saveContactIcon(event) {
  event.preventDefault();
  const contact = getContactData()[editingContactIconIndex];
  if (!contact) return;
  const iconType = document.querySelector('input[name="contact-icon-type"]:checked').value;
  const iconSvg = sanitizeSvg(document.getElementById('contact-svg-code').value);
  if (iconType === 'svg' && !iconSvg) {
    alert('Pega un código SVG válido para usar este tipo de icono.');
    return;
  }
  Object.assign(contact, {
    iconType,
    iconName: normalizeMaterialIconName(document.getElementById('contact-material-icon').value) || 'link',
    iconSvg,
    materialFill: document.getElementById('contact-icon-fill').checked ? 1 : 0,
    materialWeight: Number(document.getElementById('contact-icon-weight').value),
    materialGrade: Number(document.getElementById('contact-icon-grade').value),
    materialOpticalSize: Number(document.getElementById('contact-icon-opsz').value),
    iconRotation: Number(document.getElementById('contact-icon-rotation').value) || 0,
    iconColor: document.getElementById('contact-icon-color').value
  });
  renderContact();
  closeContactIconModal();
}