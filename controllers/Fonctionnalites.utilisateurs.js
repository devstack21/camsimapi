const {Utilisateur} = require('../models/utilisateur.model')
const Enchere = require('../models/enchere.model')
const Produit = require('../models/produit.model')
const Marche = require('../models/marche.model')
const Prix = require('../models/prix.model')
const Contract = require('../models/contract.model')
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
              Utilisateur.updateOne({_id : req.params.id} , {
                $push : {ownAchats : produit._id}
              },(err , result ) =>{
                if(err) return res.status(400).json({message : 'Une erreur est survenue lors de la sauvegarde'})
                if(result.acknowledged) res.status(200).json({message : 'Produit enregistré avec succès' , prixId : prix._id})
              })
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
              }, (err , result) => {
                if(!err) res.status(200).json({message : "Enchère rejetée avec succès"})
                else return res.status(400).json({message: "Une erreur est survenue lors du rejet de l'enchère"})
              })
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
              else res.status(200).json({ status: true , message : "prix modifié avec succès"});
            }
          );
        } catch (error) {
            return res.status(400).json({message : error})
        }
      },

      // fonction permettant & l'utilisateur de rencherir une enchere courante
    rencherirByIdAndEnchereId : (req, res) => {
        Enchere.updateOne({ _id: req.body.enchereId }, {
          $push: { participant: { userId: req.params.id, prix: req.body.prix, anonyme: req.body.anonyme} }
      
        }, (err, result) => {
          if (err) throw Error('Une erreur est survenue lors de votre operation ');
          if (result.acknowledged) {
           
            res.status(200).json({status: true , data : result})
            Utilisateur.updateOne({_id : req.params.id} , {
              $push : {rencheres : req.params.enchereId }
            }, (err , result) => {
              if(!err) res.status(200).json({message : "Enchère rejetée avec succès"})
              else return res.status(400).json({message: "Une erreur est survenue lors du rejet de l'enchère"})
            })
          }
          else res.status(200).json({status: false})
             
        }) 
      },

      // fonction permettant a l'utlisateur de modifier ou d'editer son enchere
      modifyEnchereByIdAndEnchereId : (req, res) => { 
        const {dateFin , ticket , enchereId} = req.body
        Enchere.findByIdAndUpdate(enchereId, { ticket: ticket  , dateFin:dateFin}, (err, result) => {
          if (err) {
            console.log(err)
            res.status(400).json({ status: false });
          }
          else res.status(200).json({ status: true , data : result });
        } 
        )
      },

      // fonction permettant de rejeter une enchere ? qui rejete l"enchere 
    rejeterEnchereByIdAndEnchereId : (req, res) => {
        Enchere.updateOne({ _id: req.params.enchereId }, {
      
          $pull: { participant: { userId: req.body.userId} },
        
        },(err , result ) => {
              if(err) return res.status(400).json({message : err})
              else {
               Utilisateur.updateOne({_id : req.params.id}, {
                  $pull : {rencheres  : req.params.enchereId},   
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
            // enregistrement du prix dans la base de données
            prix.save().then(() => {
              Utilisateur.updateOne({_id : req.params.id} , {
                $push : {ownAchats : prix._id}
              },(err , result ) =>{
                if(err) return res.status(400).json({message : 'Une erreur est survenue lors de la sauvegarde'})
                if(result.acknowledged) res.status(200).json({message : 'Prix enregistré avec succès' , prixId : prix._id})
              })
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

  // validation du prix du produit par l'utilisateur
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
  },


  // creation du contrat par l'utilisateur (producteur)
  createNewContractById : (request , response) =>{
      try {
        Utilisateur.findById(request.params.id , (err , result) =>{
          if(err) throw Error('Une erreur est survenue lors de la creation du contract')
          // si l'utilisateur ou le producteur n'existe pas
          if(!result) return response.status(200).json({message : 'Utilisateur inconnu'})
          else {
            try {
                //creation d'un contract par un vendeurId 
                const newContract = new Contract(request.body)
                // sauvegarde du contract dans la base de donnée
                newContract.save((err , result) =>{
                    if(!err) response.status(200).json({contractId : result._id})
                    else return response.status(400).json({message : 'Une erreur est survenue lors de la creation de votre contract'})
                })
            } catch (error) {
              return response.status(400).json({message : error})
            }
          }
      })
      } catch (error) {
          return response.status(400).json({message : error})
      } 
  },

  // editer ou modifier un contract existant (producteur) :if aucun postulant 
  editContractByIdAndContractId : (request , response) =>{
      Contract.findByIdAndUpdate(
        request.params.contractId, request.body,
        (err, doc) => {
          if (err) throw Error('Une erreur est survenue lors de la modification de votre contract')
          
          else response.status(200).json({ status: true , message : 'prix modifié avec succès'});
        }
      );
  },

  // cette fonction permet a un utilisateur de candidater pour un contract en cours 
  applyContractByIdAndContractId : (request , response) =>{
      try {
        Contract.updateOne({_id : request.params.contractId} ,(err , result) =>{
          if(err) throw Error('Une erreur est survenue lors de votre candidature a ce contract')
          if(!result) throw Error('Une erreur est survenue lors de votre candidature a ce contract')
          else {
            Contract.updateOne({_id : request.params.contractId} , {
              $push : {interested : { interestedId : request.params.id , date : new Date().getTime()}},
              
            },(err , result) =>{
                if(err) throw Error('Une erreur est survenue lors de votre candidature a ce contrat')
                if(result.acknowledged){
                    Utilisateur.updateOne({_id : request.params.id} ,{
                      $push : {contractApply : request.params.contractId}
                    },(err , result) =>{
                        if(err) throw Error('Une erreur est survenue lors de votre candidature a ce contrat')
                        if(result.acknowledged) response.status(200).json({
                          message : "Candidature au contrat reussie"
                        })
                    })
                }
            })
          }
      })
      } catch (error) {
        return response.status(400).json({"message" : error })
      }
  }
}