insert into homes (list_id, nickname, price, address_1, address_2, city, zip, province, bathrooms, bedrooms, sq_feet, year_build, description, days_listed, active)
values ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,true) returning id;
