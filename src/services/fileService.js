const path = require('path')

const fs = require('fs');

const uploadSingleFile = (fileObject) => {
    return new Promise((resolve, reject) => {
        // B1: Tạo thư mục upload nếu chưa tồn tại
        let uploadPath = path.resolve(__dirname, "../public/images/upload");
        if (!fs.existsSync(uploadPath)) {
            fs.mkdirSync(uploadPath, { recursive: true });
        }

        // B2: Lấy extension, basename (tên gốc không có .jpg/.png)
        let extName = path.extname(fileObject.name);                        // → ".png"
        let baseName = path.basename(fileObject.name, extName);            // → "abc"

        // B3: Tạo tên file mới → abc-1713328292017.png
        let finalName = `${baseName}-${Date.now()}${extName}`;

        // B4: Đường dẫn tuyệt đối để lưu file
        let finalPath = `${uploadPath}/${finalName}`;

        // B5: Di chuyển file vào thư mục đích
        fileObject.mv(finalPath, (err) => {
            if (err) {
                console.log("Upload error:", err);
                return resolve({
                    status: 'fail',
                    path: null,
                    error: JSON.stringify(err)
                });
            }

            return resolve({
                status: 'success',
                path: `/images/upload/${finalName}`, // Đường dẫn client có thể dùng
                error: null
            });
        });
    });
};


const uploadMultipleFiles = async (fileObjects) => {
    let uploadPath = path.resolve(__dirname, "../public/images/upload");

    // Tạo thư mục nếu chưa có
    if (!fs.existsSync(uploadPath)) {
        fs.mkdirSync(uploadPath, { recursive: true });
    }

    let files = Array.isArray(fileObjects) ? fileObjects : [fileObjects];

    let results = [];

    for (const file of files) {
        try {
            let extName = path.extname(file.name);
            let baseName = path.basename(file.name, extName);
            let finalName = `${baseName}-${Date.now()}${extName}`;
            let finalPath = `${uploadPath}/${finalName}`;

            // Chuyển file vào thư mục đích
            await file.mv(finalPath);

            results.push({
                originalName: file.name,
                uploadedPath: `/images/upload/${finalName}`
            });
        } catch (err) {
            console.error(`Error uploading ${file.name}:`, err);
            results.push({
                originalName: file.name,
                uploadedPath: null,
                error: err.toString()
            });
        }
    }

    return {
        status: 'success',
        files: results
    };
};

module.exports = {
    uploadSingleFile, uploadMultipleFiles
}