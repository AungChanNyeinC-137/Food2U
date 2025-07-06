export const appwriteConfig ={
    endpoint : process.env.EXPO_PUBLIC_APPWRITE_ENDPOINT,
    projectId : process.env.EXPO_PUBLIC_APPWRITE_PROJECT_ID,
    platform : "com.acn.food2u",
    databaseId : process.env.EXPO_PUBLIC_APPWRITE_DATABASE_ID,
    userCollectionId : process.env.EXPO_PUBLIC_APPWRITE_USER_COLLECTION_ID,
}