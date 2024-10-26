const fs = require("node:fs");
const readline = require("node:readline");

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

const app = {};

app.makeFolder = () => {
  rl.question("Masukan Nama Folder: ", (folderName) => {
    fs.mkdir(__dirname + `/${folderName}`, (err) => {
      if (err) throw err;
      console.log("Success created new folder");
      rl.close();
    });
  });
};

app.makeFile = () => {
  rl.question("Masukan Nama File: ", (fileName) => {
    rl.question("Masukan Ekstensi File (misal: txt): ", (ext) => {
      fs.writeFile(__dirname + `/${fileName}.${ext}`, "", (err) => {
        if (err) throw err;
        console.log(`File ${fileName}.${ext} berhasil dibuat.`);
        rl.close();
      });
    });
  });
};

app.extSorter = () => {
  const unorganizedPath = __dirname + "/unorganize_folder";
  fs.readdir(unorganizedPath, (err, files) => {
    if (err) throw err;

    files.forEach((file) => {
      const ext = file.split(".").pop(); 
      const destFolder = ext === "txt" ? "text" : ext === "jpg" || ext === "png" ? "image" : "others";
      const destFolderPath = __dirname + `/${destFolder}`;

      if (!fs.existsSync(destFolderPath)) {
        fs.mkdirSync(destFolderPath);
      }

      fs.rename(unorganizedPath + `/${file}`, destFolderPath + `/${file}`, (err) => {
        if (err) throw err;
      });
    });

    console.log("File berhasil dipindahkan berdasarkan ekstensi.");
    rl.close();
  });
};

app.readFolder = () => {
  rl.question("Masukan Nama Folder: ", (folderName) => {
      const folderPath = __dirname + `/${folderName}`;
      fs.readdir(folderPath, (err, files) => {
          if (err) throw err;

          const fileInfo = files.map((file) => {
              const stats = fs.statSync(folderPath + `/${file}`);
              const fileSize = (stats.size / 1024).toFixed(2);
              return {
                  namaFile: file,
                  extensi: file.split(".").pop(),
                  jenisFile: ["jpg", "png"].includes(file.split(".").pop()) ? "gambar" : "text",
                  tanggalDibuat: stats.birthtime.toISOString().split("T")[0],  // Format as YYYY-MM-DD
                  ukuranFile: fileSize >= 1024 ? `${(fileSize / 1024).toFixed(2)} mb` : `${fileSize} kb`,
              };
          });

          fileInfo.sort((a, b) => new Date(b.tanggalDibuat) - new Date(a.tanggalDibuat));

          console.log(`Berhasil menampilkan isi dari folder ${folderName}:`);
          console.log(JSON.stringify(fileInfo, null, 2));
          rl.close();
      });
  });
};
  

app.readFile = () => {
    rl.question("Masukan Nama File (dengan ekstensi): ", (fileName) => {
      const filePath = __dirname + `/${fileName}`;

      const ext = fileName.split(".").pop().toLowerCase();

      const imageExtensions = ["jpg", "jpeg", "png", "gif", "bmp", "svg"];
      if (imageExtensions.includes(ext)) {
        console.log("Error: File gambar tidak bisa dibaca.");
        rl.close();
        return;
      }
  
      fs.readFile(filePath, "utf8", (err, data) => {
        if (err) {
          console.log("Error membaca file:", err.message);
          rl.close();
          return;
        }
        console.log(`Isi dari file ${fileName}:\n`);
        console.log(data);
        rl.close();
      });
    });
  };
  
  

module.exports = app;
