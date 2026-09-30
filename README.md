# 📰 FetchNews - Multi-Source News Aggregator

**FetchNews** adalah portal berita modern berbasis web yang mengumpulkan (*aggregate*) berbagai berita dari sumber media terkemuka di Indonesia (seperti **CNN Indonesia**, **Kompas**, dan **Tribun News**) secara real-time ke dalam satu antarmuka yang bersih, cepat, dan terpadu.

Dibangun dengan arsitektur **Domain-Driven Modular** di atas **Next.js 16 (App Router)**, **TypeScript**, **Tailwind CSS**, dan dioptimalkan menggunakan **Bun**.

---

## ✨ Fitur Utama

- 🌐 **Multi-Source Aggregator**: Menggabungkan berita dari berbagai media secara otomatis dalam tab *All* maupun filter spesifik per portal berita.
- 🏷️ **Deduplikasi Artikel**: Logika pintar untuk menyaring duplikasi artikel berita agar feed tetap bersih dan bebas dari duplikasi key React.
- 🗂️ **Fluid Tabs dengan Logo Media**: Navigasi kategori/media yang elegan dan interaktif, lengkap dengan logo resmi masing-masing kanal berita.
- 🎴 **Interactive Card News**:
  - Tampilan kartu berita modern dengan status *Hero/Featured* untuk berita utama.
  - Fitur ekspansi (*Show more / Baca selengkapnya*) dengan modal/drawer detail artikel.
  - Format waktu humanis (*time-ago*) dan lencana kategori.
  - Fitur simpan artikel (*Bookmarks*) tersimpan di `localStorage`.
- ⚡ **Loading State Animatif**: Indikator pemuatan berbasis `loading-dev` (*Leap*) yang aktif secara dinamis saat fetch data pertama kali maupun saat berpindah tab media.
- 🛡️ **Type Safety Penuh**: Validasi data menyeluruh dengan antarmuka TypeScript untuk masing-masing vendor API.

---

## 🛠️ Tech Stack

- **Framework**: [Next.js 16](https://nextjs.org/) (App Router & Turbopack)
- **UI & Runtime**: [React 19](https://react.dev/)
- **Bahasa**: [TypeScript](https://www.typescriptlang.org/)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/)
- **Icons**: [Lucide React](https://lucide.dev/)
- **Animations/Loading**: [loading-dev](https://www.npmjs.com/package/loading-dev)
- **Runtime & Package Manager**: [Bun](https://bun.sh/) (Kompatibel dengan Node.js v20+)

---

## 📂 Struktur Proyek

Proyek ini menggunakan pola arsitektur **modular berorientasi fitur** (*Feature-based / Modular Architecture*) di dalam folder `src/modules/` agar kode tetap terisolasi, mudah diuji, dan skalabel:

```text
FetchNews/
├── app/                              # Next.js App Router
│   ├── favicon.ico
│   ├── globals.css                   # Global styles & variable Tailwind
│   ├── layout.tsx                    # Root layout & navbar
│   └── page.tsx                      # Halaman utama (memanggil modul NewsView)
├── public/                           # Static assets
│   └── logo/                         # Logo resmi media (CNN, Kompas, dll)
├── src/
│   ├── components/
│   │   └── ui/                       # Komponen antarmuka yang reusable
│   │       ├── CardNews.tsx          # Komponen kartu berita interaktif
│   │       ├── Loading.tsx           # Komponen loading spinner (Leap animation)
│   │       ├── Tabs.tsx              # Komponen tab navigasi berpindah sumber
│   │       └── ... (button, card, input)
│   ├── lib/                          # Utility & helper global (cn, date formatter)
│   └── modules/
│       └── news/                     # Domain Module: News
│           ├── @types/               # Definisi tipe TypeScript
│           │   ├── cnn.d.ts          # Kontrak API CNN Indonesia
│           │   ├── kompas.d.ts       # Kontrak API Kompas
│           │   ├── tribunNews.d.ts   # Kontrak API Tribun News
│           │   └── index.ts          # Export tipe & standar universal `NewsArticle`
│           ├── services/             # Client service per portal media
│           │   ├── cnnService.ts     # Fetch & parser berita CNN
│           │   ├── kompasService.ts  # Fetch & parser berita Kompas
│           │   └── tribunNewsService.ts # Fetch & parser berita Tribun News
│           ├── newsService.ts        # Master Aggregator (Deduplikasi & Filter)
│           ├── components/
│           │   └── NewsView.tsx      # View controller & layout feed berita
│           └── index.ts              # Entry point modul news
```

---

## 🚀 Panduan Memulai (Getting Started)

### 1. Prasyarat
- [Bun](https://bun.sh/) (disarankan) atau [Node.js](https://nodejs.org/) versi 20+

### 2. Instalasi Dependensi
```bash
bun install
# atau
npm install
```

### 3. Menjalankan Server Pengembangan
```bash
bun dev
# atau
npm run dev
```
Buka browser dan akses [http://localhost:3000](http://localhost:3000).

### 4. Perintah Validasi & Build
```bash
# Validasi tipe TypeScript
bun run typecheck

# Cek linting kode
bun run lint

# Build production bundle
bun run build
```

---

## 🧩 Panduan Coding: Menambahkan Sumber Berita Baru

Arsitektur dibuat sedemikian rupa agar sangat mudah menambahkan portal berita baru (misalnya: *Detik*, *Tempo*, atau *Liputan6*). Cukup ikuti 5 langkah berikut:

### Langkah 1: Definisikan Tipe Data API
Buat file definisi tipe data sesuai respon API sumber baru di folder `src/modules/news/@types/`:
Misal `src/modules/news/@types/tempo.d.ts`:
```typescript
export interface TempoArticleRaw {
  judul: string;
  link: string;
  poster: string;
  tipe: string;
  waktu: string;
}

export interface TempoApiResponse {
  status: boolean;
  data: TempoArticleRaw[];
}
```
Lalu ekspor tipe tersebut melalui `src/modules/news/@types/index.ts`.

---

### Langkah 2: Buat Service Parser Khusus
Buat file service di `src/modules/news/services/tempoService.ts`. Ubah data mentah dari API menjadi format standar **`NewsArticle`**:
```typescript
import { NewsArticle } from "../@types";
import { TempoApiResponse } from "../@types/tempo";

export class TempoService {
  private static readonly API_URL = "https://api.siputzx.my.id/api/berita/tempo";

  static async getArticles(): Promise<NewsArticle[]> {
    try {
      const response = await fetch(this.API_URL, { cache: "no-store" });
      const json: TempoApiResponse = await response.json();

      return (json.data || []).map((item, index) => ({
        id: item.link || `tempo-${index}`,
        title: item.judul,
        link: item.link,
        image: item.poster,
        description: "",
        isoDate: item.waktu || new Date().toISOString(),
        source: "Tempo",
        category: item.tipe || "News",
      }));
    } catch (error) {
      console.error("Gagal mengambil berita Tempo:", error);
      return [];
    }
  }
}
```

---

### Langkah 3: Daftarkan ke Master Aggregator (`newsService.ts`)
Di `src/modules/news/newsService.ts`:
1. Tambahkan ID baru ke union type:
   ```typescript
   export type NewsSourceId = "all" | "cnn" | "kompas" | "tribun" | "tempo";
   ```
2. Tambahkan panggilan service di method `getAllArticles()` dan `getArticles()`:
   ```typescript
   import { TempoService } from "./services/tempoService";

   // Di getAllArticles:
   const [cnn, kompas, tribun, tempo] = await Promise.all([
     CNNService.getArticles(),
     KompasService.getArticles(),
     TribunNewsService.getArticles(),
     TempoService.getArticles(),
   ]);

   // Di getArticles switch-case:
   case "tempo":
     return await TempoService.getArticles();
   ```

---

### Langkah 4: Tambahkan Tab Navigasi & Logo (`NewsView.tsx`)
Buka `src/modules/news/components/NewsView.tsx` dan tambahkan tab baru ke array `SOURCE_TABS`:
```typescript
{
  id: "tempo",
  label: "Tempo",
  icon: (
    <Image
      src="/logo/tempo.svg"
      alt="Tempo"
      width={16}
      height={16}
      className="h-4 w-4 object-contain"
    />
  ),
}
```

---

### Langkah 5: Taruh File Logo di `public/logo/`
Simpan aset logo (format `.svg`, `.png`, atau `.webp`) ke dalam folder `public/logo/`.

Setelah 5 langkah di atas, fitur berita baru otomatis terintegrasi ke dalam tab navigasi, daftar pencarian, filtering, animasi loading, serta sistem kartu!

---

## 🤝 Kontribusi & Standar Kode

- Gunakan format komponen fungsional React dengan *hooks*.
- Pastikan setiap perubahan bebas dari kesalahan TypeScript dengan menjalankan `bun run typecheck`.
- Pastikan tidak ada duplikasi atribut `key` pada list komponen.
- Semua pemanggilan API eksternal harus ditangani di dalam folder `services/` dan menggunakan *error handling* (`try/catch`).

---

## 📄 Lisensi

Didistribusikan di bawah lisensi MIT. Silakan gunakan dan modifikasi secara bebas untuk kebutuhan pembelajaran maupun pengembangan aplikasi.
