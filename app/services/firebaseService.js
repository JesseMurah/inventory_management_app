import { db, storage } from '/lib/firebase.js';
import { collection, addDoc, updateDoc, deleteDoc, doc, getDocs, query, where, getDoc } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL, deleteObject } from 'firebase/storage';

export const addItem = async (newItem, userId) => {
  try {
    console.log("Adding new item:", newItem, "for user:", userId);
    const docRef = await addDoc(collection(db, 'inventory'), {
      ...newItem,
      userId,
      createdAt: new Date()
    });
    console.log("Document written with ID: ", docRef.id);
    const savedItem = await getDoc(docRef);
    console.log("Saved item data:", savedItem.data());
    return { id: docRef.id, ...savedItem.data() };
  } catch (error) {
    console.error("Error adding item: ", error);
    if (error.message) {
      console.error("Error message:", error.message);
    }
    if (error.code) {
      console.error("Error code:", error.code);
    }
    throw error;
  }
};

export const updateItem = async (itemId, updatedItem, userId) => {
  try {
    const itemRef = doc(db, 'inventory', itemId);
    await updateDoc(itemRef, { ...updatedItem, userId });
    const savedItem = await getDoc(itemRef);
    return { id: itemId, ...savedItem.data() };
  } catch (error) {
    console.error("Error updating item: ", error);
    throw error;
  }
};

export const uploadImage = async (image) => {
  try {
    const storageRef = ref(storage, `inventory/${Date.now()}_${image.name}`);
    await uploadBytes(storageRef, image);
    const imageUrl = await getDownloadURL(storageRef);
    return imageUrl;
  } catch (error) {
    console.error("Error uploading image: ", error);
    throw error;
  }
};

export const deleteItem = async (itemId) => {
    try {
        const itemRef = doc(db, 'inventory', itemId);
        const item = (await getDoc(itemRef)).data();

        if (item.imageUrl) {
            const imageRef = ref(storage, item.imageUrl);
            await deleteObject(imageRef);
        }

        await deleteDoc(itemRef);
    } catch (error) {
        console.error("Error deleting item: ", error);
        throw error;
    }
};

export const getUserInventory = async (userId) => {
    try {
        const q = query(collection(db, 'inventory'), where("userId", "==", userId));
        const querySnapshot = await getDocs(q);
        const items = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        
        if (items.length === 0) {
            console.log(`No items found for user ${userId}`);
        } else {
            console.log(`Retrieved ${items.length} items for user ${userId}`);
        }
        
        return items;
    } catch (error) {
        console.error("Error getting user inventory: ", error);
        throw error;
    }
};