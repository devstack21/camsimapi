const Prix = require('../models/prix.model')
const Marche = require('../models/marche.model')
const {Utilisateur} = require('../models/utilisateur.model')

module.exports = {

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

      getAllPriceByHuileAndFilter : (req, res) => {
        //On récupère les prix de la bd pour les envoyer à l'application mobile
        Prix.findOne({ conditionnement: req.body.conditions, marche: req.body.marche })
          .then((prix) => {
            console.log(prix);
            res.status(200).json(prix);
          })
          .catch((error) => {
            console.log(error);
            res.status(500).send(error);
          });
      },
      getAllPrice : async (req , res) =>{
            //On récupère les prix validés de la bd pour les envoyer à l'application mobile
          Prix.find()
          .then((prix) => {
            res.status(200).json({data :prix});
          })
          .catch((error) => {
            res.status(500).send(error);
          });
          
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
}