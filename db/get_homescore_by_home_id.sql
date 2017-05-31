select home_id, cast(sum(adjusted_score) * 100 as int) as home_score from(select r.id, r.home_id, r.rating_description, r.rating_value, p.priority_value, (cast(r.rating_value as decimal) / 100) * (p.priority_value / cast((sum(priority_value) over ()) as decimal)) as adjusted_score
from ratings r 
join priorities p on r.priority_id = p.id 
where r.home_id = $1) as poo
group by home_id;