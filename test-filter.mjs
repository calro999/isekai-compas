import fs from 'fs';
const books = JSON.parse(fs.readFileSync('public/data/books.json', 'utf8'));
const overload = books.find(b => b.title.includes('オーバーロード'));
console.log('Book Author:', overload.author);
const mainAuthor = overload.author.split(/[\s\/／・]/)[0].trim();
console.log('Main Author:', mainAuthor);
