
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
const { getAllPricesByNameProduct, getUnvalitedPricesByNameProduct, getAllPriceByHuileAndFilter, getAllPrice, getPriceByName } = require('../controllers/API.controller.prix')

/**
  @folder 'Fonction importée depuis le dossier controllers du projet
  @role 'Ces fonctions sont utilisées pour la mise en place des actions effectuées par l'utilisateur sur l'application'
*/
const { addProductById, 
  addEnchereById, 
  modifyProductPriceByIdAndProduitId, 
  rencherirByIdAndEnchereId, 
  modifyEnchereByIdAndEnchereId, 
  rejeterEnchereByIdAndEnchereId , 
  addPricesById,
  validatePriceByIdAndPrixId,
  createNewContractById,
  editContractByIdAndContractId, 
  } = require('../controllers/Fonctionnalites.utilisateurs')

const { getAllProductByNomProduct, getAllProductsByNomProduitAndNameSeller } = require('../controllers/API.controller.produit')
/*
  @folder 'Fonction importée depuis le dossier controllers du projet
  @role 'Ces fonctions sont utilisées pour recuperer les données des encheres depuis la base de données en fonction de la requete'
*/
const { getAllEnchereByNomEnchere, getParticularEnchereByNomSeller, getAllEnchere } = require('../controllers/API.controller.enchere')
/*
  @folder 'Fonction importée depuis le dossier controllers du projet
  @role 'Ces fonctions sont utilisées pour la verification et l'envoi de message a l'utilisateur'
*/
const { initVerification  , verify} = require('../controllers/API.SMS.controller')
const { getAnnonceByTimeOrder } = require('../controllers/API.controller.annonce')



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
  @role 'affichage des prix validés'
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
router.post('/add-price/:id', addPricesById)

/** 
  @route /validate-prices/:id/:produit
  @method POST
  @role 'le controleur valide les prix collectés par l'enqueteur'
*/
router.post('/validate-price/:id/:prixId', validatePriceByIdAndPrixId)


/**
  @route /all-price/huile/filter
  @method GET
  @role l'application utilise cette route l'affichage des prix de l'huile filtré'
*/

router.get('/all-price/huile/filter' , getAllPriceByHuileAndFilter)
/**
  @route /all-price/huile/filter
  @method GET
  @role l'application utilise cette route l'affichage des prix de l'huile filtré'
*/
router.get('/all-price/:nomPrice' , getPriceByName)



/**
  @route /add-products/:id
  @method POST 
  @role 'enregistrements des produits mis en vente par les producteurs'
*/
router.post("/add-products/:id", addProductById)

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


/**
  @route /modify-product-price/:id/produitId
  @method PUT 
  @role 'Modifier un produit'
*/
router.put("/modify-product-price/:id/produitId", modifyProductPriceByIdAndProduitId)




/**
  @route /add-enchere/:id
  @method POST
  @role 'Poster une enchère' 
*/
router.post("/add-enchere/:id", addEnchereById )

/**
  @route /add-enchere/:id
  @method POST
  @role 'Retourner toutes les encheres de la base données' 
*/
router.get('/all-enchere' , getAllEnchere)
/**
  @route /all-enchere/:nomEnchere
  @method GET
  @role 'l'application utilise cette route pour l'affichage des encheres en fonction du nom de l'enchere'
*/
router.get("/all-enchere/:nomEnchere",getAllEnchereByNomEnchere)
// *success 
/**
  @route /particular-encheres/:produit
  @method GET
  @role 'l'application utilise cette route pour l'affichage des données d'une enchère en fonction du nom de l'enchereur? :('
*/
router.get("/all-encheres/:nomVendeur", getParticularEnchereByNomSeller)
// utilisateur rencherir a un enchère  : * success 
/**
  @route /rencherir/:id/enchereId
  @method PATCH
  @role 'Validation d'une enchere par un utilisateur '
*/
router.patch("/rencherir/:id/enchereId", rencherirByIdAndEnchereId )
/**
  @route /modify-enchere/:id/:enchereId
  @method PUT
  @role 'l'application utilise cette route pour la modification des données d'une enchère'
*/
router.put('/modify-enchere/:id/:enchereId', modifyEnchereByIdAndEnchereId)

/**
  @route /rejeter-enchere/:id
  @method PUT
  @role 'l'application utilise cette route pour le rejet de l'enchere par un utilisateur'
*/
router.put("/rejeter-enchere/:id", rejeterEnchereByIdAndEnchereId)

/** 
  @route /create-contract/:id
  @method POST
  @role 'l'application utilise cette route pour la creation d'un nouveau contract'
*/
router.post('/create-contract/:id',createNewContractById)
/** 
  @route /edit-contract/:id/:contractId
  @method PUT
  @role 'l'application utilise cette route pour modifier un contract'
*/
router.put('/edit-contract/:id/:contractId' , editContractByIdAndContractId)

/** 
  @route /edit-contract/:id/:contractId
  @method GET
  @role 'l'application utilise cette route pour afficher les annonces recentes'
*/
router.get('/hum' , getAnnonceByTimeOrder)


// exportation de l'objet router
module.exports = router; 