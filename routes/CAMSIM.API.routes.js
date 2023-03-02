
/**
  @global routes applications
  @description 'Definition de toutes les routes API de l'application'
  @platform Web & Mobile & SMS
*/


/**
  @folder node_modules/express/lib/router
  @role Definition de l'objet router permettant de definir les differentes routes
*/
const router = require('express').Router()

/**
  @folder 'Fonction importée depuis le dossier controllers du projet
  @role 'Ces fonctions sont utilisées pour les opérations d'authentification et login des utilisateurs ou des derivés de celui ci '
*/
const {signIn , signUp, signuProducteur} = require('../controllers/ConnexionApp.controller')
/**
  @folder 'Fonction importée depuis le dossier controllers du projet
  @role 'Ces fonctions sont utilisées pour recuperer les données et des prix depuis la base de données en fonction de la requete'
*/
const { getAllPricesByNameProduct, getUnvalitedPricesByNameProduct, getAllPriceByHuileAndFilter, getAllPrice, getPriceByName, getMyPriceById, validatePriceByIdAndPrixId, addPricesByIdAndMarcheId, getPriceInMarket, createNewProductByInvestigator, collectData, editPrice } = require('../controllers/API.controller.prix')

const { getAllProductByNomProduct, getAllProductsByNomProduitAndNameSeller, getMyProductsById, modifyProductPriceByIdAndProduitId, addProductById, getAchatVenteRegionDepartement, editAchat } = require('../controllers/API.controller.produit')
/** 
  @folder 'Fonction importée depuis le dossier controllers du projet
  @role 'Ces fonctions sont utilisées pour recuperer les données des encheres depuis la base de données en fonction de la requete'
*/
const { getParticularEnchereByNomSeller, getAllEnchere, getMyEncheresById, addEnchereById, rencherirByIdAndEnchereId, modifyEnchereByIdAndEnchereId, rejeterEnchereByIdAndEnchereId, validParticipantEnchereByIdAndEnchereId } = require('../controllers/API.controller.enchere')
/** 
  @folder 'Fonction importée depuis le dossier controllers du projet
  @role 'Ces fonctions sont utilisées pour la verification et l'envoi de message a l'utilisateur'
*/
const { initVerification  , verify} = require('../controllers/API.SMS.controller')
const { getAnnonceByTimeOrder } = require('../controllers/API.controller.annonce')
const { getMyContractById , getAllContract, getContractCreateById, createNewContractById, editContractByIdAndContractId, validParticipantContractByIdAndContractId, applyContractByIdAndContractId } = require('../controllers/API.controller.contract')
const { Utilisateur } = require('../models/utilisateur.model')
const { changeStateUser } = require('../controllers/API.controller.changeState')
const { getAllMarche, getMarcheOnlyName } = require('../controllers/API.controller.marche')


/**
  @route /signin
  @method POST 
  @role 'L'application utilise cette route pour authentifier les utilisateurs'
*/
router.post('/signin', signIn);

/**
  @route /signup
  @method POST
  @role 'L'application utilise cette route pour enregistrer les utilisateurs'
*/
router.post('/signup', signUp);
/**
  @route /signup-producteur
  @method POST
  @role 'L'application utilise cette route pour enregistrer les producteurs'
*/
router.post('/signup-producteur' , signuProducteur);



/**
  @route /initVerfication & verify*
  @method POST
  @role 'l'application utilise cette route pour la verification , l'initialisation et l'envoi de message a l'utilisateur'
*/
router.post('/initVerification', initVerification);
router.post('/verify', verify);



/**
  @route /all-prices/:produit
  @method GET
  @role 'affichage des prix validés || rechercher un produit dans un marché'
*/
router.get('/all-price/:nomProduit',getAllPricesByNameProduct);
/**
  @route /all-prices/:produit
  @method GET
  @role 'affichage des prix validés'
*/
router.get('/all-price' , getAllPrice)
/**
  @route /unvalidated-price/:nomProduit
  @method GET
  @role 'l'applicationn utilise cette route pour l'affichage des prix en attente de validation en fonction du nom du produit '
*/
router.get('/unvalidated-price/:nomProduit', getUnvalitedPricesByNameProduct)

/**
  @route /addPrices
  @method POST 
  @role 'sauvegarde des prix collectés par un enqueteur'
*/
router.post('/add-price/:id/:marcheId', addPricesByIdAndMarcheId)//addPricesByIdAndMarcheId)

/** 
  @route /validate-prices/:id/:produit
  @method POST
  @role 'le controleur valide les prix collectés par l'enqueteur'
*/
router.post('/validate-price/:id/:prixId', validatePriceByIdAndPrixId)//validatePriceByIdAndPrixId)


/**
  @route /all-price/huile/filter
  @method GET
  @role l'application utilise cette route l'affichage des prix de l'huile filtré'
*/

router.post('/all-price/huile/filter' , getAllPriceByHuileAndFilter)
/**
  @route /all-price/marche
  @method GET
  @role l'application utilise cette route l'affichage des prix d'un marcé donné a un prix donné s
*/

router.post('/all-price/marche' , getPriceInMarket)

/**
  @route /all-price/huile/filter
  @method GET
  @role l'application utilise cette route l'affichage des prix de l'huile filtré'
*/
router.get('/all-price/:nomPrice' , getPriceByName)



// ------------------------------------------PRPDUCTS ----------------------------------------------------

/**
  @route /add-products/:id
  @method POST 
  @role 'enregistrements des produits mis en vente par les producteurs'
*/
router.post("/add-products/:id", addProductById)//addProductById)

/**
  @route /all-products/:nomProduit
  @method GET
  @role 'affichage de toutes les données d'un produit donnée'
*/
router.get('/all-products/:nomProduit', getAllProductByNomProduct);

/**
  @route /all-product/:nomProduit/:nomVendeur
  @method GET
  @role 'Envoie des données des produits d'un utilisateur donnée'
*/
router.get('/all-products/:nomProduit/:nomVendeur', getAllProductsByNomProduitAndNameSeller);


// envoie des doonnées du produit crée par un producteur 
//router.get('/all-products/:id/produitId' , getProductById)

/**
  @route /modify-product-price/:id/produitId
  @method PUT 
  @role 'Modifier un produit'
*/
router.put("/modify-product-price/:id/:produitId", modifyProductPriceByIdAndProduitId) //modifyProductPriceByIdAndProduitId)

router.post("/all-products/s1" , getAchatVenteRegionDepartement) // route pour les recherches achats/ventes 

router.put('/edit-achat/:id/:achatId' , editAchat)

/// ---- recherche des produits 


// ------------------------------------------------ENCHERE---------------------------------------------------------------


/**
  @route /add-enchere/:id
  @method POST
  @role 'Poster une enchère' 
*/
router.post("/add-enchere/:id", addEnchereById )

/**
  @route /add-enchere/
  @method POST
  @role 'Retourner toutes les encheres de la base données' 
*/
router.get('/all-encheres' , getAllEnchere)


/**
  @route /all-encheres/:nomVendeur
  @method GET
  @role 'l'application utilise cette route pour l'affichage des données d'une enchère en fonction du nom de l'enchereur? :('
*/
router.get("/all-encheres/:nomVendeur", getParticularEnchereByNomSeller)

/**
  @route /rencherir/:id/enchereId
  @method PATCH
  @role 'Validation d'une enchere par un utilisateur '
*/
router.patch("/rencherir/:id/:enchereId", rencherirByIdAndEnchereId) //rencherirByIdAndEnchereId )
/**
  @route /modify-enchere/:id/:enchereId
  @method PUT
  @role 'l'application utilise cette route pour la modification des données d'une enchère'
*/
router.put('/modify-enchere/:id/:enchereId', modifyEnchereByIdAndEnchereId) //modifyEnchereByIdAndEnchereId)

/**
  @route /rejeter-enchere/:id/:enchereId
  @method PUT
  @role 'l'application utilise cette route pour le rejet de l'enchere par un utilisateur'
*/
router.put("/rejeter-enchere/:id/:enchereId", rejeterEnchereByIdAndEnchereId) //rejeterEnchereByIdAndEnchereId)

/**
  @route /rejeter-enchere/:id/:enchereId
  @method PUT
  @role 'l'application utilise cette route pour la valider la candidature d'un utilisateur a une enchere'

*/
router.put('/valid-enchere/:id/:enchereId' , validParticipantEnchereByIdAndEnchereId) //validParticipantEnchereByIdAndEnchereId)

// ---------------------------------------------CONTRACT-------------------------------------------------------------

/** 
  @route /create-contract/:id
  @method POST
  @role 'l'application utilise cette route pour la creation d'un nouveau contract'
*/
router.post('/create-contract/:id', createNewContractById) //createNewContractById)
/** 
  @route /edit-contract/:id/:contractId
  @method PUT
  @role 'l'application utilise cette route pour modifier un contract'
*/
router.put('/edit-contract/:id/:contractId' , editContractByIdAndContractId)//editContractByIdAndContractId)


/** 
  @route /valid-contract/:id/:contractId
  @method PUT
  @role 'l'application utilise cette route pour valider la candidature d'un utilisateur a un contrat'
*/
router.put('/valid-contract/:id/:contractId' , validParticipantContractByIdAndContractId) //validParticipantContractByIdAndContractId)

/**
 * @route /all-contracts
 * @method GET
 * @role 'l'application utilise ces routes pour afficher tous les contracts crées pour tous les producteurs et autres 
*/
router
  .get('/all-contracts' , getAllContract)


/**
 * @route /all-contracts/:id
 * @method GET
 * @role 'l'application utilise ces routes pour afficher tous les contracts crées par un utilisateur
*/
router 
  .get('/all-contracts/:id' , getContractCreateById) 

/**
 * @route /apply-contracts/:id/:contractId
 * @method PATCH
 * @role 'l'application utilise cette route pour permettre a un utilisateur de postuler a un contract
*/
router  
  .patch('/apply-contracts/:id/:contractId' , applyContractByIdAndContractId)//applyContractByIdAndContractId)

// --------------------------------------------------ANNONCE-----------------------------------------------------------------

/** 
  @route /annonce
  @method GET
  @role 'l'application utilise cette route pour afficher les annonces recentes'
*/
router.get('/annonce' , getAnnonceByTimeOrder)


/**
 * @route /myachats/:id /myventes/:id /mycontracts/:id /myencheres/:id
 * @method GET
 * @role 'l'application utilise ces routes pour afficher l'historique d'un utilisateur c'est a dire ses ventes , achats , encheres , contracts
*/
router
  .get('/myachats/:id' , getMyPriceById)
  .get('/myventes/:id' , getMyProductsById)
  .get('/mycontrats/:id' , getMyContractById)
  .get('/myencheres/:id' , getMyEncheresById)



router
  .get('/users' , async (req , res) =>{
    res.status(200).json({data : await Utilisateur.find()})
  })
  router 
  .get('/user/:id' , async (req , res) =>{
    res.status(200).json({data : await Utilisateur.findById(req.params.id) })
  })


/**
 * @route /change-state/:id
 * @method PUT 
 * @role 'l'application utilise cette route pour l'etat d'un utilisateur 
*/
router.put('/change-state/:id' , changeStateUser)
/**
 * @route /get-marche
 * @method GET 
 * @role 'l'application utilise cette route pour envoyer les données des marchés enregistrés 
*/
router.get('/get-marche' , getAllMarche )
/**
 * @route /get-marche/nom
 * @method GET 
 * @role 'l'application utilise cette route pour recuperer les marchés en fonction du nom 
*/
router.get('/get-marche/nom ' , getMarcheOnlyName)



router.post('/collect-product/:id' , collectData)

// exportation de l'objet router
module.exports = router; 