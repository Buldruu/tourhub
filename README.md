# Aylal

Aylal бол React + Vite + TypeScript дээр хийсэн хоёр хэлтэй аяллын үйлчилгээний website юм.

## Гол боломжууд

- Монгол / Англи хэл солих toggle
- Mobile-first responsive layout
- Нүүр, гадаад аялал, дотоод аялал, үйлчилгээ, авиа, виз, буудал, тасалбар, холбоо барих pages
- Захиалгын modal form
- WhatsApp message үүсгэх
- Local demo admin dashboard
- Захиалгыг browser `localStorage` дээр хадгалах
- CSV export

## Project structure

```txt
aylal/
  src/
    main.tsx
    style.css
    app.css
  index.html
  package.json
  vite.config.ts
  tsconfig.json
  .env.example
```

## Local ажиллуулах

```bash
npm install
cp .env.example .env
npm run dev
```

Browser дээр:

```txt
http://localhost:5173
```

## Environment тохиргоо

`.env.example` файлыг `.env` болгож хуулна. Дараа нь доорх утгуудыг өөрийн мэдээллээр солино.

```env
VITE_WHATSAPP_LINK=https://wa.me/97699990000
VITE_FACEBOOK_MESSENGER_LINK=https://m.me/aylal
VITE_PHONE=+976 9999-0000
VITE_ADMIN_USERNAME=admin
VITE_ADMIN_PASSWORD=change-this-password
```

> Анхаар: Энэ admin хэсэг нь зөвхөн demo/local dashboard. Production дээр backend auth ашиглах хэрэгтэй.

## Build хийх

```bash
npm run build
npm run preview
```

## Deploy

Vercel, Netlify, Cloudflare Pages эсвэл cPanel static hosting дээр байршуулж болно.

Vercel дээр:

```bash
npm install
npm run build
```

Build output:

```txt
dist
```

## Admin dashboard

```txt
/#/admin
```

Admin username/password-ийг `.env` файл дээр тохируулна.

## GitHub publish хийх

```bash
git init
git add .
git commit -m "Initial Aylal website"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/aylal.git
git push -u origin main
```
