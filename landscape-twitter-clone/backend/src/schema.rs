// @generated automatically by Diesel CLI.

diesel::table! {
    comments (id) {
        id -> Nullable<Integer>,
        userId -> Nullable<Integer>,
        tweetId -> Nullable<Integer>,
        comment -> Text,
        likes -> Nullable<Integer>,
        dislikes -> Nullable<Integer>,
    }
}

diesel::table! {
    tweets (id) {
        id -> Nullable<Integer>,
        userId -> Nullable<Integer>,
        title -> Text,
        likes -> Nullable<Integer>,
        dislikes -> Nullable<Integer>,
        text -> Text,
    }
}

diesel::table! {
    users (id) {
        id -> Nullable<Integer>,
        name -> Text,
        password -> Text,
    }
}

diesel::joinable!(comments -> tweets (tweetId));
diesel::joinable!(comments -> users (userId));
diesel::joinable!(tweets -> users (userId));

diesel::allow_tables_to_appear_in_same_query!(
    comments,
    tweets,
    users,
);
