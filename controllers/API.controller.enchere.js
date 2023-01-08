const Enchere = require('../models/enchere.model')
const { Utilisateur } = require('../models/utilisateur.model')
const {compareDate} = require('../modules')
const moment = require('moment')()

module.exports ={
   
      getParticularEnchereByNomSeller : async(req, res) => {

        res.status(200).json({data : await Enchere.find({ nomVendeur: req.params.nomVendeur })})
       
      },
      getAllEnchere : async (req , res) =>{
          res.status(200).json({data : await Enchere.find()})
      },
      getEnchereById : async (req ,res) =>{
        res.status(200).json({data : await Enchere.findById(req.params.enchereId)})
      },
      // mes encheres
      getMyEncheresById : async (req , res) =>{
          let user = await Utilisateur.findById(req.params.id) , encheres = []
          if(!Object.keys(user).includes('rencheres')) return res.status(200).json({data : [] })
          else {
            for(id of user.rencheres){
              let data = await Enchere.findById(id)
              if(data == null) continue
              else encheres.push(data)
              
          }
            if(user) res.status(200).json({data : encheres})
            else return res.status(401).json({message : null})
          }
          
      },
        // fonction permettant de poster une enchere 
    addEnchereById : (req, res) => {

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
     
  // cette fonction permet a un producteur de valider la candidature enchère d'un consommateur 
  validParticipantEnchereByIdAndEnchereId : async (req , res) =>{ 
    const enchere = await Enchere.findById(req.params.enchereId)
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