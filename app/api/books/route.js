// app/api/books/route.js
import { NextResponse } from 'next/server';
// Ubah baris di bawah ini:
import { supabase } from '../../../lib/supabase';

export async function GET(request) {
  // Ambil parameter dari URL untuk pagination (contoh: ?page=1&limit=10)
  const { searchParams } = new URL(request.url);
  const page = parseInt(searchParams.get('page') || '1');
  const limit = parseInt(searchParams.get('limit') || '10');
  
  // Hitung range data yang mau diambil
  const from = (page - 1) * limit;
  const to = from + limit - 1;

  try {
    // Query ke Supabase
    const { data, error, count } = await supabase
      .from('text_books')
      .select('*', { count: 'exact' })
      .range(from, to)
      .order('title', { ascending: true }); 

    if (error) {
      throw error;
    }

    // Kembalikan response JSON
    return NextResponse.json({
      success: true,
      page,
      limit,
      total_data: count,
      data,
    });

  } catch (error) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}