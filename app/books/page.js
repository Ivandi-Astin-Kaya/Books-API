'use client';

import { useState, useEffect } from 'react';

export default function BooksPage() {
  const [books, setBooks] = useState([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);

  // Fungsi Fetch ke API Local (Jembatan)
  const fetchBooks = async (searchTerm = '') => {
    setLoading(true);
    try {
      // Panggil route.js yang kita buat di atas
      const res = await fetch(`/api/books?q=${searchTerm}`);
      const data = await res.json();

      if (Array.isArray(data)) {
        setBooks(data);
      } else {
        setBooks([]); // Jaga-jaga kalau error
      }
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBooks();
  }, []);

  const handleSearch = (e) => {
    setSearch(e.target.value);
    fetchBooks(e.target.value);
  };

  // Format Rupiah biar cantik
  const formatRupiah = (angka) => {
    return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR' }).format(angka);
  };

  return (
    <div style={{ padding: '2rem', maxWidth: '800px', margin: '0 auto', fontFamily: 'sans-serif' }}>
      <h1>📚 Katalog Buku (Sumber: API Vercel)</h1>

      <input
        type="text"
        placeholder="Cari buku..."
        value={search}
        onChange={handleSearch}
        style={{ width: '100%', padding: '10px', marginBottom: '20px', borderRadius: '5px', border: '1px solid #ccc' }}
      />

      {loading ? <p>Sedang memuat data...</p> : null}

      <div style={{ display: 'grid', gap: '15px' }}>
        {books.map((book) => (
          <div key={book.id} style={{ border: '1px solid #ddd', padding: '15px', borderRadius: '8px', background: 'white' }}>
            <h3 style={{ margin: '0 0 5px 0' }}>{book.title}</h3>
            <p style={{ margin: 0, color: '#666' }}>Penulis: {book.author}</p>
            <p style={{ marginTop: '10px', fontWeight: 'bold', color: 'green' }}>
              {book.prices && book.prices.length > 0 
                ? formatRupiah(book.prices[0].price) 
                : 'Harga Hubungi Admin'}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}