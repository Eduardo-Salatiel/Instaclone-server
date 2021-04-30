const { gql } = require('apollo-server');

const typeDefs = gql`
    type User {
        id: ID
        name: String
        username: String
        email: String
        password: String
        siteWeb: String
        description: String
        avatar: String
        createAt: String
    }

    type Publication {
        id: ID,
        idUser: ID
        file: String 
        typeFile: String
        createdAt: String
    }

    type Token {
        token: String
    }

    type UpdateAvatar {
        status: Boolean,
        urlAvatar: String
    }

    type Publish {
        status: Boolean
        urlFile: String
    }

    type Comment {
        idPublication: ID
        idUser: User
        comment: String 
        createAt: String
    }
    
    type FeedPublication {
        id: ID,
        idUser: User
        file: String
        typefile: String
        createdAt: String
    }

    input UserInput {
        name: String!
        username: String!
        email: String!
        password: String!

    }
    input LoginInput {
        email: String!
        password: String!
    }

    input UpdateUserInput {
        name: String
        email: String
        currentPassword: String
        newPassword: String
        description: String
        siteWeb: String

    }

    input CommentInput {
        idPublication: ID,
        comment: String
    }

    type Query {
        #User
        getUser(id: ID, username: String): User
        search(search: String): [User]
        #Follow
        isFollow(username: String): Boolean
        getFollowers(username: String):[User]
        getFolloweds(username: String): [User]
        getNotFolloweds: [User]
        #Publication
        getPublications(username: String):[Publication]
        getPublicationsFollowers: [FeedPublication]
        #Comment
        getComments(idPublication: ID):[Comment]
        #Like
        isLike(idPublication: ID): Boolean
        countLikes(idPublication: ID): Int
    }

    type Mutation {
        #User
        register(input: UserInput): User
        login(input: LoginInput): Token
        updateAvatar(file: Upload): UpdateAvatar
        deleteAvatar: Boolean
        updateUser(input: UpdateUserInput): Boolean
        #Follow
        follow(username: String): Boolean
        unFollow(username: String): Boolean
        #Publictions
        publish(file: Upload): Publish
        #Comments
        addComment(input: CommentInput): Comment
        #Likes
        addLike(idPublication: ID): Boolean
        removeLike(idPublication: ID): Boolean
    }
`;

module.exports = typeDefs;