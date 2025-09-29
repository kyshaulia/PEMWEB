document.addEventListener('DOMContentLoaded', function() {
    const form = document.querySelector('form');
    
    // Validasi form sebelum submit
    form.addEventListener('submit', function(e) {
        e.preventDefault();
        
        if (validateForm()) {
            // Simpan data ke localStorage (simulasi database)
            saveFormData();
            
            // Tampilkan pesan sukses
            showNotification('Pendaftaran berhasil! Silakan login.', 'success');
            
            // Reset form
            form.reset();
            
            // Redirect ke halaman login setelah 2 detik
            setTimeout(() => {
                window.location.href = 'login.html';
            }, 2000);
        }
    });
    
    // Auto calculate umur dari tanggal lahir
    const tanggalLahirInput = document.querySelector('input[name="tanggal_lahir"]');
    const umurInput = document.querySelector('input[name="umur"]');
    
    tanggalLahirInput.addEventListener('change', function() {
        if (this.value) {
            const birthDate = new Date(this.value);
            const today = new Date();
            let age = today.getFullYear() - birthDate.getFullYear();
            const monthDiff = today.getMonth() - birthDate.getMonth();
            
            if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
                age--;
            }
            
            umurInput.value = age;
        }
    });
    
    // Validasi NIM (harus angka)
    const nimInput = document.querySelector('input[name="nim"]');
    nimInput.addEventListener('input', function() {
        this.value = this.value.replace(/[^0-9]/g, '');
    });
    
    // Validasi No. HP (harus angka)
    const noHpInput = document.querySelector('input[name="no_hp"]');
    noHpInput.addEventListener('input', function() {
        this.value = this.value.replace(/[^0-9]/g, '');
    });
    
    // Validasi password strength
    const passwordInput = document.querySelector('input[name="password"]');
    passwordInput.addEventListener('input', function() {
        validatePasswordStrength(this.value);
    });
});

function validateForm() {
    const nama = document.querySelector('input[name="nama"]').value.trim();
    const nim = document.querySelector('input[name="nim"]').value.trim();
    const email = document.querySelector('input[name="email"]').value.trim();
    const password = document.querySelector('input[name="password"]').value;
    const noHp = document.querySelector('input[name="no_hp"]').value.trim();
    const umur = document.querySelector('input[name="umur"]').value;
    
    // Validasi nama
    if (nama.length < 2) {
        showNotification('Nama harus minimal 2 karakter', 'error');
        return false;
    }
    
    // Validasi NIM
    if (nim.length < 5) {
        showNotification('NIM harus minimal 5 digit', 'error');
        return false;
    }
    
    // Validasi email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
        showNotification('Format email tidak valid', 'error');
        return false;
    }
    
    // Validasi password
    if (password.length < 6) {
        showNotification('Password harus minimal 6 karakter', 'error');
        return false;
    }
    
    // Validasi umur
    if (umur < 17 || umur > 60) {
        showNotification('Umur harus antara 17-60 tahun', 'error');
        return false;
    }
    
    // Validasi No. HP
    if (noHp.length < 10 || noHp.length > 13) {
        showNotification('No. HP harus 10-13 digit', 'error');
        return false;
    }
    
    return true;
}

function validatePasswordStrength(password) {
    const strengthIndicator = document.getElementById('password-strength') || createPasswordStrengthIndicator();
    
    let strength = 0;
    let feedback = '';
    
    if (password.length >= 6) strength++;
    if (password.match(/[a-z]/) && password.match(/[A-Z]/)) strength++;
    if (password.match(/\d/)) strength++;
    if (password.match(/[^a-zA-Z\d]/)) strength++;
    
    switch(strength) {
        case 0:
        case 1:
            feedback = 'Lemah';
            strengthIndicator.style.color = '#dc3545';
            break;
        case 2:
            feedback = 'Sedang';
            strengthIndicator.style.color = '#ffc107';
            break;
        case 3:
            feedback = 'Kuat';
            strengthIndicator.style.color = '#28a745';
            break;
        case 4:
            feedback = 'Sangat Kuat';
            strengthIndicator.style.color = '#20c997';
            break;
    }
    
    strengthIndicator.textContent = `Kekuatan password: ${feedback}`;
}

function createPasswordStrengthIndicator() {
    const passwordInput = document.querySelector('input[name="password"]');
    const strengthIndicator = document.createElement('div');
    strengthIndicator.id = 'password-strength';
    strengthIndicator.style.fontSize = '12px';
    strengthIndicator.style.marginTop = '5px';
    strengthIndicator.style.fontWeight = '500';
    
    passwordInput.parentNode.appendChild(strengthIndicator);
    return strengthIndicator;
}

function saveFormData() {
    const formData = {
        nama: document.querySelector('input[name="nama"]').value,
        nim: document.querySelector('input[name="nim"]').value,
        prodi: document.querySelector('input[name="prodi"]').value,
        fakultas: document.querySelector('input[name="fakultas"]').value,
        universitas: document.querySelector('input[name="universitas"]').value,
        tanggal_lahir: document.querySelector('input[name="tanggal_lahir"]').value,
        umur: document.querySelector('input[name="umur"]').value,
        gender: document.querySelector('input[name="gender"]:checked')?.value,
        alamat: document.querySelector('textarea[name="alamat"]').value,
        no_hp: document.querySelector('input[name="no_hp"]').value,
        email: document.querySelector('input[name="email"]').value,
        password: document.querySelector('input[name="password"]').value,
        tujuan: document.querySelector('textarea[name="tujuan"]').value,
        tanggal_daftar: new Date().toISOString()
    };
    
    // Simpan ke localStorage
    localStorage.setItem('userData', JSON.stringify(formData));
    console.log('Data tersimpan:', formData);
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

// Tambahkan CSS animation untuk notifikasi
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
`;
document.head.appendChild(style);