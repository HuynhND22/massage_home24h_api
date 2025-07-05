FROM node:18

# Thiết lập thư mục làm việc trong container
WORKDIR /app

# Sao chép package.json và package-lock.json (nếu có)
COPY package*.json ./

# Cài đặt dependencies với --legacy-peer-deps
RUN npm install --legacy-peer-deps

# Sao chép toàn bộ mã nguồn
COPY . .

# Build ứng dụng
RUN npm run build

# Expose cổng mà ứng dụng sẽ chạy (thường là 3000 cho NestJS)
EXPOSE 3000

# Khởi chạy ứng dụng
CMD ["node", "dist/main.js"] 