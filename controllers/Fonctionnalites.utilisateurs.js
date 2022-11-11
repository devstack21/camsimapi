const {Utilisateur} = require('../models/utilisateur.model')
const Enchere = require('../models/enchere.model')
const Produit = require('../models/produit.model')
const Marche = require('../models/marche.model')
const Prix = require('../models/prix.model')
/*
 @global docs 'exportation des differentes fonctions liées aux differents routes de l'application NodeJS
 @Indication 'Pour plus details voir dans le dossier routes : explications de chaque route'
 */
module.exports = {
    // fonction d'ajout d'un produit 
    addProductById : (req, res) => {
        Utilisateur.findOne({ username: req.body.nomVendeur, statut: "Producteur" }, (error, producteur) => {
          // Si une erreur survient
          if (error) throw Error('Une erreur est survenue lors de la sauvegarde');
          // Si le marché n'existe pas 
          if (!producteur) {
            //On enregistre le produit
            const produit = Produit(req.body)
            produit.save().then(() => {
              res.status(200).json({ message: 'Produit enregistré!', status: true , productId : produit._id});
            })
          } else {
            res.status(200).json({ message: "Ce producteur n'est pas repertorié!", status: false });
          }
        });
      },
      // fonction permettant de poster une enchere 
      addEnchereById : (req, res) => {
        Utilisateur.findOne({ username: req.body.nomVendeur, statut: "Producteur" }, (err, producteur) => {
          if (err) throw err;
          if (producteur) {
            const enchere = Enchere(req.body)
            enchere.save().then(() => {
              res.status(200).json({ message: "Enchere enregistrée avec success", status: true , enchereId : enchere._id});
              // ajouter l'id de l'enchere crée dans les données de l'utilisateur courant
              Utilisateur.updateOne({_id : req.params.id} , {
                $push : { ownEncheres : enchere._id}
              },{new : true , upsert : true})
            })
            .catch((err) => {
              console.log('Erreur : ', err);
              return res.status(500).json({message : 'Une erreur est survenue lors de la sauvegarde de l'/'enchère'})
            })
          }
          else {
            res.status(400).json({ message: "Ce producteur n'est pas repertorié!", status: false });
          }
        })
      
      },
      modifyProductPriceByIdAndProduitId : (req, res) => {
        try {
          Produit.findByIdAndUpdate(
            req.params.produitId, { prix: req.body.prix },
            (err, doc) => {
              if (err) {
                console.log(err)
                throw Error('Une erreur est survenue lors de la modification')
              }
              else {
                res.status(200).json({ status: true , message : "prix modifié avec succès"});
              }
            }
          );
        } catch (error) {
            return res.status(400).json({message : error})
        }
       
      },
      // rencherir une enchere courante
      rencherirByIdAndEnchereId : (req, res) => {
        Enchere.updateOne({ _id: req.body.enchereId }, {
          $push: { participant: { userId: req.params.id, prix: req.body.prix, anonyme: req.body.anonyme} }
      
        }, (err, result) => {
          if (err) throw Error('Une erreur est survenue lors de votre operation ');
          if (result.acknowledged) {
           
            res.status(200).json({status: true , data : result})
            Utilisateur.updateOne({_id : req.params.id} , {
              $push : {rencheres : req.params.enchereId }
            },{new : true , upsert : true})
          }
          else res.status(200).json({status: false})
             
        }) 
      },
      // modifier une enchere
      modifyEnchereByIdAndEnchereId : (req, res) => { 
        const {dateFin , ticket , id , enchereId} = req.body
        Enchere.findByIdAndUpdate(enchereId, { ticket: ticket  , dateFin:dateFin}, (err, result) => {
          if (err) {
            console.log(err)
            res.status(400).json({ status: false });
          }
          else res.status(200).json({ status: true , data : result });
        } 
        )
      },
      // fonction permettant de rejeter une enchere 
      rejeterEnchereByIdAndEncherId : (req, res) => {
        Enchere.updateOne({ _id: req.params.enchereId }, {
      
          $pull: { participant: { nom: req.body.userId} },
        
        },(err , result ) => {
              if(err) return res.status(400).json({message : err})
              else {
               Utilisateur.updateOne({_id : req.params.id}, {
                  $pull : req.body.d,   
               },
               {new : true , upsert : true },(err , result ) =>{
                  if(!err)  res.status(200).json({message : 'Enchère rejetée avec succès' , data : result});
                  else return res.status(400).json({message : 'Une erreur est survenue lors de l'/'annulation de l'/'enchère'})
                }
               )
              }
        });
    },
    // ajoute un prix d'un marche donnés
   addPricesById : (req, res) => {
    try {
      Marche.findOne({ nom: req.body.nomMarche, arrondissement: req.body.arrondissement }, (error, marche) => {
        // Si une erreur survient
        if (error) throw Error('Une erreur est survenue lors de la sauvegarde');
        // Si le marché n'existe pas
        if (marche) {
          //On enregistre le produit
          const prix = Prix(req.body)
          prix.save().then(() => {
            res.status(200).json({ message: 'Prix enregistré!', status: true , prixId : prix._id});
          })
          .catch((err) => {throw Error('Une erreur est survenue lors de votre ajout')})
        } else {
          res.status(200).json({ message: "Ce marché n'est pas encore repertorié!", status: false });
        }
      });
    } catch (error) {
      return res.status(400).json({message : error})
    }
   
  },

  validatePriceByIdAndPrixId : (req, res) => {
    if (req.body.prix == undefined) {
      Prix.findByIdAndUpdate(
        req.params.prixId, { isValidated: true },
        (err, doc) => {
          if (err) {
            console.log(err)
            res.status(400).json({ status: false });
          }
          else {
            res.status(200).json({ status: true });
          }
        }
      );
    } else {
      Prix.findByIdAndUpdate(
        req.params.prixId, { prix_marche: req.body.prix, isValidated: true },
        (err, doc) => {
          if (err) {
            console.log(err)
            res.status(400).json({ status: false });
          }
          else {
            res.status(200).json({ status: true });
          }
        }
      );
    }
  }


}