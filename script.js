// 1. INITIALIZE AOS
AOS.init({
    duration: 1000,
    once: true,
    offset: 100
});

// 2. COUNTDOWN TIMER (Gunakan satu variabel target saja)
const finalWeddingDate = new Date("June 7, 2026 08:00:00").getTime();

const timerInterval = setInterval(() => {
    const now = new Date().getTime();
    const distance = finalWeddingDate - now;

    const d = document.getElementById('days');
    const h = document.getElementById('hours');
    const m = document.getElementById('minutes');
    const s = document.getElementById('seconds');

    if (d && distance > 0) {
        d.innerText = Math.floor(distance / (1000 * 60 * 60 * 24));
        h.innerText = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        m.innerText = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
        s.innerText = Math.floor((distance % (1000 * 60)) / 1000);
    } else if (distance <= 0) {
        clearInterval(timerInterval);
        const countdownWrap = document.querySelector('.countdown');
        if (countdownWrap) countdownWrap.innerHTML = "<h3>Acara Sedang Berlangsung</h3>";
    }
}, 1000);

// 3. PARALLAX EFFECTS
window.addEventListener('scroll', () => {
    let scroll = window.scrollY;
    let vh = window.innerHeight;

    const heroImg = document.querySelector('.char-hero-main');
    if (heroImg && scroll < vh) {
        heroImg.style.transform = `scale(${1 + scroll * 0.0002}) translateY(${scroll * 0.05}px)`;
    }

    const charMid = document.querySelector('.char-mid');
    if (charMid) {
        let pos = charMid.getBoundingClientRect().top;
        if (pos < vh) {
            charMid.style.transform = `translateY(${(pos - vh) * 0.05}px)`;
        }
    }
});

// 4. RSVP & GOOGLE SHEETS
const scriptURL = 'https://script.google.com/macros/s/AKfycbzjpyKG8Upmhns6hCAvKR8AoCWkge3Cilfamz9QbeOqveF-PuDVSAnflRH8Rn9HO9Xv/exec';
const myRsvpForm = document.getElementById('rsvpForm');
const myListUcapan = document.getElementById('listUcapan');

if (myRsvpForm) {
    myRsvpForm.onsubmit = (e) => {
        e.preventDefault();
        const btn = myRsvpForm.querySelector('.btn-dark');
        btn.disabled = true;
        btn.innerText = "Mengirim...";

        const data = {
            nama: document.getElementById('nama').value,
            hadir: document.getElementById('hadir').value,
            pesan: document.getElementById('pesan').value
        };

        fetch(scriptURL, { 
            method: 'POST', 
            body: JSON.stringify(data) 
        })
        .then(() => {
            alert('Terima kasih atas ucapannya!');
            myRsvpForm.reset();
            loadUcapan(); 
        })
        .catch(err => console.error('Error!', err))
        .finally(() => {
            btn.disabled = false;
            btn.innerText = "Kirim Ucapan";
        });
    };
}

function loadUcapan() {
    if (!myListUcapan) return;
    myListUcapan.innerHTML = '<p style="text-align:center;">Memuat ucapan...</p>';
    
    fetch(scriptURL)
    .then(res => res.json())
    .then(data => {
        myListUcapan.innerHTML = '';
        data.forEach(item => {
            const html = `
                <div style="background:white; padding:15px; border-radius:15px; margin-bottom:10px; border-left:4px solid #8d6e63; box-shadow: 0 4px 6px rgba(0,0,0,0.05);">
                    <strong style="color:#1a2a44;">${item.nama}</strong> 
                    <span style="font-size:0.7rem; background:#f0f7ff; padding:2px 8px; border-radius:10px; color:#8d6e63; margin-left:5px;">${item.hadir}</span>
                    <p style="font-size:0.85rem; margin-top:8px; color:#555; line-height:1.4;">${item.pesan}</p>
                </div>
            `;
            myListUcapan.insertAdjacentHTML('beforeend', html);
        });
    })
    .catch(() => {
        myListUcapan.innerHTML = '<p style="text-align:center;">Gagal memuat ucapan.</p>';
    });
}

// 5. MUSIK & CLIPBOARD
const weddingAudio = document.getElementById('weddingMusic');

function playMusic() {
    if (weddingAudio) {
        weddingAudio.play().then(() => {
            // Jika berhasil, hapus listener agar tidak trigger terus-menerus
            ['click', 'scroll', 'touchstart'].forEach(event => {
                window.removeEventListener(event, playMusic);
            });
        }).catch(err => {
            console.log("Menunggu interaksi untuk musik...");
        });
    }
}

// Pasang listener di window agar musik jalan saat user scroll atau klik pertama kali
window.addEventListener('click', playMusic);
window.addEventListener('scroll', playMusic, { once: true });
window.addEventListener('touchstart', playMusic);

// Pasang listener di banyak aksi user sekaligus
window.addEventListener('click', unlockAudio);
window.addEventListener('touchstart', unlockAudio);
window.addEventListener('scroll', unlockAudio);

function copyText(id) {
    const textToCopy = document.getElementById(id).innerText;
    navigator.clipboard.writeText(textToCopy).then(() => {
        alert("Berhasil menyalin nomor rekening!");
    });
}

// 6. KELOPAK BUNGA
function createLeaf() {
    const leafContainer = document.getElementById('leaf-container');
    if (!leafContainer) return;
    
    const leaf = document.createElement('div');
    leaf.className = 'leaf';
    const size = Math.random() * 12 + 8 + 'px';
    leaf.style.width = size;
    leaf.style.height = size;
    leaf.style.left = Math.random() * 100 + 'vw';
    const duration = Math.random() * 5 + 7 + 's';
    leaf.style.animationDuration = duration;
    leafContainer.appendChild(leaf);
    setTimeout(() => { leaf.remove(); }, 12000);
}
setInterval(createLeaf, 600);

// Load awal
window.addEventListener('DOMContentLoaded', loadUcapan);