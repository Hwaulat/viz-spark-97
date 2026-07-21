# UPDATE REQUIREMENT — DATA BOILER & CED AREA
> Dokumen ini adalah update/revisi detail data untuk **Boiler Area** dan **CED Area** pada Utility Monitoring System. Melengkapi spesifikasi sebelumnya dengan parameter yang lebih rinci per equipment.

---

## 1. BOILER AREA (berlaku untuk Boiler 1, Boiler 2, Boiler 3)

| # | Data | Sifat Pengukuran | Keterangan |
|---|---|---|---|
| 1 | **Temperature** | Per boiler (masing-masing) | Suhu aktual tiap boiler ditampilkan terpisah, tidak digabung |
| 2 | **Pressure** | Per boiler (masing-masing) | Tekanan aktual tiap boiler ditampilkan terpisah, tidak digabung |
| 3 | **Energy** | ⏳ **Pending konfirmasi Mas Ghif** | Belum jelas apakah 1 meter energy untuk semua boiler, atau tiap boiler punya meter sendiri |
| 4 | **Gas** | Gabungan (1 untuk semua boiler) | Satu meter gas mewakili total konsumsi ketiga boiler sekaligus |
| 5 | **Jam Nyala (Running Hours)** | Per boiler (masing-masing) | Total durasi boiler menyala, akumulatif (harian/bulanan) |

### Catatan Tampilan
- **Temperature, Pressure, Jam Nyala** → tampil di masing-masing kartu boiler (3 kartu terpisah: Boiler 1 / Boiler 2 / Boiler 3)
- **Gas** → tampil sebagai 1 kartu ringkasan terpisah (di luar/di atas 3 kartu boiler), karena datanya adalah gabungan ketiga boiler
- **Energy** → sediakan slot/placeholder di kartu terlebih dahulu; tampilan final (per boiler atau gabungan) menunggu konfirmasi dari Mas Ghif

### Contoh Layout Kartu Boiler (per unit)

```
┌──────────────────────────────────┐
│  BOILER 1                ● RUNNING│
│ ────────────────────────────────  │
│  Temperature         185.4 °C     │
│  Pressure             8.2 bar     │
│  Jam Nyala Hari Ini   14.5 jam    │
│  Energy               [pending]   │
└──────────────────────────────────┘
```

### Contoh Kartu Gas (gabungan, terpisah dari 3 kartu boiler)

```
┌──────────────────────────────────┐
│  ⛽ GAS (Total Boiler 1+2+3)       │
│  Konsumsi Saat Ini:   320 m³/h    │
│  Total Hari Ini:      4,850 m³    │
└──────────────────────────────────┘
```

---

## 2. CED AREA

### 2.1 Temperature per Zona Proses

5 titik ukur suhu yang perlu ditampilkan:

| # | Zona | 
|---|---|
| 1 | Temperature Flood |
| 2 | Temperature Pre-Degreasing |
| 3 | Temperature Degreasing |
| 4 | Temperature Phosphate |
| 5 | Temperature CED |

- Kelima suhu ini ditampilkan sebagai **kartu ringkas** (angka aktual per zona)
- Dilengkapi **Grafik Trend Chart** — line chart multi-series, bisa overlay semua zona sekaligus atau toggle per zona untuk melihat tren naik/turun dari waktu ke waktu

### 2.2 Status Line / Skid Tracking

- **Hijau** = ada skid/roller yang membawa unit di posisi station tersebut (mengikuti desain line tracking yang sudah ada sebelumnya)
- **ES-B1, ES-B2, ES-B3** → ⏳ **perlu dikonfirmasi ulang** — fungsi & data yang perlu ditampilkan belum didefinisikan detail, jangan diasumsikan dulu sebelum ada kepastian

### 2.3 Station Flood — Logika Alarm Suhu

| Istilah | Arti |
|---|---|
| **SP** (Setpoint) | Suhu target yang seharusnya dicapai |
| **PV** (Process Value) | Suhu aktual saat ini |

**Aturan alarm:**
> Jika **PV < SP** (suhu aktual lebih rendah dari target) → **alarm berbunyi**

Ini berlaku sebagai parameter alarm suhu khusus di station Flood.

### 2.4 Water Pump (P1, P2)

- Hanya menampilkan **status ON / OFF** (tanpa nilai numerik tambahan seperti flow rate atau tekanan)
- **Berlaku untuk semua station** yang memiliki pompa P1/P2 — bukan hanya satu titik tertentu, jadi tiap station relevan perlu menampilkan status ini

### 2.5 Valve Modulasi (contoh: VAM211)

- Ditampilkan sebagai **persentase bukaan**, contoh: `VAM211 — Terbuka 45%`
- Pola tampilan ini **berlaku untuk semua valve modulasi sejenis** (kode VAM lainnya), bukan hanya VAM211

---

## RINGKASAN ITEM YANG MASIH PENDING KONFIRMASI

| # | Item | Yang Perlu Dikonfirmasi | PIC |
|---|---|---|---|
| 1 | Energy Boiler | Apakah 1 meter untuk semua boiler, atau per boiler masing-masing punya meter sendiri | Mas Ghif |
| 2 | ES-B1, ES-B2, ES-B3 | Fungsi dan data apa saja yang perlu ditampilkan dari titik ini | — |

> Kedua item di atas sebaiknya ditampilkan sebagai **placeholder/slot kosong** di UI terlebih dahulu, agar layout tidak perlu dirombak ulang setelah konfirmasi didapat — tinggal isi data begitu jelas.
