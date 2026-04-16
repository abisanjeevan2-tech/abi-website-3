// Firebase init — runs after CDN scripts load
(function() {
  if (typeof firebase === 'undefined') {
    console.error('Firebase CDN not loaded!');
    return;
  }
  if (!firebase.apps.length) {
    firebase.initializeApp({
      apiKey:            "AIzaSyDtDM0HqwWrR5tvCYBhJ1d9P9nvSuKxqQs",
      authDomain:        "abis-drapes-makeup.firebaseapp.com",
      projectId:         "abis-drapes-makeup",
      storageBucket:     "abis-drapes-makeup.firebasestorage.app",
      messagingSenderId: "1058533006817",
      appId:             "1:1058533006817:web:e1dce65da04fd83c4d86a0"
    });
  }
  var auth = firebase.auth();
  var db   = firebase.firestore();
  window.auth = auth;
  window.db   = db;

  auth.onAuthStateChanged(function(user) {
    var btn = document.getElementById('nav-login');
    if (user) {
      if (btn) { btn.textContent = 'Dashboard'; btn.onclick = function(){ showPage('dashboard'); }; }
      var lp = document.getElementById('page-login');
      if (lp && lp.classList.contains('active')) showPage('dashboard');
      loadDashboard(user);
    } else {
      if (btn) { btn.textContent = 'Login'; btn.onclick = function(){ showPage('login'); }; }
    }
  });
})();

function switchAuthTab(tab) {
  var si=document.getElementById('signin-form'), su=document.getElementById('signup-form');
  var tsi=document.getElementById('tab-signin'), tsu=document.getElementById('tab-signup');
  if (tab==='signin') {
    si.style.display='block'; su.style.display='none';
    tsi.style.background='var(--primary)'; tsi.style.color='#fff';
    tsu.style.background='transparent'; tsu.style.color='var(--muted)';
  } else {
    si.style.display='none'; su.style.display='block';
    tsu.style.background='var(--primary)'; tsu.style.color='#fff';
    tsi.style.background='transparent'; tsi.style.color='var(--muted)';
  }
}

function handleSignIn(e) {
  e.preventDefault();
  var email = document.getElementById('signin-email').value;
  var pwd   = document.getElementById('signin-password').value;
  var btn   = document.getElementById('signin-btn');
  var err   = document.getElementById('signin-error');
  err.style.display = 'none';
  btn.textContent = 'Signing in...'; btn.disabled = true;
  auth.signInWithEmailAndPassword(email, pwd)
    .then(function(){ showToast('Welcome back!'); showPage('dashboard'); })
    .catch(function(ex){ err.textContent = authErr(ex.code); err.style.display = 'block'; })
    .finally(function(){ btn.textContent = 'Sign In'; btn.disabled = false; });
}

function handleSignUp(e) {
  e.preventDefault();
  var name  = document.getElementById('signup-name').value;
  var email = document.getElementById('signup-email').value;
  var pwd   = document.getElementById('signup-password').value;
  var btn   = document.getElementById('signup-btn');
  var err   = document.getElementById('signup-error');
  err.style.display = 'none';
  btn.textContent = 'Creating account...'; btn.disabled = true;
  auth.createUserWithEmailAndPassword(email, pwd)
    .then(function(cred){ return cred.user.updateProfile({displayName: name}); })
    .then(function(){ showToast('Account created! Welcome!'); showPage('dashboard'); })
    .catch(function(ex){ err.textContent = authErr(ex.code); err.style.display = 'block'; })
    .finally(function(){ btn.textContent = 'Create Account'; btn.disabled = false; });
}

function handleGoogleSignIn() {
  auth.signInWithPopup(new firebase.auth.GoogleAuthProvider())
    .then(function(){ showToast('Signed in with Google!'); showPage('dashboard'); })
    .catch(function(){ showToast('Google sign-in failed. Try again.'); });
}

function handleSignOut() {
  auth.signOut().then(function(){ showPage('home'); showToast('Signed out successfully.'); });
}

function handleForgotPassword() {
  var email = document.getElementById('signin-email').value;
  if (!email) { showToast('Enter your email address first'); return; }
  auth.sendPasswordResetEmail(email)
    .then(function(){ showToast('Password reset email sent!'); })
    .catch(function(){ showToast('Could not send reset email.'); });
}

function handleBooking(e) {
  e.preventDefault();
  var user = auth.currentUser;
  if (!user) { showPage('login'); showToast('Please log in to confirm your booking'); return; }
  var form = e.target;
  function get(n) { var el = form.querySelector('[name='+n+']'); return el ? el.value : ''; }
  var btn = form.querySelector('.submit-btn');
  btn.textContent = 'Saving...'; btn.disabled = true;
  db.collection('bookings').add({
    userId: user.uid, userName: user.displayName||'', userEmail: user.email,
    name: get('name'), phone: get('phone'), email: get('email'),
    service: get('service'), date: get('date'), time: get('time'),
    location: get('location'), notes: get('notes'),
    status: 'pending', createdAt: firebase.firestore.FieldValue.serverTimestamp()
  })
  .then(function(){ showToast('Booking submitted! We will confirm within 24 hours.'); form.reset(); showPage('dashboard'); })
  .catch(function(ex){ showToast('Error saving booking. Please try again.'); console.error(ex); })
  .finally(function(){ btn.textContent = 'Continue to Login & Confirm'; btn.disabled = false; });
}

function loadDashboard(user) {
  var g = document.getElementById('dashboard-greeting');
  if (g) g.textContent = 'Welcome back, '+(user.displayName||user.email)+'!';
  var list = document.getElementById('bookings-list');
  if (!list) return;
  list.innerHTML = '<div style="text-align:center;padding:3rem;color:var(--muted);">Loading your bookings...</div>';
  db.collection('bookings').where('userId','==',user.uid).orderBy('createdAt','desc').get()
    .then(function(snap) {
      if (snap.empty) {
        list.innerHTML = '<div style="text-align:center;padding:4rem;color:var(--muted);"><div style="font-size:3rem;margin-bottom:1rem;">&#128197;</div><p style="margin-bottom:1.5rem;">No bookings yet</p><button class="btn-primary" onclick="showPage(\'booking\')">Book Your First Appointment &rarr;</button></div>';
        return;
      }
      var sc = {pending:'#E8A020',confirmed:'#27AE60',cancelled:'#d4183d'};
      var sl = {pending:'Pending Confirmation',confirmed:'Confirmed',cancelled:'Cancelled'};
      list.innerHTML = snap.docs.map(function(doc) {
        var b = doc.data();
        var dt = b.createdAt ? new Date(b.createdAt.seconds*1000).toLocaleDateString('en-US',{month:'short',day:'numeric',year:'numeric'}) : 'Just now';
        var col = sc[b.status]||'#6B6B6B', lbl = sl[b.status]||b.status;
        return '<div style="background:var(--card);border:1px solid var(--border);border-radius:var(--radius);padding:1.75rem;margin-bottom:1.25rem;">'
          +'<div style="display:flex;justify-content:space-between;align-items:flex-start;flex-wrap:wrap;gap:1rem;margin-bottom:1rem;">'
          +'<div><div style="font-family:var(--font-display);font-size:1.3rem;font-weight:500;">'+(b.service||'Appointment')+'</div>'
          +'<div style="font-size:.85rem;color:var(--muted);">Booked on '+dt+'</div></div>'
          +'<span style="padding:.35rem .9rem;border-radius:50px;font-size:.78rem;font-weight:600;background:'+col+'20;color:'+col+';">'+lbl+'</span></div>'
          +'<div style="font-size:.875rem;color:var(--muted);margin-top:.5rem;">'
          +(b.date?'&#128197; '+b.date+'&nbsp;&nbsp;':'')+(b.time?'&#128336; '+b.time+'&nbsp;&nbsp;':'')
          +(b.location?'&#128205; '+b.location:'')+'</div>'
          +(b.notes?'<div style="margin-top:.75rem;font-size:.85rem;color:var(--muted);border-top:1px solid var(--border);padding-top:.75rem;">&#128172; '+b.notes+'</div>':'')
          +'</div>';
      }).join('');
    })
    .catch(function(ex){ list.innerHTML='<div style="text-align:center;padding:3rem;color:var(--muted);">Could not load bookings.</div>'; console.error(ex); });
}

function authErr(code) {
  var msgs = {
    'auth/user-not-found':      'No account found with this email.',
    'auth/wrong-password':      'Incorrect password. Please try again.',
    'auth/email-already-in-use':'An account with this email already exists.',
    'auth/weak-password':       'Password must be at least 6 characters.',
    'auth/invalid-email':       'Please enter a valid email address.',
    'auth/too-many-requests':   'Too many attempts. Please try again later.',
    'auth/invalid-credential':  'Invalid email or password.'
  };
  return msgs[code] || 'Something went wrong. Please try again.';
}
