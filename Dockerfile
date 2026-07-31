FROM nginx:alpine

# Copy all static content into the default Nginx public directory
COPY . /usr/share/nginx/html/

# Expose port 80 to mapping
EXPOSE 80
