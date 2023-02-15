const Prix = require('../models/prix.model')
const Marche = require('../models/marche.model')
const { Utilisateur, TYPE_USER } = require('../models/utilisateur.model')
const {checkTypeObject} = require('../modules')
const _ = require('lodash')
module.exports = {

    // rechercher un produit dans un marché donné 
    getAllPricesByNameProduct : (request, response) => {
        Prix.find({ nom: request.params.nomProduit, isValidated: true })
          .then((prix) => {
            response.status(200).json(prix)
          })
          .catch((error) => { response.status(500).send(error) })
      },
    getUnvalitedPricesByNameProduct : (req, res) => {
        //On récupère les prix en attente de validation dans la bd pour les envoyer à l'application mobile
        Prix.find({ nom: req.params.nomProduit, isValidated: false })
          .then((prix) => {
            res.json(prix)
          })
          .catch((error) => { res.status(500).json(error) })
      },

    getAllPriceByHuileAndFilter : async (req, res) => {
        // // filtre les données correspondant a l'id du marché 
        // 6318a2d8e8d6f16d395b0863
        const prix =  await Prix.findOne({conditionnement : req.body.conditionnement }), {nom} = await Marche.findById({_id : req.body.id})
        console.log(prix , nom);
        let result = []
        if(!prix ) return res.status(200).json({data : []})
        else {
          if(prix.marche.nom == nom) {
            result.push(prix)
            return res.status(200).json({data : result})}
          else {
            
            return res.status(200).json({data : []})}
        }
                
      },


    getAllPrice : (req , res) =>{
            //On récupère les prix validés de la bd pour les envoyer à l'application mobile
          Prix.find()
          .then((prix) => {
            res.status(200).json({data :prix});
          })
          .catch((error) => {
            res.status(500).send(error);
          });
          
      },
   
      // recherche des prix en fonction du conditionnement et d'un prix donné
    getPriceInMarket : async (req , res) =>{
      const prix =  await Prix.find()
      if(prix.length === 0) return res.status(200).json({data : []})
      else {
        let tmp = []
        for(let elt of prix){
          if(elt.prix_marche <= req.body.prix) tmp.push(elt)
        }
        if(tmp.length == 0) return res.status(200).json({data : []})
        else return res.status(200).json({data : tmp})
      }
    },


    getPriceByName : (req , res) =>{
          Prix.findOne({nom : req.params.namePrice})
          .then((data) => res.status(200).json({data : data}))
          .catch((err) => res.status(400).json({message : err}))
      },
      // mes achats 
    getMyPriceById : async (req , res) =>{
        let user = await Utilisateur.findById(req.params.id)  , prix = []
      
          for(id of user.ownAchats){
            let data = await Prix.findById(id)
            if(data == null) continue
            else prix.push(data)
          }
          if(user) res.status(200).json({data : prix})
          else return res.status(400).json({message : null})
       
      },
      // ajoute un prix d'un marche donnés : fonctionnalités pour les autres acteurs 
    addPricesByIdAndMarcheId : (req, res) => {
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


  
  // cette methode permet a un controllerur de valider les prix : statut controlleur dans l'application 
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
  
  // cette methode permet a un controleur de valider un produit collecté par un enqueteur 
  validProductByControler : (req , res) =>{
    let {type_user} = Utilisateur.findById(req.params.id)
    if(type_user.length == 0) return res.status(200).json({message : "Vous n'etes pas un acteur de cette application"})
    else {
        if(checkTypeObject(TYPE_USER , type_user).status){
          if(TYPE_USER[checkTypeObject(TYPE_USER , type_user).index] == "Controleur"){
              Prix.findByIdAndUpdate(
                req.body.prixId ,  {isValidated : true},
                (err , result) =>{
                  if(err) return res.status(200).json({message : "Une erreur est survenue lors de la validation du prix"})
                  else res.status(200).json({message : 'Prix validé avec succès'});
                }
              )
          }
          else return res.status(400).json({message : "Vous n'etes pas un controleur"})
        }
        else return res.status(200).json({message : "Vous n'etes pas un acteur de cette application"})
    }
  }    // user must be enqueteur 
  // user id send
  
  ,
  // fonctionnalités pour les collecteurs 
  collectData : async (req , res) =>{
    let {type_user} = await Utilisateur.findById(req.params.id) 
    console.log(req.body);
    if(type_user.length == 0 ) return res.status(200).json({message : "Vous n'etes pas un acteur de ce système"})
    else {
        if(checkTypeObject(TYPE_USER , type_user).status){
            if(TYPE_USER[checkTypeObject(TYPE_USER , type_user).index] == "Enqueteur"){
              // recolte des donnée possibles
              //insertion du marché 
              req.body['marche'] = {
                "nom" : req.body.marketName,
                "departement" : req.body.departement,
                "arrondissement" : req.body.arrondissement,
                "region" : req.body.region,
             }
             // enregistrement du prix dans un marché 
              const produit = Prix(req.body) 
              produit.save()
              .then(() => {
                console.log("Enregistrement reussie");
                return res.status(200).json({message : "Enregistrement reussie "})})
              .catch((err) => {return res.status(400).json({message : "Une erreur est survenue lors de l'enregistrement du produit"})})
            }
            else return res.status(200).json({message : "Veuillez changer votre etat en tant qu'enqueteur "})
        }
        else return res.status(200).json({message : "Vous n'etes pas un acteur de ce système "})
    }
  }

}