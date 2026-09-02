const API_BASE = "https://your-api-domain.com/api";

function authHeaders() {
  const headers = {"Content-Type":"application/json"};
  const token = sessionStorage.getItem("accessToken");
  if (token) headers.Authorization = `Bearer ${token}`;
  return headers;
}
async function apiRequest(path, options={}) {
  const res = await fetch(API_BASE + path, {
    ...options,
    headers: {...authHeaders(), ...(options.headers || {})}
  });
  let body;
  try { body = await res.json(); } catch { body = {message:"Invalid JSON response", result:false}; }
  if (!res.ok) throw new Error(body.message || `HTTP ${res.status}`);
  return body;
}
async function apiGet(path) { return apiRequest(path); }
async function apiPost(path, body) {
  return apiRequest(path, {method:"POST", body:JSON.stringify(body)});
}
async function apiPut(path, body) {
  return apiRequest(path, {method:"PUT", body:JSON.stringify(body)});
}
async function apiDelete(path) { return apiRequest(path, {method:"DELETE"}); }

function showAlert(type, msg, target="alert") {
  const el = document.getElementById(target);
  if (el) el.innerHTML = `<div class="alert alert-${type}">${escapeHtml(msg)}</div>`;
}
function escapeHtml(v) {
  return String(v ?? "").replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#039;'}[c]));
}
function dataOf(response) {
  return response && response.result !== undefined ? response.data : response;
}
function renderJson(target, value) {
  document.getElementById(target).textContent = JSON.stringify(value, null, 2);
}
function query(params) {
  const q = new URLSearchParams();
  Object.entries(params).forEach(([k,v]) => { if(v !== "" && v !== null && v !== undefined) q.set(k,v); });
  return q.toString();
}
