"use client";
import { useState, useEffect } from "react";

export default function BooksPage() {
  // 1. Definisikan state yang dibutuhkan
  const [books, setBooks] = useState([]);
  const [search, setSearch] = useState(""); // Memperbaiki error 'search is not defined'
  const [loading, setLoading] = useState(true);

  // 2. Fungsi untuk mengambil data dari API
  const fetchBooks = async (searchTerm = "") => {
    setLoading(true);
    try {
      const res = await fetch(`/api/books?q=${searchTerm}`);
      const data = await res.json();
      setBooks(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error("Gagal memuat buku:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBooks();
  }, []);

  // 3. Handler untuk pencarian
  const handleSearch = (e) => {
    const value = e.target.value;
    setSearch(value);
    fetchBooks(value);
  };

  // Style untuk tabel
  const thStyle = { padding: '12px', borderBottom: '2px solid #ddd', backgroundColor: '#74787d' };
  const tdStyle = { padding: '12px', borderBottom: '1px solid #8f5454' };

  return (
  <div style={{ padding: '2rem', maxWidth: '1400px', margin: '0 auto', fontFamily: 'sans-serif', backgroundColor: '#1d1c1c' }}>
    <h1 style={{ color: '#eaeaea', marginBottom: '20px' }}>📚 Katalog Perpustakaan Lengkap</h1>
    
    <input 
      type="text"
      placeholder="Cari Judul atau Penulis"
      value={search}
      onChange={handleSearch}
      style={{ width: '100%', padding: '12px', marginBottom: '25px', borderRadius: '10px', border: '1px solid #e2e8f0', fontSize: '1rem', color: '#eaeaea', boxShadow: '0 2px 4px rgba(0,0,0,0.05)' }}
    />

    {loading ? (
      <p style={{ textAlign: 'center', color: '#718096' }}>Sedang memuat data dari database...</p>
    ) : (
      <div style={{ overflowX: 'auto', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)', borderRadius: '12px', backgroundColor: 'white' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: '1000px' }}>
          <thead>
            <tr style={{ backgroundColor: '#edf2f7', textAlign: 'left' }}>
              <th style={thStyle}>ID & Identitas</th>
              <th style={thStyle}>Informasi Buku</th>
              <th style={thStyle}>Klasifikasi</th>
              <th style={thStyle}>Status & Harga</th>
            </tr>
          </thead>
          <tbody>
            {books.length > 0 ? books.map((book) => (
              <tr key={book.id} style={{ borderBottom: '1px solid #edf2f7' }}>
                {/* Kolom 1: ID & Identitas (NUIB/ISBN) */}
                <td style={tdStyle}>
                  <div style={{ fontSize: '0.75rem', color: '#a0aec0', marginBottom: '4px' }}>ID: {book.id}</div>
                  <div style={{ fontWeight: '600', color: '#4a5568' }}>NUIB: {book.nuib || '-'}</div>
                  <div style={{ fontSize: '0.85rem', color: '#718096' }}>ISBN: {book.isbn || 'N/A'}</div>
                </td>

                {/* Kolom 2: Informasi Utama */}
                <td style={tdStyle}>
                  <div style={{ fontWeight: 'bold', color: '#2d3748', fontSize: '1rem', marginBottom: '4px' }}>{book.title}</div>
                  <div style={{ color: '#4a5568', fontSize: '0.9rem' }}>Penulis: {book.author || 'Tidak ada data'}</div>
                  <div style={{ fontSize: '0.8rem', color: '#718096', marginTop: '4px' }}>
                    Tahun: {book.publication_year || '-'} | Ed: {book.edition || '-'}
                  </div>
                </td>

                {/* Kolom 3: ID Klasifikasi (Subject, Class, dll) */}
                <td style={tdStyle}>
                  <div style={tagStyle}>Subject: {book.subject_id?.substring(0,8)}...</div>
                  <div style={tagStyle}>Class: {book.class_id?.substring(0,8)}...</div>
                  <div style={tagStyle}>Level: {book.school_level_id?.substring(0,8)}...</div>
                </td>

                {/* Kolom 4: Deskripsi & Harga */}
                <td style={tdStyle}>
                  <div style={{ fontSize: '0.85rem', color: '#4a5568', fontStyle: 'italic', marginBottom: '8px' }}>
                    {book.description ? book.description.substring(0, 50) + '...' : 'Tanpa deskripsi'}
                  </div>
                  <div style={{ fontWeight: 'bold', color: '#38a169' }}>
                    {/* Mengasumsikan data harga ada dalam JSON prices */}
                    Tersedia di Database
                  </div>
                </td>
              </tr>
            )) : (
              <tr>
                <td colSpan="4" style={{ padding: '40px', textAlign: 'center', color: '#a0aec0' }}>Data buku kosong atau tidak ditemukan.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    )}
  </div>
);
}

const thStyle = { padding: '15px', color: '#4a5568', fontSize: '0.85rem', fontWeight: 'bold', borderBottom: '2px solid #e2e8f0' };
const tdStyle = { padding: '15px', verticalAlign: 'top' };
const tagStyle = { display: 'inline-block', backgroundColor: '#f7fafc', padding: '2px 6px', borderRadius: '4px', fontSize: '0.7rem', color: '#718096', margin: '2px 0', border: '1px solid #e2e8f0' };

