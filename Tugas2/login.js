document.addEventListener('DOMContentLoaded', function() {
    const loginForm = document.querySelector('form');
    
    loginForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        if (validateLogin()) {
            // Simulasi proses login
            simulateLogin();
        }
    });
    
    // Cek jika ada data user di localStorage
    checkExistingUser();
});

function validateLogin() {
    const email = document.querySelector('input[name="email"]').value.trim();
    const password = document.querySelector('input[name="password"]').value;
    
    // Validasi email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
        showNotification('Format email tidak valid', 'error');
        return false;
    }
    
    // Validasi password
    if (password.length < 1) {
        showNotification('Password harus diisi', 'error');
        return false;
    }
    
    return true;
}

function simulateLogin() {
    const email = document.querySelector('input[name="email"]').value.trim();
    const password = document.querySelector('input[name="password"]').value;
    
    // Ambil data dari localStorage
    const savedData = localStorage.getItem('userData');
    
    if (savedData) {
        const userData = JSON.parse(savedData);
        
        // Cek kredensial
        if (userData.email === email && userData.password === password) {
            showNotification('Login berhasil! Pendaftaran seminar Anda telah dikonfirmasi.', 'success');
            
            // Simpan status login
            localStorage.setItem('isLoggedIn', 'true');
            localStorage.setItem('currentUser', JSON.stringify(userData));
            
            // Tampilkan konfirmasi pendaftaran
            setTimeout(() => {
                showRegistrationConfirmation(userData);
            }, 1000);
            
        } else {
            showNotification('Email atau password salah', 'error');
        }
    } else {
        showNotification('Akun tidak ditemukan. Silakan daftar terlebih dahulu.', 'error');
    }
}

function showRegistrationConfirmation(userData) {
    // Buat modal konfirmasi
    const modal = document.createElement('div');
    modal.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background-color: rgba(0,0,0,0.8);
        display: flex;
        justify-content: center;
        align-items: center;
        z-index: 1000;
        animation: fadeIn 0.3s ease-out;
    `;
    
    modal.innerHTML = `
        <div style="
            background: white;
            padding: 30px;
            border-radius: 15px;
            max-width: 500px;
            width: 90%;
            text-align: center;
            box-shadow: 0 20px 40px rgba(0,0,0,0.3);
        ">
            <h2 style="color: #28a745; margin-bottom: 20px;">Pendaftaran Berhasil!</h2>
            <div style="text-align: left; margin-bottom: 25px;">
                <p><strong>Nama:</strong> ${userData.nama}</p>
                <p><strong>NIM:</strong> ${userData.nim}</p>
                <p><strong>Email:</strong> ${userData.email}</p>
                <p><strong>Status:</strong> <span style="color: #28a745; font-weight: bold;">Terkonfirmasi</span></p>
            </div>
            <div style="background: #f8f9fa; padding: 15px; border-radius: 8px; margin-bottom: 20px;">
                <h3 style="margin-bottom: 10px;">Informasi Seminar</h3>
                <p><strong>Tanggal:</strong> 15 Desember 2024</p>
                <p><strong>Waktu:</strong> 09:00 - 16:00 WIB</p>
                <p><strong>Tempat:</strong> Auditorium Universitas</p>
            </div>
            <button id="close-modal" style="
                background: linear-gradient(to right, #4361ee, #3a0ca3);
                color: white;
                border: none;
                padding: 12px 30px;
                border-radius: 8px;
                font-weight: 600;
                cursor: pointer;
                transition: all 0.3s ease;
            ">Tutup</button>
        </div>
    `;
    
    document.body.appendChild(modal);
    
    // Tambahkan event listener untuk tombol tutup
    document.getElementById('close-modal').addEventListener('click', function() {
        modal.remove();
    });
    
    // Tutup modal ketika klik di luar
    modal.addEventListener('click', function(e) {
        if (e.target === modal) {
            modal.remove();
        }
    });
}

function checkExistingUser() {
    const savedData = localStorage.getItem('userData');
    if (savedData) {
        const userData = JSON.parse(savedData);
        // Auto-fill email jika user sudah pernah mendaftar
        document.querySelector('input[name="email"]').value = userData.email;
    }
}

function showNotification(message, type = 'info') {
    // Hapus notifikasi sebelumnya
    const existingNotification = document.querySelector('.notification');
    if (existingNotification) {
        existingNotification.remove();
    }
    
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.textContent = message;
    
    // Styling notifikasi
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        padding: 15px 20px;
        border-radius: 8px;
        color: white;
        font-weight: 500;
        z-index: 1000;
        animation: slideIn 0.3s ease-out;
        max-width: 300px;
        box-shadow: 0 5px 15px rgba(0,0,0,0.2);
    `;
    
    if (type === 'success') {
        notification.style.backgroundColor = '#28a745';
    } else if (type === 'error') {
        notification.style.backgroundColor = '#dc3545';
    } else {
        notification.style.backgroundColor = '#17a2b8';
    }
    
    document.body.appendChild(notification);
    
    // Hapus notifikasi setelah 5 detik
    setTimeout(() => {
        notification.remove();
    }, 5000);
}

// Tambahkan CSS animation untuk notifikasi dan modal
const style = document.createElement('style');
style.textContent = `
    @keyframes slideIn {
        from {
            transform: translateX(100%);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }
    
    @keyframes fadeIn {
        from {
            opacity: 0;
        }
        to {
            opacity: 1;
        }
    }
`;
document.head.appendChild(style);