# Petunjuk Penggunaan `expes_mqtt_mysql`

Untuk menjalankan proyek ini, pastikan Anda telah menginstal Node.js. Repositori ini memerlukan Node.js versi 20.15.0.

## Langkah-langkah Instalasi

1. **Instal Node.js:**

    - Pastikan Node.js versi 20.15.0 sudah terpasang di sistem Anda. Jika belum, silakan unduh dan instal dari [situs resmi Node.js](https://nodejs.org/).

2. **Clone Repositori:**

    - Clone repositori ini ke komputer Anda menggunakan perintah:
        ```bash
        git clone <URL_REPOSITORI>
        ```
    - Masuk ke folder root repositori menggunakan CLI (Git Bash, PowerShell, CMD, dll):
        ```bash
        cd nama_folder_repositori
        ```

3. **Instal Dependensi:**

    - Jalankan perintah berikut untuk menginstal semua paket yang diperlukan:
        ```bash
        npm install
        ```

4. **Konfigurasi Lingkungan:**

    - Hidupkan server lokal Anda (Apache, MySQL, dll.).
    - Sesuaikan file `.env_repo` dengan kebutuhan Anda. Ubah konfigurasi sesuai dengan lingkungan pengembangan Anda.
    - nama file env nya ubah menjadi `.env`.

5. **Migrasi Database:**
    - Tabel dan kolom database akan tergenerate secara otomatis saat aplikasi dijalankan.

## Catatan Tambahan

-   Pastikan Anda telah mengkonfigurasi database MySQL dengan benar.
-   Jika Anda mengalami masalah, pastikan semua dependensi telah terinstal dengan benar dan konfigurasi lingkungan sesuai.
-   jika ada pertanyaan kirim email ke ditaputra1296@gmail.com
