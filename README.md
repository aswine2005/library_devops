## Library Management System (React + Vite)

A sleek, single-page Library Management System frontend for DevOps demos. Built with React and Vite; ships static assets ready for Nginx on AWS.

### Features
- Header titled "Library Management System"
- Form to add books (Title, Author)
- List/table of books with status badges
- Borrow / Return toggle per book (UI-only)
- Delete per book
- Clean, modern CSS with dark glassy theme

### Requirements
- Node.js 18+ recommended (macOS)

### Run locally (macOS)
```bash
cd /Users/aswin/Projects/library_devops
npm install
npm run dev
```
Then open the printed local URL (defaults to `http://localhost:5173`).

### Production build
```bash
npm run build
```
This outputs static files to `dist/` suitable for Nginx or S3 + CloudFront.

To preview the production build locally:
```bash
npm run preview
```

### Nginx quick config (example)
```nginx
server {
  listen 80;
  server_name _;
  root /usr/share/nginx/html; # copy contents of dist/ here

  location / {
    try_files $uri /index.html;
  }
}
```

### Deploy to AWS EC2 with Nginx (high level)
1. Build locally and upload `dist/` to your EC2 (or build on EC2):
   ```bash
   # on your Mac
   npm run build
   scp -r dist/ ec2-user@your-ec2-ip:/home/ec2-user/
   ```
2. On EC2 (Amazon Linux):
   ```bash
   sudo yum install -y nginx
   sudo systemctl enable nginx
   sudo systemctl start nginx
   sudo rm -rf /usr/share/nginx/html/*
   sudo cp -r /home/ec2-user/dist/* /usr/share/nginx/html/
   ```
3. Optional: configure `/etc/nginx/conf.d/app.conf` with the example server block above, then reload:
   ```bash
   sudo nginx -t && sudo systemctl reload nginx
   ```

### Project structure
```
library_devops/
  ├─ index.html
  ├─ vite.config.ts
  ├─ package.json
  └─ src/
      ├─ main.jsx
      ├─ App.jsx
      ├─ styles.css
      └─ components/
          ├─ BookForm.jsx
          └─ BookList.jsx
```


