-- DROP TABLE IF EXISTS contracts;
DROP TABLE IF EXISTS tokens;
DROP TABLE IF EXISTS token_info;

CREATE TABLE IF NOT EXISTS contracts (
	owner VARCHAR(30) NOT NULL,
	contract VARCHAR(30) NOT NULL PRIMARY KEY,
	description TEXT NOT NULL,
    avatar TEXT NOT NULL,
    destination_chain_selector INT NOT NULL
);
CREATE TABLE IF NOT EXISTS tokens (
	t_index INT IDENTITY(1,1),
	receiver VARCHAR(30) NOT NULL,
    token_type INT NOT NULL,
    interval INT NOT NULL,
    links TEXT NOT NULL,
    on_loop BOOLEAN NOT NULL,
    destination_chain_selector INT NOT NULL,
    price INT NOT NULL,
    duration INT NOT NULL,
    PRIMARY KEY(t_index, receiver)
);
CREATE TABLE IF NOT EXISTS token_info (
	t_index INT NOT NULL,
	token_index INT IDENTITY(1,1) PRIMARY KEY,
    owner VARCHAR(30) NOT NULL,
    receiver VARCHAR(30) NOT NULL,
    last_updated INT NOT NULL,
    curr_link INT NOT NULL,
    active_till INT NOT NULL
);