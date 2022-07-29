const Sauce = require('../models/Sauce');
const fs = require('fs'); //Créer, lire, copier, renommer, supprimer des fichiers et écrire dans des fichiers

// Création d'une sauce
exports.createSauce = (req, res, next) => {
  const sauceObject = JSON.parse(req.body.sauce);
  delete sauceObject._id;
  delete sauceObject._userId;
  const sauce = new Sauce({
    ...sauceObject,
    imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`,
    userId: req.auth.userId,
    likes: 0,
    dislikes: 0,
    usersLiked: [],
    usersdisLiked: [],
  });
  sauce.save()
    .then(() => {
      res.status(201).json({message: 'Nouvelle sauce créée !'})
    })
    .catch(error => {
      res.status(400).json({error})
    })
};


// Modifier la sauce
exports.modifySauce = (req, res, next) => {
  const sauceObject = req.file ? {
    ...JSON.parse(req.body.sauce),
    imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
  } : {...req.body};

  delete sauceObject._userId;// éviter que quelqu'un le modifie a son et le ré-affecte a qqun d'autre (mesure de sécurité)
  Sauce.findOne({_id: req.params.id})// findOne permet de chercher la sauce a modifier
    .then((sauce) => {
      if (sauce.userId !== req.auth.userId) {
        res.status(401).json({message: 'Non-autorisé'});
      } else {
        Sauce.updateOne({_id: req.params.id}, {...sauceObject, _id: req.params.id})
          .then(() => res.status(200).json({message: 'Sauce modifiée !'}))
          .catch(error => res.status(400).json({error}));
      }
    })
    .catch((error) => {
      res.status(400).json({error});
    });
};

// Supprimer une sauce
exports.deleteSauce = (req, res, next) => {
  Sauce.findOne({_id: req.params.id})
    .then(sauce => {
      if (sauce.userId !== req.auth.userId) {
        res.status(401).json({message: 'Non-autorisé'})
      } else {
        const filename = sauce.imageUrl.split('/images/')[1];
        //supprime un fichier avec la function unlick()
        fs.unlink(`images/${filename}`, () => {
          Sauce.deleteOne({_id: req.params.id})
            .then(() => res.status(200).json({message: 'Sauce supprimée !'}))
            .catch(error => res.status(401).json({error}));
        });
      }
    }).catch(error => res.status(500).json({error}));
};

//Récupère une sauce
exports.getOneSauce = (req, res, next) => {
  Sauce.findOne({_id: req.params.id})
    .then(sauce => res.status(200).json(sauce))
    .catch(error => res.status(400).json({error}));
};

//Récupère toutes les sauces
exports.getAllSauces = (req, res, next) => {
  Sauce.find()
    .then(sauces => res.status(200).json(sauces))
    .catch(error => res.status(400).json({error}));
};

//Like/Dislike sur une sauce
exports.actionLike = (req, res, next) => {
   //recuperer id client envoye par front
   const userId =req.body.userId;
    
   //si like = 1
   if (req.body.like == 1){
   //Ajouter le userID  au tableau userLiked +1like
   Sauces.updateOne({_id: req.params.id}, {$push: { usersLiked : userId },$inc: { likes: +1 }})
   .then(()=> res.status(201).json({message: 'liked !'}))
   .catch(error => res.status(400).json({ error }));      
       
   }

   else {
       //si disliked =1
       if (req.body.like == -1){
         //Ajouter le userID  au tableau userDisliked
         Sauces.updateOne({_id: req.params.id}, {$push: { usersDisliked : userId },$inc: { dislikes: +1 }})
         .then(()=> res.status(201).json({message: 'Disliked !'}))
         .catch(error => res.status(400).json({ error }));      
       
       }
       //si like = 0  il faudrat enlever l id user de userliked et userDisliked 
       else {
         //rechercher la sauce 
         Sauces.findOne({ _id: req.params.id})
         .then((sauce) =>{
           //Si le user est dans  usersliked 
           if(sauce.usersLiked.includes(userId)){
                 //Retirer le userID  au tableau userLiked - 1 likes
             Sauces.updateOne({_id: req.params.id}, {$pull: { usersLiked : userId }, $inc: {likes : -1 }})
             .then(()=> res.status(201).json({message: 'not liked anymore!'}))
             .catch(error => res.status(400).json({ error }));                   
           }
           //Si le user est dans  usersliked
           if(sauce.usersDisliked.includes(userId)){
             //Retirer le userID  au tableau userLiked -1 dislikes
             Sauces.updateOne({_id: req.params.id}, {$pull: { usersDisliked : userId }, $inc: {dislikes : -1 }})
             .then(()=> res.status(201).json({message: 'not disliked anymore!'}))
             .catch(error => res.status(400).json({ error }));                   
           }
         })
       }
   }
};