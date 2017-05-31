update homes set nickname = $1, price = $2, address_1 = $3, address_2 = $4, city = $5, zip = $6, province = $7, bathrooms = $8, bedrooms = $9, sq_feet = $10, year_build = $11, description = $12, days_listed = $13 where id = $14
returning id, nickname, price, address_1, address_2, city, zip, province, bathrooms, bedrooms, sq_feet, year_build, description, days_listed;
