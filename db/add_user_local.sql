insert into users (name, email, password, third_party_id, user_auth_type_id, token)
values ($1, $2, $3, null, 1, $4) returning id;