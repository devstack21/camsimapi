const {Utilisateur} = require('../models/utilisateur.model')
const Enchere = require('../models/enchere.model')
const Produit = require('../models/produit.model')
const Marche = require('../models/marche.model')
const Prix = require('../models/prix.model')
const Contract = require('../models/contract.model')
const {compareDate} = require('../modules')
const moment = require('moment')()
/** 
 @global {String} docs 'exportation des differentes fonctions liées aux differents routes de l'application NodeJS
 @Indication 'Pour plus details voir dans le dossier routes : explications de chaque route'
 */

module.exports = {

    // fonction d'ajout d'un produit (achat vente)
  addProductById : (req, res) => {
        Utilisateur.findOne({ username: req.body.nomVendeur, statut: "Producteur" }, (error, producteur) => {
          // Si une erreur survient
          if (error) return res.status(400).json({message :'Une erreur est survenue lors de la sauvegarde'});
          // Si le marché n'existe pas 
          if (producteur) {
            //On enregistre le produit
            const produit = Produit(req.body)
            produit.save().then(() => {
              Utilisateur.updateOne({_id : req.params.id} , {
                $push : {ownVentes : produit._id}
              },(err , result ) =>{
                if(err) return res.status(400).json({message : 'Une erreur est survenue lors de la sauvegarde'})
                if(result.acknowledged) res.status(200).json({message : 'Produit enregistré avec succès' , prixId : produit._id})
              })
            })
          } else {
            res.status(200).json({ message: "Ce producteur n'est pas repertorié!", status: false });
          }
        });
      },

      // fonction permettant de poster une enchere 
    addEnchereById : (req, res) => {
      console.log(req.params);
        Utilisateur.findOne({ username: req.body.nomVendeur, statut: "Producteur" }, (err, producteur) => {
          if (err) throw err;
          if (producteur) {
            const enchere = Enchere(req.body)
            enchere.save().then(() => {
              // ajouter l'id de l'enchere crée dans les données de l'utilisateur courant
              Utilisateur.updateOne({_id : req.params.id} , {
                $push : { ownEncheres : enchere._id}
              }, (err , result) => {
                if(!err) res.status(200).json({ message: "Enchere enregistrée avec success", status: true , enchereId : enchere._id});
                else return res.status(400).json({message: "Une erreur est survenue lors du rejet de l'enchère"})
              })
            })
            .catch((err) => {
              console.log('Erreur : ', err);
              return res.status(500).json({message : 'Une erreur est survenue lors de la sauvegarde de l'/'enchère'})
            })
          }
          else return res.status(400).json({ message: "Ce producteur n'est pas repertorié!", status: false });
          
        })
      
      },

    modifyProductPriceByIdAndProduitId : (req, res) => {
          Produit.findByIdAndUpdate(
            req.params.produitId, { prix: req.body.prix },
            (err, doc) => {
              if (err) return res.status(400).json({message :'Une erreur est survenue lors de la modification'})
              else res.status(200).json({ status: true , message : "prix modifié avec succès"});
            }
          );
        
      },

      // fonction permettant & l'utilisateur de rencherir une enchere courante
    rencherirByIdAndEnchereId : async (req, res) => {
      const user = await Utilisateur.findById(req.params.id) , enchere = await Enchere.findById(req.params.enchereId)
        // verification (use name )
        if(user){

            // si l'utilisateur postule pour sa propre enchère ou s'il existe deja dans la liste des participants
            if(user.ownEncheres.includes(req.params.enchereId) ) return res.status(400).json({message : 'Vous ne pouvez pas rencherir a cette enchère'})
            else 
            {
              // si l'utilisateur rencherit après le delai de l'enchere
              
              if(compareDate(enchere.dateFin , moment.format("MM-DD-YYYY"))){
                //on met a jour les données de l'enchère en inserant les données du participant a savoir son id  , username et autres données
                Enchere.updateOne({ _id: req.params.enchereId }, {
                  $push: { participant: { userId: req.params.id, prix: req.body.prix, anonyme: req.body.anonyme , telephone : req.body.telephone , username : req.body.username , isOnEnchere : false} }
              
                }, (err, result) => {
                  if (err) return res.status(400).json({message :'Une erreur est survenue lors de votre operation '});
                  if (result.acknowledged) {
                    // ensuite ici on met a jour les données de 'utilisateur qui a rencherit pour une meilleure traçabilité
                    Utilisateur.updateOne({_id : req.params.id} , {
                      $push : {rencheres : req.params.enchereId }
                    }, (err , result) => {
                      if(!err) return res.status(200).json({message : "Enchère acceptée avec succès" , data : result  })
                      else res.status(400).json({message: "Une erreur est survenue lors de votre renchère" })
                    })
                  }
                  // else res.status(200).json({status: false})
                     
                })
              }
              // si le delai est passé alors on envoit ce message d'erreur 
              else return res.status(400).json({message : "La date limite de cette enchère et depassée"})
              
            }
        }// end if 
        else return res.status(400).json({mesage : "Utilisateur inconnu"})
        
      },

      // fonction permettant a l'utlisateur de modifier ou d'editer son enchere : a tester 
      modifyEnchereByIdAndEnchereId : async (req, res) => { 
        const {participant} = await Enchere.findById(req.params.enchereId) 
        if (participant.length == 0){
          Enchere.findByIdAndUpdate(req.params.enchereId,req.body, (err, result) => {
            if (err) return res.status(400).json({ status: false });
            if(!result) return res.status(400).json({message : 'Une erreur est survenue lors de la modification de votre enchère'})
            else res.status(200).json({ status: true , data : result });
          } 
          )
        }
        else return res.status(400).json({message : 'Vous ne pouvez modifier cette enchère car elle a deja des participants'})
       
      },

      // fonction permettant de rejeter une enchere ? qui rejete l"enchere  : a tester 
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
   addPricesByIdAndMarcheId : (req, res) => {
        console.log('HELLO PRICE');
        Marche.findById(req.params.marcheId , (error, marche) => {
          // Si une erreur survient
          if (error) return res.status(400).json({message : 'Une erreur est survenue lors de la sauvegarde '});
          // Si le marché n'existe pas
          if (marche) {
            //On enregistre le produit d'un marché donné
            req.body['marche'] = marche
            const prix = Prix(req.body)
            // enregistrement du prix dans la base de données
            prix.save()
              .then(() => {
                Utilisateur.updateOne({_id : req.params.id} , {
                  $push : {ownAchats : prix._id}
                },(err , result ) =>{
                  if(err) return res.status(400).json({message : 'Une erreur est survenue lors de la sauvegarde '})
                  if(result.acknowledged) res.status(200).json({message : 'Prix enregistré avec succès' , prixId : prix._id})
                })
              }).catch((err) => {return res.status(400).json({mesage : 'Une erreur est survenue lors de la sauvegarde S ' , err : err})})
            
          } else {
            res.status(200).json({ message: "Ce marché n'est pas encore repertorié!", status: false });
          }
        });
  },

  // validation du prix du produit par l'utilisateur
  validatePriceByIdAndPrixId : (req, res) => {
    if (req.body.prix == undefined) {
      Prix.findByIdAndUpdate(
        req.params.prixId, { isValidated: true },
        (err, doc) => {
          if (err) res.status(400).json({ message : 'Une erreur est survenue lors de la validation du prix',status: false });
          else {
            res.status(200).json({ message : 'Prix validé avec succès',status: true });
          }
        }
      );
    } else {
      Prix.findByIdAndUpdate(
        req.params.prixId, { prix_marche: req.body.prix, isValidated: true },
        (err, doc) => {
          if (err) return res.status(400).json({ message : 'Une erreur est survenue lors de la validation du prix', status: false });
          else res.status(200).json({message : 'Prix validé avec succès', status: true });
        }
      );
    }
  },


  // creation du contrat par l'utilisateur (producteur)
  createNewContractById : (request , response) =>{
        Utilisateur.findById(request.params.id , (err , result) =>{
          if(err) return response.status(400).json({message :'Une erreur est survenue lors de la creation du contract ', err : err})
          // si l'utilisateur ou le producteur n'existe pas
          if(!result) response.status(200).json({message : 'Utilisateur inconnu'})
          else {
                //creation d'un contract par un vendeurId
                request.body['vendeurId'] = request.params.id 
                const newContract = new Contract(request.body)
                // sauvegarde du contract dans la base de donnée
                newContract.save((err , result) =>{
                    if(!err) {
                      Utilisateur.updateOne({_id : request.params.id} ,{
                        $push : {ownContracts : newContract._id}
                      }, (err , result) =>{
                        if(!err) response.status(200).json({message : 'Creation du contract avec succès' , contractId : newContract._id})
                        else return response.status(400).json({message :'Une erreur est survenue lors de la creation de votre contract' , err : err})
                      })
                    }
                    else return response.status(400).json({message :'Une erreur est survenue lors de la creation de votre contract ' , err : err})
                })
            
          }
      })   
  },

  // editer ou modifier un contract existant (producteur) :if aucun postulant 
  editContractByIdAndContractId : async (request , response) =>{
      const user = await Utilisateur.findById(request.params.id) , {interested} = await Contract.findById(request.params.contractId)
      if(user){
          if(interested.length == 0){
              Contract.findByIdAndUpdate(
                request.params.contractId, request.body,
                (err, doc) => {
                  if (err) return response.status(400).json({message :'Une erreur est survenue lors de la modification de votre contract' , err : err})
                  else response.status(200).json({ status: true , message : 'contract modifié avec succès'});
                }
              ); 
          }
          else return response.status(200).json({message : 'Vous ne pouvez plus faire une modification sur ce contrat car il a deja des participants'})
      }
      else return response.status(400).json({message : 'Utilisateur inconnu'}) 
  },

  // cette fonction permet a un utilisateur de candidater pour un contract en cours 
  applyContractByIdAndContractId : async (request , response) =>{
    const user = await Utilisateur.findById(request.params.id) 
    if(user){
      if(user.ownContracts.includes(request.params.contractId)) return response.status(400).json({message : 'Vous ne pouvez pas postuler pour ce contract'})
      else {  

        Contract.updateOne({_id : request.params.contractId} , {
          $push : {interested : { interestedId : request.params.id , username : request.body.username , prix : request.body.prix , isOnContract: false}},
          
        },(err , result) =>{
            if(err) return response.status(400).json({message : 'Une erreur est survenue lors de votre candidature a ce contract'})
            if(result.acknowledged){
                Utilisateur.updateOne({_id : request.params.id} ,{
                  $push : {contractApply : request.params.contractId}
                },(err , result) =>{
                    if(err) return response.status(400).json({message : 'Une erreur est survenue lors de votre candidature a ce contract'})
                    if(result.acknowledged) response.status(200).json({
                      message : "Candidature au contrat reussie"
                    })
                })
            }
        })
           
      }
    }
    else return response.status(400).json({message : 'Utilisateur inconnu'})
  },
  // cette fonction permet a un producteur de valider la candidature contract d'un consommateur 
  validParticipantContractByIdAndContractId : async (req , res) =>{
      const contract = await Contract.findById(req.params.contractId)
      for (let interested of contract.interested){
        if(interested.username == req.body.username){
          interested.isOnContract = false 
          contract.save((err , result) =>{
            if(err) return res.status(400).json({message : 'Erreur de validation'})
            else res.status(200).json({message : `Validation de l'utilisateur ${req.body.username} reussie` , data : result})
          })
          break 
        }
      }
      
  },
  // cette fonction permet a un producteur de valider la candidature enchère d'un consommateur 
  validParticipantEnchereByIdAndEnchereId : async (req , res) =>{ 
    const enchere = await Contract.findById(req.params.enchereId)
    for (let participant of enchere.participant){
      if(participant.username == req.body.username){
        participant.isOnEnchere = true
        enchere.save((err , result) =>{
          if(err) return res.status(400).json({message : 'Erreur de validation'})
          else res.status(200).json({message : `Validation de l'utilisateur ${req.body.username} reussie` , data : result})
        })
        break 
      }
    }
  }
}