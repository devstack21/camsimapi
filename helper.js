import axios from "axios";

//recupere les encheres de la bd
export const getEncheres = async () => {
  return axios.get(`http://${ip}:${port}/API/all-enchere/`);
};

// recupere toous les prix de la base de donnees
export async function getAllPrices() {
  return axios.get(`http://${ip}:${port}/API/all-price/huile`);
}

export const ip = "192.168.0.101";
export const port = 5000;

// recupere toous les produits de la base de donnees
export const getAllProduct = async () => {
  return axios.get(`http://${ip}:${port}/API/all-products/Huile%20de%20palme`);
};

// recupere toous les Encheres de la base de donnees
export async function getAllEncheres() {
  const response = await fetch(
    `http://${ip}:${port}/API/allEncheres/Huile%20de%20palme`
  );

  const data = await response.json();
  return data;
}

// retourne les encheres donc la date est valide
export async function getAllEnchereValid(date) {
  const Encheres = await getAllEncheres();

  const filter = Encheres.filter((Enchere) => {
    return Enchere.dateFin >= date;
  });

  return filter;
}

export async function getAllEnchereValidAndName(date, nom) {
  const Encheres = await getAllEncheres();

  const filter = Encheres.filter((Enchere) => {
    return Enchere.dateFin >= date && Enchere.nomVendeur === nom;
  });

  return filter;
}

// retourne la date actuelle
export function currentDate() {
  let today = new Date();
  let dd = String(today.getDate()).padStart(2, "0");
  let mm = String(today.getMonth() + 1).padStart(2, "0");
  let year = today.getFullYear();
  let date = `${year}-${mm}-${dd}`;

  return date;
}

// filtrer l'enchere en function du nom de l'utilisateur '
export async function getAllEncheresFromOneUser(nom) {
  const Encheres = await getAllEncheres();

  const filter = Encheres.filter((Enchere) => {
    return Enchere.nomVendeur === nom;
  });

  return filter;
}

// retourne tous les produits d'un vendeur
export async function getAllProductProducteur(nom) {
  const Produit = await getAllProduct();

  const filter = Produit.filter((produit) => {
    return produit.nomVendeur === nom;
  });

  return filter;
}

// retourne les produit d'un vendeur avec l'id
export async function getProductProducteurById(id) {
  const Produit = await getAllProduct();

  const filter = Produit.filter((produit) => {
    return produit._id === id;
  });

  return filter;
}

// retourne  un produit en function de la region du departement et de l'arrondissement
export async function getFilterProductByPlace(query) {
  const Produit = await getAllProduct();

  const { region, departement, arrondissement } = query;

  const filter = Produit.filter((produit) => {
    return (
      produit.region === region &&
      produit.departement === departement &&
      produit.arrondissement === arrondissement
    );
  });

  return filter;
}

// retourne un produit avec une condition et un marche
export async function FilterProductWithMarche(query) {
  const { conditions, marche } = query;

  const data = await getAllPrices();

  let filterone = data.filter((produit) => {
    return (
      produit.marche.nom === marche && produit.conditionnement === conditions
    );
  });

  return filterone;
}

export async function FilterProductWithPrice(query) {
  const { conditions, prix } = query;

  const data = await getAllPrices();

  let filterone = data.filter((produit) => {
    return (
      produit.prix_marche <= prix && produit.conditionnement === conditions
    );
  });

  return filterone;
}

// flilter les produits en function du perimetre
export async function FilterProductWithPerimetre(query) {
  const { conditions, perimetre } = query;

  const data = await getAllPrices();

  let filterone = data.filter((produit) => {
    return (
      produit.marche <= perimetre && produit.conditionnement === conditions
    );
  });

  return filterone;
}

// flilter les produits invalides

export async function FilterProductWithIsvalid(query) {
  const { nom, isValid } = query;
  const data = await getAllPrix();
  let filterone = data.filter((product) => {
    return product.nom === nom && product.isValidated === isValid;
  });

  return filterone;
}