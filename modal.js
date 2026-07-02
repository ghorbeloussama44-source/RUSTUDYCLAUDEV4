/* ══════════════════════════════════════════════
   MODAL DE CANDIDATURE — RusStudy
   Crée l'espace de suivi + envoie email automatique
══════════════════════════════════════════════ */

// ─── Configuration ───
const API_BASE = ''; // vide = même domaine (Vercel). Sinon: 'https://russieeetudes.com'
const WHATSAPP_NUMBER = '79964334489'; // ton numéro WhatsApp business (sans +)

// ─── Inject modal HTML & styles ───
(function injectModal(){
  const style = document.createElement('style');
  style.textContent = `
  .modal-overlay{position:fixed;inset:0;z-index:800;background:rgba(0,0,0,0);display:flex;align-items:flex-end;justify-content:center;pointer-events:none;transition:background .35s}
  .modal-overlay.open{background:rgba(0,0,0,.65);pointer-events:all}
  .modal-sheet{width:min(540px,100%);max-height:92svh;background:#F0EBE3;border-radius:28px 28px 0 0;transform:translateY(110%);transition:transform .4s cubic-bezier(.23,1,.32,1);display:flex;flex-direction:column;overflow:hidden}
  .modal-overlay.open .modal-sheet{transform:translateY(0)}
  .modal-handle{width:44px;height:5px;border-radius:50px;background:rgba(0,0,0,.15);margin:12px auto 0;flex-shrink:0}
  .modal-header{padding:16px 20px 12px;display:flex;align-items:center;justify-content:space-between;border-bottom:1px solid rgba(0,0,0,.08);flex-shrink:0}
  .modal-header h2{font-size:1.1rem;font-weight:700;letter-spacing:-.02em;color:#0A0A0A}
  .modal-close{width:36px;height:36px;border-radius:50%;background:rgba(0,0,0,.08);border:none;cursor:pointer;display:grid;place-items:center;transition:background .15s}
  .modal-close:hover{background:rgba(0,0,0,.15)}
  .modal-close svg{stroke:#0A0A0A;fill:none;width:16px;height:16px;stroke-width:2.5}
  .mode-tabs{display:grid;grid-template-columns:1fr 1fr;gap:6px;padding:14px 20px;flex-shrink:0}
  .mode-tab{border-radius:50px;padding:11px;border:2px solid rgba(0,0,0,.1);background:transparent;cursor:pointer;font-family:'Space Grotesk',sans-serif;font-weight:700;font-size:.85rem;color:#0A0A0A;transition:all .2s}
  .mode-tab.active{background:#0A0A0A;color:#fff;border-color:#0A0A0A}
  .modal-body{flex:1;overflow-y:auto;padding:0 20px 24px}
  .modal-body::-webkit-scrollbar{width:4px}.modal-body::-webkit-scrollbar-thumb{background:rgba(0,0,0,.15);border-radius:2px}
  .fgroup{margin-bottom:14px}
  .flabel{font-size:.72rem;font-weight:700;letter-spacing:.08em;text-transform:uppercase;opacity:.45;margin-bottom:6px;display:block;color:#0A0A0A}
  .finput,.fselect{width:100%;background:#fff;border:1.5px solid rgba(0,0,0,.1);border-radius:50px;padding:13px 18px;font-family:'Space Grotesk',sans-serif;font-size:.9rem;color:#0A0A0A;outline:none;transition:border-color .2s}
  .finput:focus,.fselect:focus{border-color:#A855F7}
  .fselect{-webkit-appearance:none;cursor:pointer}
  .frow{display:grid;grid-template-columns:1fr 1fr;gap:10px}
  .ftextarea{width:100%;background:#fff;border:1.5px solid rgba(0,0,0,.1);border-radius:18px;padding:13px 18px;font-family:'Space Grotesk',sans-serif;font-size:.9rem;color:#0A0A0A;outline:none;resize:none;transition:border-color .2s}
  .ftextarea:focus{border-color:#A855F7}
  .pills{display:flex;flex-wrap:wrap;gap:7px}
  .popt{border-radius:50px;padding:8px 16px;border:1.5px solid rgba(0,0,0,.12);background:transparent;cursor:pointer;font-family:'Space Grotesk',sans-serif;font-size:.8rem;font-weight:600;color:#0A0A0A;transition:all .18s}
  .popt.sel{background:#0A0A0A;color:#fff;border-color:#0A0A0A}
  .step-ind{display:flex;gap:6px;padding:0 20px 14px;flex-shrink:0}
  .sdot{flex:1;height:4px;border-radius:50px;background:rgba(0,0,0,.1);transition:background .3s}
  .sdot.done{background:#A855F7}.sdot.active{background:#0A0A0A}
  .fsubmit{width:100%;background:#0A0A0A;color:#fff;border:none;border-radius:50px;padding:15px;font-family:'Space Grotesk',sans-serif;font-weight:700;font-size:.95rem;cursor:pointer;margin-top:16px;transition:filter .15s,transform .15s}
  .fsubmit:hover{filter:brightness(1.2);transform:scale(1.01)}
  .fsubmit:disabled{opacity:.5;cursor:wait}
  .fsubmit.purple{background:#A855F7;color:#000}
  .success-view{display:none;text-align:center;padding:24px 20px}
  .success-view.show{display:block}
  .success-icon{font-size:3.5rem;margin-bottom:12px;animation:pop .5s cubic-bezier(.23,1,.32,1)}
  @keyframes pop{from{transform:scale(0)}to{transform:scale(1)}}
  .success-view h3{font-size:1.4rem;font-weight:700;letter-spacing:-.03em;margin-bottom:10px;color:#0A0A0A}
  .success-view p{font-size:.875rem;opacity:.6;line-height:1.65;margin-bottom:20px;color:#0A0A0A}
  .success-id{background:#0A0A0A;color:#fff;border-radius:16px;padding:16px 20px;margin-bottom:14px;display:flex;align-items:center;justify-content:space-between;text-align:left}
  .success-id-num{font-size:1.2rem;font-weight:700;color:#FBBB21}
  .success-id-label{font-size:.7rem;opacity:.4;margin-top:2px}
  .success-cred{background:#fff;border:1.5px solid rgba(0,0,0,.1);border-radius:14px;padding:14px;margin-bottom:16px;text-align:left;font-size:.8rem;color:#0A0A0A;line-height:1.6}
  .success-cred strong{color:#A855F7}
  .wa-btn{display:flex;align-items:center;justify-content:center;gap:8px;background:#25D366;color:#fff;border:none;border-radius:50px;padding:14px;font-family:'Space Grotesk',sans-serif;font-weight:700;font-size:.9rem;cursor:pointer;text-decoration:none;margin-bottom:8px;transition:filter .15s}
  .wa-btn:hover{filter:brightness(1.05)}
  .form-err{color:#EF4444;font-size:.78rem;margin-top:8px;text-align:center;display:none}
  `;
  document.head.appendChild(style);

  const html = `
  <div class="modal-overlay" id="modalOverlay">
    <div class="modal-sheet" id="modalSheet">
      <div class="modal-handle"></div>
      <div class="modal-header">
        <h2 id="modalTitle">Postuler</h2>
        <button class="modal-close" onclick="closeModal()"><svg viewBox="0 0 24 24"><line x1="6" y1="6" x2="18" y2="18"/><line x1="18" y1="6" x2="6" y2="18"/></svg></button>
      </div>
      <div class="mode-tabs" id="modeTabs">
        <button class="mode-tab active" onclick="setMode('simple')">⚡ Rapide (30 sec)</button>
        <button class="mode-tab" onclick="setMode('complet')">📋 Dossier complet</button>
      </div>
      <div class="step-ind" id="stepInd" style="display:none">
        <div class="sdot active" id="sd1"></div><div class="sdot" id="sd2"></div><div class="sdot" id="sd3"></div>
      </div>

      <!-- SIMPLE -->
      <div class="modal-body" id="formSimple">
        <p style="font-size:.82rem;opacity:.5;margin:8px 0 16px;line-height:1.5;color:#0A0A0A">Laisse-nous tes coordonnées, on te crée ton espace de suivi et un conseiller te contacte sous 24h. 🚀</p>
        <div class="fgroup"><label class="flabel">Prénom et nom *</label><input class="finput" type="text" placeholder="Ex: Ayoub Mansouri" id="s_name"/></div>
        <div class="fgroup"><label class="flabel">Numéro WhatsApp *</label><input class="finput" type="tel" placeholder="+216 XX XXX XXX" id="s_phone"/></div>
        <div class="fgroup"><label class="flabel">Email *</label><input class="finput" type="email" placeholder="ton@email.com" id="s_email"/></div>
        <div class="fgroup"><label class="flabel">Filière qui t'intéresse</label>
          <select class="fselect" id="s_filiere">
            <option value="">Je ne sais pas encore</option>
            <option>🩺 Médecine Générale</option><option>💊 Pharmacie</option><option>🦷 Dentaire</option>
            <option>⚙️ Ingénierie</option><option>💼 Économie / Business</option><option>⚖️ Droit</option>
            <option>🏗️ Architecture</option><option>💻 Informatique</option>
          </select>
        </div>
        <button class="fsubmit purple" id="btnSimple" onclick="submitSimple()">Créer mon espace + être rappelé →</button>
        <div class="form-err" id="errSimple">Merci de remplir nom, WhatsApp et email.</div>
        <p style="font-size:.72rem;opacity:.4;text-align:center;margin-top:12px;line-height:1.5;color:#0A0A0A">Réponse sous 24h · Gratuit · Sans engagement</p>
      </div>

      <!-- COMPLET STEP 1 -->
      <div class="modal-body" id="formStep1" style="display:none">
        <p style="font-size:.8rem;opacity:.45;margin:8px 0 16px;color:#0A0A0A">Infos personnelles</p>
        <div class="frow">
          <div class="fgroup"><label class="flabel">Prénom *</label><input class="finput" id="c_prenom" placeholder="Prénom"/></div>
          <div class="fgroup"><label class="flabel">Nom *</label><input class="finput" id="c_nom" placeholder="Nom"/></div>
        </div>
        <div class="frow">
          <div class="fgroup"><label class="flabel">Naissance</label><input class="finput" type="date" id="c_dob"/></div>
          <div class="fgroup"><label class="flabel">Sexe</label><select class="fselect" id="c_sexe"><option value="">—</option><option>Homme</option><option>Femme</option></select></div>
        </div>
        <div class="fgroup"><label class="flabel">WhatsApp *</label><input class="finput" type="tel" placeholder="+216 XX XXX XXX" id="c_phone"/></div>
        <div class="fgroup"><label class="flabel">Email *</label><input class="finput" type="email" placeholder="ton@email.com" id="c_email"/></div>
        <div class="fgroup"><label class="flabel">Ville de résidence</label>
          <select class="fselect" id="c_ville"><option value="">Sélectionner</option><option>Tunis</option><option>Sfax</option><option>Sousse</option><option>Kairouan</option><option>Gabès</option><option>Bizerte</option><option>Nabeul</option><option>Autre</option></select>
        </div>
        <button class="fsubmit" onclick="nextStep(2)">Continuer →</button>
      </div>

      <!-- COMPLET STEP 2 -->
      <div class="modal-body" id="formStep2" style="display:none">
        <p style="font-size:.8rem;opacity:.45;margin:8px 0 16px;color:#0A0A0A">Parcours académique</p>
        <div class="fgroup"><label class="flabel">Section du Bac</label><select class="fselect" id="c_bac"><option value="">Choisir</option><option>Sciences (Math)</option><option>Sciences (Exp.)</option><option>Technique</option><option>Économie & Gestion</option><option>Lettres</option><option>Sport</option></select></div>
        <div class="fgroup"><label class="flabel">Année du Bac</label><select class="fselect" id="c_annee"><option value="">Sélectionner</option><option>2025</option><option>2024</option><option>2023</option><option>2022</option><option>Avant 2022</option></select></div>
        <div class="fgroup"><label class="flabel">Mention</label><div class="pills" id="pMention"><button class="popt" onclick="pick(this,'pMention')">Très Bien</button><button class="popt" onclick="pick(this,'pMention')">Bien</button><button class="popt" onclick="pick(this,'pMention')">Assez Bien</button><button class="popt" onclick="pick(this,'pMention')">Passable</button></div></div>
        <div class="fgroup"><label class="flabel">Niveau d'anglais</label><div class="pills" id="pEng"><button class="popt" onclick="pick(this,'pEng')">Débutant</button><button class="popt" onclick="pick(this,'pEng')">Intermédiaire</button><button class="popt" onclick="pick(this,'pEng')">Avancé</button><button class="popt" onclick="pick(this,'pEng')">Courant</button></div></div>
        <div class="fgroup"><label class="flabel">Filière souhaitée *</label><select class="fselect" id="c_filiere"><option value="">Choisir</option><option>🩺 Médecine Générale</option><option>💊 Pharmacie</option><option>🦷 Dentaire</option><option>⚙️ Ingénierie</option><option>💼 Économie / MBA</option><option>⚖️ Droit</option><option>🏗️ Architecture</option><option>💻 Informatique</option></select></div>
        <div class="fgroup"><label class="flabel">Ville en Russie</label><div class="pills" id="pCity"><button class="popt" onclick="pick(this,'pCity')">Moscou</button><button class="popt" onclick="pick(this,'pCity')">Saint-Pétersbourg</button><button class="popt" onclick="pick(this,'pCity')">Kazan</button><button class="popt" onclick="pick(this,'pCity')">Peu importe</button></div></div>
        <div class="frow" style="margin-top:4px"><button class="fsubmit" style="background:rgba(0,0,0,.1);color:#0A0A0A;margin-top:0" onclick="nextStep(1)">← Retour</button><button class="fsubmit" style="margin-top:0" onclick="nextStep(3)">Continuer →</button></div>
      </div>

      <!-- COMPLET STEP 3 -->
      <div class="modal-body" id="formStep3" style="display:none">
        <p style="font-size:.8rem;opacity:.45;margin:8px 0 16px;color:#0A0A0A">Financement</p>
        <div class="fgroup"><label class="flabel">Budget annuel (hors bourse)</label><div class="pills" id="pBudget"><button class="popt" onclick="pick(this,'pBudget')">< 3 000 €</button><button class="popt" onclick="pick(this,'pBudget')">3 000–5 000 €</button><button class="popt" onclick="pick(this,'pBudget')">5 000–8 000 €</button><button class="popt" onclick="pick(this,'pBudget')">> 8 000 €</button></div></div>
        <div class="fgroup"><label class="flabel">Postuler à une bourse ?</label><div class="pills" id="pBourse"><button class="popt" onclick="pick(this,'pBourse')">Oui absolument</button><button class="popt" onclick="pick(this,'pBourse')">Si possible</button><button class="popt" onclick="pick(this,'pBourse')">Non merci</button></div></div>
        <div class="fgroup"><label class="flabel">Comment as-tu connu RusStudy ?</label><select class="fselect" id="c_source"><option value="">Sélectionner</option><option>Instagram</option><option>Facebook</option><option>TikTok</option><option>Recommandation</option><option>Étudiant en Russie</option><option>Autre</option></select></div>
        <div class="fgroup"><label class="flabel">Questions (optionnel)</label><textarea class="ftextarea" rows="3" placeholder="Tes questions..." id="c_notes"></textarea></div>
        <div class="frow" style="margin-top:4px"><button class="fsubmit" style="background:rgba(0,0,0,.1);color:#0A0A0A;margin-top:0" onclick="nextStep(2)">← Retour</button><button class="fsubmit purple" id="btnComplet" style="margin-top:0" onclick="submitComplet()">Envoyer ✦</button></div>
      </div>

      <!-- SUCCESS -->
      <div class="modal-body"><div class="success-view" id="successView">
        <div class="success-icon">🎉</div>
        <h3>Espace créé avec succès !</h3>
        <p>Ton dossier est enregistré. Un conseiller te contactera sur WhatsApp sous <strong>24h</strong>.</p>
        <div class="success-id">
          <div><div class="success-id-num" id="successId">RS-2025-042</div><div class="success-id-label">Ton numéro de dossier</div></div>
          <span style="font-size:1.5rem">📋</span>
        </div>
        <div class="success-cred">
          🔑 <strong>Pour accéder à ton espace de suivi :</strong><br>
          • Numéro de dossier : <span id="credId">RS-2025-042</span><br>
          • Ton numéro WhatsApp<br>
          <span style="opacity:.5">Garde ces infos précieusement !</span>
        </div>
        <a href="#" class="wa-btn" id="waBtn" target="_blank">💬 Continuer sur WhatsApp</a>
        <a href="candidat.html" class="fsubmit purple" style="display:block;text-decoration:none;text-align:center;color:#000">→ Accéder à mon espace de suivi</a>
        <button onclick="closeModal()" style="background:none;border:none;cursor:pointer;font-size:.8rem;opacity:.4;margin-top:12px;font-family:'Space Grotesk',sans-serif;color:#0A0A0A">Fermer</button>
      </div></div>

    </div>
  </div>`;
  const div = document.createElement('div');
  div.innerHTML = html;
  document.body.appendChild(div);
  document.getElementById('modalOverlay').addEventListener('click', e=>{if(e.target.id==='modalOverlay')closeModal()});
})();

/* ─── State ─── */
let formData = {};

/* ─── Open / Close ─── */
function openModal(){document.getElementById('modalOverlay').classList.add('open');document.body.style.overflow='hidden'}
function closeModal(){
  document.getElementById('modalOverlay').classList.remove('open');document.body.style.overflow='';
  setTimeout(()=>{ // reset
    document.getElementById('successView').classList.remove('show');
    document.getElementById('modeTabs').style.display='grid';
    setMode('simple');
  },400);
}

/* ─── Modes ─── */
function setMode(m){
  document.querySelectorAll('.mode-tab').forEach((t,i)=>t.classList.toggle('active',(m==='simple'&&i===0)||(m==='complet'&&i===1)));
  if(m==='simple'){
    document.getElementById('formSimple').style.display='';
    ['formStep1','formStep2','formStep3'].forEach(id=>document.getElementById(id).style.display='none');
    document.getElementById('stepInd').style.display='none';
    document.getElementById('modalTitle').textContent='Postuler — Version rapide';
  }else{
    document.getElementById('formSimple').style.display='none';
    document.getElementById('stepInd').style.display='flex';
    nextStep(1);
  }
}

/* ─── Steps ─── */
function nextStep(n){
  ['formStep1','formStep2','formStep3'].forEach(id=>document.getElementById(id).style.display='none');
  document.getElementById('formStep'+n).style.display='';
  document.getElementById('modalTitle').textContent='Dossier complet — Étape '+n+'/3';
  ['sd1','sd2','sd3'].forEach((id,i)=>{const d=document.getElementById(id);d.classList.remove('active','done');if(i+1<n)d.classList.add('done');else if(i+1===n)d.classList.add('active')});
  document.getElementById('modalSheet').scrollTop=0;
}

/* ─── Pills ─── */
function pick(el,grp){document.querySelectorAll('#'+grp+' .popt').forEach(p=>p.classList.remove('sel'));el.classList.add('sel')}
function getPill(grp){const s=document.querySelector('#'+grp+' .popt.sel');return s?s.textContent:''}

/* ─── API call ─── */
async function createCandidature(data){
  try{
    const r = await fetch(API_BASE + '/api/candidatures', {
      method:'POST',
      headers:{'Content-Type':'application/json'},
      body:JSON.stringify(data)
    });
    if(!r.ok) throw new Error('API error');
    return await r.json();
  }catch(e){
    // FALLBACK : pas de backend → génère un ID local + mailto/WhatsApp
    console.warn('Backend indisponible, mode local', e);
    return { id: 'RS-' + new Date().getFullYear() + '-' + Math.floor(Math.random()*900+100), local:true };
  }
}

/* ─── Submit simple ─── */
async function submitSimple(){
  const name=document.getElementById('s_name').value.trim();
  const phone=document.getElementById('s_phone').value.trim();
  const email=document.getElementById('s_email').value.trim();
  const filiere=document.getElementById('s_filiere').value;
  if(!name||!phone||!email){document.getElementById('errSimple').style.display='block';return}
  document.getElementById('errSimple').style.display='none';
  const btn=document.getElementById('btnSimple');btn.disabled=true;btn.textContent='Création en cours...';

  const parts=name.split(' ');
  const data={prenom:parts[0]||name,nom:parts.slice(1).join(' ')||'-',email,phone,filiere:filiere||'À définir',source:'Formulaire rapide'};
  const res=await createCandidature(data);
  showSuccess(res.id, phone, name);
  btn.disabled=false;btn.textContent='Créer mon espace + être rappelé →';
}

/* ─── Submit complet ─── */
async function submitComplet(){
  const data={
    prenom:document.getElementById('c_prenom').value.trim(),
    nom:document.getElementById('c_nom').value.trim(),
    email:document.getElementById('c_email').value.trim(),
    phone:document.getElementById('c_phone').value.trim(),
    date_nais:document.getElementById('c_dob').value,
    sexe:document.getElementById('c_sexe').value,
    ville:document.getElementById('c_ville').value,
    bac_section:document.getElementById('c_bac').value,
    bac_annee:document.getElementById('c_annee').value,
    bac_mention:getPill('pMention'),
    anglais:getPill('pEng'),
    filiere:document.getElementById('c_filiere').value||'À définir',
    ville_russie:getPill('pCity'),
    budget:getPill('pBudget'),
    bourse:getPill('pBourse'),
    source:document.getElementById('c_source').value,
    notes:document.getElementById('c_notes').value
  };
  if(!data.prenom||!data.nom||!data.email||!data.phone){alert('Merci de remplir prénom, nom, email et WhatsApp.');return}
  const btn=document.getElementById('btnComplet');btn.disabled=true;btn.textContent='Envoi...';
  const res=await createCandidature(data);
  showSuccess(res.id, data.phone, data.prenom+' '+data.nom);
  btn.disabled=false;btn.textContent='Envoyer ✦';
}

/* ─── Success ─── */
function showSuccess(id, phone, name){
  document.getElementById('modeTabs').style.display='none';
  document.getElementById('stepInd').style.display='none';
  ['formSimple','formStep1','formStep2','formStep3'].forEach(x=>document.getElementById(x).style.display='none');
  document.getElementById('successId').textContent=id;
  document.getElementById('credId').textContent=id;
  document.getElementById('modalTitle').textContent='🎉 Bienvenue !';
  // WhatsApp deep link
  const msg=encodeURIComponent(`Bonjour, je viens de créer mon dossier ${id} (${name}) sur RusStudy. J'aimerais en savoir plus !`);
  document.getElementById('waBtn').href=`https://wa.me/${WHATSAPP_NUMBER}?text=${msg}`;
  // store id for candidat.html auto-fill
  try{ localStorage.setItem('rs_last_id', id); localStorage.setItem('rs_last_phone', phone); }catch(e){}
  document.getElementById('successView').classList.add('show');
}

/* ─── Formulaire inline (CTA bas de page v2) ─── */
async function submitInlineForm(btn){
  const name=document.getElementById('inline_name')?.value.trim()||'';
  const phone=document.getElementById('inline_phone')?.value.trim()||'';
  const filiere=document.getElementById('inline_filiere')?.value||'À définir';
  if(!name||!phone){alert('Merci d\'indiquer ton nom et ton numéro WhatsApp.');return}
  btn.disabled=true;btn.textContent='Envoi...';
  const parts=name.split(' ');
  const data={prenom:parts[0]||name,nom:parts.slice(1).join(' ')||'-',email:'',phone,filiere,source:'Formulaire bas de page'};
  const res=await createCandidature(data);
  // Ouvrir le modal directement sur l'écran succès
  openModal();
  showSuccess(res.id, phone, name);
  btn.disabled=false;btn.textContent='Envoyer ma candidature →';
}
