import { db } from '../firebase/config';
import { collection, getDocs, query, orderBy } from 'firebase/firestore';

// This file is now used to fetch dynamic content for the inspiration gallery from Firestore.
// The Firebase configuration in 'firebase/config.ts' must be correctly set up for this to work.

export interface InspirationStyle {
    id: string;
    name: string;
    prompt: string;
    imageUrl: string;
    category: string;
}

/**
 * Fetches the list of inspiration styles from the 'styles' collection in Firestore.
 * @returns {Promise<InspirationStyle[]>} A promise that resolves to an array of inspiration styles.
 */
export const getInspirationStyles = async (): Promise<InspirationStyle[]> => {
    try {
        const stylesCollectionRef = collection(db, 'styles');
        // Query the collection and order by category, then by name for consistent display
        const q = query(stylesCollectionRef, orderBy('category'), orderBy('name'));
        
        const querySnapshot = await getDocs(q);
        
        const styles: InspirationStyle[] = [];
        querySnapshot.forEach((doc) => {
            const data = doc.data();
            styles.push({
                id: doc.id,
                name: data.name,
                prompt: data.prompt,
                imageUrl: data.imageUrl,
                category: data.category
            });
        });

        return styles;

    } catch (error) {
        console.error("Error fetching inspiration styles from Firestore:", error);
        // We throw a more user-friendly error to be caught by the component.
        throw new Error("Gagal memuat galeri. Pastikan konfigurasi Firebase sudah benar dan ada koneksi internet.");
    }
};
