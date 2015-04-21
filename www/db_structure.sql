CREATE TABLE "auth_token" (
    "id" UUID NOT NULL,
    "user_id" BIGINT NOT NULL REFERENCES "user"("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    "life_time_minutes" INTEGER NULL,
    "create_date" TIMESTAMP WITHOUT TIME ZONE NULL,
    "last_activity_date" TIMESTAMP WITHOUT TIME ZONE NULL,
    "expire_date" TIMESTAMP WITHOUT TIME ZONE NULL,
    "ip" CHARACTER VARYING(30) NULL,
    PRIMARY KEY("id")
);


CREATE TABLE "autologin_token" (
    "id" UUID NOT NULL,
    "user_id" BIGINT NOT NULL REFERENCES "user"("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    "create_date" TIMESTAMP WITHOUT TIME ZONE NULL,
    "last_activity_date" TIMESTAMP WITHOUT TIME ZONE NULL,
    "expire_date" TIMESTAMP WITHOUT TIME ZONE NULL,
    "last_activity_ip" CHARACTER VARYING(30) NULL,
    PRIMARY KEY("id")
);


CREATE SEQUENCE "user_id";
CREATE TABLE "user" (
    "id" BIGINT NOT NULL default nextval('user_id'),
    "date_create" TIMESTAMP WITHOUT TIME ZONE NOT NULL,
    "date_modify" TIMESTAMP WITHOUT TIME ZONE NULL,
    "name" CHARACTER VARYING(255) NOT NULL,
    "first_name" CHARACTER VARYING(255) NOT NULL,
    "middle_name" CHARACTER VARYING(255) NULL,
    "last_name" CHARACTER VARYING(255) NULL,
    "email" CHARACTER VARYING(255) NOT NULL,
    "auth_id" BIGINT NOT NULL,
    PRIMARY KEY("id")
);


CREATE SEQUENCE "auth_id";
CREATE TABLE "auth" (
    "id" BIGINT NOT NULL default nextval('auth_id'),
    "email" CHARACTER VARYING(255) NULL,
    "password" CHARACTER VARYING(255) NULL,
    PRIMARY KEY("id")
);


CREATE SEQUENCE "trip_id";
CREATE TABLE "trip" (
    "id" BIGINT NOT NULL default nextval('trip_id'),
    "date_create" TIMESTAMP WITHOUT TIME ZONE NOT NULL,
    "date_modify" TIMESTAMP WITHOUT TIME ZONE NULL,
    "name" CHARACTER VARYING(255) NOT NULL,
    "description" TEXT NULL,
    "date_start" TIMESTAMP WITHOUT TIME ZONE NOT NULL,
    "date_end" TIMESTAMP WITHOUT TIME ZONE NOT NULL,
    "owner_id" BIGINT NOT NULL,
    "public" BOOLEAN NULL DEFAULT 'false',
    PRIMARY KEY("id")
);


CREATE SEQUENCE "member_id";
CREATE TABLE "member" (
    "id" BIGINT NOT NULL default nextval('member_id'),
    "date_create" TIMESTAMP WITHOUT TIME ZONE NOT NULL,
    "date_modify" TIMESTAMP WITHOUT TIME ZONE NULL,
    "user_id" BIGINT NOT NULL,
    "trip_id" BIGINT NOT NULL,
    "status_id" BIGINT NOT NULL,
    PRIMARY KEY("id")
);


CREATE SEQUENCE "point_id";
CREATE TABLE "point" (
    "id" BIGINT NOT NULL default nextval('point_id'),
    "point_type_id" BIGINT NOT NULL,
    "_p_o_i_type_id" BIGINT NOT NULL,
    "name" CHARACTER VARYING(255) NOT NULL,
    "lat" FLOAT(16) NOT NULL,
    "lng" FLOAT(16) NOT NULL,
    "trip_id" BIGINT NOT NULL,
    "location_id" BIGINT NULL,
    "description" TEXT NULL,
    "date_start" TIMESTAMP WITHOUT TIME ZONE NOT NULL,
    "date_end" TIMESTAMP WITHOUT TIME ZONE NOT NULL,
    PRIMARY KEY("id")
);
