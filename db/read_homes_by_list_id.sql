-- select h.id, h.list_id, h.nickname, h.price, h.address_1, h.address_2, city, zip, province, bathrooms, bedrooms, h.sq_feet, h.year_build, h.description, h.days_listed, i.url
-- from homes h
-- left join images i on h.cover_image_id = i.id where h.list_id = $1 and h.active = true;

select h.id, h.list_id, h.nickname, h.price, h.address_1, h.address_2, h.city, h.zip, h.province, h.bathrooms, h.bedrooms, h.sq_feet, h.year_build, h.description, h.days_listed, images.url, dankass.home_score  from 
(select poo.home_id, cast(sum(poo.line_rating) * 100 as int) as home_score from (select h.id as home_id, h.list_id as list_id, r.id as rating_id, p.priority_value, r.rating_value, (cast(r.rating_value as decimal) / 100) * (cast(p.priority_value as decimal) / sum(p.priority_value) over (partition by h.id)) as line_rating from homes h
join ratings r on h.id = r.home_id
join priorities p on r.priority_id = p.id
where h.list_id = $1 and active = true) as poo
group by home_id) as dankass
join homes h on dankass.home_id = h.id
left join images on h.cover_image_id = images.id