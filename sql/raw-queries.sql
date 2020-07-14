/*******************get all consultation for patient *********************/
select c.id,c.diagnostic,c.traitemnet,c."createdAt" as date ,m.nom,m.prenom from consultation c 
join demande d 
on c.demande_id = d.id 
join medecin m 
on m.id = d.medecin_id
where d.user_id = 5 ;

/*******************get all consultation for doctor *********************/
select c.id,c.diagnostic,c.traitemnet,c."createdAt" as date ,u.nom,u.prenom from consultation c 
join demande d 
on c.demande_id = d.id 
join utilisateur u 
on u.id = d.user_id
where d.medecin_id = 9 ;


/**********************get all demande for patient *************************/

select m.nom,m.prenom,d.id,d.symptomes,d.autre_symptomes,d.traitement,d.image,d.is_treated,d."createdAt" from demande d 
join medecin m 
on m.id = d.medecin_id
where d.user_id = 5;

/**********************get all demande for doctor *************************/

select u.nom,u.prenom,d.id,d.symptomes,d.autre_symptomes,d.traitement,d.image,d.is_treated,d."createdAt" from demande d 
join utilisateur u 
on d.user_id = u.id 
where d.medecin_id = 9 and is_treated = false ;