import { NextResponse } from 'next/server';

export async function GET(request) {
  // 1. Ambil kata kunci pencarian dari URL (kalau ada)
  const { searchParams } = new URL(request.url);
  const query = searchParams.get('q'); // misal: ?q=jaringan

  try {
    // 2. Tembak ke API Vercel yang sudah jadi
    const res = await fetch('https://books-api-fawn.vercel.app/api/books', {
      cache: 'no-store', // Agar data selalu baru
    });

    // Cek kalau API Vercel-nya error
    if (!res.ok) {
      throw new Error(`Gagal mengambil data: ${res.status}`);
    }

    const jsonResponse = await res.json();
    
    // 3. Ambil Array bukunya (karena formatnya { success: true, data: [...] })
    let books = jsonResponse.data || [];

    // 4. Fitur Search (Filter Manual di sini)
    // Karena API Vercel mungkin ga punya fitur search bawaan, kita filter di "jembatan" ini
    if (query) {
      const lowerQuery = query.toLowerCase();
      books = books.filter(book => 
        (book.title && book.title.toLowerCase().includes(lowerQuery)) ||
        (book.author && book.author.toLowerCase().includes(lowerQuery))
      );
    }

    // 5. Kirim data yang sudah bersih ke Frontend
    return NextResponse.json(books);

  } catch (error) {
    console.error("Error API:", error);
    return NextResponse.json({ error: "Gagal mengambil data buku" }, { status: 500 });
  }
}