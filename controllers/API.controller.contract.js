const {Utilisateur} = require('../models/utilisateur.model')
const Contract = require('../models/contract.model')

module.exports = {
    // cette fonction permet d'afficher les contracts postulés par l'utilisateur
    
    getMyContractById : async (req , res) =>{
        // on recupère les données par rapport a l'id envoyé par le front end
        let user = await Utilisateur.findById(req.params.id) , contracts = []
        if(!Object.keys(user).includes('contractApply')) return res.status(200).json({data : []})
        else {
            for(id of user.contractApply){
                let data = await Contract.findById(id)
                if(data == null )continue
                else contracts.push(data)
            }
            if(user) res.status(200).json({data : contracts})
            else return res.status(401).json({message : 'Utilisateur inconnu'})
        }
       
    },
    // cette fonction permet d'afficher tous les contracts crées par les producteurs et autres acteurs pouvant effectuer cette opération
    getAllContract : async (req , res) =>{
        res.status(200).json({data : await Contract.find()})
    },
    getContractCreateById : async (req , res) =>{

        let user = await Utilisateur.findById(req.params.id) , contracts = []
        
        for(id of user.ownContracts){
            let data = await Contract.findById(id)
            if(data == null) continue
            else contracts.push(data)
        }

        if(user)res.status(200).json({data : contracts })
        else return res.status(401).json({message : 'Utilisateur inconnu' })
        
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
}