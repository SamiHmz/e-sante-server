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



