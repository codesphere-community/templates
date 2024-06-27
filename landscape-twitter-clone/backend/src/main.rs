#[macro_use]
extern crate diesel;
extern crate diesel_migrations;

use actix_web::{get, post, put, web, App, HttpServer, Responder, HttpResponse};
use crate::models::{User, Tweet, NewTweet, NewComment, TweetWithUser, CommentWithUser};
use diesel::prelude::*;
use diesel::sqlite::SqliteConnection;
use crate::schema::{users::dsl as users_dsl, tweets, tweets::dsl as tweets_dsl, comments::dsl as comments_dsl};
use std::env;

mod schema;
mod models;
use crate::schema::users::dsl::*;


#[get("/backend")]
async fn hello() -> impl Responder {
    "Hello, world!!!!"
}

#[post("/backend/users")]
async fn create_user(new_user: web::Json<User>) -> impl Responder {
    let mut conn = establish_connection();

    diesel::insert_into(users)
        .values(new_user.into_inner())
        .execute(&mut conn)
        .expect("Error inserting new user");

    let inserted_user = users.order(id.desc()).first::<User>(&mut conn)
        .expect("Failed to fetch inserted user");

    HttpResponse::Created().json(inserted_user)
}

#[get("/backend/users")]
async fn get_users() -> impl Responder {
    let mut conn = establish_connection();
    let users_list = users
        .load::<User>(&mut conn)
        .expect("Error loading users");

    HttpResponse::Ok().json(users_list)
}

#[get("/backend/users/{id}")]
async fn get_user_by_id(user_id: web::Path<i32>) -> impl Responder {
    let user_id = user_id.into_inner();
    
    let mut conn = establish_connection();

    let user = users
        .filter(schema::users::id.eq(user_id))
        .first::<User>(&mut conn)
        .expect("Error loading user");

    HttpResponse::Ok().json(user)
}

#[put("/backend/users/{id}")]
async fn update_user(_user_id: web::Path<i32>, updated_user: web::Json<User>) -> impl Responder {
    let mut conn = establish_connection();
    let target = users.filter(schema::users::id.eq(id.nullable()));
    diesel::update(target)
        .set(updated_user.into_inner())
        .execute(&mut conn)
        .expect("Error updating user");

    HttpResponse::Ok().body("User updated successfully")
}

#[post("/backend/tweets")]
async fn create_tweet(new_tweet: web::Json<NewTweet>) -> impl Responder {
    let mut conn = establish_connection();
    diesel::insert_into(tweets_dsl::tweets)
        .values(new_tweet.into_inner())
        .execute(&mut conn)
        .expect("Error inserting new tweet");

    HttpResponse::Created().body("Tweet created successfully")
}

#[get("/backend/tweets")]
async fn get_tweets() -> impl Responder {

    let mut connection = establish_connection();

    let tweets_with_users = tweets_dsl::tweets
        .inner_join(users_dsl::users)
        .select((
            tweets_dsl::id,
            tweets_dsl::userId,
            tweets_dsl::title,
            tweets_dsl::likes,
            tweets_dsl::dislikes,
            tweets_dsl::text,
            users_dsl::name,  
        ))
        .load::<TweetWithUser>(&mut connection)
        .expect("Error loading tweets");

    HttpResponse::Ok().json(tweets_with_users)
}

#[post("/backend/comments")]
async fn create_comment(new_comment: web::Json<NewComment>) -> impl Responder {
    let mut conn = establish_connection();
    diesel::insert_into(comments_dsl::comments)
        .values(new_comment.into_inner())
        .execute(&mut conn)
        .expect("Error inserting new comment");

    HttpResponse::Created().body("Comment created successfully")
}

#[get("/backend/tweets/{tweet_id}/comments")]
async fn get_comments_for_tweet(tweet_id: web::Path<i32>) -> impl Responder {
    let tweet_id = tweet_id.into_inner();
    let mut conn = establish_connection();

    let results = comments_dsl::comments
        .inner_join(users_dsl::users.on(comments_dsl::userId.eq(users_dsl::id)))
        .filter(comments_dsl::tweetId.eq(tweet_id))
        .select((
            comments_dsl::id,
            comments_dsl::userId,
            comments_dsl::tweetId,
            comments_dsl::comment,
            comments_dsl::likes,
            comments_dsl::dislikes,
            users_dsl::name,
        ))
        .load::<CommentWithUser>(&mut conn)
        .expect("Error loading comments with user names");

    HttpResponse::Ok().json(results)
}

#[put("/backend/tweets/{tweet_id}/like")]
async fn like_tweet(tweet_id: web::Path<i32>) -> impl Responder {
    let mut connection = establish_connection();
    let tweet_id = tweet_id.into_inner(); 

    let tweet = tweets_dsl::tweets.filter(tweets::id.eq(tweet_id))
        .first::<Tweet>(&mut connection)
        .expect("Error loading tweet");

    let new_likes = tweet.likes.unwrap_or(0) + 1;

    diesel::update(tweets::table.filter(tweets::id.eq(tweet_id)))
        .set(tweets::likes.eq(new_likes))
        .execute(&mut connection)
        .expect("Error updating tweet likes");

    HttpResponse::Ok().finish()
}

#[put("/backend/tweets/{tweet_id}/dislike")]
async fn dislike_tweet(tweet_id: web::Path<i32>) -> impl Responder {
    let mut connection = establish_connection();
    let tweet_id = tweet_id.into_inner(); 

    let tweet = tweets_dsl::tweets.filter(tweets::id.eq(tweet_id))
        .first::<Tweet>(&mut connection)
        .expect("Error loading tweet");

    let new_dislikes = tweet.dislikes.unwrap_or(0) + 1;

    
    diesel::update(tweets::table.filter(tweets::id.eq(tweet_id)))
        .set(tweets::dislikes.eq(new_dislikes))
        .execute(&mut connection)
        .expect("Error updating tweet dislikes");

    HttpResponse::Ok().finish()
}



fn establish_connection() -> SqliteConnection {
    let database_url = env::var("DATABASE_URL")
        .expect("DATABASE_URL must be set");
    SqliteConnection::establish(&database_url)
        .expect(&format!("Error connecting to {}", database_url))
}



#[actix_web::main]
async fn main() -> std::io::Result<()> {
    HttpServer::new(move || {
        App::new()
            .app_data(web::Data::new(establish_connection()))
            .service(create_user)
            .service(get_user_by_id)
            .service(get_users)
            .service(update_user)
            .service(create_tweet)
            .service(get_tweets)
            .service(like_tweet)
            .service(dislike_tweet)
            .service(create_comment)
            .service(get_comments_for_tweet)
            .service(hello)
    })
    .bind("0.0.0.0:3000")?
    .run()
    .await
}
