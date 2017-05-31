select poo.home_id, cast(sum(poo.line_rating) * 100 as int) as home_score from (select h.id as home_id, h.list_id as list_id, r.id as rating_id, p.priority_value, r.rating_value, (cast(r.rating_value as decimal) / 100) * (cast(p.priority_value as decimal) / sum(p.priority_value) over (partition by h.id)) as line_rating from homes h
join ratings r on h.id = r.home_id
join priorities p on r.priority_id = p.id
where h.list_id = $1) as poo
group by home_id