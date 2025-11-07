# File Upload API Documentation

## Upload Endpoint

### POST `/api/upload`

This endpoint handles file uploads and saves files to the server's "Data" folder.

#### Request
- **Method**: POST
- **Content-Type**: multipart/form-data
- **Body**: FormData with the following fields:
  - `file`: The file to upload (required)
  - `folder`: Subfolder within Data directory (optional, default: 'uploads')

#### Response
```json
{
  "success": true,
  "url": "/data/posts/filename.ext",
  "path": "/data/posts/filename.ext",
  "filename": "unique-filename.ext",
  "message": "File uploaded successfully"
}
```

#### Error Response
```json
{
  "success": false,
  "message": "Error message here"
}
```

## Server Implementation Example (Node.js/Express)

```javascript
const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

const app = express();

// Create Data directory if it doesn't exist
const dataDir = path.join(__dirname, 'Data');
if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir, { recursive: true });
}

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const folder = req.body.folder || 'uploads';
    const uploadPath = path.join(dataDir, folder);
    
    // Create subfolder if it doesn't exist
    if (!fs.existsSync(uploadPath)) {
      fs.mkdirSync(uploadPath, { recursive: true });
    }
    
    cb(null, uploadPath);
  },
  filename: (req, file, cb) => {
    // Generate unique filename
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    const ext = path.extname(file.originalname);
    const name = path.basename(file.originalname, ext);
    cb(null, \`\${name}-\${uniqueSuffix}\${ext}\`);
  }
});

const upload = multer({ 
  storage,
  limits: {
    fileSize: 10 * 1024 * 1024 // 10MB limit
  },
  fileFilter: (req, file, cb) => {
    // Add file type validation if needed
    cb(null, true);
  }
});

// Upload endpoint
app.post('/api/upload', upload.single('file'), (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: 'No file uploaded'
      });
    }

    const relativePath = path.relative(__dirname, req.file.path);
    const urlPath = '/' + relativePath.replace(/\\\\/g, '/');

    res.json({
      success: true,
      url: urlPath,
      path: urlPath,
      filename: req.file.filename,
      message: 'File uploaded successfully'
    });
  } catch (error) {
    console.error('Upload error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});

// Serve uploaded files
app.use('/data', express.static(dataDir));

app.listen(3000, () => {
  console.log('Server running on port 3000');
});
```

## File Structure
After uploading files, your server directory should look like:
```
server/
├── Data/
│   ├── posts/
│   │   ├── document-123456789.docx
│   │   ├── image-987654321.jpg
│   │   └── ...
│   └── uploads/
│       ├── file1.pdf
│       └── file2.txt
├── app.js
└── ...
```

## Security Considerations
1. Validate file types and sizes
2. Sanitize file names
3. Use virus scanning for uploaded files
4. Implement rate limiting
5. Add authentication/authorization
6. Store files outside the web root for sensitive content