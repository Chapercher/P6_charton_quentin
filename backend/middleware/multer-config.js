const multer = require('multer');

const MIME_TYPES = {
  'image/jpg': 'jpg',
  'image/jpeg': 'jpg',
  'image.png': 'png'
};

//configure le chemin et le nom de fichier pour les fichiers entrants
const storage = multer.diskStorage({
  destination: (req, file, cb) =>{
    cb(null, 'images');// indique la destination du fichier
  },
  filename: (req, file, cb) => {
    const name = file.originalname.split(' ').join('_');// changer le nom de l'img pour ne pas rentrer en conflit avec une autre
    const extension = MIME_TYPES[file.mimetype];// changer le type d'extension
    cb(null, name + Date.now() + '.' + extension);
  }
});

module.exports = multer({storage: storage}).single('image');

