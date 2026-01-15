// app/api/books/route.js
import { NextResponse } from 'next/server';
// Mundur 3 tingkat dari route.js -> books -> api -> app -> baru ke lib
import { supabase } from '../../../lib/supabase';

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const query = searchParams.get('q');

  try {
    // 1. Ambil data LANGSUNG dari tabel Supabase Anda
    // Ganti 'books' dengan nama tabel Anda di Supabase
    let { data: books, error } = await supabase
      .from('text_books') 
      .select('*');

    if (error) {
      throw error;
    }

    // 2. Fitur Search Manual (opsional, atau bisa pakai filter Supabase)
    if (query && books) {
      const lowerQuery = query.toLowerCase();
      books = books.filter(book => 
        (book.title?.toLowerCase().includes(lowerQuery)) ||
        (book.author?.toLowerCase().includes(lowerQuery))
      );
    }

    return NextResponse.json(books || []);

  } catch (error) {
    console.error("Supabase Error:", error.message);
    return NextResponse.json(
      { error: "Gagal mengambil data dari Supabase", detail: error.message }, 
      { status: 500 }
    );
  }
}