let currentQRData = null;
let countdownInterval = null;
let timeLeft = 900; // 15 minutes

// URL Parameters
const urlParams = new URLSearchParams(window.location.search);
const payAmount = Number(urlParams.get('pay'));

// Initialize
document.addEventListener('DOMContentLoaded', function() {
    // Remove old theme toggle - cyberpunk is fixed theme
    
    if (!payAmount || payAmount < 1) {
        window.location.href = '404.html';
        return;
    }

    const qrisUtama = '00020101021126610014COM.GO-JEK.WWW01189360091431952319480210G1952319480303UMI51440014ID.CO.QRIS.WWW0215ID10264999833300303UMI5204581653033605802ID5914VUNIXX, Gaming6006BANTUL61055518462070703A01630436B0';
    localStorage.setItem('QRIS_Utama', qrisUtama);

    generateQRIS();
    startCountdown();
});

// Countdown - Neon enhanced
function startCountdown() {
    updateCountdownDisplay();
    countdownInterval = setInterval(() => {
        timeLeft--;
        updateCountdownDisplay();
        
        if (timeLeft <= 0) {
            clearInterval(countdownInterval);
            showMessageNeon('⏰ QR Code telah kedaluwarsa. Silakan refresh halaman untuk generate baru.', 'warning');
            const qrContainer = document.getElementById('qrContainer');
            qrContainer.innerHTML = `
                <div style="text-align: center; padding: 2rem;">
                    <i style="font-size: 4rem; color: #FFB84D; margin-bottom: 1rem;">⏰</i>
                    <p style="color: var(--text-secondary); font-size: 1.2rem; margin-bottom: 1.5rem;">QR Code Kedaluwarsa</p>
                    <button onclick="location.reload()" class="btn-neon btn-purple" style="width: 200px; margin: 0 auto;">
                        🔄 Refresh
                    </button>
                </div>
            `;
            document.getElementById('actionButtons').style.display = 'none';
        }
    }, 1000);
}

function updateCountdownDisplay() {
    const minutes = Math.floor(timeLeft / 60);
    const seconds = timeLeft % 60;
    const countdownEl = document.getElementById('countdown');
    countdownEl.textContent = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
    
    const timerSection = document.getElementById('timerSection');
    if (timeLeft <= 60) {
        timerSection.style.background = 'rgba(255, 71, 87, 0.3)';
        timerSection.style.borderColor = '#ff4757';
        timerSection.style.boxShadow = '0 0 20px rgba(255, 71, 87, 0.5)';
        document.getElementById('countdown').style.color = '#ff4757';
    }
}

// Format Currency
function formatCurrency(amount) {
    return new Intl.NumberFormat('id-ID', {
        style: 'currency',
        currency: 'IDR',
        minimumFractionDigits: 0
    }).format(amount);
}

// Neon Message System - Cyberpunk style
function showMessageNeon(text, type = 'danger') {
    const messageContainer = document.getElementById('messageContainer');
    let icon, bgColor, textColor;
    
    if (type === 'success') {
        icon = '✅';
        bgColor = 'rgba(0, 255, 65, 0.3)';
        textColor = 'var(--neon-green)';
    } else if (type === 'warning') {
        icon = '⚠';
        bgColor = 'rgba(255, 184, 77, 0.3)';
        textColor = '#FFB84D';
    } else {
        icon = '❌';
        bgColor = 'rgba(255, 71, 87, 0.3)';
        textColor = '#ff4757';
    }
    
    messageContainer.innerHTML = `
        <div class="alert alert-${type}" style="
            background: ${bgColor};
            border: 1px solid ${textColor};
            color: ${textColor};
            box-shadow: 0 0 20px ${textColor}20;
            animation: glowPulseMessage 2s ease-in-out infinite alternate;
        ">
            <span style="font-size: 1.5rem; margin-right: 0.8rem;">${icon}</span>
            ${text}
        </div>
    `;
    
    setTimeout(() => {
        const alert = messageContainer.querySelector('.alert');
        if (alert) {
            alert.style.opacity = '0';
            alert.style.transform = 'translateY(-10px)';
            setTimeout(() => alert.remove(), 400);
        }
    }, 5000);
}

// Add glow animation for messages
const style = document.createElement('style');
style.textContent = `
    @keyframes glowPulseMessage {
        0% { box-shadow: 0 0 10px currentColor20; }
        100% { box-shadow: 0 0 25px currentColor40, 0 0 35px currentColor20; }
    }
`;
document.head.appendChild(style);

// QRIS API
async function qris(id, harga) {
    try {
        const response = await fetch(`https://api-mininxd.vercel.app/qris?qris=${id}&nominal=${harga}`);
        return await response.json();
    } catch(e) {
        return { error: e.message };
    }
}

// Generate QRIS - Neon optimized
async function generateQRIS() {
    const qrisUtama = localStorage.getItem('QRIS_Utama');
    const amountDisplay = document.getElementById('amountDisplay');
    const amountLabel = document.getElementById('amountLabel');
    
    amountDisplay.textContent = formatCurrency(payAmount);
    amountLabel.textContent = 'Total Pembayaran';

    try {
        showMessageNeon('🔄 Generating Secure QRIS Code...', 'warning');
        
        const data = await qris(qrisUtama, payAmount);

        if (!data || (!data.QR && !data.qr)) {
            throw new Error('Gagal generate QRIS dari API');
        }

        const qrString = data.QR || data.qr || data.qris;
        currentQRData = qrString;

        if (data.merchant) {
            document.getElementById('displayMerchantName').textContent = data.merchant;
            document.getElementById('merchantDisplay').style.display = 'flex';
        }

        // Render QR with neon colors
        const canvas = document.createElement('canvas');
        await QRCode.toCanvas(canvas, qrString, {
            width: 260,
            margin: 3,
            color: { 
                dark: '#140028', 
                light: '#e8d5ff' 
            },
            errorCorrectionLevel: 'H'
        });

        const qrContainer = document.getElementById('qrContainer');
        qrContainer.style.opacity = '0';
        qrContainer.innerHTML = '';
        qrContainer.appendChild(canvas);
        
        requestAnimationFrame(() => {
            qrContainer.style.transition = 'all 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275)';
            qrContainer.style.opacity = '1';
            qrContainer.style.transform = 'scale(1.05)';
            setTimeout(() => qrContainer.style.transform = 'scale(1)', 300);
        });

        document.getElementById('actionButtons').style.opacity = '0';
        document.getElementById('actionButtons').style.display = 'grid';
        setTimeout(() => {
            document.getElementById('actionButtons').style.transition = 'opacity 0.5s';
            document.getElementById('actionButtons').style.opacity = '1';
        }, 100);

        showMessageNeon('✅ QRIS Ready! Scan untuk bayar.', 'success');

    } catch (error) {
        document.getElementById('qrContainer').innerHTML = `
            <div style="text-align: center; padding: 2rem;">
                <i style="font-size: 4rem; color: #ff4757; margin-bottom: 1rem;">❌</i>
                <p style="color: var(--text-secondary); font-size: 1.2rem; margin-bottom: 1rem;">Gagal Generate QR</p>
                <p style="color: #ff4757; font-size: 1rem;">${error.message}</p>
                <button onclick="generateQRIS()" class="btn-neon btn-purple" style="width: 180px; margin: 1.5rem auto 0;">
                    🔄 Coba Lagi
                </button>
            </div>
        `;
        showMessageNeon('❌ Error: ' + error.message, 'danger');
    }
}

// Download QR
function downloadQR() {
    const canvas = document.querySelector('#qrContainer canvas');
    if (canvas) {
        const merchant = document.getElementById('displayMerchantName').textContent || 'MIZUKI-MD';
        const link = document.createElement('a');
        link.download = `MIZUKI-QRIS-${merchant}-${payAmount}.png`;
        link.href = canvas.toDataURL();
        link.click();
        showMessageNeon('💾 QR Code berhasil diunduh!', 'success');
    }
}

// Copy QR Data
function copyQRCode() {
    if (currentQRData) {
        navigator.clipboard.writeText(currentQRData)
            .then(() => showMessageNeon('📋 QRIS Data disalin ke clipboard!', 'success'))
            .catch(() => showMessageNeon('❌ Gagal copy QRIS data', 'danger'));
    }
}

// Share
function shareQR() {
    if (navigator.share && currentQRData) {
        navigator.share({
            title: 'MIZUKI-MD | QRIS Payment',
            text: `Bayar ${formatCurrency(payAmount)} via QRIS`,
            url: window.location.href
        }).catch(() => copyLink());
    } else {
        copyLink();
    }
}

function copyLink() {
    navigator.clipboard.writeText(window.location.href).then(() => {
        showMessageNeon('🔗 Payment link disalin!', 'success');
    }).catch(() => {
        showMessageNeon('❌ Gagal copy link', 'danger');
    });
}
