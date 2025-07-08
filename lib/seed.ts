import * as FileSystem from 'expo-file-system';
import { ID } from "react-native-appwrite";
import { appwriteConfig, databases, storage } from "./appwrite";
import dummyData from "./data";


interface Category {
    name: string;
    description: string;
}

interface Customization {
    name: string;
    price: number;
    type: "topping" | "side" | "size" | "crust" | string; // extend as needed
}

interface MenuItem {
    name: string;
    description: string;
    image_url: string;
    price: number;
    rating: number;
    calories: number;
    protein: number;
    category_name: string;
    customizations: string[]; // list of customization names
}

interface DummyData {
    categories: Category[];
    customizations: Customization[];
    menu: MenuItem[];
}

// ensure dummyData has correct shape
const data = dummyData as DummyData;

async function clearAll(collectionId: string): Promise<void> {
    const list = await databases.listDocuments(
        appwriteConfig.databaseId,
        collectionId
    );

    await Promise.all(
        list.documents.map((doc) =>
            databases.deleteDocument(appwriteConfig.databaseId, collectionId, doc.$id)
        )
    );
}

async function clearStorage(): Promise<void> {
    const list = await storage.listFiles(appwriteConfig.bucketId);

    await Promise.all(
        list.files.map((file) =>
            storage.deleteFile(appwriteConfig.bucketId, file.$id)
        )
    );
}

async function uploadImageToStorage_old(imageUrl: string) {

   try {
     console.log("✅ Seeding uploadImageToStorage starts.");
    const response = await fetch(imageUrl);
    const blob = await response.blob();

    const fileObj = {
        name: imageUrl.split("/").pop() || `file-${Date.now()}.jpg`,
        type: blob.type,
        size: blob.size,
        uri: imageUrl,
    };
    console.log('file object:', fileObj)

    const file = await storage.createFile(
        appwriteConfig.bucketId,
        ID.unique(),
        fileObj
    );

    return storage.getFileViewURL(appwriteConfig.bucketId, file.$id);
   } catch (error) {
    console.log(error as string)
   }
}

function getMimeType(fileName: string): string {
  const ext = fileName.split('.').pop()?.toLowerCase();
  switch (ext) {
    case 'jpg':
    case 'jpeg':
      return 'image/jpeg';
    case 'png':
      return 'image/png';
    case 'webp':
      return 'image/webp';
    case 'gif':
      return 'image/gif';
    default:
      return 'application/octet-stream';
  }
}

export async function uploadImageToStorage(imageUrl: string) {
  try {
    console.log("✅ Seeding uploadImageToStorage starts for:", imageUrl);

    // Extract file name
    const fileName = imageUrl.split('/').pop() || `image-${Date.now()}.jpg`;
    const mimeType = getMimeType(fileName);

    // Download image to cache folder
    const localPath = `${FileSystem.cacheDirectory}${fileName}`;
    const downloadResult = await FileSystem.downloadAsync(imageUrl, localPath);

    console.log("📥 Image downloaded to:", downloadResult.uri);

    // Get file size
    const fileInfo = await FileSystem.getInfoAsync(downloadResult.uri);

    if (!fileInfo.exists || !fileInfo.size) {
      throw new Error('Downloaded file is missing or empty.');
    }

    const fileObj = {
      uri: downloadResult.uri,
      name: fileName,
      type: mimeType,
      size: fileInfo.size,
    };

    console.log("📦 File object ready:", fileObj);

    // Upload to Appwrite bucket
    const file = await storage.createFile(
      appwriteConfig.bucketId,
      ID.unique(),
      fileObj
    );

    const fileUrl = storage.getFileViewURL(appwriteConfig.bucketId, file.$id);
    console.log("✅ Upload successful. View URL:", fileUrl);

    return fileUrl;

  } catch (error: any) {
    console.error("❌ Error uploading image:", {
      message: error?.message,
      code: error?.code,
      response: error?.response,
    });
  }
}
async function seed(): Promise<void> {
    console.log("✅ Seeding start.");

    // 1. Clear all
    await clearAll(appwriteConfig.categoryCollectionId);
    await clearAll(appwriteConfig.customizationCollectionId);
    await clearAll(appwriteConfig.menuCollectionId);
    await clearAll(appwriteConfig.menuCustomizationCollectionId);
    await clearStorage();
    console.log("✅ cleared db");

    // 2. Create Categories
    const categoryMap: Record<string, string> = {};
    for (const cat of data.categories) {
        const doc = await databases.createDocument(
            appwriteConfig.databaseId,
            appwriteConfig.categoryCollectionId,
            ID.unique(),
            cat
        );
        categoryMap[cat.name] = doc.$id;
    }
    console.log("✅ Seeding Categories complete.");


    // 3. Create Customizations
    const customizationMap: Record<string, string> = {};
    for (const cus of data.customizations) {
        const doc = await databases.createDocument(
            appwriteConfig.databaseId,
            appwriteConfig.customizationCollectionId,
            ID.unique(),
            {
                name: cus.name,
                price: cus.price,
                type: cus.type,
            }
        );
        customizationMap[cus.name] = doc.$id;
    }
    console.log("✅ Seeding Customizations complete.");


    // 4. Create Menu Items
    const menuMap: Record<string, string> = {};
    for (const item of data.menu) {
        const uploadedImage = await uploadImageToStorage(item.image_url);

        const doc = await databases.createDocument(
            appwriteConfig.databaseId,
            appwriteConfig.menuCollectionId,
            ID.unique(),
            {
                name: item.name,
                description: item.description,
                image_url: uploadedImage,
                price: item.price,
                rating: item.rating,
                calories: item.calories,
                protein: item.protein,
                categories: categoryMap[item.category_name],
            }
        );

        menuMap[item.name] = doc.$id;

        // 5. Create menu_customizations
        for (const cusName of item.customizations) {
            await databases.createDocument(
                appwriteConfig.databaseId,
                appwriteConfig.menuCustomizationCollectionId,
                ID.unique(),
                {
                    menu: doc.$id,
                    customizations: customizationMap[cusName],
                }
            );
        }
    }

    console.log("✅ Seeding complete.");
}

export default seed;