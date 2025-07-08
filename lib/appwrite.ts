import { CreateUserPrams, GetMenuParams, SignInParams } from "@/type";
import { Account, Avatars, Client, Databases, ID, Query, Storage } from "react-native-appwrite";

export const appwriteConfig = {
    endpoint: process.env.EXPO_PUBLIC_APPWRITE_ENDPOINT!,
    projectId: process.env.EXPO_PUBLIC_APPWRITE_PROJECT_ID!,
    platform: "com.acn.food2u",
    databaseId: process.env.EXPO_PUBLIC_APPWRITE_DATABASE_ID!,
    bucketId: '686bf8d6003217b5fc4b',
    userCollectionId: process.env.EXPO_PUBLIC_APPWRITE_USER_COLLECTION_ID!,
    categoryCollectionId: process.env.EXPO_PUBLIC_APPWRITE_CATEGORY_COLLECTION_ID!,
    menuCollectionId: process.env.EXPO_PUBLIC_APPWRITE_MENU_COLLECTION_ID!,
    customizationCollectionId: process.env.EXPO_PUBLIC_APPWRITE_CUSTOMIZATION_COLLECTION_ID!,
    menuCustomizationCollectionId: process.env.EXPO_PUBLIC_APPWRITE_MENU_CUSTOMIZATION_COLLECTION_ID!,
}

export const client = new Client();
client
    .setEndpoint(appwriteConfig.endpoint)
    .setProject(appwriteConfig.projectId)
    .setPlatform(appwriteConfig.platform);

export const account = new Account(client);
export const databases = new Databases(client);
const avatars = new Avatars(client);
export const storage = new Storage(client);

export const createUser = async ({ email, password, name }: CreateUserPrams) => {
    try {
        const newAccount = await account.create(ID.unique(), email, password, name);

        if (!newAccount) throw Error;
        await SignIn({ email, password })
        const avatarUrl = avatars.getInitialsURL(name);
        return await databases.createDocument(
            appwriteConfig.databaseId,
            appwriteConfig.userCollectionId,
            ID.unique(),
            {
                accountId: newAccount.$id,
                email,
                name,
                avatar: avatarUrl,
            });


    } catch (error) {
        throw new Error(error as string);
    }
}

export const SignIn = async ({ email, password }: SignInParams) => {
    try {
        const session = await account.createEmailPasswordSession(email, password);

    } catch (error) {
        throw new Error(error as string)
    }
}

export const getCurrentUser = async () => {
    try {
        const currentAccount = await account.get();
        if (!currentAccount) throw Error;

        const currentUser = await databases.listDocuments(
            appwriteConfig.databaseId,
            appwriteConfig.userCollectionId,
            [Query.equal('accountId', currentAccount.$id)]
        )

        if (!currentUser) throw Error;

        return currentUser.documents[0];
    } catch (error) {
        throw new Error(error as string)
    }
}

export const getMenu = async ({ category, query }: GetMenuParams) => {
    try {
        const queries: string[] = [];

        if(category) queries.push(Query.equal('categories', category));
        if(query) queries.push(Query.search('name', query));

        const menus = await databases.listDocuments(
            appwriteConfig.databaseId,
            appwriteConfig.menuCollectionId,
            queries,
        )

        return menus.documents;
    } catch (e) {
        throw new Error(e as string);
    }
}

export const getCategories = async () => {
    try {
        const categories = await databases.listDocuments(
            appwriteConfig.databaseId,
            appwriteConfig.categoryCollectionId,
        )

        return categories.documents;
    } catch (e) {
        throw new Error(e as string);
    }
}