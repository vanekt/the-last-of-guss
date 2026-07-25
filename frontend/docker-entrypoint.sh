#!/bin/sh
set -e

# Override default public/env.js 
cat <<EOF > /usr/share/nginx/html/env.js
window.__ENV__ = {
  BACKEND_URL: "${BACKEND_URL}"
};
EOF

exec nginx -g "daemon off;"
